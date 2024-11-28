import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobileNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "patient"),
      defaultValue: "patient",
      allowNull: false,
    },
    twoFactorSecret: {
      type: DataTypes.STRING,
      allowNull: true, // Null initially, updated when 2FA is enabled
    },
  },
  {
    underscored: true,
    tableName: "users",
    timestamps: false,
  }
);

// Association function to be called later
User.associate = (models) => {
  User.hasMany(models.Appointment, { foreignKey: "patientId", onDelete: "CASCADE" });
};

export default User;