import { DataTypes } from "sequelize";
import sequelize from '..config/dbConfig'

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
      type: DataTypes.ENUM('pending', 'accepted', 'cancelled'), // Use ENUM for specific values
      allowNull: false,
      defaultValue: 'pending', // Set default status
    },
    doctorName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
     //References for a users table
     patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    }
  }, {
    underscored: true,
    tableName: 'appointments', // Specify the table name to match the database
    timestamps: true, // If you don't want Sequelize to auto-add `createdAt` and `updatedAt` fields
  });
  
  export default Appointment;