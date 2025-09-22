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

class AuthService {
  private baseUrl = "/auth";

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
}

export const authService = new AuthService();
export type { User, SignInCredentials, AuthResponse };
