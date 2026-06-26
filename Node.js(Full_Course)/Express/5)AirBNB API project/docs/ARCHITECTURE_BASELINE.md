# Architecture Baseline

## Project Structure Tree

```
AirBNB API project/
├── backend/
│   ├── config/             # Configuration files
│   ├── controllers/        # Route handlers (authController, homeController, etc.)
│   ├── middlewares/        # Custom middlewares (authMiddleware.js)
│   ├── models/             # Mongoose Schemas & Models (home.js, user.js)
│   ├── routes/             # Express routers (authRoutes, hostRouter, useRouter)
│   ├── services/           # Business logic abstraction (if used)
│   ├── utils/              # Helper utilities
│   ├── validations/        # Express-validator schemas
│   ├── app.js              # Express app setup and middleware chain
│   └── server.js           # Server entry point
└── frontend/
    ├── public/             # Static assets
    ├── src/                # React components and TSX entry (main.tsx, App.tsx)
    ├── vite.config.ts      # Vite bundler config
    └── eslint.config.js    # ESLint configuration
```

## Runtime & Tooling Baseline
- **Backend Start Command**: `npm run start` or `npm run server` (for nodemon).
- **Frontend Start Command**: `npm run dev` (Vite dev server).
- **Frontend Build**: `npm run build` generates static files in `frontend/dist/`.

## Config Management
- Use a `.env` file in the `backend` directory to manage environment-specific variables like `JWT_SECRET`, `JWT_REFRESH_SECRET`, and `PORT`.

## Quality Bar
- ESLint is configured for the frontend. Before pushing code, ensure `npm run lint` passes without errors.
- Ensure all incoming data is validated using `express-validator` to prevent corrupt data from reaching the database.
