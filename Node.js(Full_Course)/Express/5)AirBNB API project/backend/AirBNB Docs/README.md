# 🏠 AirBnB Clone — Full-Stack Production App

> A production-ready Airbnb clone built with **Express.js**, **React + TypeScript**, **MongoDB**, and **Stripe** payments.

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite + TailwindCSS |
| Backend | Node.js + Express.js + Vanilla JS |
| Database | MongoDB + Mongoose ODM |
| Auth | JWT (Access + Refresh Tokens) + bcrypt |
| Payments | Stripe (Checkout + Webhooks) |
| File Storage | Local `public/uploads/` folder (served via Express / Nginx) |
| Email | Nodemailer + SendGrid |
| Testing | Vitest (frontend) + Jest + Supertest (backend) |
| DevOps | PM2 (process manager) + Nginx (reverse proxy) + GitHub Actions |

---

## 📁 Project Structure

```
airbnb-clone/
├── client/                        # React + TypeScript frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/            # Shared UI components
│   │   │   ├── layout/            # Header, Footer, Navbar
│   │   │   ├── listings/          # Listing cards, grids, filters
│   │   │   ├── booking/           # Booking form, calendar, summary
│   │   │   ├── auth/              # Login, Register, OAuth
│   │   │   └── payments/          # Stripe elements, confirmation
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── ListingDetail.tsx
│   │   │   ├── Search.tsx
│   │   │   ├── Checkout.tsx
│   │   │   ├── BookingConfirmation.tsx
│   │   │   ├── Dashboard/
│   │   │   │   ├── HostDashboard.tsx
│   │   │   │   ├── GuestDashboard.tsx
│   │   │   │   └── AdminDashboard.tsx
│   │   │   └── Auth/
│   │   │       ├── Login.tsx
│   │   │       └── Register.tsx
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── context/               # React Context providers
│   │   ├── services/              # API client (axios instances)
│   │   ├── types/                 # Shared TypeScript types
│   │   ├── utils/                 # Helper functions
│   │   ├── constants/             # App-wide constants
│   │   ├── router/                # React Router config
│   │   └── App.tsx
│   ├── .env.example
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── server/                        # Express + Vanilla JS backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.ts              # MongoDB connection
│   │   │   └── stripe.ts          # Stripe config
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Listing.ts
│   │   │   ├── Booking.ts
│   │   │   ├── Review.ts
│   │   │   └── Payment.ts
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── listing.controller.js
│   │   │   ├── booking.controller.js
│   │   │   ├── payment.controller.js
│   │   │   ├── review.controller.js
│   │   │   └── user.controller.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── listing.routes.js
│   │   │   ├── booking.routes.js
│   │   │   ├── payment.routes.js
│   │   │   ├── review.routes.js
│   │   │   └── user.routes.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js  # JWT verification
│   │   │   ├── role.middleware.js  # Role-based access
│   │   │   ├── validate.middleware.js # express-validator schema validation
│   │   │   ├── rateLimit.middleware.js
│   │   │   ├── upload.middleware.js # Multer → public/uploads/
│   │   │   └── error.middleware.js # Global error handler
│   │   ├── services/
│   │   │   ├── auth.service.js
│   │   │   ├── listing.service.js
│   │   │   ├── booking.service.js
│   │   │   ├── payment.service.js
│   │   │   ├── email.service.js
│   │   │   └── stripe.service.js
│   │   ├── utils/
│   │   │   ├── ApiError.ts        # Custom error class
│   │   │   ├── ApiResponse.ts     # Standard response wrapper
│   │   │   ├── asyncHandler.ts    # Async try/catch wrapper
│   │   │   ├── jwt.ts
│   │   │   └── validators/        # express-validator schemas
│   │   ├── types/
│   │   │   └── index.ts           # Express + custom type extensions
│   │   ├── jobs/
│   │   │   └── expireBookings.ts  # Cron: auto-expire pending bookings
│   │   └── app.js                 # Express app setup
│   ├── server.js                  # Entry point
│   ├── .env.example
│   ├── tsconfig.json
│   └── package.json
│
├── docs/                          # All documentation
│   ├── AI_CONTEXT.md
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── DATABASE.md
│   ├── STRIPE.md
│   ├── DEPLOYMENT.md
│   └── CODING_GUIDELINES.md
│
├── docker-compose.yml
├── docker-compose.prod.yml
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
└── README.md                      # ← You are here
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.x
- MongoDB >= 6.x (or MongoDB Atlas)
- Stripe account (test keys)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/airbnb-clone.git
cd airbnb-clone

# Install server deps
cd server && npm install

# Install client deps
cd ../client && npm install
```

### 2. Environment Setup

```bash
# Server
cp server/.env.example server/.env

# Client
cp client/.env.example client/.env
```

Fill in all values — see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for details.

### 3. Start Local Services

```bash
# macOS
brew services start mongodb-community@7.0

# Ubuntu/Debian
sudo systemctl start mongod
```

### 4. Run in Development

```bash
# Terminal 1 — Backend (hot reload via tsx watch)
cd server && npm run dev

# Terminal 2 — Frontend (Vite HMR)
cd client && npm run dev
```

App runs at `http://localhost:5173`. API at `http://localhost:5000`.

### 5. Run in Production (PM2)

```bash
# Build both apps
cd server && npm run build && cd ..
cd client && npm run build && cd ..

# Start with PM2
pm2 start ecosystem.config.js --env production
pm2 save      # persist process list across reboots
```

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for full Nginx + SSL setup.

---

## 🔑 Core Features

- **Authentication** — JWT access + refresh token rotation, Google OAuth
- **Listings** — Create, edit, delete listings with multi-image upload
- **Search & Filter** — Location, dates, guests, price range, amenities
- **Booking** — Date availability check, conflict prevention, booking lifecycle
- **Payments** — Stripe Checkout, webhook fulfillment, refunds
- **Reviews** — Host & guest mutual reviews after stay completion
- **Dashboards** — Host earnings, guest trips, admin panel
- **Email Notifications** — Booking confirmed, payment received, check-in reminder
- **Role System** — Guest, Host, Admin with route-level guards

---

## 📚 Documentation Index

| Document | Description |
|----------|-------------|
| [AI_CONTEXT.md](docs/AI_CONTEXT.md) | **Start here if you're an AI assistant** — condensed project context |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design, data flow, component breakdown |
| [API.md](docs/API.md) | All REST endpoints with request/response shapes |
| [DATABASE.md](docs/DATABASE.md) | MongoDB schemas, indexes, relationships |
| [STRIPE.md](docs/STRIPE.md) | Payment flow, webhook setup, refund logic |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md) | Docker, CI/CD, env vars, production checklist |
| [CODING_GUIDELINES.md](docs/CODING_GUIDELINES.md) | **AI coding rules — read before generating any code** |

---

## 🧪 Testing

```bash
# Backend tests
cd server && npm test

# Frontend tests
cd client && npm test

# E2E (Playwright)
npm run test:e2e
```

---

## 📄 License

MIT
