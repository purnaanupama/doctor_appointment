import express from 'express';
import { loginUser, registerUser } from '../controllers/userController.js';
import {
    validateRegisterUser,
    validateLoginUser
  } from '../middleware/authValidator.js';
const router = express.Router();


router.post('/register',registerUser);
router.post('/login',loginUser);

export default router;