const express = require("express");
const userRouter = express.Router();

const userController = require("../controllers/userController");

userRouter.get("/", userController.getHome);
userRouter.get("/homes/:homeId", userController.getHomeDetail);

module.exports = userRouter;
