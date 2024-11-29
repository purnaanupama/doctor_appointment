import { User } from "../models/Index.js";
import { Appointment } from "../models/Index.js";
import logger from "../config/logger.js"; // Import the logger

export const addAppointment = async (req, res, next) => {
  const { status, doctor_name, patient_id } = req.body;
  const now_time = new Date();
  const time = `${now_time.getHours().toString().padStart(2, '0')}:${now_time.getMinutes().toString().padStart(2, '0(')}:${now_time.getSeconds().toString().padStart(2, '0')}`;
  const now = new Date();
  const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;

  try {
    logger.info('Adding new appointment', { status, doctor_name, patient_id });

    const new_appointment = await Appointment.create({
      appointmentDate: formattedDate,
      appointmentTime: time,
      status: status,
      doctorName: doctor_name,
      patientId: patient_id,
    });

    logger.info('Appointment created successfully', { appointmentId: new_appointment.id });
    return res.status(200).json({
      status: true,
      data: new_appointment,
      message: 'Appointment Created Successfully',
    });
  } catch (error) {
    logger.error('Error creating appointment', { error: error.message });
    next(error);
  }
};

export const updateAppointment = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    logger.info('Updating appointment', { appointmentId: id, status });

    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      logger.warn('Appointment not found', { appointmentId: id });
      return res.status(404).json({
        status: false,
        message: 'Appointment does not exist!',
      });
    }

    const updatedAppointment = await appointment.update({ status });
    logger.info('Appointment updated successfully', { appointmentId: id, status });

    return res.status(200).json({
      status: true,
      message: 'Appointment status updated successfully',
    });
  } catch (error) {
    logger.error('Error updating appointment', { error: error.message });
    next(error);
  }
};

export const fetchAppointments = async (req, res, next) => {
  try {
    logger.info('Fetching all appointments');
    const appointments = await Appointment.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    logger.info('Appointments fetched successfully', { totalAppointments: appointments.length });
    return res.status(200).json({
      status: true,
      message: 'Appointments fetched successfully',
      data: appointments,
    });
  } catch (error) {
    logger.error('Error fetching appointments', { error: error.message });
    next(error);
  }
};

export const fetchUserAppointments = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info('Fetching appointments for user', { userId: id });

    const appointments = await Appointment.findAll({
      where: {
        patient_id: id,
      },
    });

    logger.info('User appointments fetched successfully', { userId: id, totalAppointments: appointments.length });
    return res.status(200).json({
      status: true,
      message: 'Appointments fetched successfully',
      data: appointments,
    });
  } catch (error) {
    logger.error('Error fetching user appointments', { error: error.message });
    next(error);
  }
};

export const deleteAppointments = async (req, res, next) => {
  const { id } = req.params;

  try {
    logger.info('Deleting appointment', { appointmentId: id });

    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      logger.warn('Appointment not found', { appointmentId: id });
      return res.status(404).json({
        status: false,
        message: 'Appointment not found',
      });
    }

    await appointment.destroy();
    logger.info('Appointment deleted successfully', { appointmentId: id });

    return res.status(200).json({
      status: true,
      message: 'Appointment deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting appointment', { error: error.message });
    next(error);
  }
};