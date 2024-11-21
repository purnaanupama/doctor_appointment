const User = require("../models/user_model");
const bcryptjs = require('bcryptjs');

exports.register = async (req, res) => {
  // Object destructuring from request body
  const { full_name, email, mobile_number, age, password, confirm_password } = req.body;
  // Check if the user already exists
  try {
    const user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ // Use 400 for user already existing
        status: 'Fail',
        message: 'User already exist!'});}
    // Check if passwords match
    if (password !== confirm_password) {
      return res.status(400).json({ // Use 400 for password mismatch
        status: 'Fail',
        message: 'Passwords do not match!'
      });}
    // Hash the password before saving to database
    const hashedPassword = bcryptjs.hashSync(password, 10);
    // Create the new user in the database
    const newUser = await User.create({
      full_name,
      email,
      mobile_number,
      age,
      password: hashedPassword
    });
    // Return the newly created user without the password field
    return res.status(201).json({
      status: 'Success',
      message: 'User created successfully!',
      user: {
        id: newUser.id,
        full_name: newUser.full_name,
        email: newUser.email,
        mobile_number: newUser.mobile_number,
        age: newUser.age
      }
    });
  } catch (error) {
    // Catch any errors and return a server error response
    return res.status(500).json({
      status: 'Fail',
      message: error.message
    });
  }
};
