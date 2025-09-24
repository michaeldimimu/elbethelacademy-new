import express from "express";
import type { Request, Response } from "express";
import crypto from "crypto";
import User from "../models/User.js";
import PasswordReset from "../models/PasswordReset.js";
import EmailService from "../services/emailService.js";

const router = express.Router();

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post("/forgot-password", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({
        error: "Email is required",
      });
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Please provide a valid email address",
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return success to prevent email enumeration attacks
    // But only send email if user exists
    if (user && user.isActive) {
      // Check for existing unused reset tokens
      const existingReset = await PasswordReset.findOne({
        userId: user._id,
        isUsed: false,
        expiresAt: { $gt: new Date() },
      });

      // If there's an existing valid token, don't create another one too soon
      if (existingReset) {
        const timeSinceCreated = Date.now() - existingReset.createdAt.getTime();
        const minWaitTime = 2 * 60 * 1000; // 2 minutes

        if (timeSinceCreated < minWaitTime) {
          return res.status(429).json({
            error: "Please wait before requesting another password reset",
            message: "You can request a new password reset in a few minutes",
          });
        }

        // Mark existing token as used to prevent multiple active tokens
        existingReset.isUsed = true;
        await existingReset.save();
      }

      // Generate secure token
      const resetToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      // Create password reset record
      const passwordReset = new PasswordReset({
        userId: user._id,
        email: user.email,
        token: tokenHash,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour expiry
      });

      await passwordReset.save();

      // Generate reset link
      const resetLink = `${
        process.env.FRONTEND_URL || "http://localhost:5173"
      }/reset-password?token=${resetToken}`;

      // Get user's IP and user agent for security info
      const ipAddress =
        (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress;
      const userAgent = req.headers["user-agent"];

      // Send password reset email
      try {
        const emailService = EmailService.getInstance();
        const emailResult = await emailService.sendPasswordResetEmail({
          name: user.name,
          email: user.email,
          resetLink,
          expiresAt: passwordReset.expiresAt,
          ipAddress,
          userAgent,
        });

        if (!emailResult.success) {
          throw new Error(emailResult.error || "Failed to send email");
        }
      } catch (emailError: any) {
        console.error("Failed to send password reset email:", emailError);
        // Delete the reset token if email fails
        await PasswordReset.deleteOne({ _id: passwordReset._id });
        return res.status(500).json({
          error: "Failed to send password reset email",
          message: "Please try again later or contact support",
        });
      }
    }

    // Always return the same response to prevent email enumeration
    res.json({
      message:
        "If an account with that email exists, you will receive a password reset link shortly",
    });
  } catch (error) {
    console.error("Password reset request error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Please try again later",
    });
  }
});

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post("/reset-password", async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    // Validate input
    if (!token || !password) {
      return res.status(400).json({
        error: "Token and password are required",
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        error: "Password must be at least 8 characters long",
      });
    }

    // Hash the token to match stored value
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // Find valid reset token
    const passwordReset = await PasswordReset.findOne({
      token: tokenHash,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    if (!passwordReset) {
      return res.status(400).json({
        error: "Invalid or expired reset token",
        message: "Please request a new password reset",
      });
    }

    // Find the user
    const user = await User.findById(passwordReset.userId);
    if (!user || !user.isActive) {
      return res.status(400).json({
        error: "User account not found or inactive",
      });
    }

    // Update user password (let the User model's pre-save middleware handle hashing)
    user.password = password;
    await user.save();

    // Mark reset token as used
    passwordReset.isUsed = true;
    await passwordReset.save();

    // Invalidate all other reset tokens for this user
    await PasswordReset.updateMany(
      { userId: user._id, isUsed: false },
      { isUsed: true }
    );

    res.json({
      message: "Password has been reset successfully",
      success: true,
    });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Please try again later",
    });
  }
});

/**
 * @route   GET /api/auth/verify-reset-token/:token
 * @desc    Verify if reset token is valid
 * @access  Public
 */
router.get(
  "/verify-reset-token/:token",
  async (req: Request, res: Response) => {
    try {
      const { token } = req.params;

      if (!token) {
        return res.status(400).json({
          error: "Token is required",
        });
      }

      // Hash the token to match stored value
      const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

      // Find valid reset token
      const passwordReset = await PasswordReset.findOne({
        token: tokenHash,
        isUsed: false,
        expiresAt: { $gt: new Date() },
      }).populate("userId", "email name");

      if (!passwordReset) {
        return res.status(400).json({
          error: "Invalid or expired reset token",
          valid: false,
        });
      }

      // Check if user still exists and is active
      const user = await User.findById(passwordReset.userId);
      if (!user || !user.isActive) {
        return res.status(400).json({
          error: "User account not found or inactive",
          valid: false,
        });
      }

      res.json({
        valid: true,
        email: passwordReset.email,
        expiresAt: passwordReset.expiresAt,
      });
    } catch (error) {
      console.error("Token verification error:", error);
      res.status(500).json({
        error: "Internal server error",
        valid: false,
      });
    }
  }
);

export default router;
