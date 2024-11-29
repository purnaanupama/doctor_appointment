import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname workaround for ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Create the logger
const logger = winston.createLogger({
  levels,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // Log format in JSON for easy parsing
  ),
  transports: [
    new winston.transports.File({ 
      filename: path.join(__dirname, 'logs', 'error.log'), 
      level: 'error' 
    }), // Log errors
    new winston.transports.File({ 
      filename: path.join(__dirname, 'logs', 'combined.log') 
    }), // Log all levels
  ],
});

// If we're in development, log to the console as well
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export default logger;