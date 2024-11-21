const { DataTypes } = require('sequelize');
const sequelize = require('../config/DBconfig');

const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    full_name: {
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
    mobile_number: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true, // Optional field
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'users', // Specify the table name to match the database
    timestamps: false, // If you don't want Sequelize to auto-add `createdAt` and `updatedAt` fields
  });
  
  module.exports = User;