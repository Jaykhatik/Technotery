const { check, validationResult } = require('express-validator');

// Helper to send errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "fail", message: errors.array()[0].msg });
  }
  next();
};

exports.validateSignup = [
  check('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  check('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  validateRequest
];

exports.validateLogin = [
  check('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  check('password')
    .notEmpty().withMessage('Password is required'),
  validateRequest
];

exports.validateRefreshToken = [
  check('token')
    .notEmpty().withMessage('Refresh token is required'),
  validateRequest
];
