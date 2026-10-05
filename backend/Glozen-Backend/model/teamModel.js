import { sequelize } from "./connectDB.js";
import { DataTypes } from "sequelize";

const Team = sequelize.define(
  "Team",
  {
    // =====================================================
    // NAME
    // =====================================================

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // =====================================================
    // POSITION
    // =====================================================

    position: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // =====================================================
    // IMAGE
    // =====================================================

    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // =====================================================
    // BIO
    // =====================================================

    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },

  // =====================================================
  // TABLE OPTIONS
  // =====================================================

  {
    tableName: "teams",
    timestamps: true,
  }
);

// IMPORTANT:
// Do NOT use:
// sequelize.sync({ alter: true });
//
// Models should only define the database structure.
// Database synchronization should not happen here.

export default Team;