# Architecture Baseline

## Project Structure Tree

```
AirBNB API project/
├── backend/
│   ├── config/             # Configuration files
│   ├── middlewares/        # Custom middlewares (auth, error, rateLimit)
│   ├── models/             # Mongoose schemas (home, user)
│   ├── routes/             # Express routers
│   ├── utils/              # Helper classes (ApiError, ApiResponse, asyncHandler, logger)
│   ├── validations/        # Express-validator logic
│   ├── app.js              # Express app configuration (helmet, cors, etc.)
│   └── server.js           # Server entry point
├── docs/                   # Documentation single-source of truth
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
