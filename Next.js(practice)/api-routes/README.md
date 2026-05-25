# 👥 Next.js Users Directory — Project Overview

A fast, premium, full-stack **Next.js App Router** user directory profile application. It performs full CRUD operations on a mock JSON database file (`db.json`) using robust API routes, centralized services, and dynamic client-side components.

---

## ⚡ Key Highlights
* **Create (POST)**: Dynamic form with automated next sequential user ID calculations.
* **Read (GET)**: Server-Side Rendered (SSR) fast listings grid and dynamic profile detailed pages.
* **Update (PUT)**: Sleek, inline toggle form to edit profiles directly inside the card with instant client state rendering.
* **Delete (DELETE)**: Inline card removal with custom red micro-animated double-confirmation buttons.
* **Typings**: 100% Type-safe codebase with all interfaces centralized inside the types folder.
* **Aesthetics**: Premium dark neon interface using Outfit typography, subtle glassmorphism, responsive grids, and instant notifications with `react-hot-toast`.

---

## 🗺️ Project Documentation Guide
To make this repository extremely easy to understand, we have split the technical guides into simple, targeted overview files. Click any link below to learn more:

| Guide File | Focus Area | Description |
| :--- | :--- | :--- |
| 📖 **[CRUD.md](./CRUD.md)** | **Full CRUD Walkthrough** | Complete code manual explaining exactly how Create, Read, Update, and Delete were built from start to end. |
| 📁 **[app.md](./src/app/app.md)** | **Routing & Endpoints** | Breakdown of Next.js dynamic routing pages (`/users/[userId]`) and backend API routes. |
| 📁 **[services.md](./src/services/services.md)** | **API Client Layer** | Explains the Axios central instance, base routing constants, request interceptors, and services. |
| 📁 **[components.md](./src/components/components.md)** | **UI Components** | Overview of dynamic interactive client cards (`UserCard`, `UserDetailCard`). |
| 📁 **[utils.md](./src/utils/utils.md)** | **Mock Database** | Explains how we read/write persistence securely to `db.json` using Node's FileSystem module. |
| 📁 **[types.md](./src/types/types.md)** | **TypeScript Types** | Explains all centralized type interfaces stored in the shared directory. |

---

## 🏃‍♂️ Quick Start

### 1. Install dependencies:
```bash
npm install
```

### 2. Start the local server:
```bash
npm run dev
```
Open **[http://localhost:3000/users](http://localhost:3000/users)** to start managing profiles!
