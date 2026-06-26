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

## The Enterprise Approach (`utils/`)
We use a centralized error handling strategy utilizing custom wrappers:

1. **`ApiError.js`**: When a controller encounters a failure (e.g., home not found), it should throw this custom class.
   ```javascript
   throw new ApiError(404, "Home not found");
   ```
2. **`asyncHandler.js`**: All async controller functions MUST be wrapped in `asyncHandler`. This entirely eliminates the need for `try/catch` blocks. If a promise rejects, `asyncHandler` catches it and forwards it to the global error middleware.
   ```javascript
   exports.getHome = asyncHandler(async (req, res) => {
     // No try/catch needed!
     const home = await Home.findById(req.params.homeId);
     if (!home) throw new ApiError(404, "Home not found");
     
     res.status(200).json(new ApiResponse(200, "Home found", home));
   });
   ```

## Global Error Middleware
Any thrown `ApiError` or unhandled promise rejection is caught by `middlewares/error.middleware.js`. This middleware logs the error securely to `error.log` via **Winston**, and serializes the error into a clean JSON response for the frontend.

## Validation Errors
Errors caught by `express-validator` are collected in the request object. Controllers must check for these early:
```javascript
const errors = validationResult(req);
if (!errors.isEmpty()) {
  return res.status(400).json({ errors: errors.array() });
}
```
