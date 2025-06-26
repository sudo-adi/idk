const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User.model");
const config = require("../config/environment");

class AuthService {
  static generateToken(userId) {
    return jwt.sign({ id: userId }, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRE,
    });
  }

  static async register(userData) {
    const user = await User.create(userData);
    const token = this.generateToken(user._id);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  static async login(email, password) {
    const user = await User.findOne({ email, isActive: true }).select(
      "+password"
    );

    if (!user || !(await user.comparePassword(password))) {
      throw new Error("Invalid credentials");
    }

    const token = this.generateToken(user._id);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  static async generatePasswordResetToken(email) {
    const user = await User.findOne({ email, isActive: true });

    if (!user) {
      throw new Error("User not found");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();
    return resetToken;
  }
}

module.exports = AuthService;
