const AuthService = require("../services/auth.service");
const ApiResponse = require("../utils/response");
const { validationResult } = require("express-validator");

class AuthController {
  static async register(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ApiResponse.validationError(res, errors.array());
      }

      const result = await AuthService.register(req.body);
      return ApiResponse.success(
        res,
        result,
        "User registered successfully",
        201
      );
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ApiResponse.validationError(res, errors.array());
      }

      const { email, password } = req.body;
      const result = await AuthService.login(email, password);

      return ApiResponse.success(res, result, "Login successful");
    } catch (error) {
      if (error.message === "Invalid credentials") {
        return ApiResponse.error(res, "Invalid email or password", 401);
      }
      next(error);
    }
  }

  static async getProfile(req, res, next) {
    try {
      const user = {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        avatar: req.user.avatar,
        createdAt: req.user.createdAt,
      };

      return ApiResponse.success(res, user, "Profile retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const resetToken = await AuthService.generatePasswordResetToken(email);

      // In production, send email with reset token
      // For now, we'll just return success message

      return ApiResponse.success(res, null, "Password reset email sent");
    } catch (error) {
      if (error.message === "User not found") {
        return ApiResponse.error(res, "Email not found", 404);
      }
      next(error);
    }
  }
}

module.exports = AuthController;
