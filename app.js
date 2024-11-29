import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import sequelize from './config/dbConfig.js';
import userRouter from './routes/userRoutes.js';
import appointmentRouter from './routes/appointmentRoutes.js';
import { errorHandler } from './middleware/errorHanlder.js';
import cors from 'cors';
import { createClient } from 'redis';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

dotenv.config();

// Initialize Redis client
const client = createClient();

// Connect to Redis and handle errors
client.connect().then(() => {
  console.log("Connected to Redis");
}).catch((err) => {
  console.error("Redis connection error:", err);
});

// Create rate limiter using Redis as store
const limiter = rateLimit({
  windowMs:  2 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 100 requests per windowMs
  store: new RedisStore({
    sendCommand: (...args) => client.sendCommand(args),
  }),
  message: "Too many requests from this IP, please try again later.",
  
  // Define a custom handler for rate-limited requests
  handler: (req, res) => {
    console.log(`Rate limit reached for IP: ${req.ip}`);
    console.log(`Request Details: ${req.method} ${req.originalUrl}`);
    res.status(429).json({
      error: 'Too many requests',
      message: 'You have exceeded the rate limit. Please try again later.',
    });
  }
});

// Create express app
const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.FRONT_URL, // Allow your front-end URL
  credentials: true               // Enable cookies to be sent with requests
}));

// Apply rate limiting middleware before routes
app.use(limiter);

// Middleware setup
app.use(express.json()); // Parses incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data from requests
app.use(cookieParser()); // Parses cookies attached to client requests and makes them available in req.cookies.

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

// Mount routes
app.use('/api/medicare/user', userRouter);
app.use('/api/medicare/appointment', appointmentRouter);

// Error handler middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});