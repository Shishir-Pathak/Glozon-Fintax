import { sequelize } from "./connectDB.js";
import { DataTypes } from "sequelize";

const Partner = sequelize.define(
  "Partner",
  {
    // =====================================================
    // ID
    // =====================================================

    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    // =====================================================
    // PARTNER NAME
    // =====================================================

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // =====================================================
    // SLUG
    // =====================================================

    // IMPORTANT:
    // unique: true removed temporarily because the
    // existing partners table already has too many indexes.
    //
    // Your controller already creates a unique slug using:
    // name + timestamp
    //
    // Example:
    // abc-company-1756201234567
    // =====================================================

    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // =====================================================
    // PARTNER LOGO
    // =====================================================

    logoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // =====================================================
    // ACTIVE / INACTIVE
    // =====================================================

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },

  // =====================================================
  // TABLE OPTIONS
  // =====================================================

  {
    tableName: "partners",
    timestamps: true,
  }
);

export default Partner;