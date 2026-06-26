const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

const ACCESS_TOKEN_SECRET = env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = env.REFRESH_TOKEN_SECRET;

exports.registerUser = (email, password, role, callback) => {
  User.findByEmail(email, (existingUser) => {
    if (existingUser) {
      return callback({ error: "Email already in use" });
    }

    bcrypt.hash(password, 12, (err, hashedPassword) => {
      if (err) {
        return callback({ error: "Failed to hash password" });
      }

      const assignedRole = (role === 'admin' || role === 'host') ? role : 'user';
      const newUser = new User(email, hashedPassword, assignedRole);
      
      newUser.save(() => {
        callback(null, {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role
        });
      });
    });
  });
};

exports.loginUser = (email, password, callback) => {
  User.findByEmail(email, (user) => {
    if (!user) {
      return callback({ error: "Invalid email or password" });
    }

    bcrypt.compare(password, user.password, (err, doMatch) => {
      if (err || !doMatch) {
        return callback({ error: "Invalid email or password" });
      }

      const accessToken = jwt.sign(
        { userId: user.id, role: user.role },
        ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      );

      const refreshToken = jwt.sign(
        { userId: user.id },
        REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
      );

      user.refreshToken = refreshToken;
      user.accessToken = accessToken; // Save access token for testing visibility
      
      User.update(user, (err) => {
        if (err) {
          return callback({ error: "Error saving refresh token" });
        }
        callback(null, { accessToken, refreshToken });
      });
    });
  });
};

exports.rotateToken = (token, callback) => {
  jwt.verify(token, REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return callback({ error: "Invalid or expired refresh token" });
    }

    User.findById(decoded.userId, (user) => {
      if (!user || user.refreshToken !== token) {
        return callback({ error: "Invalid refresh token" });
      }

      const newAccessToken = jwt.sign(
        { userId: user.id, role: user.role },
        ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      );

      const newRefreshToken = jwt.sign(
        { userId: user.id },
        REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
      );

      user.refreshToken = newRefreshToken;
      user.accessToken = newAccessToken; // Save access token for testing visibility
      
      User.update(user, (updateErr) => {
        if (updateErr) {
          return callback({ error: "Error rotating refresh token" });
        }
        callback(null, { accessToken: newAccessToken, refreshToken: newRefreshToken });
      });
    });
  });
};

exports.logoutUser = (userId, callback) => {
  User.findById(userId, (user) => {
    if (!user) {
      return callback({ error: "User not found" });
    }

    user.refreshToken = null;
    user.accessToken = null;
    
    User.update(user, (err) => {
      if (err) {
        return callback({ error: "Could not log out" });
      }
      callback(null, true);
    });
  });
};
