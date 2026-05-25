# 📁 Services Folder — How It Works

This folder handles **all API communication** between the frontend and backend. Think of it as a clean pipeline:

```
Your Component → Service Function → Axios Instance → Backend API
```

---

## 🗂️ Folder Structure

```
services/
├── api/
│   ├── index.ts        ← Axios instances (one per role)
│   └── routes.ts       ← All API endpoint URLs
├── config/
│   └── index.ts        ← Axios factory + interceptors (auth logic)
├── userService/
│   └── index.ts        ← User-related API calls
└── README.md           ← You are here!
```

---

## 🔄 Flow — Step by Step

Here's what happens when you call an API from a component:

### Step 1️⃣ — `config/index.ts` (The Factory)

This file creates **configured Axios instances** using `getAxiosInstance()`.

What it does:
- Takes a `baseURL` from `.env.local`
- Creates an Axios instance with JSON headers
- **Request Interceptor** → Automatically attaches the auth token (from secure storage) to every request
- **Response Interceptor** → If the server returns `401 Unauthorized`, it clears the token and redirects to `/login`

```
getAxiosInstance(baseURL) → returns a ready-to-use Axios instance
```

### Step 2️⃣ — `api/index.ts` (The Instances)

This file uses the factory to create **one Axios instance per role**:

```ts
USER_API   → uses NEXT_PUBLIC_USER_BASE_URL
```

Each instance already has auth tokens and error handling baked in.

### Step 3️⃣ — `api/routes.ts` (The Endpoints)

All API endpoint paths are stored here as constants:

```ts
export const USER_API_ROUTES = {
    getAllUsers: "/users",
    getUserById: "/user",
    createUser: "/users",
};
```

**Why?** → If an endpoint changes, you update it in **one place**, not in every file.

### Step 4️⃣ — `userService/index.ts` (The Service Functions)

This is what your components actually call. Each function:
1. Uses the correct Axios instance (`USER_API`)
2. Hits the correct endpoint (`USER_API_ROUTES.xxx`)
3. Returns the data or throws an error

```ts
// In your component:
import { getAllUsers } from "@/services/userService";

const users = await getAllUsers();
```

---

## 🧩 Visual Summary

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐     ┌──────────┐
│  Component   │────▶│  userService     │────▶│  USER_API   │────▶│ Backend  │
│  (page.tsx)  │     │  (getAllUsers)    │     │  (axios)    │     │  Server  │
└─────────────┘     └──────────────────┘     └─────────────┘     └──────────┘
                            │                       │
                    uses routes.ts           uses config/
                    for endpoint URL         for auth token
```

---

## 🔐 Auth Flow (Automatic)

You **don't need to manually add tokens**. The config handles it:

```
Every Request:
  → Interceptor checks secureStorage for token
  → If found, adds "Authorization: Bearer <token>" header

Every Response:
  → If 401 error → clears token → redirects to /login
```

---

## ➕ How to Add a New Role/Service

Let's say you want to add **Admin** services:

### 1. Add routes in `api/routes.ts`

```ts
export const ADMIN_API_ROUTES = {
    getAllOrders: "/orders",
    updateOrder: "/order",
};
```

### 2. Add Axios instance in `api/index.ts`

```ts
export const ADMIN_API = getAxiosInstance(process.env.NEXT_PUBLIC_ADMIN_BASE_URL);
```

### 3. Add env variable in `.env.local`

```
NEXT_PUBLIC_ADMIN_BASE_URL=http://localhost:5000/api/admin
```

### 4. Create service folder `adminService/index.ts`

```ts
import { ADMIN_API } from "../api";
import { ADMIN_API_ROUTES } from "../api/routes";

export const getAllOrders = async () => {
    try {
        const res = await ADMIN_API.get(ADMIN_API_ROUTES.getAllOrders);
        return res.data;
    } catch (err: any) {
        throw err.response?.data || err.message;
    }
};
```

---

## 📌 Key Files Outside This Folder

| File | Purpose |
|------|---------|
| `utils/secureStorage.ts` | Encrypted localStorage (stores auth token safely) |
| `.env.local` | Base URLs for each API instance |

---

## 💡 Quick Tips

- **Never hardcode API URLs** in components — always use routes.ts
- **Never manually set auth headers** — the interceptor does it
- **One service file per role** — keeps things organized
- **Restart dev server** after changing `.env.local`
