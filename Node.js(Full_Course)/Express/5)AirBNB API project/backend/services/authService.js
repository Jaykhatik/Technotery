const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

const ACCESS_TOKEN_SECRET = env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = env.REFRESH_TOKEN_SECRET;

exports.registerUser = async (email, password, role, callback) => {
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return callback({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const assignedRole = (role === 'admin' || role === 'host') ? role : 'user';
    
    const newUser = new User({
      email,
      password: hashedPassword,
      role: assignedRole
    });
    
    await newUser.save();
    
    callback(null, {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role
    });
  } catch (err) {
    callback({ error: "Server error" });
  }
};

exports.loginUser = async (email, password, callback) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return callback({ error: "Invalid email or password" });
    }

    const doMatch = await bcrypt.compare(password, user.password);
    if (!doMatch) {
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

    // No need to save tokens to the DB for stateless JWT architecture
    callback(null, { accessToken, refreshToken });
  } catch (err) {
    callback({ error: "Server error" });
  }
};

exports.rotateToken = async (token, callback) => {
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.userId);
    
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

    // Stateless rotation: we don't save new tokens to DB
    callback(null, { accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    return callback({ error: "Invalid or expired refresh token" });
  }
};

exports.logoutUser = async (userId, callback) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return callback({ error: "User not found" });
    }

    // Since tokens aren't in DB, logout is handled by the client dropping the cookie/token
    callback(null, true);
  } catch (err) {
    callback({ error: "Could not log out" });
  }
};
