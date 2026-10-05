import { sequelize } from "./connectDB.js";
import { DataTypes } from "sequelize";

const Testimonial = sequelize.define(
  "Testimonial",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    position: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    image_public_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "testimonials",

    timestamps: true,

    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Testimonial;