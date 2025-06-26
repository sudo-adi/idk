const logger = require("../utils/logger");
const ApiResponse = require("../utils/response");

const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    return ApiResponse.error(res, "Resource not found", 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = "User already Exists";
    return ApiResponse.error(res, message, 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((val) => val.message);
    return ApiResponse.validationError(res, errors);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return ApiResponse.error(res, "Invalid token", 401);
  }

  if (err.name === "TokenExpiredError") {
    return ApiResponse.error(res, "Token expired", 401);
  }

  return ApiResponse.error(
    res,
    err.message || "Server Error",
    err.statusCode || 500
  );
};

module.exports = errorHandler;
