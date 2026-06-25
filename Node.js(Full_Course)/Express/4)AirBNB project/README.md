# AirBNB Project (Node.js & Express)

## 📌 Project Overview
This project is a fundamental Node.js web application using the **Express.js** framework. It serves as an introductory building block for a larger Airbnb-style application. The core focus of this project is demonstrating essential web development concepts such as routing, handling HTTP requests, serving static HTML files, processing form data, and structuring the codebase using the **MVC (Model-View-Controller)** pattern.

---

## ✅ Completed Topics & Implementations

### 1. Express Framework Setup
- **What we did:** Initialized a Node.js project and integrated the `express` package to create our web server.
- **Explanation:** Express simplifies the process of creating a server and handling requests/responses compared to core Node.js.
- **Code snippet (`app.js`):**
  ```javascript
  const express = require("express");
  const app = express();
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
  });
  ```

### 2. Separation of Concerns (MVC Architecture - Controllers)
- **What we did:** Extracted the logic for handling requests out of the route definitions and placed them into separate **Controller** files (`userController.js`, `hostController.js`, `errorController.js`).
- **Explanation:** This keeps our code modular and clean. Routes only define *where* a request goes, while controllers define *what happens* when it gets there.
- **Code snippet (`controllers/userController.js`):**
  ```javascript
  const path = require("path");
  const pathUtil = require("../utils/pathUtil");

  exports.getHome = (req, res, next) => {
    res.sendFile(path.join(pathUtil, "views", "home.html"));
  };
  ```

### 3. Modular Routing (`express.Router`)
- **What we did:** Used `express.Router()` to split our routes into different files (`useRouter.js`, `hostRouter.js`).
- **Explanation:** Instead of having all routes in `app.js`, we group related routes together. For example, all host-related actions (like adding a home) are in `hostRouter.js`.
- **Code snippet (`routes/hostRouter.js`):**
  ```javascript
  const express = require("express");
  const hostRouter = express.Router();
  const hostController = require("../controllers/hostController");

  hostRouter.get("/add-home", hostController.getAddHome);
  hostRouter.post("/add-home", hostController.postAddHome);

  module.exports = hostRouter;
  ```

### 4. Serving Static HTML Pages
- **What we did:** Instead of sending plain text responses, we use `res.sendFile()` to serve actual HTML files from the `views` folder.
- **Explanation:** The `path` module helps construct the correct absolute file paths across different operating systems.

### 5. Serving Static Assets (CSS)
- **What we did:** Configured Express to serve static files from a `public` directory.
- **Explanation:** This allows our HTML pages to link to CSS stylesheets or images that the browser can directly download.
- **Code snippet (`app.js`):**
  ```javascript
  app.use(express.static(path.join(pathUtil,'public')));
  ```

### 6. Handling Form Data (POST Requests)
- **What we did:** Used the `express.urlencoded()` middleware to parse incoming request bodies.
- **Explanation:** When a user submits a form on the `/host/add-home` page, this middleware parses the data so we can access it via `req.body` in our controller.
- **Code snippet (`app.js` & `hostController.js`):**
  ```javascript
  // app.js
  app.use(express.urlencoded());

  // controllers/hostController.js
  exports.postAddHome = (req, res, next) => {
    console.log(req.body); // Form data is available here!
    res.sendFile(path.join(pathUtil, "views", "homeAdded.html"));
  };
  ```

### 7. Global 404 Error Handling
- **What we did:** Created a catch-all middleware at the end of our route definitions to handle undefined routes.
- **Explanation:** If a user visits a URL that doesn't exist, they are shown a custom "Page Not Found" (`pnf.html`) page instead of a generic browser error.
- **Code snippet (`app.js` & `errorController.js`):**
  ```javascript
  const errorController = require("./controllers/errorController");
  app.use(errorController.get404);
  ```

### 8. Templating Engine (EJS)
- **What we did:** Replaced all static `.html` files with `.ejs` templates and configured Express to use the EJS view engine (`app.set('view engine', 'ejs')`).
- **Explanation:** This allows us to inject dynamic Node.js variables directly into our frontend HTML. We loop over our array of homes (`homes.forEach`) to render property cards dynamically.

### 9. Data Persistence (File System)
- **What we did:** Moved away from storing homes in a temporary RAM array. We imported Node's built-in `fs` (File System) module to read and write data to `data/homes.json`.
- **Explanation:** Now, when the server restarts, data is no longer lost. The app reads `homes.json` when the homepage loads, and writes to it when a new home is added.

### 10. Data Validation (`express-validator`)
- **What we did:** Created a `validations/homeValidator.js` middleware and injected it into our POST route to check user input.
- **Explanation:** We never trust user data. The validator checks if the price is a positive number, if the name is long enough, and if the photo is a valid URL. If validation fails, the controller catches the error using `validationResult(req)` and forces the user to try again, displaying a helpful error box without erasing their previous input.

### 11. Environment Variables (`.env`)
- **What we did:** Installed `dotenv`, created a `.env` file, and added `PORT=3000`.
- **Explanation:** Hardcoding ports is bad practice for cloud deployment. We now use `process.env.PORT` to dynamically assign the server port.

### 12. Architecture Split (`server.js`)
- **What we did:** Separated `app.js` (which now only configures the Express app) from a new `server.js` file (which imports the app and starts the server).
- **Explanation:** This is an industry-standard practice that makes the application easier to test and scale.

### 13. Dynamic Route Parameters (Detail Page)
- **What we did:** Created a dynamic route (`/homes/:homeId`) to view specific property details.
- **Explanation:** Express allows passing dynamic variables in the URL. We catch this ID in `userController.js`, use a new `findById` model method to pull the specific home from `homes.json`, and pass it to a dedicated `homeDetail.ejs` view template.

### 14. UI/UX Overhaul (Stay Retro Theme)
- **What we did:** Built a single, responsive `public/style.css` file utilizing a stunning "Light Paper" Retro UI.
- **Explanation:** Features a sticky top navigation bar with a custom "Half Home" SVG logo, interactive property cards with charcoal ink drop-shadows, terracotta accents, a responsive hamburger menu, and a scroll-to-top button.

### 15. Guaranteed Unique IDs (`uuid`)
- **What we did:** Replaced basic `Math.random()` ID generation with the official `uuid` npm package.
- **Explanation:** By using `uuidv4()`, we ensure that every single home added to `homes.json` receives a cryptographically strong, 100% unique identifier (e.g. `1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed`), completely eliminating the risk of ID collisions in production.
- **Code snippet (`models/home.js`):**
  ```javascript
  const { v4: uuidv4 } = require('uuid');
  
  constructor(homeName, price, location, rating, photoUrl) {
    this.id = uuidv4(); 
    // ...
  }
  ```

### 16. Expanded Data Schema & Realism
- **What we did:** Upgraded our JSON data structure (`homes.json`) and backend models to support new fields: `type`, `description`, and an array of `highlights`. 
- **Explanation:** This data seamlessly flows through our MVC architecture without breaking existing logic, allowing the Detail Page to dynamically render rich, highly realistic property information. We also seeded the application with beautiful, thematic "Stay Retro" dummy data.

---

## 🚀 Installation & Setup Steps

Follow these steps to run the project locally on your machine:

1. **Prerequisites:** Make sure you have [Node.js](https://nodejs.org/) installed on your computer.

2. **Navigate to the Project Directory:**
   Open your terminal or command prompt and change directory to the project folder:
   ```bash
   cd "path/to/Express/4)AirBNB project"
   ```

3. **Install Dependencies:**
   Run the following command to install the required packages (`express`, `express-validator`, `dotenv`, `uuid`, etc.) defined in the `package.json` file:
   ```bash
   npm install
   ```

4. **Run the Server:**
   You can start the server using the custom npm script (which uses `nodemon` for auto-restarts) by running:
   ```bash
   npm run server
   ```

5. **Access the Application:**
   Open your web browser and visit the following URLs:
   - **Home:** `http://localhost:3000/`
   - **Add Home:** `http://localhost:3000/host/add-home`
   - **Property Details:** Click "View" on any property card from the Home page!
