// models/index.js
import sequelize from "../config/dbConfig.js";
import User from "./User.js";
import Appointment from "./Appointment.js";

// Add models to the central object
const models = {
  User,
  Appointment,
};

// Initialize associations
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Export models and sequelize instance
export { sequelize, models, User, Appointment };