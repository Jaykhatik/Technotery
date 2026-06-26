const path = require("path");
const pathUtil = require("../utils/pathUtil");
const homeService = require("../services/homeService");
exports.getHome = (req, res, next) => {
  // 2. Fetch all saved homes using the service
  homeService.getAllHomes((allHomes) => {
    // Return JSON data
    res
      .status(200)
      .json({
        status: "success",
        count: allHomes.length,
        data: { homes: allHomes },
      });
  });
};

exports.getHomeDetail = (req, res, next) => {
  const homeId = req.params.homeId;
  homeService.getHomeById(homeId, (home) => {
    if (!home) {
      return res
        .status(404)
        .json({ status: "fail", message: "Home not found" });
    }
    res.status(200).json({
      status: "success",
      data: { home: home },
    });
  });
};
