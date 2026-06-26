# Security Baseline

## Authentication Flow
This project uses JSON Web Tokens (JWT) for stateless authentication.
1. **Signup/Login**: The client sends credentials to `/auth/login`. On success, the server responds with an `accessToken` and a `refreshToken`.
2. **Accessing Protected Routes**: The client must include the `accessToken` in the `Authorization` header (`Bearer <token>`).
3. **Token Refresh**: When the `accessToken` expires, the client calls `/auth/refresh` with the `refreshToken` to get a new `accessToken`.

## Authorization (RBAC)
Role-Based Access Control is enforced via the `authorizeRoles` middleware.
- **Roles**: `admin`, `host`, `user`.
- A user attempting to POST to `/host/add-home` MUST have their role set to `host` or `admin`.

## Best Practices Enforced
- **Encryption**: User passwords are encrypted using `bcryptjs` before persisting to `users.json`.
- **Validation**: Incoming requests to `/auth/*` and `/host/*` are heavily sanitized and validated using `express-validator` to prevent malicious payloads.
