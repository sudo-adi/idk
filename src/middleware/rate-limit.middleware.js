const rateLimit = require("express-rate-limit");
const config = require("../config/environment");

const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs: windowMs * 60 * 1000, // Convert minutes to milliseconds
    max,
    message: {
      success: false,
      message,
      timestamp: new Date().toISOString(),
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

const generalLimiter = createRateLimit(
  config.RATE_LIMIT.WINDOW,
  config.RATE_LIMIT.MAX,
  "Too many requests from this IP, please try again later."
);

const authLimiter = createRateLimit(
  15, // 15 minutes
  5, // 5 attempts
  "Too many authentication attempts, please try again later."
);

module.exports = { generalLimiter, authLimiter };
