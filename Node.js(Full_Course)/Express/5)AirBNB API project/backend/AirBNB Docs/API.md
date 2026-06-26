# 📡 API.md — REST API Reference

**Base URL:** `https://api.yourapp.com` (prod) / `http://localhost:5000` (dev)

All responses follow this envelope:
```json
// Success
{ "success": true, "message": "string", "data": {}, "meta": { "page": 1, "total": 100 } }

// Error
{ "success": false, "message": "string", "errors": [] }
```

Auth: pass `Authorization: Bearer <accessToken>` on protected routes.

---

## Auth Routes `/api/auth`

### POST `/api/auth/register`
Register a new user.

**Body:**
```json
{
  "name": "Riya Shah",
  "email": "riya@example.com",
  "password": "StrongPass1!",
  "role": "guest"  // optional, default: "guest"
}
```

**Response 201:**
```json
{
  "data": {
    "user": { "_id": "...", "name": "Riya Shah", "email": "...", "role": "guest" },
    "accessToken": "eyJ..."
  }
}
```
> Sets `refreshToken` httpOnly cookie.

---

### POST `/api/auth/login`
**Body:** `{ "email": "...", "password": "..." }`

**Response 200:** Same shape as register.

---

### POST `/api/auth/refresh-token`
Uses `refreshToken` cookie. No body needed.

**Response 200:** `{ "data": { "accessToken": "eyJ..." } }`

---

### POST `/api/auth/logout`
🔒 Auth required.

Clears refresh token cookie and removes token hash from `User.refreshTokens[]` in MongoDB.

**Response 200:** `{ "message": "Logged out successfully" }`

---

### POST `/api/auth/forgot-password`
**Body:** `{ "email": "..." }`

**Response 200:** `{ "message": "Reset link sent to email" }`

---

### POST `/api/auth/reset-password`
**Body:** `{ "token": "...", "newPassword": "..." }`

**Response 200:** `{ "message": "Password reset successful" }`

---

## Listing Routes `/api/listings`

### GET `/api/listings`
Search and filter listings. All params optional.

**Query Params:**

| Param | Type | Example |
|-------|------|---------|
| `city` | string | `Mumbai` |
| `country` | string | `India` |
| `checkIn` | ISO date | `2024-12-20` |
| `checkOut` | ISO date | `2024-12-25` |
| `guests` | number | `2` |
| `minPrice` | number | `1000` |
| `maxPrice` | number | `10000` |
| `type` | string | `apartment` |
| `amenities` | CSV | `wifi,pool,gym` |
| `lat` | number | `19.076` |
| `lng` | number | `72.877` |
| `radius` | number (km) | `10` |
| `page` | number | `1` |
| `limit` | number | `20` |
| `sortBy` | string | `price_asc` / `price_desc` / `rating` |

**Response 200:**
```json
{
  "data": [ /* array of listing summaries */ ],
  "meta": { "page": 1, "limit": 20, "total": 143, "pages": 8 }
}
```

---

### GET `/api/listings/:id`
Get full listing detail (includes host info, reviews summary).

**Response 200:**
```json
{
  "data": {
    "_id": "...",
    "title": "...",
    "host": { "_id": "...", "name": "...", "avatar": "...", "createdAt": "..." },
    "images": [{ "url": "...", "caption": "..." }],
    "pricing": { "basePrice": 3500, "cleaningFee": 500, "serviceFee": 12, "currency": "INR" },
    "capacity": { "guests": 4, "bedrooms": 2, "beds": 3, "bathrooms": 1 },
    "amenities": ["wifi", "kitchen", "parking"],
    "rating": { "average": 4.7, "count": 23 },
    "location": { "city": "Goa", "country": "India", "coordinates": { "type": "Point", "coordinates": [73.83, 15.49] } }
  }
}
```

---

### POST `/api/listings` 🔒 Host only
Create a new listing. Accepts `multipart/form-data` for image uploads.

**Form Fields:**
```
title, description, type, address, city, state, country, zipCode,
lat, lng, basePrice, cleaningFee, serviceFee, currency,
guests, bedrooms, beds, bathrooms, amenities (JSON array),
checkInTime, checkOutTime, smokingAllowed, petsAllowed, partiesAllowed
images (files, max 10)
```

**Response 201:** `{ "data": { /* full listing */ } }`

---

### PUT `/api/listings/:id` 🔒 Host (owner) only
Update listing. Same fields as create (all optional).

**Response 200:** `{ "data": { /* updated listing */ } }`

---

### DELETE `/api/listings/:id` 🔒 Host (owner) or Admin
Soft-delete: sets `status: 'inactive'`.

**Response 200:** `{ "message": "Listing removed" }`

---

### GET `/api/listings/:id/availability`
Check availability for a date range.

**Query:** `?checkIn=2024-12-20&checkOut=2024-12-25`

**Response 200:**
```json
{ "data": { "available": true, "blockedDates": [] } }
```

---

### POST `/api/listings/:id/block-dates` 🔒 Host (owner)
Block dates for maintenance etc.

**Body:** `{ "dates": ["2024-12-24", "2024-12-25"] }`

---

## Booking Routes `/api/bookings`

### POST `/api/bookings` 🔒 Auth required
Create a booking (status starts as `pending`).

**Body:**
```json
{
  "listingId": "...",
  "checkIn": "2024-12-20",
  "checkOut": "2024-12-25",
  "guests": { "adults": 2, "children": 1, "infants": 0 }
}
```

**Response 201:**
```json
{
  "data": {
    "bookingId": "...",
    "totalPrice": 20500,
    "currency": "INR",
    "status": "pending"
  }
}
```

---

### GET `/api/bookings` 🔒 Auth required
Get current user's bookings.

**Query:** `?status=confirmed&page=1&limit=10`

**Response 200:** Array of bookings with listing summary.

---

### GET `/api/bookings/:id` 🔒 Auth required
Get booking detail. User must be guest or host of the booking.

---

### PATCH `/api/bookings/:id/cancel` 🔒 Auth required
Cancel a booking. Guest or host can cancel.

**Body:** `{ "reason": "Change of plans" }`

**Response 200:** `{ "message": "Booking cancelled", "data": { "refundAmount": 18000 } }`

---

### GET `/api/bookings/host` 🔒 Host only
Get all bookings for host's listings.

**Query:** `?status=confirmed&page=1`

---

## Payment Routes `/api/payments`

### POST `/api/payments/create-checkout-session` 🔒 Auth required
Creates Stripe Checkout session for a booking.

**Body:** `{ "bookingId": "..." }`

**Response 200:**
```json
{ "data": { "sessionId": "cs_test_..." } }
```
Client then calls `stripe.redirectToCheckout({ sessionId })`.

---

### POST `/api/payments/webhook`
Stripe webhook endpoint. **NO AUTH. Uses raw body.**

Handled events:
- `checkout.session.completed` → confirms booking
- `payment_intent.payment_failed` → marks booking expired

**Response 200:** `{ "received": true }`

---

### POST `/api/payments/refund` 🔒 Auth required
Process a refund for a cancelled booking.

**Body:** `{ "bookingId": "..." }`

**Response 200:**
```json
{ "data": { "refundId": "re_...", "refundAmount": 18000 } }
```

---

### GET `/api/payments/history` 🔒 Auth required
Get user's payment history.

---

## Review Routes `/api/reviews`

### POST `/api/reviews` 🔒 Auth required
Submit a review after a completed booking.

**Body:**
```json
{
  "bookingId": "...",
  "ratings": {
    "overall": 5,
    "cleanliness": 4,
    "accuracy": 5,
    "communication": 5,
    "location": 4,
    "value": 4
  },
  "comment": "Wonderful stay!"
}
```

**Rules:**
- Can only review after check-out date
- One review per booking per direction
- Booking must have status `completed`

---

### GET `/api/reviews/listing/:listingId`
Get all public reviews for a listing.

**Query:** `?page=1&limit=10`

---

### GET `/api/reviews/user/:userId`
Get all public reviews for a user (host or guest).

---

## User Routes `/api/users`

### GET `/api/users/profile` 🔒 Auth required
Get own profile.

### PATCH `/api/users/profile` 🔒 Auth required
Update own profile. Accepts `multipart/form-data` for avatar upload.

**Fields:** `name, phone, bio, avatar (file)`

### GET `/api/users/:id/public`
Get public profile of any user (host or guest).

### POST `/api/users/saved-listings/:listingId` 🔒 Auth required
Save/unsave a listing. Toggle behavior.

### GET `/api/users/saved-listings` 🔒 Auth required
Get saved listings.

---

## Admin Routes `/api/admin` 🔒 Admin only

### GET `/api/admin/users` — List all users (paginated)
### PATCH `/api/admin/users/:id/ban` — Ban a user
### GET `/api/admin/listings` — List all listings
### PATCH `/api/admin/listings/:id/status` — Approve/deactivate listing
### GET `/api/admin/bookings` — List all bookings
### GET `/api/admin/stats` — Dashboard stats (revenue, active users, bookings)

---

## HTTP Status Codes Used

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient role) |
| 404 | Not Found |
| 409 | Conflict (e.g., date already booked) |
| 422 | Unprocessable Entity |
| 429 | Too Many Requests (rate limited) |
| 500 | Internal Server Error |
