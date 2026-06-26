# API Endpoints

## User & Public Routes
| Method | Endpoint         | Description                           | Auth Required |
|--------|------------------|---------------------------------------|---------------|
| GET    | `/`              | Retrieves a list of available homes   | No            |
| GET    | `/homes/:homeId` | Retrieves details for a specific home | No            |

## Host & Admin Routes (Protected)
| Method | Endpoint         | Description                                 | Auth Required    |
|--------|------------------|---------------------------------------------|------------------|
| GET    | `/host/add-home` | (Optional API test route for form metadata) | Yes (host/admin) |
| POST   | `/host/add-home` | Submits a new home to the database          | Yes (host/admin) |

## Authentication Routes
| Method | Endpoint        | Description                                     | Auth Required |
|--------|-----------------|-------------------------------------------------|---------------|
| POST   | `/auth/signup`  | Registers a new user                            | No            |
| POST   | `/auth/login`   | Authenticates a user and issues JWTs            | No            |
| POST   | `/auth/refresh` | Issues a new access token using a refresh token | No            |
| POST   | `/auth/logout`  | Invalidates the user session (clears tokens)    | No            |
