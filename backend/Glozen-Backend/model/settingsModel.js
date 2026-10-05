import { sequelize } from "./connectDB.js";
import { DataTypes } from "sequelize";

const Settings = sequelize.define(
  "Settings",
  {
    // ==========================================
    // ID
    // ==========================================

    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // ==========================================
    // COMPANY DETAILS
    // ==========================================

    companyName: {
      type: DataTypes.STRING,
      field: "companyName",
      defaultValue: "Glozon FinTax",
    },

    tagline: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "Finance, Tax & Advisory Solutions",
    },

    logo: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "/Logo.png",
    },

    // ==========================================
    // CONTACT DETAILS
    // ==========================================

    primaryEmail: {
      type: DataTypes.STRING,
      field: "primaryEmail",
      defaultValue: "info@glozonfintax.com",
    },

    secondaryEmail: {
      type: DataTypes.STRING,
      field: "secondaryEmail",
      defaultValue: "support@glozonfintax.com",
    },

    primaryPhone: {
      type: DataTypes.STRING,
      field: "primaryPhone",
      defaultValue: "+977 9845971220",
    },

    secondaryPhone: {
      type: DataTypes.STRING,
      field: "secondaryPhone",
      defaultValue: "+977 9811111111",
    },

    whatsapp: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "+977 9845971220",
    },

    address: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "Gaushala, Kathmandu, Nepal",
    },

    website: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "https://glozonfintax.com",
    },

    googleMapUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // ==========================================
    // SOCIAL MEDIA
    // ==========================================

    facebook: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    linkedin: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    instagram: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    twitter: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // ==========================================
    // FOOTER
    // ==========================================

    footerDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // ==========================================
    // CLIENT ONBOARDING DECLARATION
    // ==========================================

    declaration: {
      type: DataTypes.TEXT,
      allowNull: true,

      defaultValue:
        "I declare that the information provided above is true and correct to the best of my knowledge and belief.\n\nI authorize Glozon FinTax & Advisory Pvt. Ltd. to act on my behalf in relation to my taxation and accounting affairs.",
    },

    // ==========================================
    // BUSINESS HOURS
    // ==========================================

    businessHours: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    // ==========================================
    // TIMESTAMPS
    // ==========================================

    createdAt: {
      type: DataTypes.DATE,
      field: "created_at",
    },

    updatedAt: {
      type: DataTypes.DATE,
      field: "updated_at",
    },
  },

  {
    tableName: "site_settings1",
    timestamps: true,
  }
);

export default Settings;