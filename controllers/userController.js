import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

//User register
export const registerUser = async (req, res, next) => {
    const { username, email, password, mobileNumber, role } = req.body;
  
    try {
      //Check any user already registered using same email
      let user = await User.findOne({ where: { email: email } });
      if (user) {
        return res.status(400).json({
            status: false,
            message: 'User is already exists'
        });
      }
  
      //Hashing the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      //Adding user data to the users table
      user = await User.create({ username, email, password: hashedPassword, mobileNumber, role });
  
      //Create jwt token
      const payload = { id: user.id, role: user.role };
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: '1hr'})
  
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
// export const loginUser = async (req, res, next) => {
//   const { email, password } = req.body;

//   try {
//     //Check email as user credentials
//     const user = await User.findOne({ where: { email: email } });
//     if (!user) {
//       return res.status(401).json({
//         status: false,
//         message: 'Invalid user Email'
//       });
//     }

//     //Check password as user credentials
//     const isMatch = await bcrypt.compare(password, )
//     if (!isMatch) {
//       return res.status(201).json({
//         status: true,
//         token,
//         message: 'User is  successfully'
//       });
//     }

//     //Create jwt token
//     const payload = { id: user.userId };
//     const token = generateJwtToken(payload);
//     // const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: '1hr'});

//     //Setting up JWT token in cookie
//     res.cookie('token', token, {
//       httpOnly: true,
//       expires: new Date(Date.now() + 3600000) //Token expiretion time (1 hour)
//     });

//     return res.status(201).json({
//       status: 'success',
//       token,
//       data: { id: user.userId, email },
//       message: 'User is logged successfully'
//     });
//   } catch (error) {
//     next(error);
//   }
// };