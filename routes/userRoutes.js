import express from 'express';
import { getUser, loginUser, logout, registerUser } from '../controllers/userController.js';
import {
    validateRegisterUser,
    validateLoginUser
  } from '../middleware/formValidation.js';
import { verifyToken } from '../middleware/authMiddlware.js';

const router = express.Router();

router.post('/register',validateRegisterUser, registerUser);
router.post('/login',validateLoginUser, loginUser);
router.post('/logout',verifyToken, logout);
router.get('/current-user', verifyToken, getUser);
router.post('/enable-2fa', verifyToken, enable2FA);
router.post('/verify-2fa', verifyToken, verify2FA);


export default router;