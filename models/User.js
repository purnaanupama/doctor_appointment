import { DataTypes } from "sequelize";
import sequelize from '../config/dbConfig.js'

const User = sequelize.define('User', {
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
        isEmail: true, // Ensures the email format is valid
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
      type: DataTypes.ENUM('admin', 'patient'),
      defaultValue: 'patient',
      allowNull: false,
    }
  }, {
    underscored: true,
    tableName: 'users', // Specify the table name to match the database
    timestamps: false, // If you don't want Sequelize to auto-add `createdAt` and `updatedAt` fields
  });
  
  export default User;