# 🏠 AirBnB Clone — Development Roadmap

> A production-ready Airbnb clone built with **React + TypeScript**, **Express + Vanilla JS**, **MongoDB**, and **Stripe** payments.
> This document is your step-by-step build guide. Follow phases in order. Do not skip phases.

---

## 📐 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          CLIENT  (React + TS)                           │
│                                                                         │
│   Pages ──► Components ──► React Context (UI State)                    │
│                │                                                        │
│            services/           Custom Hooks (Server State)             │
│           (axios layer)               │                                 │
└──────────────────┬────────────────────┼────────────────────────────────┘
                   │   HTTPS / REST     │
                   ▼                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         SERVER  (Express + Vanilla JS)                          │
│                                                                         │
│  Request                                                                │
│    │                                                                    │
│    ▼                                                                    │
│  [Helmet] ──► [CORS] ──► [RateLimit] ──► Router                       │
│                                              │                          │
│                                       [authMiddleware]                  │
│                                              │                          │
│                                       [roleMiddleware]                  │
│                                              │                          │
│                                       [validate (express-validator)]                  │
│                                              │                          │
│                                    asyncHandler(Controller)             │
│                                              │                          │
│                                           Service                       │
│                                         ┌───┴───┐                      │
│                                      Mongoose  Stripe                   │
└──────────────────────────────────────────┬───────┬──────────────────────┘
                                           │       │
                              ┌────────────┘       └──────────────┐
                              ▼                                    ▼
                      ┌──────────────┐                  ┌──────────────────┐
                      │   MongoDB    │                  │ public/uploads/  │
                      │  (Atlas or   │                  │  (local disk,    │
                      │   local)     │                  │  Nginx in prod)  │
                      └──────────────┘                  └──────────────────┘
```

---

## 🗺️ Project Structure

```
airbnb-clone/
├── client/                        # React + TypeScript frontend
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── common/            # Shared UI (Button, Modal, Input…)
│       │   ├── layout/            # Header, Footer, Navbar
│       │   ├── listings/          # ListingCard, ListingGrid, Filters
│       │   ├── booking/           # BookingForm, Calendar, Summary
│       │   ├── auth/              # Login, Register, OAuth
│       │   └── payments/          # Stripe redirect, Confirmation
│       ├── pages/
│       │   ├── Home.tsx
│       │   ├── Search.tsx
│       │   ├── ListingDetail.tsx
│       │   ├── Checkout.tsx
│       │   ├── BookingConfirmation.tsx
│       │   ├── Dashboard/
│       │   │   ├── GuestDashboard.tsx
│       │   │   ├── HostDashboard.tsx
│       │   │   └── AdminDashboard.tsx
│       │   └── Auth/
│       │       ├── Login.tsx
│       │       └── Register.tsx
│       ├── hooks/                 # Custom React hooks
│       ├── context/               # React Context providers
│       ├── services/              # Axios API layer
│       ├── types/                 # Shared TypeScript types
│       ├── utils/
│       ├── constants/
│       └── router/
│
├── server/
│   └── src/
│       ├── config/
│       │   ├── db.ts
│       │   └── stripe.ts
│       ├── models/                # Mongoose models
│       │   ├── User.ts
│       │   ├── Listing.ts
│       │   ├── Booking.ts
│       │   ├── Review.ts
│       │   └── Payment.ts
│       ├── controllers/           # HTTP layer only
│       ├── routes/                # Express routers
│       ├── middleware/
│       │   ├── auth.middleware.js
│       │   ├── role.middleware.js
│       │   ├── validate.middleware.js
│       │   ├── rateLimit.middleware.js
│       │   ├── upload.middleware.js
│       │   └── error.middleware.js
│       ├── services/              # Business logic + DB + Stripe
│       ├── utils/
│       │   ├── ApiError.ts
│       │   ├── ApiResponse.ts
│       │   ├── asyncHandler.ts
│       │   ├── jwt.ts
│       │   └── validators/        # express-validator schemas
│       ├── jobs/
│       │   └── expireBookings.ts  # Cron job
│       └── app.js
│
├── docs/
│   ├── AI_CONTEXT.md
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── DATABASE.md
│   ├── STRIPE.md
│   ├── DEPLOYMENT.md
│   └── CODING_GUIDELINES.md
│
├── postman/
│   └── AirBnB_Clone.postman_collection.json   # ← Postman collection
│
├── ecosystem.config.js
└── README.md
```

---

## 🔄 Request Lifecycle

```
Client (axios)
     │
     │  Authorization: Bearer <accessToken>
     ▼
  [CORS] — validates against ALLOWED_ORIGINS env var
     │
     ▼
  [Helmet] — sets security headers
     │
     ▼
  [RateLimit] — IP-based counter (express-rate-limit)
     │
     ▼
  Router — matches route
     │
     ▼
  [authMiddleware] — verifies JWT, attaches req.user
     │
     ▼
  [roleMiddleware] — checks req.user.role for restricted routes
     │
     ▼
  [validate(zodSchema)] — validates req.body / req.query / req.params
     │
     ▼
  asyncHandler(controller) — catches all async errors
     │
     ▼
  Controller — calls service(s), returns response
     │
     ▼
  Service — Mongoose queries / Stripe / email
     │
     ▼
  ApiResponse.success(res, data)
     │
     ▼
{ success: true, message, data, meta? }
```

---

## 💳 Payment Flow

```
   Guest                  Server                  Stripe
     │                       │                       │
     │  POST /create-        │                       │
     │  checkout-session ───►│                       │
     │                       │  sessions.create() ──►│
     │                       │◄── { sessionId } ─────│
     │◄── { sessionId } ─────│                       │
     │                       │                       │
     │  redirectToCheckout() │                       │
     │──────────────────────────────────────────────►│
     │                       │         (user pays)   │
     │                       │                       │
     │                       │◄── webhook POST ──────│
     │                       │  checkout.session     │
     │                       │  .completed           │
     │                       │                       │
     │                       │  verifySignature()    │
     │                       │  Booking → confirmed  │
     │                       │  Payment audit log    │
     │                       │  Send emails          │
     │                       │                       │
     │◄── redirect to ───────│                       │
     │  /booking-confirmation│                       │
```

---

## 🔐 Authentication Flow

```
REGISTER
  Client ──► POST /api/auth/register
               │ express-validator validation
               │ Check email unique
               │ bcrypt hash (cost 12)
               │ Create User document
               │ Generate accessToken (15m) + refreshToken (7d)
               │ Store refreshToken HASH in User.refreshTokens[]
               │ Set refreshToken in httpOnly cookie
               └──► Return { user, accessToken }

LOGIN
  Client ──► POST /api/auth/login
               │ Find user by email
               │ bcrypt.compare()
               │ Generate new token pair
               └──► Return { user, accessToken }

TOKEN REFRESH  (triggered by axios 401 interceptor)
  Client ──► POST /api/auth/refresh-token  (cookie sent automatically)
               │ Read refreshToken from cookie
               │ Verify signature
               │ Check hash in User.refreshTokens[]
               │ Rotate token (replace old hash)
               └──► Return { accessToken }

LOGOUT
  Client ──► POST /api/auth/logout
               │ Remove token hash from User.refreshTokens[]
               │ Clear cookie
               └──► 200 OK
```

---

## 🗄️ Database Schema Map

```
users ──────────────────────────────────────────────────────────────────────────
  _id, email (unique), password (select:false), name, avatar, role
  refreshTokens[], savedListings[], stripeAccountId?

listings ───────────────────────────────────────────────────────────────────────
  _id, host → users._id
  title, description, type, status
  location { address, city, state, country, coordinates (GeoJSON Point) }
  images [{ url, caption }]
  pricing { basePrice, cleaningFee, serviceFee%, currency, weeklyDiscount?, monthlyDiscount? }
  capacity { guests, bedrooms, beds, bathrooms }
  amenities[], rules { checkIn/OutTime, smoking, pets, parties }
  rating { average, count }    ← denormalized
  blockedDates[]

bookings ───────────────────────────────────────────────────────────────────────
  _id, listing → listings._id
  guest → users._id, host → users._id  ← host denormalized
  checkIn, checkOut, nights
  guests { adults, children, infants }
  pricing { basePrice, cleaningFee, serviceFee, totalPrice, currency }  ← snapshot
  status: pending | confirmed | cancelled | completed | expired
  payment { stripeSessionId, stripePaymentIntentId, paidAt, refundId, … }
  guestReviewed, hostReviewed

reviews ────────────────────────────────────────────────────────────────────────
  _id, booking → bookings._id (unique per direction)
  reviewer → users._id, reviewee → users._id, listing → listings._id
  direction: guest-to-host | host-to-guest
  ratings { overall, cleanliness, accuracy, communication, location, value }
  comment, isPublic

payments ───────────────────────────────────────────────────────────────────────
  _id, booking → bookings._id, user → users._id
  amount, currency, status
  stripe { sessionId (unique), paymentIntentId, chargeId?, refundId?, refundAmount? }

Relationships:
  User    (1) ──► (N) Listing    [host]
  User    (1) ──► (N) Booking    [guest]
  Listing (1) ──► (N) Booking    [listing]
  Booking (1) ──► (0-2) Review   [guest→host, host→guest]
  Booking (1) ──► (1) Payment    [audit log]
```

---

## 🧪 Backend Testing — Postman

All backend API testing is done via **Postman** (not automated integration tests during development phases). A Postman collection is maintained at `postman/AirBnB_Clone.postman_collection.json`.

### Postman Setup

1. Download & install [Postman](https://www.postman.com/downloads/)
2. Import the collection: `File → Import → postman/AirBnB_Clone.postman_collection.json`
3. Create a Postman Environment called `AirBnB Local`:

| Variable | Initial Value |
|----------|--------------|
| `BASE_URL` | `http://localhost:5000` |
| `ACCESS_TOKEN` | _(leave blank — auto-set by login test)_ |
| `BOOKING_ID` | _(leave blank — set per test)_ |
| `LISTING_ID` | _(leave blank — set per test)_ |

4. Add this script to the **Login** request's Tests tab to auto-capture the token:
```javascript
const res = pm.response.json();
if (res.data?.accessToken) {
  pm.environment.set("ACCESS_TOKEN", res.data.accessToken);
}
```

5. All protected routes use the Authorization header:
```
Authorization: Bearer {{ACCESS_TOKEN}}
```

### Postman Collection Structure

```
AirBnB Clone/
├── Auth/
│   ├── Register
│   ├── Login           ← sets ACCESS_TOKEN automatically
│   ├── Refresh Token
│   ├── Logout
│   ├── Forgot Password
│   └── Reset Password
├── Listings/
│   ├── Search Listings
│   ├── Get Listing Detail
│   ├── Create Listing (Host)
│   ├── Update Listing (Host)
│   ├── Delete Listing
│   ├── Check Availability
│   └── Block Dates (Host)
├── Bookings/
│   ├── Create Booking
│   ├── My Bookings
│   ├── Booking Detail
│   ├── Cancel Booking
│   └── Host Bookings
├── Payments/
│   ├── Create Checkout Session
│   ├── Simulate Webhook (stripe CLI)
│   ├── Refund
│   └── Payment History
├── Reviews/
│   ├── Submit Review
│   ├── Listing Reviews
│   └── User Reviews
├── Users/
│   ├── My Profile
│   ├── Update Profile
│   ├── Public Profile
│   ├── Save Listing
│   └── Saved Listings
└── Admin/
    ├── All Users
    ├── Ban User
    ├── All Listings
    ├── Update Listing Status
    ├── All Bookings
    └── Dashboard Stats
```

---

## 📋 Standard Response Format

Every API response uses this envelope:

```json
// Success
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "meta": { "page": 1, "limit": 20, "total": 143, "pages": 8 }
}

// Error
{
  "success": false,
  "message": "Human-readable error message",
  "errors": []
}
```

---

## 🚦 Development Phases

---

## Phase 1 — Project Foundation & Setup

**Goal:** Working Express + React skeleton with TypeScript, ESLint, env management, and MongoDB connected.

### Backend Setup

- [ ] Init `server/` with `npm init -y`, install deps:
  ```
  express   mongoose dotenv helmet cors express-rate-limit
  bcryptjs jsonwebtoken express-validator winston
    eslint   ```
- [ ] Create `server/src/app.js` — mount Helmet, CORS, JSON parser, routes placeholder
- [ ] Create `server/src/server.js` — entry point, connect DB then start server
- [ ] Create `server/src/config/db.js` — MongoDB connection with retry logic
- [ ] Create `server/src/utils/ApiError.js`
- [ ] Create `server/src/utils/ApiResponse.js`
- [ ] Create `server/src/utils/asyncHandler.js`
- [ ] Create `server/src/utils/logger.js` (Winston)
- [ ] Create `server/src/middleware/error.middleware.js`
- [ ] Create `server/src/middleware/rateLimit.middleware.js`
- [ ] Create `server/.env` from `.env.example`
- [ ] Verify: `GET /api/health` returns `{ status: "ok" }`

### Frontend Setup

- [ ] Init with `npm create vite@latest client -- --template react-ts`
- [ ] Install: `tailwindcss axios react-router-dom`
- [ ] Configure TailwindCSS
- [ ] Create `client/src/services/api.ts` — base axios instance with auth header + refresh interceptor
- [ ] Create `client/.env` from `.env.example`
- [ ] Set up React Router with placeholder routes
- [ ] Verify: app loads at `http://localhost:5173`

### Postman

- [ ] Create Postman environment `AirBnB Local` with `BASE_URL=http://localhost:5000`
- [ ] Add `GET {{BASE_URL}}/api/health` — verify 200

**✅ Phase 1 Done When:** Health endpoint returns 200, MongoDB connects, React loads, no TypeScript errors.

---

## Phase 2 — Database Models

**Goal:** All five Mongoose models with correct schemas, types, and indexes.

### Tasks

- [ ] `server/src/models/User.js`
  - Fields: `email` (unique), `password` (select:false), `name`, `avatar`, `role`, `refreshTokens[]`, `savedListings[]`, `isVerified`, `phone?`, `bio?`, `stripeAccountId?`
  - Indexes: `{ email: 1 }` unique, `{ role: 1 }`, `{ googleId: 1 }` sparse
  - Pre-save hook: hash password if modified (bcrypt cost 12)
  - Method: `comparePassword()`

- [ ] `server/src/models/Listing.js`
  - Fields: all location, pricing, capacity, amenities, rules, rating (denormalized), blockedDates
  - Indexes: `{ host: 1 }`, `{ status: 1 }`, `{ 'location.city': 1 }`, `{ 'pricing.basePrice': 1 }`, `{ 'location.coordinates': '2dsphere' }`, `{ 'rating.average': -1 }`, compound `{ status, city, price }`

- [ ] `server/src/models/Booking.js`
  - Fields: listing, guest, host (denormalized), checkIn, checkOut, nights, guests, pricing snapshot, status, payment sub-doc
  - Indexes: `{ guest: 1 }`, `{ host: 1 }`, `{ listing: 1 }`, `{ 'payment.stripeSessionId': 1 }` unique sparse, `{ listing, checkIn, checkOut }` for conflict check

- [ ] `server/src/models/Review.js`
  - Fields: booking, reviewer, reviewee, listing, direction, ratings sub-doc, comment
  - Unique index: `{ booking: 1, direction: 1 }`

- [ ] `server/src/models/Payment.js`
  - Fields: booking, user, amount, currency, status, stripe sub-doc
  - Indexes: `{ 'stripe.sessionId': 1 }` unique, `{ 'stripe.paymentIntentId': 1 }` unique sparse

- [ ] Create `server/src/scripts/createIndexes.js` — run once on deploy
- [ ] Create shared TypeScript interfaces in `server/src/types/index.js`

### Postman

- No API calls yet. Verify models by checking MongoDB Compass or `mongosh` after Phase 3.

**✅ Phase 2 Done When:** All models compile without errors. Mongoose connects and registers all collections.

---

## Phase 3 — Authentication

**Goal:** Full JWT auth with register, login, refresh, logout, and password reset.

```
Register ──► hash password ──► create User ──► issue tokens ──► return user + accessToken
Login    ──► compare hash  ──► issue tokens ──► return user + accessToken
Refresh  ──► read cookie   ──► rotate token ──► return new accessToken
Logout   ──► remove hash   ──► clear cookie ──► 200
```

### Backend Tasks

- [ ] `server/src/utils/jwt.js` — `signAccessToken()`, `signRefreshToken()`, `verifyToken()`
- [ ] `server/src/services/auth.service.js`
  - `register()` — validate unique email, hash, create user, generate tokens
  - `login()` — find user, compare password, generate tokens
  - `refreshToken()` — verify cookie token, rotate, return new access token
  - `logout()` — remove token hash from `User.refreshTokens[]`
  - `forgotPassword()` — generate reset token, send email
  - `resetPassword()` — verify token, update password
- [ ] `server/src/controllers/auth.controller.js` — HTTP layer only, calls service
- [ ] `server/src/routes/auth.routes.js` — register all 6 auth routes with rate limiter
- [ ] `server/src/middleware/auth.middleware.js` — verify JWT, attach `req.user`
- [ ] `server/src/middleware/role.middleware.js` — check `req.user.role`
- [ ] `server/src/utils/validators/auth.validator.js` — express-validator schemas for all auth bodies
- [ ] Register routes in `app.js`

### Postman Tests

| Request | Expected |
|---------|----------|
| `POST /api/auth/register` with valid body | 201, returns user + accessToken |
| `POST /api/auth/register` duplicate email | 409 Conflict |
| `POST /api/auth/register` weak password | 400 Validation error |
| `POST /api/auth/login` valid creds | 200, sets cookie |
| `POST /api/auth/login` wrong password | 401 |
| `POST /api/auth/refresh-token` with cookie | 200, new accessToken |
| `POST /api/auth/logout` | 200, cookie cleared |
| Any protected route without token | 401 |
| Any protected route with expired token | 401 |

**✅ Phase 3 Done When:** All Postman auth tests pass. Cookie is set httpOnly. Tokens rotate correctly.

---

## Phase 4 — Listings CRUD

**Goal:** Hosts can create/edit/delete listings with multi-image upload. Anyone can search and view.

```
Search ──► filter by city/price/dates/guests/geo ──► paginated results
Create ──► multipart/form-data ──► Multer saves files ──► relative paths in DB
Update ──► host (owner) only ──► patch fields + images
Delete ──► soft delete (status: inactive) + unlink files
```

### Backend Tasks

- [ ] `server/src/middleware/upload.middleware.js`
  - Multer disk storage to `public/uploads/listings/`
  - Filename: `{timestamp}-{uuid}.{ext}`
  - Validate MIME type (jpeg, png, webp, gif) and size (max 5MB)
  - Max 10 files
- [ ] `server/src/services/listing.service.js`
  - `searchListings()` — filters, geo query, pagination, `.lean()`
  - `getListingById()` — populate host (name, avatar, createdAt only)
  - `createListing()` — save images, create document
  - `updateListing()` — ownership check, update fields, handle image removal with `fs.unlink()`
  - `deleteListing()` — set `status: inactive`, unlink images
  - `checkAvailability()` — query bookings for date conflicts
  - `blockDates()` — append to `blockedDates[]`
- [ ] `server/src/controllers/listing.controller.js`
- [ ] `server/src/routes/listing.routes.js`
- [ ] `server/src/utils/validators/listing.validator.js` — express-validator schemas
- [ ] Setup Express static middleware for `/uploads` → `public/uploads/`

### Postman Tests

| Request | Expected |
|---------|----------|
| `GET /api/listings` | 200, paginated array |
| `GET /api/listings?city=Mumbai&minPrice=1000` | 200, filtered results |
| `GET /api/listings?lat=19.07&lng=72.87&radius=10` | 200, geo results |
| `GET /api/listings/:id` | 200, full listing with host |
| `POST /api/listings` as Host (multipart) | 201, listing created with image URLs |
| `POST /api/listings` as Guest | 403 Forbidden |
| `POST /api/listings` no auth | 401 |
| `PUT /api/listings/:id` as owner Host | 200, updated |
| `PUT /api/listings/:id` as different Host | 403 |
| `DELETE /api/listings/:id` | 200, status=inactive |
| `GET /api/listings/:id/availability?checkIn=&checkOut=` | 200, available:true/false |

**✅ Phase 4 Done When:** All Postman listing tests pass. Images upload, serve, and delete correctly.

---

## Phase 5 — Bookings

**Goal:** Guests can create bookings with atomic conflict checking. Booking lifecycle is managed correctly.

```
POST /api/bookings
  ──► validate dates
  ──► recalculate price server-side from listing
  ──► atomic conflict check (findOne with $or overlap)
  ──► create Booking { status: 'pending' }
  ──► return { bookingId, totalPrice, status }
```

### Backend Tasks

- [ ] `server/src/services/booking.service.js`
  - `createBooking()` — fetch listing, recalculate price (NEVER trust client price), atomic conflict check, create booking
  - `getUserBookings()` — paginated, filtered by status
  - `getBookingById()` — ownership check (guest or host)
  - `cancelBooking()` — update status, set `cancelledBy`, trigger refund if confirmed
  - `getHostBookings()` — all bookings for host's listings
  - `calculateTotalPrice()` — `basePrice × nights + cleaningFee + serviceFee%` with weekly/monthly discounts
- [ ] `server/src/controllers/booking.controller.js`
- [ ] `server/src/routes/booking.routes.js`
- [ ] `server/src/utils/validators/booking.validator.js`
- [ ] `server/src/jobs/expireBookings.js` — cron job to expire pending bookings after 30 min

### Postman Tests

| Request | Expected |
|---------|----------|
| `POST /api/bookings` valid dates | 201, status=pending, correct totalPrice |
| `POST /api/bookings` overlapping dates | 409 Conflict |
| `POST /api/bookings` past dates | 400 Validation error |
| `POST /api/bookings` guests > capacity | 400 |
| `GET /api/bookings` | 200, user's bookings |
| `GET /api/bookings/:id` as guest | 200 |
| `GET /api/bookings/:id` as unrelated user | 403 |
| `PATCH /api/bookings/:id/cancel` | 200, status=cancelled |
| `GET /api/bookings/host` as Host | 200, host's bookings |
| `GET /api/bookings/host` as Guest | 403 |

**✅ Phase 5 Done When:** Booking creation is atomic. Prices are always recalculated server-side. Conflicts are correctly detected.

---

## Phase 6 — Payments (Stripe)

**Goal:** Stripe Checkout integration with webhook-driven confirmation. Booking is ONLY confirmed via webhook.

```
CRITICAL: Webhook route must be registered BEFORE express.json()
          and must use express.raw({ type: 'application/json' })
```

### Backend Tasks

- [ ] `server/src/config/stripe.js` — initialize Stripe client
- [ ] `server/src/services/stripe.service.js`
  - `createCheckoutSession()` — create Stripe session with `metadata: { bookingId, userId }`, idempotency key
  - `processRefund()` — calculate refund (100% if >48h, 50% if ≤48h), call `stripe.refunds.create()`
- [ ] `server/src/controllers/payment.controller.js`
  - `handleWebhook()` — verify signature, handle `checkout.session.completed` and `payment_intent.payment_failed`
  - Idempotency: check `Payment.findOne({ 'stripe.sessionId': session.id })` before processing
- [ ] `server/src/routes/payment.routes.js`
- [ ] `server/src/utils/validators/payment.validator.js`
- [ ] Register webhook route BEFORE `express.json()` in `app.js`
- [ ] `server/src/services/email.service.js` — `sendBookingConfirmation()`, `notifyHostNewBooking()`

### Postman Tests

| Request | Expected |
|---------|----------|
| `POST /api/payments/create-checkout-session` | 200, returns sessionId |
| `POST /api/payments/create-checkout-session` invalid bookingId | 404 |
| Stripe webhook (use `stripe listen --forward-to ...`) | Booking → confirmed, Payment created |
| `POST /api/payments/refund` booking >48h before checkin | Full refund |
| `POST /api/payments/refund` booking ≤48h before checkin | 50% refund |
| `POST /api/payments/refund` non-confirmed booking | 400 |
| `GET /api/payments/history` | 200, user's payments |

### Webhook Local Testing
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login and forward
stripe login
stripe listen --forward-to localhost:5000/api/payments/webhook

# Trigger test events
stripe trigger checkout.session.completed
```

**✅ Phase 6 Done When:** Booking status only becomes `confirmed` after webhook. Payment audit log created. Emails sent.

---

## Phase 7 — Reviews

**Goal:** Mutual review system. Only completed bookings can be reviewed. One review per booking per direction.

```
Guest ──► review Host after checkout
Host  ──► review Guest after checkout
Both reviews are independent and can be written at any time post-stay
```

### Backend Tasks

- [ ] `server/src/services/review.service.js`
  - `createReview()` — verify booking is `completed`, check `guestReviewed`/`hostReviewed`, create review, update `Listing.rating.average` and `count`, set reviewed flag on booking
  - `getListingReviews()` — paginated, direction=`guest-to-host`, public only
  - `getUserReviews()` — paginated
- [ ] `server/src/controllers/review.controller.js`
- [ ] `server/src/routes/review.routes.js`
- [ ] `server/src/utils/validators/review.validator.js`

### Postman Tests

| Request | Expected |
|---------|----------|
| `POST /api/reviews` after completed booking | 201, review created |
| `POST /api/reviews` duplicate (same booking+direction) | 409 Conflict |
| `POST /api/reviews` booking not completed | 400 |
| `POST /api/reviews` review before checkout date | 400 |
| `GET /api/reviews/listing/:id` | 200, paginated guest reviews |
| `GET /api/reviews/user/:id` | 200, user reviews |
| Verify `Listing.rating.average` updated after review | Query MongoDB |

**✅ Phase 7 Done When:** Reviews only possible after completed bookings. Rating average updates correctly. Duplicate prevention works.

---

## Phase 8 — User Profiles & Admin

**Goal:** Profile management with avatar upload, saved listings, and admin controls.

### Backend Tasks

- [ ] `server/src/services/user.service.js`
  - `getProfile()`, `updateProfile()` (with avatar upload + old file unlink)
  - `getPublicProfile()` — no email returned (SEC-005)
  - `toggleSavedListing()` — add/remove from `User.savedListings[]`
  - `getSavedListings()` — populate listing summaries
- [ ] `server/src/controllers/user.controller.js`
- [ ] `server/src/routes/user.routes.js`
- [ ] Admin routes: ban user, approve/deactivate listing, all bookings, stats dashboard
- [ ] `server/src/utils/validators/user.validator.js`

### Postman Tests

| Request | Expected |
|---------|----------|
| `GET /api/users/profile` | 200, own profile (no password) |
| `PATCH /api/users/profile` with avatar file | 200, avatar URL updated |
| `GET /api/users/:id/public` | 200, no email in response |
| `POST /api/users/saved-listings/:id` | 200, toggle saved |
| `GET /api/users/saved-listings` | 200, array of listings |
| `GET /api/admin/users` as Admin | 200 |
| `GET /api/admin/users` as Guest | 403 |
| `PATCH /api/admin/users/:id/ban` | 200, user banned |
| `GET /api/admin/stats` | 200, revenue/bookings summary |

**✅ Phase 8 Done When:** All user and admin endpoints pass. Emails never exposed in public routes.

---

## Phase 9 — Frontend Core

**Goal:** Working React app with routing, auth, listing search, and Context wired up.

### Tasks

- [ ] Set up React Router with all page routes
- [ ] `client/src/context/AuthContext.tsx` — `user`, `setUser()`, `clearAuth()`
- [ ] `client/src/context/FilterContext.tsx` — search filters state
- [ ] `client/src/services/api.ts` — axios instance with request interceptor (attach token) and response interceptor (refresh on 401)
- [ ] `client/src/services/auth.service.js` — typed wrappers for all auth API calls
- [ ] `client/src/services/listing.service.js`
- [ ] `client/src/services/booking.service.js`
- [ ] `client/src/services/payment.service.js`
- [ ] `client/src/services/review.service.js`
- [ ] `client/src/services/user.service.js`
- [ ] Auth pages: `Login.tsx`, `Register.tsx` — form + validation + redirect
- [ ] `components/layout/Header.tsx` — nav with auth state
- [ ] Home page: listing grid with search bar
- [ ] Listing search page with filters sidebar
- [ ] Listing detail page: images, info, booking widget

**✅ Phase 9 Done When:** Users can register, log in, browse listings, and view detail pages.

---

## Phase 10 — Frontend Booking & Payment

**Goal:** Full booking flow from date selection through Stripe redirect and confirmation page.

### Tasks

- [ ] `components/booking/DatePicker.tsx` — availability-aware date selection
- [ ] `components/booking/BookingWidget.tsx` — guest count, price breakdown, Book button
- [ ] `Checkout.tsx` page — booking summary before payment
- [ ] On submit: call `POST /api/bookings`, then `POST /api/payments/create-checkout-session`, then redirect to Stripe
- [ ] `BookingConfirmation.tsx` — poll booking status after Stripe redirect
- [ ] `GuestDashboard.tsx` — list bookings with cancel option
- [ ] `HostDashboard.tsx` — incoming bookings, earnings summary, listing management
- [ ] `AdminDashboard.tsx` — user management, listing approvals, stats

**✅ Phase 10 Done When:** End-to-end booking with Stripe test card completes. Booking shows as confirmed.

---

## Phase 11 — Reviews Frontend

**Goal:** Review form and display integrated into the booking flow.

### Tasks

- [ ] `components/reviews/ReviewForm.tsx` — star ratings + comment, shows after checkout date
- [ ] `components/reviews/ReviewCard.tsx`
- [ ] `components/reviews/ReviewList.tsx` — paginated, on listing detail page
- [ ] Wire `guestReviewed`/`hostReviewed` flags to show/hide review form in dashboards

**✅ Phase 11 Done When:** Reviews display on listing pages. Review form appears only for eligible completed bookings.

---

## Phase 12 — Polish, Security Audit & Production Deploy

**Goal:** Production-ready. All security rules checked. Deployed with PM2 + Nginx.

### Security Checklist

- [ ] `NODE_ENV=production` set
- [ ] All secrets in env vars (not in code)
- [ ] Stripe LIVE keys configured
- [ ] `ALLOWED_ORIGINS` set to actual domain
- [ ] HTTPS enforced (Let's Encrypt)
- [ ] Stripe webhook secret from production Dashboard
- [ ] MongoDB Atlas IP allowlist configured
- [ ] Nginx blocks non-image files in `/uploads/`
- [ ] Password fields `select: false` in all schemas
- [ ] No `console.log` in production code (Winston only)
- [ ] Error messages sanitized in production (`NODE_ENV` guard)
- [ ] No `any` types or `@ts-ignore` in codebase
- [ ] Rate limiters active on all routes

### Performance Checklist

- [ ] MongoDB indexes created (`npm run db:indexes`)
- [ ] `.lean()` on all read-only queries
- [ ] React build minified and code-split
- [ ] Gzip enabled in Nginx
- [ ] Image cache headers: `Cache-Control: public, immutable, max-age=2592000`
- [ ] Nginx serves `/uploads/` directly (bypasses Node)

### Deployment Steps

```bash
# 1. Install PM2 globally
npm install -g pm2

# 2. Build both apps
cd server && npm run build && cd ..
cd client && npm run build && cd ..

# 3. Create uploads directory
mkdir -p server/public/uploads
touch server/public/uploads/.gitkeep

# 4. Create logs directory
mkdir -p logs

# 5. Start with PM2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup   # run the printed command

# 6. Nginx config + SSL
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d yourdomain.com
```

### Final Postman Smoke Tests (Production)

| Request | Expected |
|---------|----------|
| `GET https://yourdomain.com/api/health` | 200, database: connected |
| `POST /api/auth/register` | 201 |
| `POST /api/auth/login` | 200, httpOnly cookie set |
| `GET /api/listings` | 200, results |
| Stripe webhook from production Dashboard | Booking confirmed |

**✅ Phase 12 Done When:** All production checklist items ticked. App live on HTTPS. PM2 running in cluster mode.

---

## 📊 Phase Summary

```
Phase  1 │████░░░░░░░░░░░░░░░░░░░░│ Project Setup & Skeleton
Phase  2 │████████░░░░░░░░░░░░░░░░│ Database Models
Phase  3 │████████████░░░░░░░░░░░░│ Authentication
Phase  4 │████████████████░░░░░░░░│ Listings CRUD + Image Upload
Phase  5 │████████████████████░░░░│ Bookings
Phase  6 │████████████████████████│ Payments (Stripe)
Phase  7 │████████████████████████│ Reviews
Phase  8 │████████████████████████│ Users & Admin
Phase  9 │████████████████████████│ Frontend Core
Phase 10 │████████████████████████│ Frontend Booking & Payment
Phase 11 │████████████████████████│ Frontend Reviews
Phase 12 │████████████████████████│ Polish, Security & Deploy
```

---

## 🔑 Critical Rules Summary

| # | Rule | Where |
|---|------|-------|
| 1 | Booking confirmed ONLY inside Stripe webhook | STRIPE.md |
| 2 | Price ALWAYS recalculated server-side | STRIPE.md |
| 3 | Every route with input needs a express-validator schema | CODING_GUIDELINES R-003 |
| 4 | Role checks in `roleMiddleware`, never controllers | CODING_GUIDELINES R-004 |
| 5 | Webhook uses `express.raw()`, registered BEFORE `express.json()` | STRIPE.md |
| 6 | All async handlers wrapped with `asyncHandler()` | CODING_GUIDELINES R-005 |
| 7 | All responses use `ApiResponse` wrapper | CODING_GUIDELINES R-006 |
| 8 | Never use original upload filename — always generate `uuid` | CODING_GUIDELINES R-010 |
| 9 | Access tokens in memory only — never `localStorage` | CODING_GUIDELINES SEC-004 |
| 10 | Use Winston logger — no `console.log` in production | CODING_GUIDELINES R-009 |

---

## 📚 Documentation Index

| Doc | What's Inside |
|-----|--------------|
| `docs/AI_CONTEXT.md` | Quick-start context for AI assistants and new devs |
| `docs/ARCHITECTURE.md` | System design, request lifecycle, all flows |
| `docs/API.md` | Every endpoint with request/response shapes |
| `docs/DATABASE.md` | MongoDB schemas, indexes, key queries |
| `docs/STRIPE.md` | Payment flow, webhook handler, refund logic |
| `docs/DEPLOYMENT.md` | Env vars, PM2, Nginx, CI/CD, production checklist |
| `docs/CODING_GUIDELINES.md` | All coding rules — read before writing any code |

---

## 🧰 Tech Stack Reference

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React + TypeScript | 18.x |
| Build Tool | Vite | 5.x |
| Styling | TailwindCSS | 3.x |
| UI State | React Context | 19.x |
| Server State | Custom Hooks / useEffect | 19.x |
| HTTP Client | Axios | 1.x |
| Backend | Express + Vanilla JS | 4.x |
| Validation | express-validator | 3.x |
| Auth | JWT + bcrypt | — |
| Database | MongoDB + Mongoose | 7.x / 8.x |
| Payments | Stripe Checkout | 2024-06-20 |
| File Uploads | Multer | 1.x |
| Email | SendGrid / Nodemailer | — |
| Logger | Winston | 3.x |
| API Testing | **Postman** | latest |
| Process Manager | PM2 | 5.x |
| Reverse Proxy | Nginx | — |
| CI/CD | GitHub Actions | — |
