# 👥 Next.js Users Directory — Project Overview

Welcome to the **Next.js Users Management Directory**! This is a clean, premium, full-stack **Next.js App Router** application demonstrating dynamic CRUD (Create, Read, Update, Delete) operations using API routes, centralized Axios service clients, and a local mock database (`db.json`).

---

## ⚡ Key Highlights

- **Create (POST)**: Sleek profile form with automated, next sequential user ID calculations.
- **Read (GET)**: High-performance, Server-Side Rendered (SSR) directory grid listings and dynamic profile detail pages.
- **Update (PUT)**: Dynamic, inline edit mode switch inside the profile details card. Prefills form inputs and saves changes instantly with local state rendering.
- **Delete (DELETE)**: Two-step inline delete confirmation (Confirm/Cancel) with micro-animated red hover effects inside directory cards to prevent accidental actions.
- **Notifications**: Integrated success/error alerts using the `react-hot-toast` library.
- **Type-Safety**: 100% type-checked codebase with all interfaces centralized inside the types library.
- **Catch-All Route**: Unknown/invalid API paths are intercepted by the `[...student]` catch-all route which returns a premium cosmic 404 HTML page.

---

## 📖 Project Documentation Directory

We have structured the guides in this repository to make learning extremely easy. Here are the active documentation files in this project:

- 📖 **[CRUD.md](./CRUD.md)**: The complete step-by-step CRUD operations coding manual, outlining the data model, route handlers, service layer methods, and UI components from start to end in simple terms.
- 📁 **[SERVICE.md](./src/services/SERVICE.md)**: The comprehensive API service layer documentation explaining the Axios factory, interceptors (auth & token flushes), endpoints configuration, and userService handlers.

---

## 📂 Active Project Structure

Here is the exact layout of files and folders present in this project:

```
api-routes/
├── db.json                          ← Mock database storing user JSON arrays
├── CRUD.md                          ← Step-by-step CRUD coding guide
├── README.md                        ← You are here! (High-level project overview)
├── .env.local                       ← App config (NEXT_PUBLIC_API_BASE_URL)
└── src/
    ├── app/                         ← NEXT.JS PAGES & ROUTING
    │   ├── layout.tsx               ← Global wrapper with react-hot-toast Toaster
    │   ├── page.tsx                 ← Root page (redirects to /users)
    │   ├── globals.css              ← Global responsive dark-theme stylesheet
    │   │
    │   ├── api/                     ← API ROUTE HANDLERS
    │   │   ├── users/
    │   │   │   ├── route.ts         ← GET all users / POST create user
    │   │   │   └── [userId]/
    │   │   │       └── route.ts     ← GET one / PUT update / DELETE remove
    │   │   └── [...student]/
    │   │       ├── route.ts         ← Catch-all: returns cosmic 404 HTML page
    │   │       └── student.module.css ← Styles for the catch-all 404 HTML response
    │   │
    │   ├── users/                   ← UI PAGES
    │   │   ├── page.tsx             ← Directory listing page (SSR)
    │   │   └── [userId]/
    │   │       └── page.tsx         ← Dynamic profile detail page (SSR)
    │   │
    │   └── adduser/
    │       └── page.tsx             ← Form page to create a new user (Client-side)
    │
    ├── components/                  ← REUSABLE UI COMPONENTS
    │   ├── UserCard.tsx             ← Grid card with inline delete confirmation
    │   └── UserDetailCard.tsx       ← Profile card with inline edit toggle form
    │
    ├── services/                    ← CENTRALIZED SERVICE CALLS
    │   ├── SERVICE.md               ← API service architecture documentation
    │   ├── api/
    │   │   ├── index.ts             ← Instantiated Axios client instance
    │   │   └── routes.ts            ← API backend route paths map
    │   ├── config/
    │   │   └── index.ts             ← Axios factory + auth & response interceptors
    │   └── userService/
    │       └── index.ts             ← User CRUD service methods (GET, POST, PUT, DELETE)
    │
    ├── types/                       ← SHARED TYPES
    │   └── index.ts                 ← Centralized TypeScript interfaces
    │
    └── utils/                       ← CORE UTILITIES
        └── db.ts                    ← Mock JSON database helpers (getUsers, saveUser, saveUsers)
```

---

## 🌐 API Routes Reference

All API routes live under `/api/`. Here is a full reference of every route, its HTTP methods, and what it does.

### `/api/users` — `src/app/api/users/route.ts`

| Method | Path         | Description                                      |
|--------|--------------|--------------------------------------------------|
| `GET`  | `/api/users` | Fetches and returns the full list of all users   |
| `POST` | `/api/users` | Creates a new user with an auto-incremented ID   |

### `/api/users/[userId]` — `src/app/api/users/[userId]/route.ts`

| Method   | Path                  | Description                                    |
|----------|-----------------------|------------------------------------------------|
| `GET`    | `/api/users/:userId`  | Fetches a single user by their numeric ID      |
| `PUT`    | `/api/users/:userId`  | Updates an existing user's fields by ID        |
| `DELETE` | `/api/users/:userId`  | Permanently removes a user record by ID        |

### `/api/[...student]` — Catch-All Route — `src/app/api/[...student]/route.ts`

This route **catches every unmatched API path** — any URL that doesn't match `/api/users` or `/api/users/:id` is handled here.

| Method     | Path              | Status | Response                                                     |
|------------|-------------------|--------|--------------------------------------------------------------|
| `GET`      | `/api/**` (any)   | `404`  | Returns a fully styled HTML page: cosmic space 404 animation |
| `POST`     | `/api/**` (any)   | `403`  | JSON error: `"Please enter valid url!!!!!."`                 |
| `PUT`      | `/api/**` (any)   | `403`  | JSON error: `"Please enter valid url!!!!!."`                 |
| `DELETE`   | `/api/**` (any)   | `403`  | JSON error: `"Please enter valid url!!!!!."`                 |

> **How it works:** Next.js resolves more specific routes first. `/api/users` and `/api/users/[userId]` match before the catch-all, so `[...student]` only fires for genuinely unknown paths.
>
> **Styling:** The CSS for the `GET` 404 page lives in `student.module.css` (co-located with `route.ts`) and is loaded at request-time via `fs.readFileSync`, keeping the route handler clean.

---

## 🏃‍♂️ Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Start the local server**:
   ```bash
   npm run dev
   ```
3. **Explore**:
   Open **[http://localhost:3000/users](http://localhost:3000/users)** to start managing profile directory records!

4. **Test the catch-all route**:
   Visit any unknown API path like **[http://localhost:3000/api/anything](http://localhost:3000/api/anything)** to see the cosmic 404 page in action.
