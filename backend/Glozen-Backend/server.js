import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB, { sequelize } from "./model/connectDB.js";
import "./model/index.js";


// =====================================================
// ROUTES
// =====================================================

import router from "./routes/routes.js";

// =====================================================
// ENVIRONMENT VARIABLES
// =====================================================

dotenv.config();

// =====================================================
// DATABASE CONNECTION
// =====================================================



// =====================================================
// EXPRESS APP
// =====================================================

const app = express();

// =====================================================
// CORS
// =====================================================

app.use(
  cors({
    origin: "http://localhost:5173",

    methods: [
      "GET",
      "POST",
      "DELETE",
      "PUT",
    ],

    credentials: true,
  })
);

// =====================================================
// BODY PARSERS
// =====================================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// =====================================================
// API ROUTES
// =====================================================

app.use(
  "/api/v1",
  router
);

// =====================================================
// HOME ROUTE
// =====================================================

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// =====================================================
// START SERVER
// =====================================================

const startServer = async () => {
  try {
    // Connect to MySQL
    await connectDB();

    const [result] = await sequelize.query(
  "SELECT DATABASE() AS database_name, @@hostname AS hostname, @@port AS port"
);

console.log("MYSQL SERVER INFO:", result);

    // Check registered Sequelize models
    console.log("REGISTERED MODELS:", Object.keys(sequelize.models));

    // Create tables from Sequelize models
await sequelize.sync();

console.log("Database tables synchronized successfully.");

const [tables] = await sequelize.query("SHOW TABLES");

console.log("TABLES IN DATABASE:");
console.log(tables);

    // Start Express server
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();