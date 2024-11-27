import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import axios from 'axios';

//User register
//user new reducer
export const registerUser = async (req, res, next) => {
  //Check is any validation error are there
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, mobileNumber, role } = req.body;
  
    try {
      //Check any user already registered using same email
      let user = await User.findOne({ 
        where: { email }});
      if (user) {
        return res.status(400).json({
            status: false,
            message: 'User is already exists'
        });
      }
      //Hashing the password
      const hashedPassword = await bcrypt.hash(password, 10);
      if (!hashedPassword) {
        return res.status(400).json({
          status: false,
          message: 'Password hashing error'
        });
      }
  
      //Adding user data to the users table
      user = await User.create({ username, email, password:hashedPassword, mobileNumber, role });
  
      //Create jwt token
      const payload = { id: user.id, role: user.role };
      const token = jwt.sign(
        payload, 
        process.env.JWT_SECRET_KEY, 
        {expiresIn: '1hr'}
      )
  
      //Setting up JWT token in cookie
      res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 3600000) //Token expiretion time (1 hour)
      });
  
      return res.status(201).json({
        status: true,
        token,
        message: 'User is registered successfully'
      });
    } catch (error) {
      next(error);
    }
  };


  //User Login
  export const loginUser = async (req, res, next) => {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { email, password, captchaToken } = req.body;
  
    // Check if required fields are present
    if (!email || !password || !captchaToken) {
      return res.status(400).json({
        status: false,
        message: 'Email, password, and reCAPTCHA response are required.',
      });
    }
  
    try {
      // Verify reCAPTCHA token
      const secretKey = process.env.RECAPTCHA_SECRET_KEY;
      const recaptchaResponse = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify`,
        null,
        {
          params: {
            secret: secretKey,
            response: captchaToken,
          },
        }
      );
  
      if (!recaptchaResponse.data.success) {
        return res.status(400).json({
          status: false,
          message: recaptchaResponse.data['error-codes'] || 'ReCAPTCHA verification failed. Please try again.',
        });
      }
  
      // Find user in database
      const user = await User.findOne({
        where: { email },
        attributes: ['id', 'email', 'password', 'role'],
      });
  
      if (!user) {
        return res.status(400).json({
          status: false,
          message: 'User not found!',
        });
      }
  
      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          status: false,
          message: 'Password is incorrect. Please try again.',
        });
      }
  
      // Generate JWT token
      const payload = { id: user.id, role: user.role };
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: '1h',
      });
  
      // Set JWT token in HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: new Date(Date.now() + 3600000),
      });
  
      // Send response
      return res.status(200).json({
        status: true,
        token,
        data: { id: user.id, email },
        message: 'User is logged in successfully',
      });
    } catch (error) {
      // Handle unexpected errors
      return next(error);
    }
  };

  //User logout functionality
export const logout = async (req, res, next) => {
  try {
    // Clear the token cookie by setting it with an immediate expiration
    res.clearCookie('token', {
      httpOnly: true,
      secure: true
    });

    return res.status(200).json({
      success: 'success',
      message: 'Logged out successfully.'
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next)=>{
  try {
    const user = req.user;
    const user_data = await User.findByPk(user)
    console.log(user);
    const userPlain = user_data.get({ plain: true });
    const {id,...rest} = userPlain;
    return res.status(200).json({
      success: 'success',
      data:rest
    });
  } catch (error) {
      next(error)
  }
}