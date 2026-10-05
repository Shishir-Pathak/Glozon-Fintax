import { sequelize } from "./connectDB.js";
import { DataTypes } from "sequelize";

const Content = sequelize.define(
  "Content",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    sectionKey: {
      type: DataTypes.STRING,
      allowNull: false,

      // Keep unique at the model level.
      // Do NOT use sync({ alter: true }) repeatedly.
      unique: true,
    },

    data: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    tableName: "site_contents",
    timestamps: true,
  }
);

export default Content;