import { body } from 'express-validator';

// Validation for registering a user
export const validateRegisterUser = [
  body('username').notEmpty().withMessage('Username is required'),

  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 5, max: 10 })
    .withMessage('Password must be at least 5 characters long'),

  body('mobileNumber')
    .notEmpty()
    .withMessage('Mobile Number is required'),
];

// Validation for logging in a user
export const validateLoginUser = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address'),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Validation for creating or updating an appointment
export const validateAppointment = [
  body('appointmentDate')
    .notEmpty()
    .withMessage('Appointment date is required')
    .isISO8601()
    .withMessage('Appointment date must be in a valid ISO 8601 format (YYYY-MM-DD)'), // Ensures valid date format

  body('appointmentTime')
    .notEmpty()
    .withMessage('Appointment time is required')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('Appointment time must be in HH:mm (24-hour) format'),

  body('status')
    .optional()
    .isIn(['pending', 'accepted', 'cancelled'])
    .withMessage("Status must be one of 'pending', 'accepted', or 'cancelled'"),

  body('doctorName')
    .optional()
    .isString()
    .withMessage('Doctor name must be a string'),

  body('patientId')
    .notEmpty()
    .withMessage('Patient ID is required')
    .isInt()
    .withMessage('Patient ID must be an integer'),
];
