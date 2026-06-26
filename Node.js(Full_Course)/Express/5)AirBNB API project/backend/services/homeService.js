const Home = require("../models/home");

exports.addHome = async (homeData, callback) => {
  try {
    const newHome = new Home({
      ...homeData,
      highlights: Array.isArray(homeData.highlights) 
        ? homeData.highlights 
        : (homeData.highlights ? homeData.highlights.split(',').map(h => h.trim()).filter(h => h.length > 0) : [])
    });
    await newHome.save();
    callback(newHome);
  } catch (err) {
    console.error("Error adding home:", err);
  }
};

exports.getAllHomes = async (callback) => {
  try {
    const homes = await Home.find();
    callback(homes);
  } catch (err) {
    console.error("Error getting homes:", err);
    callback([]);
  }
};

exports.getHomeById = async (id, callback) => {
  try {
    const home = await Home.findById(id);
    callback(home);
  } catch (err) {
    console.error("Error getting home by id:", err);
    callback(null);
  }
};
