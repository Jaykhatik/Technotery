const express = require("express");
const userRouter = express.Router();

const path = require("path");
const pathUtil = require("../utils/pathUtil");

userRouter.get("/", (req, res, next) => {
  // res.sendFile(path.join(__dirname, "../", "views", "home.html"));
  res.sendFile(path.join(pathUtil, "views", "home.html"));
});

module.exports = userRouter;
