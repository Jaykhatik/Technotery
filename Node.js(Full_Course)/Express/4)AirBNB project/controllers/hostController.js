const path = require("path");
const pathUtil = require("../utils/pathUtil");

const Home = require("../models/home");
const { validationResult } = require("express-validator");

exports.getAddHome = (req, res, next) => {
  res.render("addHome", { errors: [], oldInput: {} });
};

exports.postAddHome = (req, res, next) => {
  // 1. Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // If errors exist, render the form again with the errors and the user's old input
    return res.status(422).render("addHome", {
      errors: errors.array(),
      oldInput: req.body
    });
  }

  // 2. Extract data from the form
  const { homeName, price, location, rating, photoUrl, type, description, highlights } = req.body;
  // 3. Create a new Home object
  const newHome = new Home(homeName, price, location, rating, photoUrl, type, description, highlights);
  // 4. Save it to our JSON file (asynchronously)
  newHome.save(() => {
    res.render("homeAdded");
  });
};
