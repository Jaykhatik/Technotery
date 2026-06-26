const logger = require('../utils/logger');
const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
  let error = err;

  // Convert raw errors to ApiError
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, []);
  }

  // Log the error
  logger.error(`${error.statusCode} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    errors: error.errors || [],
  });
};

module.exports = errorHandler;
