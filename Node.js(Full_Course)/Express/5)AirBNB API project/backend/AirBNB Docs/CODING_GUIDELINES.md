# 📋 CODING_GUIDELINES.md — AI Coding Rules & Conventions

> **IMPORTANT:** If you are an AI assistant (GitHub Copilot, Claude, Cursor, etc.) generating code for this project, you MUST read and follow every rule in this file before writing a single line of code. No exceptions.

---

## 🔴 CRITICAL RULES (Never Violate)

### R-001 · TypeScript Strict Mode
- **ALL** code (frontend and backend) must be written in TypeScript.
- `tsconfig.json` has `"strict": true`. Never disable it.
- No `any` types. Use `unknown` + type guards if the shape is truly unknown.
- No `@ts-ignore` or `@ts-nocheck` comments.

### R-002 · No Plaintext Secrets
- Never hardcode API keys, DB URIs, secrets, or tokens in source files.
- All secrets come from environment variables via `process.env`.
- Every new env var must be added to `.env.example` with a placeholder value and a comment explaining what it is.

### R-003 · Input Validation on Every Route
- Every Express route that accepts a request body, query params, or URL params MUST validate input using a **Zod schema** in `server/src/utils/validators/`.
- Validation runs via `validate.middleware.ts` before the controller is called.
- Never trust `req.body` directly in a controller.

### R-004 · Authentication & Authorization
- Protected routes MUST use `authMiddleware` (JWT verification).
- Role-restricted routes MUST use `roleMiddleware(['host', 'admin'])` etc.
- Never check roles inside a controller — that logic belongs in middleware.
- JWT secrets must be at least 32 characters. Access token TTL: 15 minutes. Refresh token TTL: 7 days.

### R-005 · Async Error Handling
- All async Express route handlers MUST be wrapped with `asyncHandler()` from `server/src/utils/asyncHandler.ts`.
- Never use naked `try/catch` in controllers — let `asyncHandler` catch it and forward to `error.middleware.ts`.
- Throw `new ApiError(statusCode, message)` — never `res.status(xxx).json(...)` for errors.

### R-006 · Standard Response Shape
- Every successful API response MUST use `ApiResponse` from `server/src/utils/ApiResponse.ts`.
- Shape: `{ success: true, message: string, data: T, meta?: PaginationMeta }`.
- Never return raw objects directly from controllers.

### R-007 · Stripe Webhook Security
- The Stripe webhook route (`POST /api/payments/webhook`) MUST use `express.raw()` body parser — NOT `express.json()`.
- Always verify webhook signatures with `stripe.webhooks.constructEvent()`.
- Never trust webhook payloads that fail signature verification.
- All payment state changes MUST originate from webhook events — never from direct API calls after checkout.

### R-008 · MongoDB Safety
- Never use `findOne` without handling the `null` case.
- All Mongoose queries that can throw must be inside `asyncHandler`.
- Use `.lean()` on read-only queries for performance.
- Never expose the full Mongoose document to the client — select only needed fields or use `.toObject()` with transforms.
- Always create indexes for fields used in `find()`, `sort()`, and `$lookup`.

### R-009 · No Direct `console.log` in Production Code
- Use the project logger (`server/src/utils/logger.ts` — Winston) for all server-side logging.
- `console.log` is permitted ONLY in one-off scripts or tests.
- Log levels: `error` for crashes, `warn` for degraded state, `info` for lifecycle events, `debug` for development traces.

### R-010 · File Uploads
- File uploads go through `upload.middleware.ts` (Multer with disk storage).
- Files are saved to `server/public/uploads/{subfolder}/` using a `{timestamp}-{uuid}.{ext}` filename.
- Never use the original filename from the client — always generate a new name to prevent path traversal.
- Validate MIME type (images only: jpeg, png, webp, gif) and file size (max 5MB) before saving.
- Store only the relative path (`/uploads/listings/abc.jpg`) in MongoDB. Reconstruct the full URL using `BASE_URL` env var.
- On image delete (listing removed or image replaced), call `fs.unlink()` to remove the file from disk. Never leave orphaned files.

---

## 🟡 ARCHITECTURE RULES

### A-001 · Controller ↔ Service Separation
- Controllers handle HTTP: parse request, call service, return response.
- Services handle business logic: DB queries, external API calls, computations.
- Never write DB queries (Mongoose calls) inside controllers.
- Never write `res.json()` inside services.

### A-002 · Route File Structure
Every route file must follow this pattern:
```ts
// server/src/routes/example.routes.ts
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';
import { createExampleSchema } from '../utils/validators/example.validator';
import * as ExampleController from '../controllers/example.controller';

const router = Router();

router.get('/', ExampleController.getAll);
router.post('/', authMiddleware, validate(createExampleSchema), ExampleController.create);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), validate(updateExampleSchema), ExampleController.update);

export default router;
```

### A-003 · Frontend API Layer
- Never call `fetch()` or `axios` directly in a React component or hook.
- All API calls go through typed service files in `client/src/services/`.
- Services use the pre-configured axios instance from `client/src/services/api.ts` which handles auth headers and token refresh.

### A-004 · State Management
- Global state (auth user, filters, cart) lives in **Zustand** stores in `client/src/store/`.
- Server state (listings, bookings, reviews) is managed by **React Query** (TanStack Query).
- Never store server-fetched data in Zustand — only client-side UI state.

### A-005 · Component Rules
- Components must be functional. No class components.
- Props must always be typed with an explicit `interface Props {}`.
- Components longer than 200 lines should be split into sub-components.
- No inline styles. Use Tailwind utility classes only.
- Reusable UI primitives go in `components/common/`. Page-specific components stay in their page folder.

### A-006 · Custom Hooks
- Any stateful logic used in 2+ components must be extracted into a custom hook in `client/src/hooks/`.
- Hooks must start with `use` prefix.
- Data-fetching hooks wrap React Query's `useQuery` / `useMutation`.

---

## 🟢 CODE STYLE RULES

### S-001 · Naming Conventions

| Thing | Convention | Example |
|-------|-----------|---------|
| Files (components) | PascalCase | `ListingCard.tsx` |
| Files (utils/hooks) | camelCase | `useListings.ts` |
| Files (routes/controllers) | kebab-case | `listing.routes.ts` |
| Variables / functions | camelCase | `getUserById` |
| Types / Interfaces | PascalCase | `BookingStatus` |
| Enums | PascalCase + UPPER values | `Role.ADMIN` |
| Constants | SCREAMING_SNAKE | `MAX_IMAGES_PER_LISTING` |
| MongoDB collections | plural, camelCase | `bookings`, `listings` |

### S-002 · Import Order
Always group and order imports:
1. Node built-ins (`path`, `fs`)
2. Third-party packages (`express`, `mongoose`, `stripe`)
3. Internal modules (`../models/User`, `../utils/ApiError`)
4. Types (`import type { ... }`)

Use ESLint `import/order` rule — do not manually manage this.

### S-003 · No Magic Numbers
All numeric constants (HTTP status codes not from `http-status`, limits, timeouts) must be named constants in `server/src/constants/` or `client/src/constants/`.

### S-004 · Error Messages
- Error messages must be human-readable and actionable.
- Never expose stack traces or internal error details to clients in production.
- Use `NODE_ENV` guard: send full error in `development`, sanitized message in `production`.

### S-005 · Comments
- Write comments for **why**, not **what** (the code shows what).
- Every exported function/class must have a JSDoc comment.
- TODO comments must include a ticket reference: `// TODO [AIRBNB-42]: Implement Google OAuth`.

---

## 🔵 SECURITY RULES

### SEC-001 · Helmet & CORS
- `helmet()` must be applied as the first middleware in `app.ts`.
- CORS must only allow origins defined in `ALLOWED_ORIGINS` env var.
- Never use `cors({ origin: '*' })` in production.

### SEC-002 · Rate Limiting
- All auth routes (`/api/auth/*`) must have a strict rate limiter: 10 requests / 15 minutes per IP.
- All other API routes must have a general rate limiter: 100 requests / 15 minutes per IP.
- Use `express-rate-limit` with the default in-memory store. This resets on server restart — acceptable for single-server deployments.
- Configure via `rateLimit.middleware.ts`, not inline in routes.

### SEC-003 · Password Hashing
- Always hash passwords with `bcrypt` at a cost factor of 12.
- Never log, return, or compare plaintext passwords.
- Password fields must be `select: false` in the Mongoose schema.

### SEC-004 · JWT Refresh Token Rotation
- Refresh tokens are stored in an `httpOnly`, `secure`, `sameSite: strict` cookie.
- Access tokens are stored in memory (React state), NOT `localStorage`.
- On refresh, invalidate the old refresh token (rotation) by replacing its hash in `User.refreshTokens[]` in MongoDB.
- `User.refreshTokens` is an array of hashed tokens — supports multiple devices. On logout, remove only the current token. On "logout all devices", clear the entire array.

### SEC-005 · Sensitive Data
- Never return `password`, `__v`, or internal `_id` fields to the client — use Mongoose `transform` or explicit field selection.
- Mask Stripe payment method details — never store raw card numbers.
- User emails should not appear in publicly accessible listing or review responses.

---

## 🟣 STRIPE RULES

### STR-001 · Payment Flow
The ONLY accepted payment flow:
1. Client calls `POST /api/payments/create-checkout-session` → gets `sessionId`.
2. Client redirects to Stripe Checkout using `sessionId`.
3. Stripe calls `POST /api/payments/webhook` on success.
4. Webhook handler confirms booking and sends confirmation email.
- Never confirm bookings client-side. Always wait for the webhook.

### STR-002 · Idempotency
- All Stripe API calls must use idempotency keys.
- Format: `{userId}-{bookingId}-{action}` (e.g., `user123-book456-charge`).

### STR-003 · Refunds
- Refunds are processed server-side only via `POST /api/payments/refund`.
- Apply refund policy (full refund > 48h before check-in, 50% otherwise).
- Always update `Booking.status = 'cancelled'` and `Payment.refundStatus` atomically.

---

## ⚫ GIT RULES

### G-001 · Branch Naming
- `main` — production-ready code only
- `develop` — integration branch
- `feature/AIRBNB-xx-short-description` — new features
- `fix/AIRBNB-xx-short-description` — bug fixes
- `chore/short-description` — maintenance

### G-002 · Commit Messages (Conventional Commits)
```
type(scope): short description

Types: feat | fix | chore | docs | style | refactor | test | perf
Examples:
  feat(booking): add date conflict check before creating booking
  fix(auth): refresh token not cleared on logout
  perf(listings): add compound index on location + price
```

### G-003 · Pull Requests
- PRs require at least one reviewer approval before merge.
- CI must be green (lint + tests pass).
- No direct pushes to `main`.

---

## 🧪 TESTING RULES

### T-001 · What to Test
- Every controller endpoint needs an integration test (Jest + Supertest).
- Every service function with business logic needs a unit test.
- Frontend: test custom hooks and complex components.

### T-002 · Test File Location
- Backend: `server/src/__tests__/` mirroring the `src/` structure.
- Frontend: co-located `__tests__/` folders next to the component.

### T-003 · Test Data
- Use factories (e.g., `fishery` or plain functions) for test data — never hardcode ObjectIds or emails.
- Use `mongodb-memory-server` for database tests — never test against a real DB.
- Mock Stripe in all tests. For file upload tests, use a temp directory and clean up after each test with `fs.rm()`.

---

## 🤖 AI-SPECIFIC INSTRUCTIONS

If you are an AI model generating code for this project:

1. **Read ARCHITECTURE.md first** to understand the data flow before generating any file.
2. **Check DATABASE.md** before writing any Mongoose model or query.
3. **Check STRIPE.md** before writing any payment-related code.
4. **Never generate a file without its corresponding TypeScript types.**
5. **Always generate the Zod validator alongside any new route.**
6. **If you add a new env var, update `.env.example` in the same response.**
7. **When generating a model, also generate the indexes** as defined in DATABASE.md.
8. **Always wrap async route handlers in `asyncHandler`** — never raw async functions.
9. **Generate tests alongside implementation code** when asked to implement a feature.
10. **Ask for clarification** if a requirement conflicts with these rules rather than silently violating them.
