const jwt = require('jsonwebtoken');
const env = require('../config/env');

// Verify token middleware
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({ status: "fail", message: "Access denied. No token provided." });
  }

  const token = authHeader.split(' ')[1]; // Expected format: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ status: "fail", message: "Access denied. Token missing." });
  }

  const secret = env.ACCESS_TOKEN_SECRET;

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ status: "fail", message: "Invalid or expired token." });
    }
    
    // Attach decoded user info (userId, role) to the request
    req.user = decoded;
    next();
  });
};

// Role authorization middleware
exports.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        status: "fail", 
        message: "You do not have permission to perform this action" 
      });
    }
    next();
  };
};
