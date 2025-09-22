import "dotenv/config";
import Database from "../src/config/database.js";
import User from "../src/models/User.js";

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
        email: "admin@example.com",
        password: "password123",
        name: "Administrator",
      },
      {
        username: "user",
        email: "user@example.com",
        password: "user123",
        name: "Regular User",
      },
      {
        username: "johndoe",
        email: "john.doe@example.com",
        password: "johnpass123",
        name: "John Doe",
      },
    ];

    console.log("👥 Creating demo users...");

    for (const userData of demoUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`✅ Created user: ${userData.username} (${userData.email})`);
    }

    console.log("🎉 Database seeding completed successfully!");
    console.log("\n📋 Demo credentials:");
    console.log("┌─────────────────────────────────────────┐");
    console.log("│ Username: admin     | Password: password123 │");
    console.log("│ Username: user      | Password: user123     │");
    console.log("│ Username: johndoe   | Password: johnpass123 │");
    console.log("└─────────────────────────────────────────┘");

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
