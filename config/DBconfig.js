const { Sequelize } = require('sequelize');

// Create a Sequelize instance
const sequelize = new Sequelize('medicare', 'medicare', 'pass', {
  host: 'localhost',
  dialect: 'mysql', // Change to 'postgres', 'sqlite', 'mariadb', or 'mssql' if needed
  logging: false,   // Disable logging in the console
});

module.exports = sequelize;

