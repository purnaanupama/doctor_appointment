import express from 'express';
<<<<<<< HEAD
import { 
  getUser, 
  loginUser, 
  logout, 
  registerUser, 
  enable2FA, 
  verify2FA } from '../controllers/userController.js';
=======
import { getUser, loginUser, logout, registerUser, enable2FA, verify2FA } from '../controllers/userController.js';
>>>>>>> 08486aa8b0e730fd321587a1fdf686ad7f157fa8
import {
    validateRegisterUser,
    validateLoginUser
  } from '../middleware/formValidation.js';
import { verifyToken } from '../middleware/authMiddlware.js';

const router = express.Router();

router.post('/register',validateRegisterUser, registerUser);
router.post('/login',validateLoginUser, loginUser);
<<<<<<< HEAD
router.post('/logout',verifyToken, logout);
router.get('/current-user', verifyToken, getUser);
router.post('/enable-2fa', verifyToken, enable2FA);
router.post('/verify-2fa', verifyToken, verify2FA);

=======
router.get('/logout',verifyToken,logout);
router.get('/current-user',verifyToken,getUser);
router.post('/enable-2fa', verifyToken, enable2FA);
router.post('/verify-2fa', verifyToken, verify2FA);
>>>>>>> 08486aa8b0e730fd321587a1fdf686ad7f157fa8

export default router;