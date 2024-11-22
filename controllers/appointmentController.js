import {User} from "../models/Index.js";
import {Appointment} from "../models/Index.js";


export const addAppointment=async(req,res,next)=>{
    const { status, doctor_name, patient_id } = req.body;
     //Get proper time output
         const now_time = new Date();
         const hours = String(now_time.getHours()).padStart(2, '0');
         const minutes = String(now_time.getMinutes()).padStart(2, '0');
         const seconds = String(now_time.getSeconds()).padStart(2, '0');
         const time = `${hours}:${minutes}:${seconds}`; 
     //Get date
         const now = new Date();
         const year = now.getFullYear();
         const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
         const day = String(now.getDate()).padStart(2, '0');
         const formattedDate = `${year}-${month}-${day}`;
    try {
      //Check if the valid user is making adding the appointment
      //Check if user exist
      //create appointment 
      let new_appointment = await Appointment.create({ 
         appointmentDate:formattedDate,
         appointmentTime:time, 
         status:status, 
         doctorName:doctor_name, 
         patientId:patient_id });
      
      return res.status(200).json({
        status: true,
        data: new_appointment,
        message: 'Appointment Created Successfully'
      });
      
    } catch (error) {
      next(error);
    }
}

export const updateAppointment = async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;    
    try {
      // Step 1: Find the appointment by ID
      const appointment = await Appointment.findByPk(id);
      console.log('Appointment found:', appointment);
  
      // Step 2: If appointment does not exist, return 404 response
      if (!appointment) {
        return res.status(404).json({
          status: false,
          message: 'Appointment does not exist!',
        });
      }
  
      // Step 3: Update only the status
      const updatedAppointment = await appointment.update({ status });
      console.log('Updated appointment:', updatedAppointment);
  
      // Step 4: Return the updated appointment
      return res.status(200).json({
        status: true,
        message: 'Appointment status updated successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  export const fetchAppointments = async (req, res, next) => {
    try {
      const appointments = await Appointment.findAll({
        include: [
          {
            model: User,
            attributes: ['username'], // Include only the username
          },
        ],
      });
  
      return res.status(200).json({
        status: true,
        message: 'Appointments fetched successfully',
        data: appointments,
      });
    } catch (error) {
      next(error);
    }
  }
  
  

  export const deleteAppointments = async (req, res, next) => {
      const { id } = req.params; // Extract the appointment ID from request parameters
  
      try {
          // Find the appointment by ID
          const appointment = await Appointment.findByPk(id);
  
          // If appointment does not exist, return a 404 error
          if (!appointment) {
              return res.status(404).json({
                  status: false,
                  message: 'Appointment not found',
              });
          }
  
          // Delete the appointment
          await appointment.destroy();
  
          // Respond with success message
          return res.status(200).json({
              status: true,
              message: 'Appointment deleted successfully',
          });
      } catch (error) {
        next(error);
      }
  };