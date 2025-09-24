import express from "express";
import type { Request, Response } from "express";
import crypto from "crypto";
import Invitation from "../models/Invitation.js";
import User from "../models/User.js";
import {
  requireAuth,
  requirePermission,
  canModifyUser,
  canInviteRole,
  getInvitableRoles,
} from "../middleware/auth.js";
import {
  UserRole,
  Permission,
  ROLE_HIERARCHY,
  isHigherOrEqualRole,
} from "../types/roles.js";

const router = express.Router();

/**
 * @route   POST /api/invitations
 * @desc    Create a new user invitation
 * @access  Private (Admin/Super Admin)
 */
router.post(
  "/",
  requireAuth,
  requirePermission(Permission.INVITE_USERS),
  async (req: Request, res: Response) => {
    try {
      const { email, role } = req.body;
      const currentUser = req.session.user!;

      // Validate required fields
      if (!email || !role) {
        return res.status(400).json({
          error: "Email and role are required",
        });
      }

      // Validate email format
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: "Please provide a valid email address",
        });
      }

      // Validate role
      if (!Object.values(UserRole).includes(role)) {
        return res.status(400).json({
          error: "Invalid role specified",
          availableRoles: Object.values(UserRole),
        });
      }

      // Check if current user can assign this role
      if (!canInviteRole(currentUser.role, role)) {
        const invitableRoles = getInvitableRoles(currentUser.role);
        return res.status(403).json({
          error: "You don't have permission to assign this role",
          message: `You can only invite users with the following roles: ${invitableRoles.join(
            ", "
          )}`,
          invitableRoles,
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({
        email: email.toLowerCase(),
      });

      if (existingUser) {
        return res.status(400).json({
          error: "A user with this email already exists",
        });
      }

      // Check if there's already a pending invitation for this email and role
      const existingInvitation = await Invitation.findOne({
        email: email.toLowerCase(),
        role,
        isUsed: false,
        expiresAt: { $gt: new Date() },
      });

      if (existingInvitation) {
        return res.status(400).json({
          error: "An invitation for this email and role already exists",
          existingInvitation: {
            id: existingInvitation._id,
            email: existingInvitation.email,
            role: existingInvitation.role,
            expiresAt: existingInvitation.expiresAt,
          },
        });
      }

      // Create new invitation
      const invitation = new Invitation({
        email: email.toLowerCase(),
        role,
        token: crypto.randomBytes(32).toString("hex"), // Generate token explicitly
        invitedBy: currentUser.id,
        invitedByDetails: {
          name: currentUser.name,
          email: currentUser.email,
          role: currentUser.role,
        },
      });

      await invitation.save();

      // Return invitation details (without token for security)
      const responseData = {
        id: invitation._id,
        email: invitation.email,
        role: invitation.role,
        invitedBy: invitation.invitedByDetails,
        expiresAt: invitation.expiresAt,
        createdAt: invitation.createdAt,
        // Include invitation link for frontend to display/copy
        // Use environment variable for frontend URL, fallback to development default
        invitationLink: `${
          process.env.FRONTEND_URL || "http://localhost:5173"
        }/invite/${invitation.token}`,
      };

      res.status(201).json({
        message: "Invitation created successfully",
        invitation: responseData,
      });
    } catch (error: any) {
      console.error("Create invitation error:", error);
      res.status(500).json({
        error: "Internal server error",
        message: error.message,
      });
    }
  }
);

/**
 * @route   GET /api/invitations
 * @desc    Get all pending invitations
 * @access  Private (Admin/Super Admin)
 */
router.get(
  "/",
  requireAuth,
  requirePermission(Permission.READ_USER),
  async (req: Request, res: Response) => {
    try {
      const currentUser = req.session.user!;

      // Build query based on user role
      let query: any = {
        isUsed: false,
        expiresAt: { $gt: new Date() },
      };

      // If not super admin, only show invitations created by current user
      if (currentUser.role !== UserRole.SUPER_ADMIN) {
        query.invitedBy = currentUser.id;
      }

      const invitations = await Invitation.find(query)
        .populate("invitedBy", "name email role")
        .sort({ createdAt: -1 });

      // Transform data for response (exclude sensitive token)
      const responseData = invitations.map((invitation) => ({
        id: invitation._id,
        email: invitation.email,
        role: invitation.role,
        invitedBy: invitation.invitedByDetails,
        expiresAt: invitation.expiresAt,
        createdAt: invitation.createdAt,
        invitationLink: `${
          process.env.FRONTEND_URL || "http://localhost:5173"
        }/invite/${invitation.token}`,
      }));

      res.json({
        invitations: responseData,
        count: responseData.length,
      });
    } catch (error: any) {
      console.error("Get invitations error:", error);
      res.status(500).json({
        error: "Internal server error",
        message: error.message,
      });
    }
  }
);

/**
 * @route   GET /api/invitations/:token
 * @desc    Get invitation details by token (for acceptance)
 * @access  Public (but token-protected)
 */
router.get("/token/:token", async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        error: "Invitation token is required",
      });
    }

    // Find valid invitation
    const invitation = await Invitation.findOne({
      token,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    if (!invitation) {
      return res.status(404).json({
        error: "Invalid or expired invitation",
        message: "This invitation link is no longer valid",
      });
    }

    // Return invitation details for acceptance form
    res.json({
      email: invitation.email,
      role: invitation.role,
      invitedBy: invitation.invitedByDetails,
      expiresAt: invitation.expiresAt,
      token: invitation.token, // Needed for acceptance
    });
  } catch (error: any) {
    console.error("Get invitation by token error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

/**
 * @route   POST /api/invitations/:token/accept
 * @desc    Accept invitation and create user account
 * @access  Public (but token-protected)
 */
router.post("/token/:token/accept", async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { username, password, name } = req.body;

    // Validate required fields
    if (!username || !password || !name) {
      return res.status(400).json({
        error: "Username, password, and name are required",
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters long",
      });
    }

    // Find and validate invitation
    const invitation = await Invitation.findOne({
      token,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    if (!invitation) {
      return res.status(404).json({
        error: "Invalid or expired invitation",
        message: "This invitation link is no longer valid",
      });
    }

    // Check if user with this email already exists
    const existingUserByEmail = await User.findOne({
      email: invitation.email,
    });

    if (existingUserByEmail) {
      return res.status(400).json({
        error: "A user with this email already exists",
      });
    }

    // Check if username is already taken
    const existingUserByUsername = await User.findOne({
      username: username.trim(),
    });

    if (existingUserByUsername) {
      return res.status(400).json({
        error: "Username is already taken",
      });
    }

    // Create new user
    const newUser = new User({
      username: username.trim(),
      email: invitation.email,
      password,
      name: name.trim(),
      role: invitation.role,
      isActive: true,
    });

    await newUser.save();

    // Mark invitation as used
    invitation.isUsed = true;
    invitation.usedAt = new Date();
    await invitation.save();

    // Return success response (excluding password)
    res.status(201).json({
      message: "Account created successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        isActive: newUser.isActive,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Accept invitation error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

/**
 * @route   DELETE /api/invitations/:id
 * @desc    Cancel/revoke an invitation
 * @access  Private (Admin/Super Admin)
 */
router.delete(
  "/:id",
  requireAuth,
  requirePermission(Permission.DELETE_USER),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const currentUser = req.session.user!;

      // Find invitation
      const invitation = await Invitation.findById(id);

      if (!invitation) {
        return res.status(404).json({
          error: "Invitation not found",
        });
      }

      // Check if user can cancel this invitation
      // Super admins can cancel any invitation
      // Admins can only cancel invitations they created
      if (currentUser.role !== UserRole.SUPER_ADMIN) {
        if (invitation.invitedBy.toString() !== currentUser.id) {
          return res.status(403).json({
            error: "You can only cancel invitations you created",
          });
        }
      }

      // Delete invitation
      await Invitation.findByIdAndDelete(id);

      res.json({
        message: "Invitation cancelled successfully",
      });
    } catch (error: any) {
      console.error("Cancel invitation error:", error);
      res.status(500).json({
        error: "Internal server error",
        message: error.message,
      });
    }
  }
);

/**
 * @route   GET /api/invitations/stats
 * @desc    Get invitation statistics
 * @access  Private (Admin/Super Admin)
 */
router.get(
  "/stats",
  requireAuth,
  requirePermission(Permission.READ_USER),
  async (req: Request, res: Response) => {
    try {
      const currentUser = req.session.user!;

      // Build base query based on user role
      let baseQuery: any = {};
      if (currentUser.role !== UserRole.SUPER_ADMIN) {
        baseQuery.invitedBy = currentUser.id;
      }

      // Get statistics
      const [
        totalInvitations,
        pendingInvitations,
        usedInvitations,
        expiredInvitations,
      ] = await Promise.all([
        Invitation.countDocuments(baseQuery),
        Invitation.countDocuments({
          ...baseQuery,
          isUsed: false,
          expiresAt: { $gt: new Date() },
        }),
        Invitation.countDocuments({
          ...baseQuery,
          isUsed: true,
        }),
        Invitation.countDocuments({
          ...baseQuery,
          isUsed: false,
          expiresAt: { $lt: new Date() },
        }),
      ]);

      res.json({
        total: totalInvitations,
        pending: pendingInvitations,
        used: usedInvitations,
        expired: expiredInvitations,
      });
    } catch (error: any) {
      console.error("Get invitation stats error:", error);
      res.status(500).json({
        error: "Internal server error",
        message: error.message,
      });
    }
  }
);

export default router;
