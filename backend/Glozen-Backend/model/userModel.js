import { DataTypes } from "sequelize";
import { sequelize } from "./connectDB.js";

const User = sequelize.define(
  "User",
  {
    // =====================================================
    // EMAIL
    // =====================================================

    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // =====================================================
    // PASSWORD
    // =====================================================

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // =====================================================
    // ROLE
    // =====================================================

    role: {
      type: DataTypes.ENUM(
        "user",
        "admin"
      ),
      defaultValue: "user",
    },
  },

  // =====================================================
  // TABLE OPTIONS
  // =====================================================

  {
    tableName: "users",
    timestamps: true,
  }
);

// IMPORTANT:
// Do NOT use sequelize.sync({ alter: true }) here.
//
// Database synchronization should not be performed
// every time a model is imported.

export default User;