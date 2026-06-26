const path = require("path");
const pathUtil = require("../utils/pathUtil");

const homeService = require("../services/homeService");
const { validationResult } = require("express-validator");

exports.getAddHome = (req, res, next) => {
  res.status(200).json({ status: "success", message: "Send a POST request to add a home" });
};

exports.postAddHome = (req, res, next) => {
  // 1. Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: "fail",
      errors: errors.array(),
      oldInput: req.body
    });
  }

  // 2. Pass data to the Service layer
  homeService.addHome(req.body, (newHome) => {
    res.status(201).json({ status: "success", message: "Home added successfully", data: { home: newHome } });
  });
};
