import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import speakeasy from "speakeasy";
import { verifyOtp, generateOtp } from '../utils/otpUtils.js';
import { sendEmail } from "../utils/sendEmail.js";

//Verify user account controller
export const accountVerify = async (req, res, next) => {
  const { otp } = req.body;
  // Verify the OTP token
  try {
    const isValid = verifyOtp(otp);
    if (isValid) {
      // Find the user by OTP code
      const user = await User.findOne({ otp_code: otp });
      if (user) {
        // Mark the user as verified
        user.verified_user = true;
        user.otp_code = null;
        await user.save();
        res.status(200).json({
          status: "success",
          message: "User verified successfully",
        });
      } else {
        res.status(400).json({
          status: "fail",
          message: "Invalid OTP",
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

//User register controller
export const registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password, mobileNumber, role } = req.body;

  try {
    // Check if a user already exists with the same email
    let user = await User.findOne({
      where: { email },
    });

    if (user) {
      return res.status(400).json({
        status: false,
        message: "User already exists!",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!hashedPassword) {
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

    return res.status(201).json({
      status: true,
      message: "User registered successfully! Please verify your account using the OTP sent to your email.",
    });
  } catch (error) {
    next(error);
  }
};

//User login controller
export const loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, otp } = req.body;

  try {
    const user = await User.findOne({
      where: { email },
      attributes: ["id", "email", "password", "role", "twoFactorSecret", "verified_user"],
    });

    if (!user) {
      return res.status(400).json({
        status: false,
        message: "User not found!",
      });
    }

    // Check if the user is verified
    if (!user.verified_user) {
      return res.status(401).json({
        status: false,
        message: "User is not verified! Please verify your account.",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: false,
        message: "Invalid password!",
      });
    }

    // Check if 2FA is enabled
    if (user.twoFactorSecret) {
      if (!otp) {
        return res.status(400).json({
          status: false,
          message: "OTP is required for 2FA.",
        });
      }

      // Verify the OTP
      const isValid = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: "base32",
        token: otp,
      });

      if (!isValid) {
        return res.status(401).json({
          status: false,
          message: "Invalid OTP!",
        });
      }
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

    return res.status(200).json({
      status: true,
      token,
      data: { id: user.id, email },
      message: "User logged in successfully!",
    });
  } catch (error) {
    next(error);
  }
};

//Getting selected user controller
export const getUser = async (req, res, next) => {
  try {
    const user = req.user;
    const user_data = await User.findByPk(user);
    console.log(user);
    const userPlain = user_data.get({ plain: true });
    const { password, ...rest } = userPlain;
    return res.status(200).json({
      success: "success",
      data: rest,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res, next) => {
  try {
    console.log('token',);
    
    // Clear the token cookie by setting it with an immediate expiration
    res.clearCookie('token', {
      httpOnly: true,
      secure:true
    });

    return res.status(200).json({
      success: 'success',
      message: 'Logged out successfully.'
    });
  } catch (error) {
    next(error);
  }
};