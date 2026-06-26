const Home = require("../models/home");

exports.addHome = (homeData, callback) => {
  const {
    homeName,
    price,
    location,
    rating,
    photoUrl,
    type,
    description,
    highlights,
  } = homeData;
  
  const newHome = new Home(
    homeName,
    price,
    location,
    rating,
    photoUrl,
    type,
    description,
    highlights,
  );

  newHome.save(() => {
    callback(newHome);
  });
};

exports.getAllHomes = (callback) => {
  Home.fetchAll((homes) => {
    callback(homes);
  });
};

exports.getHomeById = (id, callback) => {
  Home.findById(id, (home) => {
    callback(home);
  });
};
