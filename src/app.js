const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const routes = require("./routes/index.routes");
const errorHandler = require("./middleware/error.middleware");
// const { generalLimiter } = require("./middleware/rate-limit.middleware");
const logger = require("./utils/logger");

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(compression());

// Rate limiting
// app.use("/api", generalLimiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(
    morgan("combined", {
      stream: { write: (message) => logger.info(message.trim()) },
    })
  );
}

// API routes
app.use("/api/v1", routes);

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;
