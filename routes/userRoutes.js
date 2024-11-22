import express from 'express';
import { loginUser, registerUser } from '../controllers/userController.js';
import {
    validateRegisterUser,
    validateLoginUser
  } from '../middleware/authValidator.js';
const router = express.Router();
//ee
router.post('/register', validateRegisterUser, registerUser);
router.post('/login', validateLoginUser, loginUser);

export default router;