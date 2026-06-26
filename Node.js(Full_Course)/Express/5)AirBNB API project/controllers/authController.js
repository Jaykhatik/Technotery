const authService = require('../services/authService');

exports.signup = (req, res, next) => {
  const { email, password, role } = req.body;

  authService.registerUser(email, password, role, (err, userData) => {
    if (err) {
      const statusCode = err.error === "Email already in use" ? 400 : 500;
      return res.status(statusCode).json({ status: "fail", message: err.error });
    }

    res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: { user: userData }
    });
  });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;

  authService.loginUser(email, password, (err, tokens) => {
    if (err) {
      const statusCode = err.error === "Invalid email or password" ? 401 : 500;
      return res.status(statusCode).json({ status: "fail", message: err.error });
    }

    res.status(200).json({
      status: "success",
      message: "Logged in successfully",
      tokens: tokens
    });
  });
};

exports.refreshToken = (req, res, next) => {
  const { token } = req.body;

  authService.rotateToken(token, (err, newTokens) => {
    if (err) {
      return res.status(403).json({ status: "fail", message: err.error });
    }

    res.status(200).json({
      status: "success",
      tokens: newTokens
    });
  });
};

exports.logout = (req, res, next) => {
  const { userId } = req.body; 

  if (!userId) {
    return res.status(400).json({ status: "fail", message: "User ID is required" });
  }

  authService.logoutUser(userId, (err, success) => {
    if (err) {
      const statusCode = err.error === "User not found" ? 404 : 500;
      return res.status(statusCode).json({ status: "fail", message: err.error });
    }

    res.status(200).json({
      status: "success",
      message: "Logged out successfully"
    });
  });
};
