const app = require("./src/app");
const connectDB = require("./src/config/database");
const config = require("./src/config/environment");
const logger = require("./src/utils/logger");

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

// Connect to database
connectDB();

// Start server
const server = app.listen(config.PORT, () => {
  logger.info(
    `Server running in ${config.NODE_ENV} mode on port ${config.PORT}`
  );
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  server.close(() => {
    logger.info("Process terminated");
  });
});
