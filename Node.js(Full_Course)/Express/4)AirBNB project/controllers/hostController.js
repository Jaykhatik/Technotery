const path = require("path");
const pathUtil = require("../utils/pathUtil");

exports.getAddHome = (req, res, next) => {
  res.sendFile(path.join(pathUtil, "views", "addHome.html"));
};

exports.postAddHome = (req, res, next) => {
  console.log(req.body);
  res.sendFile(path.join(pathUtil, "views", "homeAdded.html"));
};
