import express from 'express';
import { addAppointment,updateAppointment } from '../controllers/appointmentController.js';

const router = express.Router();

router.post('/create-appointment',addAppointment);
router.patch('/update-appointment',updateAppointment);

export default router;