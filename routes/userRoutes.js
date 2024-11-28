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
router.get('/logout',verifyToken,logout);
router.get('/current-user',verifyToken,getUser);

export default router;