const path = require("path");

const express = require("express");
const pathUtil = require("../utils/pathUtil");
const hostRouter = express.Router();


hostRouter.get("/add-home", (req, res, next) => {
  // res.sendFile(path.join(__dirname, "../", "views", "addHome.html"));
  res.sendFile(path.join(pathUtil, "views", "addHome.html"));
});
hostRouter.post("/add-home", (req, res, next) => {
  console.log(req.body);
  // res.sendFile(path.join(__dirname, "../", "views", "homeAdded.html"));
  res.sendFile(path.join(pathUtil, "views", "homeAdded.html"));
});

module.exports = hostRouter;
