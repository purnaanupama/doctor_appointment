import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const Appointment = sequelize.define(
  "Appointment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    appointmentDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    appointmentTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "cancelled"),
      defaultValue: "pending",
    },
    doctorName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false, // Foreign key for User model
    },
  },
  {
    underscored: true,
    tableName: "appointments",
    timestamps: true,
  }
);

// Association function to be called later
Appointment.associate = (models) => {
  Appointment.belongsTo(models.User, { foreignKey: "patientId" });
};

export default Appointment;