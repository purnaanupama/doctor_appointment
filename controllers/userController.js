import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import axios from 'axios';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

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


  export const loginUser = async (req, res, next) => {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { email, password, otp } = req.body;
  
    try {
      const user = await User.findOne({
        where: { email },
        attributes: ['id', 'email', 'password', 'role', 'twoFactorSecret'],
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
  
      // Check if 2FA is enabled
      if (user.twoFactorSecret) {
        if (!otp) {
          return res.status(400).json({
            status: false,
            message: 'OTP is required for 2FA.',
          });
        }
  
        // Verify OTP
        const isValid = speakeasy.totp.verify({
          secret: user.twoFactorSecret,
          encoding: 'base32',
          token: otp,
        });
  
        if (!isValid) {
          return res.status(401).json({
            status: false,
            message: 'Invalid OTP',
          });
        }
      }
  
      // Generate JWT token
      const payload = { id: user.id, role: user.role };
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: '1h',
      });
  
      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'strict',
        expires: new Date(Date.now() + 3600000),
      });
  
      return res.status(200).json({
        status: true,
        token,
        data: { id: user.id, email },
        message: 'User is logged in successfully',
      });
    } catch (error) {
      next(error);
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

//Implement 2FA
export const enable2FA = async(req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if(!user){
      return res.status(404).json({
        status: false,
        message: 'User not found!!',
      });
    }

    //Generete 2FA secret
    const secret = speakeasy.generateSecret({
      name: `MediCare (${user.email})`
    });

    //Save secret key to the table
    user.twoFactorSecret = secret;
    user.save();

    // Generate QR code for authenticator app
    QRCode.toDataURL(secret.otpauth_url, (err, dataURL) => {
      if (err) {
        return next(err);
      }
      res.status(200).json({
        status: true,
        message: '2FA enabled successfully',
        qrCode: dataURL, // QR code for the user to scan
      });
    });
  } catch (error) {
    next(error);
  }
}

//Verifying 2FA
export const verify2FA = async (req, res, next) => {
  const { otp } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findByPk(userId);

    if (!user || !user.twoFactorSecret) {
      return res.status(400).json({ 
        status: false, 
        message: '2FA is not enabled for this user'
       });
    }

    // Verify the OTP
    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: otp,
    });

    if (!isValid) {
      return res.status(401).json({ 
        status: false, 
        message: 'Invalid OTP' 
      });
    }

    res.status(200).json({
      status: true,
      message: '2FA verified successfully',
    });
  } catch (error) {
    next(error);
  }
};
