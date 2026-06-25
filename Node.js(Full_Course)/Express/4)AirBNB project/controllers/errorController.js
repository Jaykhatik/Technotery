const path = require("path");
const pathUtil = require("../utils/pathUtil");

exports.get404 = (req, res, next) => {
  res.status(404).sendFile(path.join(pathUtil, "views", "pnf.html"));
};
