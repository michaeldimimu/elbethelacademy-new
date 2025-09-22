import type { Request, Response, NextFunction } from "express";
import { UserRole, Permission, hasPermission } from "../types/roles";

// Extend Express Request type to include user session
declare global {
  namespace Express {
    interface Request {
      session: {
        user?: {
          id: string;
          name: string;
          email: string;
          username: string;
          role: UserRole;
          isActive: boolean;
        };
      } & any;
    }
  }
}

/**
 * Middleware to check if user is authenticated
 */
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  if (!req.session.user.isActive) {
    return res.status(403).json({ error: "Account is inactive" });
  }

  next();
};

/**
 * Middleware to check if user has a specific permission
 */
export const requirePermission = (permission: Permission) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!req.session.user.isActive) {
      return res.status(403).json({ error: "Account is inactive" });
    }

    if (!hasPermission(req.session.user.role, permission)) {
      return res.status(403).json({
        error: "Insufficient permissions",
        required: permission,
        userRole: req.session.user.role,
      });
    }

    next();
  };
};

/**
 * Middleware to check if user has one of multiple permissions
 */
export const requireAnyPermission = (permissions: Permission[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!req.session.user.isActive) {
      return res.status(403).json({ error: "Account is inactive" });
    }

    const hasAnyPermission = permissions.some((permission) =>
      hasPermission(req.session.user!.role, permission)
    );

    if (!hasAnyPermission) {
      return res.status(403).json({
        error: "Insufficient permissions",
        required: `One of: ${permissions.join(", ")}`,
        userRole: req.session.user.role,
      });
    }

    next();
  };
};

/**
 * Middleware to check if user has a specific role
 */
export const requireRole = (role: UserRole) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!req.session.user.isActive) {
      return res.status(403).json({ error: "Account is inactive" });
    }

    if (req.session.user.role !== role) {
      return res.status(403).json({
        error: "Insufficient role",
        required: role,
        userRole: req.session.user.role,
      });
    }

    next();
  };
};

/**
 * Middleware to check if user has one of multiple roles
 */
export const requireAnyRole = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!req.session.user.isActive) {
      return res.status(403).json({ error: "Account is inactive" });
    }

    if (!roles.includes(req.session.user.role)) {
      return res.status(403).json({
        error: "Insufficient role",
        required: `One of: ${roles.join(", ")}`,
        userRole: req.session.user.role,
      });
    }

    next();
  };
};

/**
 * Middleware to check if user is admin or higher
 */
export const requireAdmin = requireAnyRole(["super_admin", "admin"]);

/**
 * Middleware to check if user is super admin
 */
export const requireSuperAdmin = requireRole("super_admin");

/**
 * Helper function to check if current user can modify another user
 * Super admins can modify anyone, admins can modify non-admin users
 */
export const canModifyUser = (
  currentUserRole: UserRole,
  targetUserRole: UserRole
): boolean => {
  if (currentUserRole === "super_admin") {
    return true; // Super admin can modify anyone
  }

  if (currentUserRole === "admin") {
    return !["super_admin", "admin"].includes(targetUserRole); // Admin can't modify other admins or super admins
  }

  return false; // Other roles can't modify users
};
