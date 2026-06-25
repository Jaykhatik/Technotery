const path = require("path");
const pathUtil = require("../utils/pathUtil");

exports.getHome = (req, res, next) => {
  res.sendFile(path.join(pathUtil, "views", "home.html"));
};
