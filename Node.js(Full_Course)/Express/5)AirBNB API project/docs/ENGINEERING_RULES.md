# Engineering Rules

## 1. Boundary Discipline
- **Controllers** must solely handle HTTP request parsing and response formatting. They should not directly read/write from the filesystem.
- **Models** are strictly responsible for data persistence logic (interacting with `backend/data/*.json`).
- **Middlewares** should be used for cross-cutting concerns like Auth (`authMiddleware.js`).
- **Validations** must be encapsulated in `backend/validations/` and applied at the route level before hitting the controller.

## 2. API Contract Rules
- All responses must be JSON.
- Successful responses should typically have a `200` or `201` status.
- Error responses must follow a consistent format, preferably including an `error` or `message` key, and proper HTTP status codes (`400`, `401`, `403`, `404`, `500`).

## 3. Type Safety
- The frontend relies on TypeScript. Any data structure changes in the backend must be mirrored in the frontend interfaces.

## 4. Security Defaults
- Passwords must NEVER be stored in plain text. Always use `bcryptjs` for hashing before saving in `models/user.js`.
- Sensitive routes (like `/host/add-home`) MUST use the `verifyToken` and `authorizeRoles` middlewares.
- Tokens must be rotated; use access tokens for short-lived authorization and refresh tokens for long-lived sessions.

## 5. Code Reuse
- Use `backend/utils/` for shared logic, such as `pathUtil.js` for directory resolution.
