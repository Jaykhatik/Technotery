# 🏡 Airbnb Clone - Fullstack Project

Welcome to the ultimate Airbnb Fullstack Project! This repository has evolved from a basic Express server into a highly scalable, production-ready fullstack application containing both a Node.js backend and a React frontend.

## 🏗️ Project Architecture (Monorepo)

This project uses a monorepo structure, meaning both the frontend and backend live peacefully in the same repository. 

```text
Airbnb API Project/
├── backend/       # Node.js, Express, JWT, JSON Data
├── frontend/      # React, TypeScript, Vite
├── .gitignore     # Global git ignore (Protects both environments)
└── README.md      # You are here!
```

---

## 🔒 The Backend (`/backend`)

The backend is a robust REST API built with Node.js and Express. It features a strict Controller-Service-Repository architecture, making it ready for enterprise scaling.

### Key Features We Built:
* **Role-Based Access Control (RBAC)**: Users are strictly categorized as `user`, `host`, or `admin`.
* **Advanced Authentication**: 
  * Passwords are securely hashed using `bcryptjs`.
  * We implemented short-lived `accessTokens` (15 mins) and long-lived `refreshTokens` (7 days).
  * **Refresh Token Rotation**: Hitting the refresh API safely rotates *both* tokens for maximum security.
* **Validation Layer**: We implemented `express-validator` to intercept and block bad data before it ever touches our logic.
* **Fail-Fast Configuration**: A dedicated `config/env.js` file ensures the server immediately safely crashes on startup if critical secrets (like JWT Keys) are missing from the `.env` file.

*(For a deep dive into how the backend works, check out the `backend/BACKEND_FOLDER_STRUCTURE.md` and `backend/AUTHENTICATION_GUIDE.md` files!)*

### How to run the backend:
```bash
cd backend
npm install
npm run server
```

---

## 💻 The Frontend (`/frontend`)

The frontend is a blazing-fast Single Page Application (SPA) initialized using **Vite**, **React**, and **TypeScript**. 

### Key Features We Built:
* **Vite Initialization**: Set up for ultra-fast Hot Module Replacement (HMR) and lightning-fast builds.
* **TypeScript Setup**: Enforces strict typing to prevent annoying runtime errors when we start connecting to the API.
* **Secure Environment Checks**: Customized `.gitignore` to ensure frontend secrets (`.env.local`) never leak to GitHub.

### How to run the frontend:
```bash
cd frontend
npm install
npm run dev
```

---

## 🚀 What's Next?
The architecture is flawless. The API is locked down and secured. The frontend is initialized and ready to go. 

The next phase of the project is building out the beautiful React components and using tools like Axios or Fetch to connect the UI directly to our secure Node.js backend!
