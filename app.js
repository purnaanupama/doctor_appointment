const express = require('express');  //A web application framework for Node.js, used to create the server and handle routes
const dotenv = require('dotenv');  //A module for loading environment variables from a .env file.
const cookieParser = require('cookie-parser'); //cookie-parser: A middleware that parses cookies from incoming requests.
const { Sequelize } = require('sequelize');
const sequelize = require('./config/DBconfig');

dotenv.config(); //Loads environment variables from a .env file into process.env

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
app.use('/medicare/user', require('./routes/user_route.js'));
console.log("SDF");


//Start server
const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})

console.log("dasdhaksdhadkadkjadkakd");
console.log("dasdhaksdhadkadkjadkakd");
console.log("dasdhaksdhadkadkjadkakd");
console.log("dasdhaksdhadkadkjadkakd");