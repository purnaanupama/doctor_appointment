import Appointment from "../models/Appointment.js";


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
         console.log(formattedDate);  // Correct output: "2024-11-22"
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
      return res.status(500).json({
            status: false,
            message: 'Error creating appointment',
            error:error.message
          }); 
    }
}

export const updateAppointment = async (req, res, next) => {
    const { id, status } = req.body;
    console.log(`Updating appointment with id: ${id} and status: ${status}`);
    
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
        appointment: updatedAppointment,
      });
    } catch (error) {
      console.error('Error updating appointment:', error);
      return res.status(500).json({
        status: false,
        message: 'Something went wrong',
      });
    }
  };
  
  
