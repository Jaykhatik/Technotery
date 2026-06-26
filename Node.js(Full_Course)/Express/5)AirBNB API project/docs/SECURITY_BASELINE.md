# Security Baseline

## Authentication Flow
This project uses JSON Web Tokens (JWT) for stateless authentication.
1. **Signup/Login**: The client sends credentials to `/auth/login`. On success, the server responds by setting `jwt` and `refreshToken` securely as `httpOnly` cookies.
2. **Accessing Protected Routes**: The browser automatically includes the `httpOnly` cookies with the request. The server verifies the token.
3. **Token Refresh**: When the `accessToken` expires, the client calls `/auth/refresh` allowing the server to issue new tokens via cookies.

## Authorization (RBAC)
Role-Based Access Control is enforced via the `authorizeRoles` middleware.
- **Roles**: `admin`, `host`, `user`.
- A user attempting to POST to `/host/add-home` MUST have their role set to `host` or `admin`.

## Best Practices Enforced
- **Encryption**: User passwords are encrypted using `bcryptjs` before persisting to the MongoDB database.
- **Validation**: Incoming requests to `/auth/*` and `/host/*` are heavily sanitized and validated using `express-validator` to prevent malicious payloads.
