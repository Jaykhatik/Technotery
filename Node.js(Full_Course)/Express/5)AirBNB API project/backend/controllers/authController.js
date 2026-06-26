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

    res.cookie('jwt', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

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

    res.cookie('jwt', newTokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000 
    });

    res.cookie('refreshToken', newTokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });

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

    res.clearCookie('jwt');
    res.clearCookie('refreshToken');

    res.status(200).json({
      status: "success",
      message: "Logged out successfully"
    });
  });
};
