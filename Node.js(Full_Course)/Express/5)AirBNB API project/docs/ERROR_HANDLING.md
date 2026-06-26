# Error Handling

## General Philosophy
As an API-first application, the backend should never crash silently or return HTML error pages. All errors must be serialized into JSON responses.

## HTTP Status Conventions
- **200/201**: Success / Created.
- **400 Bad Request**: Validation failed (e.g., via `express-validator`).
- **401 Unauthorized**: Missing or invalid JWT.
- **403 Forbidden**: Valid JWT, but the user lacks the required role.
- **404 Not Found**: Endpoint does not exist, or requested resource (e.g., Home ID) was not found.
- **500 Internal Server Error**: Unhandled exceptions, file read/write errors.

## Controller Implementation
When catching errors in controllers (especially inside callbacks or async functions), explicitly return a `500` status:
```javascript
fs.readFile(path, (err) => {
  if (err) return res.status(500).json({ error: "File operation failed" });
});
```

## Validation Errors
Errors caught by `express-validator` are collected in the request object. Controllers must check for these early:
```javascript
const errors = validationResult(req);
if (!errors.isEmpty()) {
  return res.status(400).json({ errors: errors.array() });
}
```
