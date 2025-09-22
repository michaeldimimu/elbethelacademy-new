import "dotenv/config";
import express from "express";
import session from "express-session";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

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

// Simple auth implementation for development
// In production, you'd use a proper auth library setup
app.post("/auth/signin/credentials", (req, res) => {
  const { username, password } = req.body;

  // Mock user database
  const users = [
    {
      id: "1",
      username: "admin",
      password: "password123",
      name: "Administrator",
      email: "admin@example.com",
    },
    {
      id: "2",
      username: "user",
      password: "user123",
      name: "Regular User",
      email: "user@example.com",
    },
  ];

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    // Store user in session
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
    };

    console.log("User logged in and session stored:", req.session.user);

    res.json({
      user: req.session.user,
    });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
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
