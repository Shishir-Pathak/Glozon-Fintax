import { sequelize } from "./connectDB.js";
import { DataTypes } from "sequelize";

const Career = sequelize.define(
  "Career",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    country: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Nepal",
    },

    position: {
      type: DataTypes.ENUM(
        "Accounting & Financial Reporting",
        "Taxation & Regulatory Advisory",
        "Audit Support & Assurance",
        "Payroll Processing & Administration",
        "Strategic Advisory & Corporate Finance",
        "None"
      ),
      allowNull: false,
      defaultValue: "None",
    },

    experience: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    linkedInUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    coverLetter: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    resumeUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    approveStatus: {
      type: DataTypes.ENUM(
        "pending",
        "shortlisted",
        "approved",
        "rejected"
      ),
      defaultValue: "pending",
      allowNull: false,
    },
  },
  {
    tableName: "careers",
    timestamps: true,
  }
);

export default Career;