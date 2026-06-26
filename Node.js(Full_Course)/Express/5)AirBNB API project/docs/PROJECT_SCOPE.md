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
- **Framework**: Express.js (^5.2.1)
- **Authentication**: jsonwebtoken (^9.0.3), bcryptjs (^3.0.3)
- **Validation**: express-validator (^7.3.2)
- **Data Storage**: MongoDB Atlas via mongoose
- **Dev Tools**: nodemon (^3.1.14), dotenv (^17.4.2)
- **Security & Network**: cors, cookie-parser

### Frontend
- **Framework**: React (^19.2.7) with TypeScript (~6.0.2)
- **Bundler**: Vite (^8.1.0)
- **Styling**: Vanilla CSS (index.css)
- **Linting**: ESLint (^10.5.0)

## Architecture Intent
The backend is designed as a pure REST JSON API. It is decoupled from the frontend, meaning it strictly serves and consumes JSON payloads rather than server-rendered HTML. A clear MVC (Model-View-Controller) pattern is applied, with Mongoose models handling database operations, and controllers orchestrating the HTTP cycle.

## Runtime Constraints
- The backend runs on `localhost` (default port mapped in `.env`).
- Persistence relies on MongoDB Atlas, making the backend stateless and scalable.
- The frontend expects the backend to be running simultaneously to fetch data.
