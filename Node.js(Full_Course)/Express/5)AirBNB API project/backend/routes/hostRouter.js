const express = require("express");
const hostRouter = express.Router();

const hostController = require("../controllers/hostController");
const homeValidator = require("../validations/homeValidator");
const { verifyToken, authorizeRoles } = require("../middlewares/authMiddleware");

// Protected routes - only logged-in hosts or admins can access
hostRouter.use(verifyToken);
hostRouter.use(authorizeRoles('host', 'admin'));

hostRouter.get("/add-home", hostController.getAddHome);
hostRouter.post("/add-home", homeValidator.validateAddHome, hostController.postAddHome);

module.exports = hostRouter;
