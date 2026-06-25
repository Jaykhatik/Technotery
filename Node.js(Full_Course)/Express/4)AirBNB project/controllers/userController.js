const path = require("path");
const pathUtil = require("../utils/pathUtil");
const Home = require("../models/home");

exports.getHome = (req, res, next) => {
  // 2. Fetch all saved homes (now asynchronous with a callback)
  Home.fetchAll((allHomes) => {
    // Render the EJS template and pass the dynamic data
    res.render("home", { homes: allHomes });
  });
};

exports.getHomeDetail = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId, (home) => {
    if (!home) {
      return res.redirect("/");
    }
    res.render("homeDetail", { home: home }); 
  });
};
