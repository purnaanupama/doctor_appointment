import { useContext, useEffect, useState } from 'react';
import Header from '../components/Header';
import { IoIosAddCircle } from "react-icons/io";
import Appointment_Form from '../components/appointment_form';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Context from '../context/context.js';
import { toast } from 'react-toastify';

const Appointment_Patient = () => {
  const { fetchUserDetails } = useContext(Context);
  const user = useSelector(state => state.user.user);
  const [open, setOpen] = useState(false);
  const [userAppointments, setUserAppointments] = useState([]);

  // Get all user appointments
  const fetchUserAppointments = async () => {
    if (user?.data?.id) {  // Check if user data and id are available
      try {
        console.log("user", user?.data);
        const response = await axios.get(`http://localhost:3000/api/medicare/appointment/get-user-appointment/${user.data.id}`, {
          withCredentials: true
        });
        setUserAppointments(response.data.data); // Set user appointments array
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("User data is not available yet.");
    }
  };

  useEffect(() => {
    fetchUserDetails(); // Fetch user details
  }, []);

  // Fetch user appointments only when user data is available
  useEffect(() => {
    if (user?.data?.id) {
      fetchUserAppointments();
    }
  }, [user]);  // Re-run whenever `user` state changes

  const cancelAppointment=async(id)=>{
    try {
      const response = await axios.patch(`http://localhost:3000/api/medicare/appointment/update-appointment/${id}`,
      {
        status:'cancelled'
      },
      {
        withCredentials:true
      })
      if(response){
        fetchUserAppointments();
        toast.success('Appointment Cancelled !', {
            className: 'custom-toast',
          });
      }
    } catch (error) {
     toast.error('Something went wrong !', {
            className: 'custom-toast',
          });
      console.log(error);  
    }
  }

  return (
    <div className='w-[100%]'>
      <Header />
      <p className="py-4 m-6 px-6 text-lg font-semibold w-[calc(95%)] bg-gradient-to-r from-[#012d68] via-[#012d68] to-transparent text-white">
        Appointment
      </p>
      <div className='w-full h-auto'>
        <button onClick={() => setOpen(true)} className='py-2 ml-6 text-[14px] flex items-center gap-2 rounded-sm bg-slate-400 px-6 hover:bg-slate-500'>
          Add Appointment <IoIosAddCircle className='text-[18px] text-black' />
        </button>
      </div>
      {open && <Appointment_Form setOpen={setOpen} fetchAppointments={fetchUserAppointments}/>}
      
      {/* Appointments Table */}
      <p className='py-2 mt-4 font-semibold ml-6 text-[18px]'>Appointment History</p>
      <div className="mt-4 px-6">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Doctor</th>
              <th className="px-4 py-2 text-left">Appointment Time</th>
              <th className="px-4 py-2 text-left">Appointment Date</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {userAppointments.length > 0 ? (
              userAppointments.map((appointment) => (
                <tr key={appointment.id} className="border-b">
                  <td className="px-4 py-2 text-sm">{appointment.id}</td>
                  <td className="px-4 py-2 text-sm">{appointment.doctorName || "Not Assigned"}</td>
                  <td className="px-4 py-2 text-sm">{appointment.appointmentTime}</td>
                  <td className="px-4 py-2 text-sm">{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-sm">{appointment.status}</td>
                  <td className="px-4 py-2 text-sm"><p onClick={()=>{cancelAppointment(appointment.id)}} className='text-xs bg-red-700 text-white rounded-md p-1 text-center cursor-pointer hover:bg-red-800'>Cancel</p></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-20 text-[20px] text-center">No appointments available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Appointment_Patient;

