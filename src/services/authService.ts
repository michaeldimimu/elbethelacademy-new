import { UserRole } from "../types/roles";

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: UserRole;
  isActive: boolean;
}

interface AuthResponse {
  user?: User;
  error?: string;
}

interface SignInCredentials {
  username: string;
  password: string;
}

interface ForgotPasswordRequest {
  email: string;
}

interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

interface PasswordResetResponse {
  success?: boolean;
  message?: string;
  error?: string;
}

class AuthService {
  private baseUrl = "/auth";
  private passwordResetUrl = "/api/auth";

  async signIn(credentials: SignInCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/signin/credentials`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include", // Include cookies for session management
      });

      if (response.ok) {
        const data = await response.json();
        return { user: data.user };
      } else {
        const errorData = await response.json().catch(() => ({}));
        return { error: errorData.message || "Invalid credentials" };
      }
    } catch (error) {
      console.error("AuthService: Network error", error);
      return { error: "Network error occurred" };
    }
  }

  async signOut(): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/signout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Sign out error:", error);
    }
  }

  async getSession(): Promise<User | null> {
    try {
      const response = await fetch(`${this.baseUrl}/session`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        return data.user || null;
      }
    } catch (error) {
      console.error("Get session error:", error);
    }
    return null;
  }

  async checkAuth(): Promise<boolean> {
    const user = await this.getSession();
    return !!user;
  }

  async requestPasswordReset(email: string): Promise<PasswordResetResponse> {
    try {
      const response = await fetch(`${this.passwordResetUrl}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: data.message };
      } else {
        return { error: data.message || "Failed to send reset email" };
      }
    } catch (error) {
      console.error("AuthService: Password reset request error", error);
      return { error: "Network error occurred" };
    }
  }

  async verifyResetToken(token: string): Promise<PasswordResetResponse> {
    try {
      const response = await fetch(
        `${this.passwordResetUrl}/verify-reset-token/${encodeURIComponent(
          token
        )}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: data.message };
      } else {
        return { error: data.message || "Invalid or expired reset token" };
      }
    } catch (error) {
      console.error("AuthService: Token verification error", error);
      return { error: "Network error occurred" };
    }
  }

  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<PasswordResetResponse> {
    try {
      const response = await fetch(`${this.passwordResetUrl}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password: newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: data.message };
      } else {
        return { error: data.message || "Failed to reset password" };
      }
    } catch (error) {
      console.error("AuthService: Password reset error", error);
      return { error: "Network error occurred" };
    }
  }
}

export const authService = new AuthService();
export type {
  User,
  SignInCredentials,
  AuthResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  PasswordResetResponse,
};
