const fs = require("fs");
const path = require("path");
const pathUtil = require("../utils/pathUtil");
const { v4: uuidv4 } = require('uuid');

const dataPath = path.join(pathUtil, "data", "users.json");

module.exports = class User {
  constructor(email, password, role = 'user') {
    this.id = uuidv4();
    this.email = email;
    this.password = password; // Should be hashed before saving
    this.role = role;
    this.refreshToken = null;
    this.accessToken = null; // Added for testing visibility
  }

  save(callback) {
    User.fetchAllRaw((data) => {
      if (!data[this.role]) {
        data[this.role] = [];
      }
      data[this.role].push(this);
      
      fs.writeFile(dataPath, JSON.stringify(data, null, 2), (err) => {
        if (err) console.log("Error saving user:", err);
        if (callback) callback();
      });
    });
  }

  static update(updatedUser, callback) {
    User.fetchAllRaw((data) => {
      const roleArray = data[updatedUser.role];
      if (roleArray) {
        const existingUserIndex = roleArray.findIndex(u => u.id === updatedUser.id);
        if (existingUserIndex >= 0) {
          roleArray[existingUserIndex] = updatedUser;
          fs.writeFile(dataPath, JSON.stringify(data, null, 2), (err) => {
            if (err) console.log("Error updating user:", err);
            if (callback) callback();
          });
          return;
        }
      }
      if (callback) callback(new Error("User not found"));
    });
  }

  // Helper method to get the raw object grouping by roles
  static fetchAllRaw(callback) {
    fs.readFile(dataPath, (err, fileContent) => {
      const defaultData = { admin: [], host: [], user: [] };
      if (err) {
        return callback(defaultData);
      }
      try {
        const data = JSON.parse(fileContent);
        
        // Migration logic: If users.json is still a flat array, convert it
        if (Array.isArray(data)) {
          const migratedData = { admin: [], host: [], user: [] };
          data.forEach(u => {
            if (!migratedData[u.role]) migratedData[u.role] = [];
            migratedData[u.role].push(u);
          });
          return callback(migratedData);
        }
        
        callback(data);
      } catch (e) {
        callback(defaultData);
      }
    });
  }

  // Returns a flat array of all users for easy searching
  static fetchAll(callback) {
    this.fetchAllRaw((data) => {
      const allUsers = [
        ...(data.admin || []),
        ...(data.host || []),
        ...(data.user || [])
      ];
      callback(allUsers);
    });
  }

  static findByEmail(email, callback) {
    this.fetchAll((users) => {
      const user = users.find(u => u.email === email);
      callback(user);
    });
  }
  
  static findById(id, callback) {
    this.fetchAll((users) => {
      const user = users.find(u => u.id === id);
      callback(user);
    });
  }
};
