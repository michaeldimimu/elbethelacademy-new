import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
import type { User } from "../services/authService";
import { UserRole, Permission, hasPermission } from "../types/roles";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (credentials: {
    username: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  hasPermission: (permission: Permission) => boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const sessionUser = await authService.getSession();
      setUser(sessionUser);
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (credentials: {
    username: string;
    password: string;
  }) => {
    try {
      const response = await authService.signIn(credentials);
      if (response.user) {
        setUser(response.user);
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error("Sign in failed:", error);
      return { success: false, error: "Sign in failed" };
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const checkPermission = (permission: Permission): boolean => {
    if (!user || !user.isActive) return false;
    return hasPermission(user.role, permission);
  };

  const checkRole = (role: UserRole): boolean => {
    if (!user || !user.isActive) return false;
    return user.role === role;
  };

  const checkAnyRole = (roles: UserRole[]): boolean => {
    if (!user || !user.isActive) return false;
    return roles.includes(user.role);
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signOut,
    hasPermission: checkPermission,
    hasRole: checkRole,
    hasAnyRole: checkAnyRole,
    isAdmin: checkAnyRole(["super_admin", "admin"]),
    isSuperAdmin: checkRole("super_admin"),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
