require("dotenv").config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 3000,
  DB_URI: process.env.DB_URI,
  JWT_SECRET: process.env.JWT_SECRET || "fallback-secret",
  JWT_EXPIRE: process.env.JWT_EXPIRE || "7d",
  EMAIL: {
    HOST: process.env.EMAIL_HOST,
    PORT: process.env.EMAIL_PORT,
    USER: process.env.EMAIL_USER,
    PASS: process.env.EMAIL_PASS,
  },
  UPLOAD_MAX_SIZE: process.env.UPLOAD_MAX_SIZE || 5000000,
  RATE_LIMIT: {
    WINDOW: process.env.RATE_LIMIT_WINDOW || 15,
    MAX: process.env.RATE_LIMIT_MAX || 100,
  },
  CLOUDINARY: {
    CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "default-cloud-name",
    API_KEY: process.env.CLOUDINARY_API_KEY || "default-api-key",
    API_SECRET: process.env.CLOUDINARY_API_SECRET || "default-api-secret"
  },
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || null
};
