# Middleware Chain

## Overview
The Express backend relies on a sequential middleware pipeline defined in `app.js`. Order matters heavily.

## 1. Global Pre-Processing
```javascript
app.use(helmet());
app.use(apiLimiter);
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```
- **Security First**: `helmet` secures HTTP headers, and `apiLimiter` protects against DDOS.
- **Data Parsing**: Configures cross-origin requests, parses incoming `httpOnly` cookies, and ensures request bodies are parsed as JSON.

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
app.use((req, res, next) => next(new ApiError(404, "Endpoint Not Found")));
app.use(errorHandler);
```
- The 404 middleware catches unmatched routes and throws an `ApiError`.
- The `errorHandler` intercepts all thrown `ApiError`s, logs them via `winston`, and returns a clean JSON response.
