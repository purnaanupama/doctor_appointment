import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaTrashAlt } from "react-icons/fa";

const Appointment_Admin = () => {
  const [data, setData] = useState([]);

  const fetchAllAppointments = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/appointment/get-appointments`,
        {
          withCredentials: true,
        }
      );
      console.log(response.data.data);
      setData(response.data.data); // Assuming response.data.data contains an array of appointments
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to fetch appointments!");
    }
  };

  const updateAppointmentStatus=async(id,status)=>{
    try {
      const response = await axios.patch(`${import.meta.env.VITE_BASE_URL}/appointment/update-appointment/${id}`,
      {
        status:status
      },
      {
        withCredentials:true
      })
      if(response){
        fetchAllAppointments();
        if(status==="cancelled"){
          toast.success('Appointment Cancelled !', {
            className: 'custom-toast',
          });
        }else{
          toast.success('Appointment Accepted !', {
            className: 'custom-toast',
          });
        }
   
        
      }
    } catch (error) {
     toast.error('Something went wrong !', {
            className: 'custom-toast',
          });
      console.log(error);  
    }
  }

  const deleteAppointment=async(id)=>{
   try {
    const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/appointment/delete-appointment/${id}`,{
      withCredentials:true
    });
    fetchAllAppointments();
    toast.success('Appointment deleted !', {
      className: 'custom-toast',
    });
   } catch (error) {
    toast.error('Something went wrong !', {
      className: 'custom-toast',
    });
    console.log(error);
   }
  }

  useEffect(() => {
    fetchAllAppointments();
  }, []);

  return (
    <div className="w-full">
      <p className="py-4 m-6 px-6 text-lg font-semibold w-[calc(95%)] bg-gradient-to-r from-[#012d68] via-[#012d68] to-transparent text-white">
        Appointment Management
      </p>
      <div className="mt-4 px-6">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-300">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Username</th>
              <th className="px-4 py-2 text-left">Doctor Name</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left"></th>
              <th className="px-4 py-2 text-left"></th>
              <th className="px-4 py-2 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((appointment) => (
                <tr key={appointment.id} className="border-b">
                  <td className="px-4 py-2 text-sm">{appointment.id}</td>
                  <td className="px-4 py-2 text-sm">{appointment.User?.username || "N/A"}</td>
                  <td className="px-4 py-2 text-sm">{appointment.doctorName}</td>
                  <td className="px-4 py-2 text-sm">{appointment.status}</td>
                  <td className="px-4 py-2 text-sm"><p onClick={()=>{updateAppointmentStatus(appointment.id,"cancelled")}} className='text-xs bg-red-700 text-white rounded-md p-1 text-center cursor-pointer hover:bg-red-800'>Cancel</p></td>
                  <td className="px-4 py-2 text-sm"><p onClick={()=>{updateAppointmentStatus(appointment.id,"accepted")}} className='text-xs bg-green-700 text-white rounded-md p-1 text-center cursor-pointer hover:bg-green-800'>Accept</p></td>
                  <td className="px-4 py-2 text-sm"><FaTrashAlt onClick={()=>{deleteAppointment(appointment.id)}}/></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-20 text-[20px] text-center">
                  No appointments available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Appointment_Admin;