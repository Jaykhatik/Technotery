const express = require("express");
const hostRouter = express.Router();

const hostController = require("../controllers/hostController");
const homeValidator = require("../validations/homeValidator");

hostRouter.get("/add-home", hostController.getAddHome);
hostRouter.post("/add-home", homeValidator.validateAddHome, hostController.postAddHome);

module.exports = hostRouter;
