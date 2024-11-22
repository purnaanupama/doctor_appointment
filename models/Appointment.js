import { DataTypes } from "sequelize";
import sequelize from '../config/dbConfig.js';
import User from "./User.js";

// Define Appointment model
const Appointment = sequelize.define('Appointment', {
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
      type: DataTypes.ENUM('pending', 'accepted', 'cancelled'),
      defaultValue: 'pending',
    },
    doctorName: {
      type: DataTypes.STRING,
      allowNull: true,  // Optionally set this as nullable, in case it can be empty
    },
    patientId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id'
      },
      allowNull: false,  // Ensure that the foreign key cannot be null
      onDelete: 'CASCADE', // Automatically delete appointments if the user is deleted
      onUpdate: 'CASCADE', // If the user ID changes, update the foreign key
    }
}, {
    underscored: true,
    tableName: 'appointments', // Ensure it matches your database table name
    timestamps: true,  // Sequelize will handle createdAt and updatedAt automatically
});

// Export the model
export default Appointment;
