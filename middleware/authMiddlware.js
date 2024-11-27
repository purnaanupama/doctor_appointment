import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  //Access JWT token from cookie
  const token = req.cookies.token;

  //Check the token
  if (!token) {
    return res.status(401).json({
      status: false,
      message: 'Access denied. No token provided.'
    });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decodedToken.id; //Store decoded user data into request object
    next(); //Proceed to the next middleware or route
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({
        status: false,
        message: 'Token expired.',
        error: error.message
      });
    }
    return res.status(403).json({
      status: false,
      message: 'Invalid token.',
      error: error.message
    });
  }
};