# Middleware Chain

## Overview
The Express backend relies on a sequential middleware pipeline defined in `app.js`. Order matters heavily.

## 1. Global Pre-Processing
```javascript
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```
- Configures cross-origin requests, parses incoming `httpOnly` cookies, and ensures request bodies are parsed as JSON.

## 2. Route Handling (Routers as Middleware)
```javascript
app.use(userRouter);
app.use("/host", hostRouter);
app.use("/auth", authRouter);
```
- Routes are evaluated in this order. If a request matches, the route's specific controller logic takes over.
- Note: `/host` routes inject further middleware (`verifyToken`, `authorizeRoles`) before hitting controllers.

## 3. Global Error Handling
```javascript
app.use(errorController.get404);
```
- If a request falls through all previous routers without a match, this middleware catches it and returns a standard `404 Not Found` JSON error.
