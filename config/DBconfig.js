import { Sequelize } from "sequelize";

// Create a Sequelize instance
const sequelize = new Sequelize('medicare', 'medicareUser', 'pass', {
  host: 'localhost',
  dialect: 'mysql', // Change to 'postgres', 'sqlite', 'mariadb', or 'mssql' if needed
  logging: false,   // Disable logging in the console
});

export default sequelize; 