import { sequelize } from "./connectDB.js";
import { DataTypes } from "sequelize";

const PartnerSubmission = sequelize.define(
  "PartnerSubmission",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    partnerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          msg: "Please provide a valid email address",
        },
      },
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    registrationNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    contactName: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    position: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // ==========================================
    // GENERATED PDF
    // ==========================================

    pdfUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // ==========================================
    // PARTNER LOGO
    // ==========================================

    logoUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "partner_submissions",
    timestamps: true,
  }
);

export default PartnerSubmission;