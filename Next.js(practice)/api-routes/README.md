# 👥 Next.js Users Directory — Project Overview

Welcome to the **Next.js Users Management Directory**! This is a clean, premium, full-stack **Next.js App Router** application demonstrating dynamic CRUD (Create, Read, Update, Delete) operations using API routes, centralized Axios service clients, and a local mock database (`db.json`).

---

## ⚡ Key Highlights
* **Create (POST)**: Sleek profile form with automated, next sequential user ID calculations.
* **Read (GET)**: High-performance, Server-Side Rendered (SSR) directory grid listings and dynamic profile detail pages.
* **Update (PUT)**: Dynamic, inline edit mode switch inside the profile details card. Prefills form inputs and saves changes instantly with local state rendering.
* **Delete (DELETE)**: Two-step inline delete confirmation (Confirm/Cancel) with micro-animated red hover effects inside directory cards to prevent accidental actions.
* **Notifications**: Integrated success/error alerts using the `react-hot-toast` library.
* **Type-Safety**: 100% type-checked codebase with all interfaces centralized inside the types library.

---

## 📖 Project Documentation Directory
We have structured the guides in this repository to make learning extremely easy. Here are the active documentation files in this project:

* 📖 **[CRUD.md](./CRUD.md)**: The complete step-by-step CRUD operations coding manual, outlining the data model, route handlers, service layer methods, and UI components from start to end in simple terms.
* 📁 **[SERVICE.md](./src/services/SERVICE.md)**: The comprehensive API service layer documentation explaining the Axios factory, interceptors (auth & token flushes), endpoints configuration, and userService handlers.

---

## 📂 Active Project Structure
Here is the exact layout of files and folders present in this project:

```
api-routes/
├── db.json                     ← The mock database storing user JSON arrays
├── CRUD.md                     ← Step-by-step CRUD coding guide
├── README.md                   ← You are here! (High-level project overview)
├── .env.local                  ← App configurations (NEXT_PUBLIC_API_BASE_URL)
└── src/
    ├── app/                    ← NEXT.JS PAGES & ROUTING
    │   ├── api/
    │   │   └── users/
    │   │       ├── route.ts      ← API GET all / POST create handlers
    │   │       └── [userId]/
    │   │           └── route.ts  ← API GET one / PUT update / DELETE remove handlers
    │   │   ├── users/
    │   │   │   ├── page.tsx      ← Directory list page (SSR)
    │   │   │   └── [userId]/
    │   │   │       └── page.tsx  ← Dynamic profile detail page (SSR)
    │   │   ├── adduser/
    │   │   │   └── page.tsx      ← Form page to create a new user (Client-side)
    │   │   ├── layout.tsx        ← Global wrapper with react-hot-toast notifications
    │   │   └── globals.css       ← Global responsive dark-theme stylesheet
    │   
    │   ├── components/         ← REUSABLE UI COMPONENTS
    │   │   ├── UserCard.tsx      ← Grid list item card with inline delete confirmation
    │   │   └── UserDetailCard.tsx ← Profile details card with inline edit toggle form
    │   
    │   ├── services/           ← CENTRALIZED SERVICE CALLS
    │   │   ├── SERVICE.md        ← API Service architecture documentation
    │   │   ├── api/
    │   │   │   ├── index.ts      ← Instantiated Axios client instance
    │   │   │   └── routes.ts     ← API backend route paths map
    │   │   ├── config/
    │   │   │   └── index.ts      ← Axios factory + auth & response interceptors
    │   │   └── userService/
    │   │       └── index.ts      ← User endpoints service calls (Axios PUT, DELETE, POST / fetch GET)
    │   
    │   ├── types/              ← SHARED TYPES
    │   │   └── index.ts          ← Centralized TypeScript interfaces
    │   
    │   └── utils/              ← CORE UTILITIES
    │       └── db.ts             ← mock JSON database helpers (getUsers, saveUser, saveUsers)
```

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
