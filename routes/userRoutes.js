import express from 'express';
import { getUser, loginUser, logout, registerUser, accountVerify } from '../controllers/userController.js';
import {
    validateRegisterUser,
    validateLoginUser
  } from '../middleware/formValidation.js';
import { verifyToken } from '../middleware/authMiddlware.js';

const router = express.Router();

router.post('/register',validateRegisterUser, registerUser);
router.post('/login',validateLoginUser, loginUser);
router.post('/logout',verifyToken, logout);
router.post('/verify-otp', accountVerify);
router.get('/current-user', verifyToken, getUser);

export default router;