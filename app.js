import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import sequelize from './config/dbConfig.js';
dotenv.config();

const app = express(); //create express app

app.use(express.json()); //Parses incoming requests with JSON payloads
app.use(express.urlencoded({extended:true})); //Parses URL-encoded data from requests
app.use(cookieParser()); //Parses cookies attached to client requests and makes them available in req.cookies.

// Check database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected...');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

// Sync database
sequelize
  .sync()
  .then(() => {
    console.log('Database synced');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

//Mount routes
// app.use('/medicare/user', require('./routes/userRoutes.js'));


//Start server
const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})
