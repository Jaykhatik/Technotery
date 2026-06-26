# 🏗️ ARCHITECTURE.md — System Design

## Overview

This project follows a **3-tier architecture** with a clear separation between the presentation layer (React), application layer (Express), and data layer (MongoDB). All communication between client and server is JSON over HTTPS.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (React + TS)                     │
│  ┌──────────┐  ┌───────────┐  ┌──────────┐  ┌──────────────┐  │
│  │  Pages   │  │Components │  │ Context API │  │ Custom Hooks │  │
│  │ (Routes) │→ │  (UI)     │  │  (State) │  │ (Server Data)│  │
│  └──────────┘  └───────────┘  └──────────┘  └──────────────┘  │
│                      │                              │           │
│              services/ (axios)            hooks/useXxx.ts       │
└─────────────────────────────────────────────────────────────────┘
                              │ HTTPS / REST
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      SERVER (Express + Vanilla JS)                      │
│                                                                 │
│  Request → [Helmet] → [CORS] → [RateLimit] → Router            │
│                                                  │              │
│                                          [authMiddleware]       │
│                                                  │              │
│                                          [validate (express-validator)]       │
│                                                  │              │
│                                            Controller           │
│                                                  │              │
│                                             Service             │
│                                           ┌────┴────┐          │
│                                        Mongoose   Stripe        │
│                                           │         │           │
└─────────────────────────────────────────────────────────────────┘
                    │                           │
          ┌─────────┴────────┐       ┌──────────┴──────────┐
          │    MongoDB       │       │  public/uploads/     │
          │  (Primary DB)    │       │  (Local file system) │
          └──────────────────┘       │  served via Nginx    │
                                     └─────────────────────┘
```

---

## Request Lifecycle

### Standard API Request
```
1. Client (axios) → sends JWT in Authorization: Bearer header
2. CORS check → validate origin against ALLOWED_ORIGINS
3. Helmet → set security headers
4. Rate Limiter → in-memory counter per IP (express-rate-limit)
5. Router → match route
6. authMiddleware → verify JWT, attach req.user
7. roleMiddleware → check req.user.role if route is role-restricted
8. validate() → run express-validator schema against req.body / req.query / req.params
9. asyncHandler(controller) → call controller, catch errors
10. Controller → call service function(s)
11. Service → Mongoose query / external API call
12. Controller → ApiResponse.success(res, data)
13. Client receives { success: true, message, data }
```

### Error Lifecycle
```
1. Any middleware/controller/service throws ApiError or generic Error
2. asyncHandler catches it and calls next(error)
3. error.middleware.js handles:
   - ApiError → use its statusCode and message
   - Mongoose ValidationError → 400
   - Mongoose CastError (bad ObjectId) → 400
   - JWT errors → 401
   - Unhandled → 500 (log full error, return generic message in prod)
4. Client receives { success: false, message, errors?: [] }
```

---

## Authentication Flow

### Registration
```
Client → POST /api/auth/register
  → Validate (express-validator)
  → Check email uniqueness
  → Hash password (bcrypt 12 rounds)
  → Create User document
  → Generate access token (15min) + refresh token (7 days)
  → Store refresh token hash in User document (refreshTokens[] array)
  → Set refresh token in httpOnly cookie
  → Return access token in response body + user object
```

### Login
```
Client → POST /api/auth/login
  → Find user by email
  → Compare password (bcrypt.compare)
  → Generate new token pair
  → Append new refresh token hash to User.refreshTokens[]
  → Return access token + user
```

### Token Refresh
```
Client detects 401 (interceptor in api.ts)
  → POST /api/auth/refresh-token (sends httpOnly cookie automatically)
  → Server reads refresh token from cookie
  → Verify token signature + check hash exists in User.refreshTokens[]
  → Issue new access token + rotate refresh token (replace old hash)
  → If refresh token expired/invalid → 401 → client logs out
```

---

## Booking Flow

```
1. Guest selects listing + dates → frontend checks availability
   GET /api/bookings/availability?listingId=X&checkIn=Y&checkOut=Z

2. Guest submits booking request
   POST /api/bookings
   → Check date conflicts in DB (atomic)
   → Create Booking { status: 'pending' }

3. Guest proceeds to payment
   POST /api/payments/create-checkout-session
   → Create Stripe Checkout Session
   → Store sessionId in Booking document
   → Return { url: stripe_checkout_url }

4. Guest completes payment on Stripe hosted page

5. Stripe fires webhook → POST /api/payments/webhook
   → Verify signature
   → Handle checkout.session.completed event:
     - Update Booking { status: 'confirmed' }
     - Create Payment record
     - Send confirmation email to guest
     - Send notification email to host

6. Guest redirected to /booking-confirmation?id=XX
   → Frontend polls/fetches booking status
```

---

## Stripe Payment Architecture

```
                    ┌───────────┐
                    │   Guest   │
                    └─────┬─────┘
                          │ POST /create-checkout-session
                          ↓
                    ┌───────────┐
                    │  Express  │
                    │  Server   │─────────────┐
                    └─────┬─────┘             │ stripe.checkout.sessions.create()
                          │                   ↓
                          │            ┌─────────────┐
                          │            │   Stripe    │
                          │            │   API       │
                          │            └──────┬──────┘
                          │                   │ Returns session
                          │◄──────────────────┘
                          │
                    Return { sessionId }
                          │
                          ↓
                    ┌───────────┐
                    │  Guest    │─── redirects to Stripe Checkout
                    │  Browser  │
                    └───────────┘
                          │
                   (payment complete)
                          │
                          ↓
              ┌───────────────────────┐
              │  Stripe Webhook       │──────→ POST /api/payments/webhook
              │  checkout.session     │         │
              │  .completed           │         │ verifies signature
              └───────────────────────┘         │ updates Booking
                                                │ sends emails
                                                ↓
                                         Booking { status: 'confirmed' }
```

---

## Image Upload Flow

```
Client selects images (max 10, max 5MB each)
  → Validates client-side (type + size)
  → POST /api/listings (multipart/form-data)
  → multer parses files into req.files (disk storage)
  → upload.middleware saves files to server/public/uploads/listings/{uuid}.jpg
  → Controller stores relative path in Listing.images[].url
  → URL format: /uploads/listings/{uuid}.jpg
  → Client constructs full URL: BASE_URL + /uploads/listings/{uuid}.jpg
```

**File naming:** `{timestamp}-{uuid}.{ext}` — prevents collisions and path traversal.

**Served by:** Express static middleware in dev (`/uploads → public/uploads/`), Nginx in production (direct disk read, bypasses Node for performance).

**On delete:** When a listing is deleted or an image is removed, the corresponding file is deleted from disk using `fs.unlink()`.

---

## Caching Strategy

No Redis. Rate limiting uses `express-rate-limit` with in-memory store (resets on server restart — acceptable for single-server deployments). Refresh tokens are stored in the User document in MongoDB.

For repeated expensive queries (search, listing detail), use short-lived in-process caching with `node-cache` if needed in the future.

---

## Role System

```
guest  → can search, view listings, make bookings, write reviews
host   → all guest permissions + create/manage own listings, view earnings
admin  → all permissions + manage all users, listings, bookings
```

Role is stored in the User document and checked by `roleMiddleware`.

---

## Email Notification Triggers

| Trigger | Recipient | Template |
|---------|-----------|---------|
| Booking confirmed | Guest + Host | `booking-confirmed` |
| Booking cancelled | Guest + Host | `booking-cancelled` |
| Payment received | Guest | `payment-receipt` |
| Refund issued | Guest | `refund-issued` |
| Check-in reminder | Guest | `checkin-reminder` (24h before) |
| New review | Host | `new-review` |

Emails are sent via the `email.service.js` which uses SendGrid/Nodemailer with HTML templates in `server/src/templates/email/`.

---

## Environment Tiers

| Tier | MongoDB | Stripe | File Storage | Notes |
|------|---------|--------|--------------|-------|
| `development` | Local MongoDB | Test keys | `public/uploads/` local | Hot reload, verbose logs |
| `test` | mongodb-memory-server | Mocked | Temp dir / mocked | CI pipeline |
| `production` | MongoDB Atlas | Live keys | `public/uploads/` on VPS disk | Error tracking, Nginx serves files |
