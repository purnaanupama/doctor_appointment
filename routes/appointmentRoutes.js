import express from 'express';
import { addAppointment, updateAppointment, fetchAppointments, deleteAppointments} from '../controllers/appointmentController.js';
import {verifyToken} from '../middleware/authMiddlware.js'

const router = express.Router();

router.post('/create-appointment',verifyToken,addAppointment);
router.patch('/update-appointment/:id',verifyToken,updateAppointment);
router.get('/get-appointments',verifyToken,fetchAppointments);
router.delete('/delete-appointment/:id',verifyToken,deleteAppointments);


export default router;