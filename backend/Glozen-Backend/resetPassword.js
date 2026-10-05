
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { sequelize } from "./model/connectDB.js";

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();

    console.log("Database connected successfully.");

    // Admin credentials
    const email = "admin@glozon.com";
    const password = "admin123";

    // Check whether admin already exists
    const [existingUsers] = await sequelize.query(
      "SELECT id, email, role FROM users WHERE email = ?",
      {
        replacements: [email],
      }
    );

    if (existingUsers.length > 0) {
      console.log("\nAdmin already exists:");
      console.table(existingUsers);

      await sequelize.close();
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    await sequelize.query(
      `
      INSERT INTO users
      (email, password, role, createdAt, updatedAt)
      VALUES (?, ?, 'admin', NOW(), NOW())
      `,
      {
        replacements: [email, hashedPassword],
      }
    );

    console.log("\n======================================");
    console.log("✅ ADMIN CREATED SUCCESSFULLY");
    console.log("======================================");
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Role: admin");
    console.log("======================================\n");

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("\n❌ ERROR CREATING ADMIN:");
    console.error(error);

    try {
      await sequelize.close();
    } catch {}

    process.exit(1);
  }
};

createAdmin();

