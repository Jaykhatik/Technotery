const path = require("path");
const pathUtil = require("../utils/pathUtil");

exports.get404 = (req, res, next) => {
  res.status(404).json({ status: "fail", message: "Route not found" });
};
