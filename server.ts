import "dotenv/config";
import express from "express";
import session from "express-session";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import Database from "./src/config/database.js";
import EmailService from "./src/services/emailService.js";
import User, { IUser } from "./src/models/User.js";
import {
  requireAuth,
  requirePermission,
  requireAdmin,
  requireSuperAdmin,
} from "./src/middleware/auth.js";
import { Permission } from "./src/types/roles.js";
import invitationRoutes from "./src/routes/invitation.route.js";
import passwordResetRoutes from "./src/routes/password-reset.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: process.env.AUTH_SECRET || "your-secret-key-here",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Connect to database
const database = Database.getInstance();
database.connect().catch((error) => {
  console.error("❌ Failed to connect to database:", error.message);
  console.log("📋 To set up MongoDB, please refer to MONGODB_SETUP.md");
  console.log(
    "⚠️ Server will continue without database - authentication will not work"
  );
  // Don't exit the process, let the server run for frontend development
});

// Initialize email service
const emailService = EmailService.getInstance();
if (emailService.isEmailEnabled()) {
  emailService.verifyEmailConfiguration();
}

// API routes
app.use("/api/invitations", invitationRoutes);
app.use("/api/auth", passwordResetRoutes);

// Auth routes with MongoDB
app.post("/auth/signin/credentials", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    // Find user in database
    const user = (await User.findOne({ username })) as IUser | null;

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Store user in session
    req.session.user = {
      id: (user._id as any).toString(),
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      isActive: user.isActive,
    };

    console.log("User logged in and session stored:", req.session.user);

    res.json({
      user: req.session.user,
    });
  } catch (error) {
    console.error("Sign in error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/auth/signout", (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).json({ error: "Could not sign out" });
    }

    // Clear the session cookie
    res.clearCookie("connect.sid");
    res.json({ message: "Signed out successfully" });
  });
});

app.get("/auth/session", (req, res) => {
  // Check if user is in session
  console.log("Checking session, user:", req.session.user);

  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.json({ user: null });
  }
});

// User registration endpoint (optional)
app.post("/auth/register", async (req, res) => {
  try {
    const { username, email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({
        error: "User with this username or email already exists",
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      name,
    });

    await user.save();

    // Store user in session
    req.session.user = {
      id: (user._id as any).toString(),
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      isActive: user.isActive,
    };

    res.status(201).json({
      user: req.session.user,
      message: "User created successfully",
    });
  } catch (error: any) {
    console.error("Registration error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({ error: errors.join(", ") });
    }

    res.status(500).json({ error: "Internal server error" });
  }
});

// Protected API routes demonstrating RBAC
app.get("/api/profile", requireAuth, (req, res) => {
  res.json({
    user: req.session.user,
    message: "This is your profile data",
  });
});

app.get("/api/admin/users", requireAdmin, async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
    res.json({
      users,
      message: "Admin access: All users list",
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.get(
  "/api/admin/dashboard",
  requirePermission(Permission.CREATE_USER),
  (req, res) => {
    res.json({
      message: "Admin dashboard data",
      stats: {
        totalUsers: "This would be a real count",
        activeUsers: "This would be active user count",
        permissions: "This would show user permissions",
      },
    });
  }
);

app.post(
  "/api/admin/users/:id/activate",
  requireSuperAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndUpdate(
        id,
        { isActive: true },
        { new: true, select: "-password" }
      );

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        message: "User activated successfully",
        user,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to activate user" });
    }
  }
);

app.post(
  "/api/admin/users/:id/deactivate",
  requireSuperAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true, select: "-password" }
      );

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        message: "User deactivated successfully",
        user,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to deactivate user" });
    }
  }
);

app.get(
  "/api/teacher/courses",
  requirePermission(Permission.CREATE_COURSE),
  (req, res) => {
    res.json({
      message: "Teacher access: Course management",
      courses: [
        { id: 1, name: "Sample Course 1", students: 25 },
        { id: 2, name: "Sample Course 2", students: 18 },
      ],
    });
  }
);

app.get(
  "/api/student/courses",
  requirePermission(Permission.READ_COURSE),
  (req, res) => {
    res.json({
      message: "Student access: Enrolled courses",
      courses: [
        { id: 1, name: "Mathematics 101", progress: 75 },
        { id: 2, name: "Science Basics", progress: 60 },
      ],
    });
  }
);

// Serve static files from the dist directory (for production)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(join(__dirname, "dist")));

  // Handle React Router - send all other requests to index.html
  app.get("*", (req, res) => {
    res.sendFile(join(__dirname, "dist", "index.html"));
  });
} else {
  // Development fallback
  app.get("/", (req, res) => {
    res.json({
      message: "API is running! Frontend should be served by Vite dev server.",
    });
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Auth endpoints available at http://localhost:${PORT}/auth/*`);
});

// Extend Express Session interface to include user
declare module "express-session" {
  interface SessionData {
    user?: {
      id: string;
      name: string;
      email: string;
      username: string;
      role: string;
      isActive: boolean;
    };
  }
}
