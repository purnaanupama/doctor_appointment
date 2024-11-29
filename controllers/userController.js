import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { verifyOtp, generateOtp } from '../utils/otpUtils.js';
import { sendEmail } from "../utils/sendEmail.js";
import logger from "../config/logger.js"; // Import the logger

// Verify user account controller
export const accountVerify = async (req, res, next) => {
  const { otp } = req.body;
  // Verify the OTP token
  try {
    logger.info('Verifying OTP', { otp });
    const isValid = verifyOtp(otp);
    if (isValid) {
      // Find the user by OTP code
      const user = await User.findOne({ otp_code: otp });
      if (user) {
        // Mark the user as verified
        user.verified_user = true;
        user.otp_code = null;
        await user.save();
        logger.info('User verified successfully', { userId: user.id });
        res.status(200).json({
          status: "success",
          message: "User verified successfully",
        });
      } else {
        logger.warn('Invalid OTP', { otp });
        res.status(400).json({
          status: "fail",
          message: "Invalid OTP",
        });
      }
    }
  } catch (error) {
    logger.error('Error verifying OTP', { error: error.message });
    next(error);
  }
};

// User register controller
export const registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Validation failed during user registration', { errors: errors.array() });
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password, mobileNumber, role } = req.body;

  try {
    // Check if a user already exists with the same email
    let user = await User.findOne({ where: { email } });

    if (user) {
      logger.warn('User already exists', { email });
      return res.status(400).json({
        status: false,
        message: "User already exists!",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!hashedPassword) {
      logger.error('Error hashing password', { email });
      return res.status(500).json({
        status: false,
        message: "Error hashing password.",
      });
    }

    // Generate OTP for email verification
    const otp = generateOtp();

    // Add the user to the database
    user = await User.create({
      username,
      email,
      password: hashedPassword,
      mobileNumber,
      role,
      otp_code: otp, // Save OTP temporarily
      verified_user: false,
    });

    // Send OTP to user via email
    await sendEmail(email, otp);

    logger.info('User registered successfully', { userId: user.id });
    return res.status(201).json({
      status: true,
      message: "User registered successfully! Please verify your account using the OTP sent to your email.",
    });
  } catch (error) {
    logger.error('Error during user registration', { error: error.message });
    next(error);
  }
};

// User login controller
export const loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Validation failed during user login', { errors: errors.array() });
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      where: { email },
      attributes: ["id", "email", "password", "role"],
    });

    if (!user) {
      logger.warn('User not found', { email });
      return res.status(400).json({
        status: false,
        message: "User not found!",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn('Invalid password', { email });
      return res.status(401).json({
        status: false,
        message: "Invalid password!",
      });
    }

    // Generate JWT token
    const payload = { id: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      expires: new Date(Date.now() + 3600000),
    });

    logger.info('User logged in successfully', { userId: user.id, email });
    return res.status(200).json({
      status: true,
      token,
      data: { id: user.id, email },
      message: "User logged in successfully!",
    });
  } catch (error) {
    logger.error('Error during user login', { error: error.message });
    next(error);
  }
};

// Getting selected user controller
export const getUser = async (req, res, next) => {
  try {
    const user = req.user;
    const user_data = await User.findByPk(user);
    const userPlain = user_data.get({ plain: true });
    const { password, ...rest } = userPlain;
    logger.info('User data fetched successfully', { userId: user });
    return res.status(200).json({
      success: "success",
      data: rest,
    });
  } catch (error) {
    logger.error('Error fetching user data', { error: error.message });
    next(error);
  }
};

export const logout = (req, res, next) => {
  try {
    logger.info('Logging out user');
    // Clear the token cookie by setting it with an immediate expiration
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
    });

    logger.info('User logged out successfully');
    return res.status(200).json({
      success: 'success',
      message: 'Logged out successfully.',
    });
  } catch (error) {
    logger.error('Error during logout', { error: error.message });
    next(error);
  }
};
