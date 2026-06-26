# 🔐 Authentication & Authorization Guide

This guide explains how the authentication system works in our AirBNB API project using simple words and step-by-step examples.

## 🌟 The Core Concept
We use **JWT (JSON Web Tokens)** for security. Think of tokens as digital ID cards. Our system uses two types of tokens:
1. **Access Token**: A short-lived "VIP Pass" (expires in 15 minutes). You attach this pass to your requests to access protected routes (like adding a home).
2. **Refresh Token**: A long-lived "Membership Card" (expires in 7 days). When your short-lived pass expires, you use this card to get a brand new pass without having to type in your password again.

### 🎭 Roles
Our API supports Role-Based Access Control (RBAC). There are exactly 3 roles in our system:
- **`user`**: Can browse and view homes, but cannot add new homes. (This is the default role).
- **`host`**: Can browse homes AND has permission to add new home listings.
- **`admin`**: Has all the powers of a host, plus administrative privileges.

---

## 🛠️ Step-by-Step API Usage

Here is the exact flow of how to use the authentication system from start to finish.

### Step 1: Signup (Create an Account)
**Endpoint:** `POST /auth/signup`
**What it does:** Creates a new user, securely encrypts (hashes) their password so hackers can't read it, and saves them in `data/users.json` grouped by their specific role.

**Request Body (JSON):**
```json
{
  "email": "host@test.com",
  "password": "mysecurepassword",
  "role": "host"
}
```

### Step 2: Login (Get your Tokens)
**Endpoint:** `POST /auth/login`
**What it does:** Verifies your email and password. If correct, the server gives you your digital ID cards: an `accessToken` and a `refreshToken`.

**Request Body (JSON):**
```json
{
  "email": "host@test.com",
  "password": "mysecurepassword"
}
```

**Response:**
```json
{
  "status": "success",
  "tokens": {
    "accessToken": "eyJhbG... (short-lived VIP pass)",
    "refreshToken": "eyJhbG... (long-lived Membership card)"
  }
}
```

### Step 3: Access a Protected Route (Add a Home)
**Endpoint:** `POST /host/add-home`
**What it does:** Allows a host or admin to create a new home listing. 
**Security:** This route is protected. You MUST prove who you are.

**How to send the request (in Postman):**
1. Go to the **Auth** tab.
2. Select **Bearer Token**.
3. Paste your short-lived `accessToken`.

*Note: If you log in with a `user` account, the server will block you with a `403 Forbidden` error because you don't have the `host` role!*

### Step 4: Refreshing your Token (With Rotation)
**Endpoint:** `POST /auth/refresh`
**What it does:** After 15 minutes, your `accessToken` will expire. Instead of forcing the user to log in again, you secretly send the `refreshToken` here. For maximum security, the server will **rotate** your tokens, giving you a brand new `accessToken` AND a brand new `refreshToken`!

**Request Body (JSON):**
```json
{
  "token": "YOUR_CURRENT_REFRESH_TOKEN_HERE"
}
```

**Response:**
```json
{
  "status": "success",
  "tokens": {
    "accessToken": "eyJhbG... (new short-lived VIP pass)",
    "refreshToken": "eyJhbG... (new long-lived Membership card)"
  }
}
```

### Step 5: Logout
**Endpoint:** `POST /auth/logout`
**What it does:** Deletes the `refreshToken` from the database. This means the refresh token can never be used again to generate access tokens, safely logging the user out.

**Request Body (JSON):**
```json
{
  "userId": "the-uuid-of-the-user"
}
```

---

## 💻 Code Architecture (Behind the Scenes)

If you want to look at the code, here is how the system is structured:

1. **`routes/authRoutes.js`**: The map that directs requests like `/login` and `/signup` to the correct validation and controller logic.
2. **`validations/authValidator.js`**: The first line of defense. It uses `express-validator` to ensure emails are properly formatted and passwords are long enough before any actual code runs.
3. **`controllers/authController.js`**: The traffic cop. It receives the validated HTTP request, hands the data over to the service, and sends the final HTTP response (e.g., status 200 or 401) back to the user.
4. **`services/authService.js`**: The heavy lifter (Business Logic). Contains all the complex logic for database lookups, hashing passwords (using `bcryptjs`), and generating/rotating tokens (using `jsonwebtoken`).
5. **`models/user.js`**: The data manager. It handles organizing the `data/users.json` file beautifully into role-based categories (`admin`, `host`, `user`).
6. **`middlewares/authMiddleware.js`**: The security bouncers.
   - `verifyToken`: Checks if you have a valid VIP pass (`accessToken`) before letting you in.
   - `authorizeRoles`: Checks your specific role to ensure you have permission to perform an action.
7. **`config/env.js` & `.env`**: A secure configuration system that validates and loads your highly confidential JWT secret keys so they aren't exposed in your code.
