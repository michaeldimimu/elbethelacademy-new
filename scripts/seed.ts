import "dotenv/config";
import Database from "../src/config/database.js";
import User from "../src/models/User.js";
import { UserRole } from "../src/types/roles.js";

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Connect to database
    const database = Database.getInstance();
    await database.connect();

    // Check if users already exist
    const existingUsers = await User.find({});
    if (existingUsers.length > 0) {
      console.log(
        "📋 Database already contains users. Clearing existing users..."
      );
      await User.deleteMany({});
    }

    // Create demo users
    const demoUsers = [
      {
        username: "admin",
        email: "admin@elbethelacademy.com",
        password: "admin123",
        name: "System Administrator",
        role: UserRole.ADMIN,
        isActive: true,
      },
      {
        username: "teacher",
        email: "teacher@elbethelacademy.com",
        password: "teacher123",
        name: "John Teacher",
        role: UserRole.TEACHER,
        isActive: true,
      },
      {
        username: "student",
        email: "student@elbethelacademy.com",
        password: "student123",
        name: "Jane Student",
        role: UserRole.STUDENT,
        isActive: true,
      },
    ];

    console.log("👥 Creating demo users...");

    for (const userData of demoUsers) {
      const user = new User(userData);
      await user.save();
      console.log(
        `✅ Created user: ${userData.username} (${userData.email}) - Role: ${userData.role}`
      );
    }

    console.log("🎉 Database seeding completed successfully!");
    console.log("\n📋 Demo credentials:");
    console.log("┌─────────────────────────────────────────────────────┐");
    console.log(
      "│ Admin:   admin    | Password: admin123    | Role: admin   │"
    );
    console.log(
      "│ Teacher: teacher  | Password: teacher123  | Role: teacher │"
    );
    console.log(
      "│ Student: student  | Password: student123  | Role: student │"
    );
    console.log("└─────────────────────────────────────────────────────┘");

    await database.disconnect();
    console.log("✅ Database connection closed");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    console.error("Full error details:", error);
    process.exit(1);
  }
}

// Run seeding
seedDatabase();
