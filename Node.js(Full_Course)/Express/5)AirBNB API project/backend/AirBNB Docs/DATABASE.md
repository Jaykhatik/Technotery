# 🗄️ DATABASE.md — MongoDB Schemas & Indexes

## Connection

Connect via `server/src/config/db.js`. Use `MONGODB_URI` env var. Enable `autoIndex: false` in production (run index creation separately).

---

## Collections & Schemas

### `users`

```typescript
{
  _id: ObjectId,
  email: string,           // unique, lowercase, trim
  password: string,        // select: false (bcrypt hash)
  name: string,
  avatar: string,          // relative path e.g. /uploads/avatars/abc.jpg
  role: 'guest' | 'host' | 'admin',  // default: 'guest'
  isVerified: boolean,
  googleId?: string,
  phone?: string,
  bio?: string,
  // Auth
  refreshTokens: string[], // hashed refresh tokens (one per device/session)
  // Host-specific
  stripeAccountId?: string,
  // Guest-specific
  savedListings: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}

INDEXES:
  - { email: 1 } UNIQUE
  - { googleId: 1 } SPARSE
  - { role: 1 }
```

### `listings`

```typescript
{
  _id: ObjectId,
  host: ObjectId,          // ref: 'User'
  title: string,           // max: 100 chars
  description: string,     // max: 5000 chars
  type: 'apartment' | 'house' | 'villa' | 'cabin' | 'hotel' | 'hostel',
  status: 'draft' | 'active' | 'inactive',  // default: 'draft'

  location: {
    address: string,
    city: string,
    state: string,
    country: string,
    zipCode: string,
    coordinates: {
      type: 'Point',       // GeoJSON
      coordinates: [number, number]  // [longitude, latitude]
    }
  },

  images: [{
    url: string,           // relative path e.g. /uploads/listings/abc.jpg
    caption?: string
  }],

  pricing: {
    basePrice: number,     // per night, in smallest currency unit (paise/cents)
    cleaningFee: number,
    serviceFee: number,    // percentage, e.g. 12 = 12%
    currency: string,      // ISO 4217, e.g. 'INR', 'USD'
    weeklyDiscount?: number,    // percentage discount for 7+ nights
    monthlyDiscount?: number    // percentage discount for 30+ nights
  },

  capacity: {
    guests: number,
    bedrooms: number,
    beds: number,
    bathrooms: number
  },

  amenities: string[],     // enum defined in constants/amenities.ts

  rules: {
    checkInTime: string,   // '15:00'
    checkOutTime: string,  // '11:00'
    smokingAllowed: boolean,
    petsAllowed: boolean,
    partiesAllowed: boolean,
    quietHours?: string
  },

  // Computed from reviews (denormalized for performance)
  rating: {
    average: number,       // 0–5, 1 decimal
    count: number
  },

  // Blocked dates (non-booking unavailability set by host)
  blockedDates: [Date],

  createdAt: Date,
  updatedAt: Date
}

INDEXES:
  - { host: 1 }
  - { status: 1 }
  - { 'location.city': 1 }
  - { 'location.country': 1 }
  - { 'pricing.basePrice': 1 }
  - { 'location.coordinates': '2dsphere' }  // Geospatial queries
  - { 'rating.average': -1 }
  - { status: 1, 'location.city': 1, 'pricing.basePrice': 1 }  // Compound search index
```

### `bookings`

```typescript
{
  _id: ObjectId,
  listing: ObjectId,       // ref: 'Listing'
  guest: ObjectId,         // ref: 'User'
  host: ObjectId,          // ref: 'User' (denormalized for fast host queries)

  checkIn: Date,
  checkOut: Date,
  nights: number,          // computed: checkOut - checkIn

  guests: {
    adults: number,
    children: number,
    infants: number
  },

  pricing: {
    basePrice: number,     // price at time of booking (snapshot)
    cleaningFee: number,
    serviceFee: number,
    totalPrice: number,    // final total charged
    currency: string
  },

  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'expired',

  payment: {
    stripeSessionId: string,       // Checkout Session ID
    stripePaymentIntentId?: string,
    paidAt?: Date,
    refundId?: string,
    refundAmount?: number,
    refundedAt?: Date
  },

  // Set to true after both guest and host have reviewed
  guestReviewed: boolean,
  hostReviewed: boolean,

  cancellationReason?: string,
  cancelledAt?: Date,
  cancelledBy?: 'guest' | 'host' | 'admin',

  createdAt: Date,
  updatedAt: Date
}

INDEXES:
  - { guest: 1 }
  - { host: 1 }
  - { listing: 1 }
  - { status: 1 }
  - { 'payment.stripeSessionId': 1 } UNIQUE SPARSE
  - { listing: 1, checkIn: 1, checkOut: 1 }  // Availability conflict check
  - { checkIn: 1, status: 1 }                // Check-in reminders cron
```

### `reviews`

```typescript
{
  _id: ObjectId,
  booking: ObjectId,       // ref: 'Booking' — one review per booking per direction
  reviewer: ObjectId,      // ref: 'User'
  reviewee: ObjectId,      // ref: 'User'
  listing: ObjectId,       // ref: 'Listing'

  direction: 'guest-to-host' | 'host-to-guest',

  ratings: {
    overall: number,       // 1–5
    cleanliness?: number,
    accuracy?: number,
    communication?: number,
    location?: number,
    value?: number
  },

  comment: string,         // max: 2000 chars
  isPublic: boolean,       // default: true

  createdAt: Date
}

INDEXES:
  - { listing: 1, direction: 1 }
  - { reviewer: 1 }
  - { reviewee: 1 }
  - { booking: 1, direction: 1 } UNIQUE  // one review per booking per direction
```

### `payments` (audit log)

```typescript
{
  _id: ObjectId,
  booking: ObjectId,       // ref: 'Booking'
  user: ObjectId,          // ref: 'User' (guest)

  amount: number,          // in smallest currency unit
  currency: string,
  status: 'pending' | 'succeeded' | 'failed' | 'refunded' | 'partially_refunded',

  stripe: {
    sessionId: string,
    paymentIntentId: string,
    chargeId?: string,
    refundId?: string,
    refundAmount?: number
  },

  metadata: Record<string, string>,  // passed to Stripe
  createdAt: Date,
  updatedAt: Date
}

INDEXES:
  - { booking: 1 }
  - { user: 1 }
  - { 'stripe.sessionId': 1 } UNIQUE
  - { 'stripe.paymentIntentId': 1 } UNIQUE SPARSE
  - { status: 1, createdAt: -1 }
```

---

## Relationships Summary

```
User (1) ──────────────→ (N) Listing        [host field]
User (1) ──────────────→ (N) Booking        [guest field]
Listing (1) ───────────→ (N) Booking        [listing field]
Booking (1) ───────────→ (0-2) Review       [guest→host, host→guest]
Booking (1) ───────────→ (1) Payment        [audit log]
```

---

## Key Queries

### Availability Conflict Check (Booking Creation)
```javascript
// Check if any confirmed/pending booking overlaps with requested dates
await Booking.findOne({
  listing: listingId,
  status: { $in: ['confirmed', 'pending'] },
  $or: [
    { checkIn: { $lt: checkOut }, checkOut: { $gt: checkIn } }
  ]
}).lean();
```

### Listing Search
```javascript
await Listing.find({
  status: 'active',
  'location.city': /^city/i,        // partial match
  'pricing.basePrice': { $gte: minPrice, $lte: maxPrice },
  'capacity.guests': { $gte: guests }
})
.sort({ 'rating.average': -1 })
.skip((page - 1) * limit)
.limit(limit)
.select('title images pricing capacity location rating')
.lean();
```

### Geo Search (Near a Point)
```javascript
await Listing.find({
  'location.coordinates': {
    $near: {
      $geometry: { type: 'Point', coordinates: [lng, lat] },
      $maxDistance: 10000  // 10km
    }
  },
  status: 'active'
}).lean();
```

### Host Earnings Summary
```javascript
await Booking.aggregate([
  { $match: { host: hostId, status: 'confirmed' } },
  { $group: {
    _id: null,
    totalEarnings: { $sum: '$pricing.totalPrice' },
    totalBookings: { $count: {} }
  }}
]);
```

---

## Migration Strategy

- Use `migrate-mongo` for schema migrations.
- All migrations stored in `server/src/migrations/`.
- Run on deploy before server starts: `npm run migrate:up`.
- Never mutate a field type without a migration.

---

## Denormalization Decisions

| Field | Why Denormalized |
|-------|-----------------|
| `Booking.host` | Avoid join to listing for host dashboard queries |
| `Listing.rating.average` | Avoid aggregation on every listing view; updated after each review |
| `Booking.pricing.*` | Price snapshot — listing price can change after booking |
