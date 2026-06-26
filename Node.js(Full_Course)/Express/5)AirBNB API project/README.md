# AirBNB API Project (Node.js & Express)

## 📌 Project Overview
This project is a backend RESTful API built with **Node.js** and the **Express.js** framework. It serves as the data layer for an Airbnb-style application. The core focus of this project is demonstrating essential backend web development concepts such as API routing, handling HTTP requests, processing JSON payloads, data validation, and structuring the codebase using the **MVC (Model-View-Controller)** pattern.

---

## ✅ Core Features & Architecture

### 1. Express API Setup
- **Overview:** The server is built using the Express framework to handle HTTP requests efficiently.
- **Implementation:** The app processes incoming JSON payloads using `express.json()` and `express.urlencoded()`.

### 2. MVC Architecture (Controllers)
- **Overview:** Request handling logic is separated into **Controllers** (`userController.js`, `hostController.js`, `errorController.js`) to keep the routing modular and clean.
- **Implementation:** Routes map to controller functions which handle the business logic and return JSON responses.

### 3. Modular Routing (`express.Router`)
- **Overview:** Routes are grouped logically using `express.Router()`.
- **Implementation:** `/host` routes manage property creation, while root routes (`/`) handle fetching property data.

### 4. JSON API Responses
- **Overview:** The application operates strictly as an API, returning structured JSON data (`res.json()`) instead of rendering HTML templates.
- **Implementation:** This allows the backend to be consumed by any client-side framework (React, Vue, mobile apps).

### 5. Data Persistence (File System)
- **Overview:** Data is persistently stored using Node's built-in `fs` module.
- **Implementation:** Properties are saved and retrieved from a local `data/homes.json` file asynchronously.

### 6. Data Validation (`express-validator`)
- **Overview:** Incoming data from POST requests is validated before being processed.
- **Implementation:** The `validations/homeValidator.js` middleware ensures data integrity (e.g., verifying price is a positive number, URLs are valid). If validation fails, a `422 Unprocessable Entity` response is returned with error details.

### 7. Guaranteed Unique IDs (`uuid`)
- **Overview:** Each property is assigned a cryptographically strong, unique identifier using the `uuid` package (`uuidv4`).

### 8. Environment Configuration (`.env`)
- **Overview:** Sensitive settings and configuration are managed using environment variables via the `dotenv` package.
- **Implementation:** The server port is configured dynamically via `process.env.PORT`.

---

## 🚀 Installation & Setup Steps

1. **Prerequisites:** Make sure you have [Node.js](https://nodejs.org/) installed.

2. **Navigate to the Project Directory:**
   ```bash
   cd "path/to/Express/5)AirBNB API project"
   ```

3. **Install Dependencies:**
   ```bash
   npm install
   ```

4. **Environment Setup:**
   Ensure you have a `.env` file in the root directory with the appropriate settings (e.g., `PORT=3000`).

5. **Run the Server:**
   Start the server in development mode using nodemon:
   ```bash
   npm run server
   ```

6. **API Endpoints:**
   You can test the endpoints using a tool like Postman, Insomnia, or cURL.
   - **GET /:** Fetch a JSON list of all homes.
   - **GET /homes/:homeId:** Fetch JSON details for a specific home by ID.
   - **GET /host/add-home:** Returns instructions on adding a home.
   - **POST /host/add-home:** Add a new home (requires JSON or urlencoded payload with home details matching the validation schema).
