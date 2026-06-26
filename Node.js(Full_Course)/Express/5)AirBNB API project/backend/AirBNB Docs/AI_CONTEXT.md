# 🤖 AI_CONTEXT.md — Read This First

> One-page condensed context for any AI assistant (or new dev) working in this repo.
> This is a *summary index*, not a replacement — for full detail, jump to the linked doc.

---

## What this project is

A production-ready **Airbnb clone**: React + TypeScript frontend, Express + Vanilla JS backend, MongoDB, Stripe Checkout for payments, local-disk file storage. Three roles: `guest`, `host`, `admin`.

## Stack at a glance

| Layer | Tech |
|---|---|
| Frontend | React 18, TypeScript, Vite, TailwindCSS, React Context (state) |
| Backend | Node.js, Express, Vanilla JS, express-validator validation, JWT auth |
| Database | MongoDB + Mongoose (no Redis, no Docker in dev) |
| Payments | Stripe Checkout (hosted page) + webhooks only — never client-confirmed |
| Files | Local `server/public/uploads/`, served by Express (dev) / Nginx (prod) |
| Process mgmt | PM2 (cluster mode) + Nginx reverse proxy |
| Email | SendGrid/Nodemailer |

## Mental model of a request

```
Client (axios) → CORS → Helmet → RateLimit → Router
  → authMiddleware (JWT) → roleMiddleware → validate (express-validator)
  → asyncHandler(Controller) → Service → Mongoose/Stripe
  → ApiResponse.success(res, data)
```
Full detail: **ARCHITECTURE.md**

## The 5 things to never get wrong

1. **Booking confirmation only ever happens inside the Stripe webhook handler** (`checkout.session.completed`). Never confirm a booking from a client-facing route. → STRIPE.md
2. **Price is always recalculated server-side** from the listing + dates — never trust a price sent by the client. → STRIPE.md
3. **Every route with input needs a express-validator schema** run through `validate.middleware.js`; controllers never touch `req.body` directly. → CODING_GUIDELINES.md (R-003)
4. **Role checks live in `roleMiddleware`, never in controllers.** → CODING_GUIDELINES.md (R-004)
5. **Webhook route uses `express.raw()` and must be registered before `express.json()`.** → STRIPE.md

## Where things live (quick map)

- Routes → `server/src/routes/*.routes.ts`
- Controllers (HTTP only, no DB calls) → `server/src/controllers/`
- Services (business logic, DB, Stripe) → `server/src/services/`
- express-validator schemas → `server/src/utils/validators/`
- Mongoose models → `server/src/models/`
- Frontend API calls → `client/src/services/` (never raw axios/fetch in components)
- Global state → React Context (`client/src/context/`); server data → Custom Hooks / useEffect

Full tree: **README.md**

## Collections (one-liners)

`users`, `listings`, `bookings`, `reviews`, `payments` — schemas, fields, and indexes are in **DATABASE.md**. Key denormalizations: `Booking.host` (avoid joins), `Listing.rating.average` (avoid per-view aggregation), `Booking.pricing.*` (price snapshot at booking time).

## Env vars you'll need

JWT secrets, `MONGODB_URI`, `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET`, `ALLOWED_ORIGINS`, `BASE_URL`, `UPLOAD_DIR`, SendGrid key. Full list with comments: **DEPLOYMENT.md**

## Before writing any code, also check

- **CODING_GUIDELINES.md** — naming conventions, error handling pattern (`ApiError` + `asyncHandler`), response shape (`ApiResponse`), security rules, testing rules. This is the rulebook; nothing here should be violated silently — ask if a request conflicts with it.

## Doc map

| Need to know about... | Go to |
|---|---|
| Endpoints, request/response shapes | API.md |
| System design, request lifecycle, flows | ARCHITECTURE.md |
| Schemas, indexes, queries | DATABASE.md |
| Payments, webhooks, refunds | STRIPE.md |
| Env vars, PM2, Nginx, CI/CD | DEPLOYMENT.md |
| Coding rules / conventions | CODING_GUIDELINES.md |
