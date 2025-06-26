const express = require("express");
const { body } = require("express-validator");
const AuthController = require("../controllers/auth.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { authLimiter } = require("../middleware/rate-limit.middleware");

const router = express.Router();

// Validation rules
const registerValidation = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const loginValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Routes
router.post(
  "/register",
  // authLimiter,
  registerValidation,
  AuthController.register
);
router.post("/login", loginValidation, AuthController.login);
router.get("/profile", authenticate, AuthController.getProfile);
router.post("/forgot-password", authLimiter, AuthController.forgotPassword);

module.exports = router;
