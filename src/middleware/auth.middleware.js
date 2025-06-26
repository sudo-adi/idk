const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const ApiResponse = require("../utils/response");
const config = require("../config/environment");

const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return ApiResponse.error(res, "Access denied. No token provided.", 401);
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user || !user.isActive) {
      return ApiResponse.error(res, "Invalid token or user not found.", 401);
    }

    req.user = user;
    next();
  } catch (error) {
    return ApiResponse.error(res, "Invalid token.", 401);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return ApiResponse.error(
        res,
        "Access denied. Insufficient permissions.",
        403
      );
    }
    next();
  };
};

module.exports = { authenticate, authorize };
