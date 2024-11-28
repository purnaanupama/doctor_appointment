import axios from 'axios';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { AiFillCloseCircle } from "react-icons/ai";
import { toast } from 'react-toastify';

const Appointment_Form = ({ setOpen, fetchAppointments }) => {
  const [loading,setLoading]=useState(false)
  const user = useSelector(state => state.user.user);
  const [data, setData] = useState({
    doctor_name: "",
    status: "pending",
    patient_id: ""
  });

  const handleOpen = () => {
    setOpen(false);  // Close the modal
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const response = await axios.post('http://localhost:3000/api/medicare/appointment/create-appointment',
        {
          doctor_name: data.doctor_name,
          status: "pending",
          patient_id: user.data?.id
        },
        {
          withCredentials: true
        }
      );
      if (response) {
        console.log(response);
        handleOpen()
        setLoading(false)
        fetchAppointments();
        toast.success('Appointment Created !', {
            className: 'custom-toast',
          });
      }
    } catch (error) {
      console.log(error);
      setLoading(false)
      toast.success('Something went wrong !', {
        className: 'custom-toast',
      });
    }
  }

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    console.log(data);
  };

  return (
    <div className="absolute w-full h-full top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="w-[400px] bg-white p-6 rounded-md shadow-lg relative">
        <p className="text-center py-2 mb-4 font-semibold text-lg">Add Appointment</p>
        <AiFillCloseCircle onClick={handleOpen} className='absolute right-3 top-3 cursor-pointer text-lg' />
        <form className="flex flex-col space-y-4">
          {/* Doctor Selection */}
          <div>
            <label htmlFor="doctor" className="block mb-2 text-sm font-medium text-gray-700">
              Select Doctor
            </label>
            <select
              onChange={handleOnChange}
              id="doctor"
              value={data.doctor_name} // Bind to state variable 'doctor_name'
              name="doctor_name"
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a Doctor</option>  {/* Empty option for default */}
              <option value="Dr. Nuwan Perera">Dr. Nuwan Perera</option>
              <option value="Dr. Amali Jayasinghe">Dr. Amali Jayasinghe</option>
              <option value="Dr. Tharindu Fernando">Dr. Tharindu Fernando</option>
              <option value="Dr. Lasantha Wickramasinghe">Dr. Lasantha Wickramasinghe</option>
            </select>
          </div>
          {/* Mobile Number Input */}
          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
              Enter Mobile Number
            </label>
            <input
              type="text"
              name="mobile"
              placeholder='Enter contact number'
              id="mobile"
              value={data.mobile}
              onChange={handleOnChange}
              className="w-full px-3 py-2 border mb-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
           {
             loading?'Loading':'Submit'
           } 
          </button>
        </form>
      </div>
    </div>
  );
};

export default Appointment_Form;
