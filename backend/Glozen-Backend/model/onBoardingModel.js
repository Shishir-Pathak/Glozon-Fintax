import { sequelize } from "./connectDB.js";
import { DataTypes } from "sequelize";

const onboarding = sequelize.define(
  "OnBoarding",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    // =====================================================
    // PERSONAL INFORMATION
    // =====================================================

    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    lastName: {
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

    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    country: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Nepal",
    },

    // =====================================================
    // GENDER
    // Individual only
    // =====================================================

    gender: {
      type: DataTypes.ENUM(
        "Male",
        "Female",
        "Other"
      ),
      allowNull: true,
    },

    // =====================================================
    // MARITAL STATUS
    // Individual only
    // =====================================================

    maritalStatus: {
      type: DataTypes.ENUM(
        "Single",
        "Married",
        "Divorced"
      ),
      allowNull: true,
      defaultValue: null,
    },

    // =====================================================
    // ADDITIONAL PERSONAL INFORMATION
    // =====================================================

    // Individual only
    occupation: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // =====================================================
    // VISA TYPE / STATUS
    // OPTIONAL — for both Individual and Company
    // =====================================================

    visaType: {
      type: DataTypes.ENUM(
        "Student Visa",
        "Bridging Visa",
        "TR-Temporary VISA",
        "Australia Citizenship",
        "PR-Permanent VISA",
        "Other Type"
      ),
      allowNull: true,
      defaultValue: null,
    },

    // Required for both Individual and Company
    investmentTrading: {
      type: DataTypes.ENUM(
        "Yes",
        "No"
      ),
      allowNull: false,
    },

    // Required for both Individual and Company
    hasAbn: {
      type: DataTypes.ENUM(
        "Yes",
        "No"
      ),
      allowNull: false,
    },

    // =====================================================
    // BUSINESS INFORMATION
    // =====================================================

    businessType: {
      type: DataTypes.ENUM(
        "individual",
        "company"
      ),
      allowNull: false,
      defaultValue: "individual",
    },

    // Required for both Individual and Company
    panId: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // Individual only
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    // Company only
    corporateId: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // =====================================================
    // SIGNATURE
    // =====================================================

    signatureName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    signatureDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    signatureUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // =====================================================
    // PDF
    // =====================================================

    pdfUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // =====================================================
    // ADMIN STATUS
    // =====================================================

    checked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "onboarding",
    timestamps: true,
  }
);

export default onboarding;