const fs = require("fs");
const path = require("path");
const pathUtil = require("../utils/pathUtil");
const { v4: uuidv4 } = require('uuid');


const dataPath = path.join(pathUtil, "data", "homes.json");

module.exports = class Home {
  // We initialize the home object with data coming from the form
  constructor(homeName, price, location, rating, photoUrl, type, description, highlights) {
   this.id = uuidv4(); 
    this.homeName = homeName;
    this.price = price;
    this.location = location;
    this.rating = rating;
    this.photoUrl = photoUrl;
    this.type = type;
    this.description = description;
    this.status = "Available"; // Added availability status
    // Store highlights as an array
    this.highlights = Array.isArray(highlights) 
      ? highlights 
      : (highlights ? highlights.split(',').map(h => h.trim()).filter(h => h.length > 0) : []);
  }

  // This method saves the current object into our JSON file
  save(callback) {
    Home.fetchAll((homes) => {
      homes.push(this);
      // Write the updated array back to the file
      fs.writeFile(dataPath, JSON.stringify(homes), (err) => {
        if (err) console.log("Error saving file:", err);
        if (callback) callback();
      });
    });
  }

  // This static method reads all the saved homes from the JSON file
  static fetchAll(callback) {
    fs.readFile(dataPath, (err, fileContent) => {
      if (err) {
        // If file doesn't exist yet, return empty array
        return callback([]);
      }
      try {
        const parsedHomes = JSON.parse(fileContent);
        // Inject status for old data that was saved before we added this field
        const homesWithStatus = parsedHomes.map(home => ({
          ...home,
          status: home.status || "Available"
        }));
        callback(homesWithStatus);
      } catch (e) {
        callback([]);
      }
    });
  }

  // Find a specific home by its ID 
  static findById(id, callback) {
    this.fetchAll((homes) => {
      const home = homes.find(h => h.id === id);
      callback(home);
    });
  }
};
