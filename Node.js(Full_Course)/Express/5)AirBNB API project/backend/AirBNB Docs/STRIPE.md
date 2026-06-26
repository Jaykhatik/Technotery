# 💳 STRIPE.md — Payment Integration Guide

## Overview

This project uses **Stripe Checkout** (hosted page) for payments. We do NOT build a custom card form. All payment state changes are driven by **Stripe webhooks** — never by client-side redirects.

---

## Environment Variables Required

```env
STRIPE_SECRET_KEY=sk_test_...          # Server only — NEVER expose to client
STRIPE_PUBLISHABLE_KEY=pk_test_...     # Safe for client
STRIPE_WEBHOOK_SECRET=whsec_...        # From `stripe listen` or Dashboard
```

---

## Payment Flow (Step by Step)

### Step 1 — Create Checkout Session (Server)

`POST /api/payments/create-checkout-session`

```typescript
// server/src/services/stripe.service.js
import Stripe from 'stripe';
import { stripe } from '../config/stripe';

export const createCheckoutSession = async (
  bookingId: string,
  userId: string,
  totalPrice: number,    // in smallest currency unit (paise/cents)
  currency: string,
  listingTitle: string,
  successUrl: string,
  cancelUrl: string
): Promise<string> => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: currency.toLowerCase(),
        product_data: {
          name: listingTitle,
          description: `Booking ID: ${bookingId}`,
        },
        unit_amount: totalPrice,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: successUrl,  // e.g. https://yourapp.com/booking-confirmation?id={bookingId}
    cancel_url: cancelUrl,
    metadata: {
      bookingId,
      userId,
    },
    // Optional: collect billing address
    billing_address_collection: 'auto',
  }, {
    idempotencyKey: `${userId}-${bookingId}-checkout`,
  });

  return session.id;
};
```

### Step 2 — Client Redirects to Stripe

```typescript
// client/src/services/payment.service.js
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const redirectToCheckout = async (sessionId: string): Promise<void> => {
  const stripe = await stripePromise;
  if (!stripe) throw new Error('Stripe failed to load');
  
  const { error } = await stripe.redirectToCheckout({ sessionId });
  if (error) throw new Error(error.message);
};
```

### Step 3 — Webhook Handler (Server)

`POST /api/payments/webhook`

> ⚠️ This route MUST use `express.raw({ type: 'application/json' })` — NOT `express.json()`.
> Register it BEFORE the global `express.json()` middleware.

```typescript
// server/src/controllers/payment.controller.js
import { Request, Response } from 'express';
import Stripe from 'stripe';
import { stripe } from '../config/stripe';
import { Booking } from '../models/Booking';
import { Payment } from '../models/Payment';
import { emailService } from '../services/email.service';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

export const handleWebhook = asyncHandler(async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body,                           // raw Buffer
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    throw new ApiError(400, `Webhook signature verification failed: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutComplete(session);
      break;
    }
    case 'payment_intent.payment_failed': {
      const intent = event.data.object as Stripe.PaymentIntent;
      await handlePaymentFailed(intent);
      break;
    }
    default:
      // Ignore unhandled event types
  }

  res.json({ received: true });
});

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const { bookingId, userId } = session.metadata!;

  // Idempotency: check if already processed
  const existing = await Payment.findOne({ 'stripe.sessionId': session.id });
  if (existing) return;

  // Update booking status
  const booking = await Booking.findByIdAndUpdate(
    bookingId,
    {
      status: 'confirmed',
      'payment.stripeSessionId': session.id,
      'payment.stripePaymentIntentId': session.payment_intent,
      'payment.paidAt': new Date(),
    },
    { new: true }
  ).populate('listing guest host');

  if (!booking) throw new ApiError(404, `Booking ${bookingId} not found`);

  // Create payment audit record
  await Payment.create({
    booking: bookingId,
    user: userId,
    amount: session.amount_total,
    currency: session.currency,
    status: 'succeeded',
    stripe: {
      sessionId: session.id,
      paymentIntentId: session.payment_intent as string,
    },
    metadata: session.metadata ?? {},
  });

  // Send email notifications
  await Promise.all([
    emailService.sendBookingConfirmation(booking),
    emailService.notifyHostNewBooking(booking),
  ]);
}

async function handlePaymentFailed(intent: Stripe.PaymentIntent) {
  await Booking.findOneAndUpdate(
    { 'payment.stripeSessionId': intent.metadata?.sessionId },
    { status: 'expired' }
  );
}
```

---

## Refund Flow

`POST /api/payments/refund` — Admin or guest (within policy window)

```typescript
// Refund policy:
// - Full refund if cancelled > 48h before check-in
// - 50% refund if cancelled <= 48h before check-in
// - No refund if cancelled after check-in

export const processRefund = async (bookingId: string, cancelledBy: string) => {
  const booking = await Booking.findById(bookingId).populate('payment');
  if (!booking) throw new ApiError(404, 'Booking not found');
  if (booking.status !== 'confirmed') throw new ApiError(400, 'Only confirmed bookings can be refunded');

  const hoursUntilCheckIn = (booking.checkIn.getTime() - Date.now()) / (1000 * 60 * 60);
  const refundFraction = hoursUntilCheckIn > 48 ? 1.0 : 0.5;
  const refundAmount = Math.floor(booking.pricing.totalPrice * refundFraction);

  const refund = await stripe.refunds.create({
    payment_intent: booking.payment.stripePaymentIntentId,
    amount: refundAmount,
  }, {
    idempotencyKey: `${bookingId}-refund`,
  });

  // Update booking + payment records atomically
  await Promise.all([
    Booking.findByIdAndUpdate(bookingId, {
      status: 'cancelled',
      cancelledBy,
      cancelledAt: new Date(),
      'payment.refundId': refund.id,
      'payment.refundAmount': refundAmount,
      'payment.refundedAt': new Date(),
    }),
    Payment.findOneAndUpdate(
      { booking: bookingId },
      {
        status: refundFraction === 1.0 ? 'refunded' : 'partially_refunded',
        'stripe.refundId': refund.id,
        'stripe.refundAmount': refundAmount,
      }
    ),
  ]);
};
```

---

## Webhook Setup

### Local Development

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:5000/api/payments/webhook

# Copy the webhook signing secret output and add to .env:
# STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### Production (Stripe Dashboard)

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/payments/webhook`
3. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
   - `charge.refunded`
4. Copy the signing secret → `STRIPE_WEBHOOK_SECRET` env var

---

## Route Registration Order (Critical)

```typescript
// app.js — ORDER MATTERS
import express from 'express';
const app = express();

// 1. Webhook route FIRST (before express.json())
app.post(
  '/api/payments/webhook',
  express.raw({ type: 'application/json' }),
  paymentController.handleWebhook
);

// 2. Then global JSON parser
app.use(express.json());

// 3. Then all other routes
app.use('/api/auth', authRouter);
app.use('/api/listings', listingRouter);
// ...
```

---

## Testing Payments

Use Stripe test cards:

| Scenario | Card Number | CVC | Expiry |
|----------|------------|-----|--------|
| Success | `4242 4242 4242 4242` | Any 3 digits | Any future date |
| Requires auth | `4000 0025 0000 3155` | Any | Any future |
| Decline | `4000 0000 0000 9995` | Any | Any future |
| Insufficient funds | `4000 0000 0000 9995` | Any | Any future |

> **Always use test keys (`sk_test_...`, `pk_test_...`) in development and staging.**

---

## Stripe Config File

```typescript
// server/src/config/stripe.js
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
  typescript: true,
});
```

---

## Price Calculation (Server-Side)

Always calculate the final price on the server. Never trust the price sent from the client.

```typescript
export const calculateTotalPrice = (
  listing: IListing,
  checkIn: Date,
  checkOut: Date
): { baseTotal: number; cleaningFee: number; serviceFee: number; total: number } => {
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  const baseTotal = listing.pricing.basePrice * nights;

  // Apply weekly/monthly discounts
  let discountedBase = baseTotal;
  if (nights >= 30 && listing.pricing.monthlyDiscount) {
    discountedBase = baseTotal * (1 - listing.pricing.monthlyDiscount / 100);
  } else if (nights >= 7 && listing.pricing.weeklyDiscount) {
    discountedBase = baseTotal * (1 - listing.pricing.weeklyDiscount / 100);
  }

  const cleaningFee = listing.pricing.cleaningFee;
  const serviceFee = Math.floor(discountedBase * (listing.pricing.serviceFee / 100));
  const total = Math.floor(discountedBase) + cleaningFee + serviceFee;

  return { baseTotal: Math.floor(discountedBase), cleaningFee, serviceFee, total };
};
```
