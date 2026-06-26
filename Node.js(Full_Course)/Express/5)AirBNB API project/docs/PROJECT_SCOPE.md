# Project Scope: AirBNB API

## Domain Model
This project implements a lightweight property rental platform. 
The main entities are:
- **User**: Represents platform users. Users have specific roles (`admin`, `host`, `user`) that dictate their authorization level.
- **Home**: Represents a property listed for rental. Each property has attributes like price, location, rating, and status.

## Modules & Features
1. **Authentication Module**: Handles user signup, login, logout, and token refresh using JSON Web Tokens (JWT).
2. **User/Guest Module**: Public-facing functionality allowing anyone to browse available properties (homes).
3. **Host Module**: Protected module that allows hosts and admins to add new properties.
4. **Error Handling Module**: Global fallback for 404s and unhandled exceptions.

## Tech Stack
### Backend
- **Runtime**: Node.js
- **Framework**: Express (Node.js) + Vanilla JS
- **Database**: MongoDB Atlas + Mongoose
- **Authentication**: JWT (`jsonwebtoken`), `bcryptjs`
- **Security & Network**: `cors`, `cookie-parser`, `helmet`, `express-rate-limit`
- **Validation**: `express-validator`
- **Logging**: `winston`

## Frontend Dependencies
- **Framework**: React 18 (TypeScript) + Vite
- **Routing**: `react-router-dom`
- **Networking**: `axios`
- **Styling**: `tailwindcss`, `@tailwindcss/vite` (V4 Architecture)
- **Linting**: ESLint (^10.5.0)

## Architecture Intent
The backend is designed as a pure REST JSON API. It is decoupled from the frontend, meaning it strictly serves and consumes JSON payloads rather than server-rendered HTML. A clear MVC (Model-View-Controller) pattern is applied, with Mongoose models handling database operations, and controllers orchestrating the HTTP cycle.

## Runtime Constraints
- The backend runs on `localhost` (default port mapped in `.env`).
- Persistence relies on MongoDB Atlas, making the backend stateless and scalable.
- The frontend expects the backend to be running simultaneously to fetch data.
