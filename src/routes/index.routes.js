const express = require("express");
const authRoutes = require("./auth.routes");
const productRoutes = require("./product.routes");
const folderRoutes = require("./folder.routes");
const ApiResponse = require("../utils/response");

const router = express.Router();

// Health check
router.get("/health", (req, res) => {
  ApiResponse.success(
    res,
    {
      status: "OK",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    "Server is healthy"
  );
});

// API routes
router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/folders", folderRoutes);

// Catch all undefined routes
router.all("*", (req, res) => {
  ApiResponse.error(res, `Route ${req.originalUrl} not found`, 404);
});

module.exports = router;
