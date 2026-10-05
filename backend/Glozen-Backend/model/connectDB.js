import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// =====================================================
// DATABASE CONNECTION
// =====================================================

console.log("DATABASE:", process.env.DB_NAME);
console.log("HOST:", process.env.DB_HOST);
console.log("USER:", process.env.DB_USER);

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: console.log,
  },
);

// =====================================================
// CONNECT DATABASE
// =====================================================

export default async function connectDB() {
  try {
    await sequelize.authenticate();

    console.log("MySQL connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:");

    console.error(error);

    // Stop the application if database connection fails
    process.exit(1);
  }
}
