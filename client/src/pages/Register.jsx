import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css'; 
import logo from '../assets/logo.jpg'


const Register = () => {
  const [registerData, setRegisterData] = useState({});
  const [error, setError] = useState("");
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  
  //password validator
  const validatePassword = (password) => {
    const validations = [
      {
        regex: /[A-Z]/,
        error: "Password must include at least one uppercase letter",
      },
      {
        regex: /[a-z]/,
        error: "Password must include at least one lowercase letter",
      },
      {
        regex: /^.{8,20}$/,
        error: "Password must be between 8 and 20 characters long",
      },
      {
        regex: /[#@%&!]/,
        error: "Password must include at least one special character (#, @, %, &, or !)",
      },
    ];

    for (let validation of validations) {
      if (!validation.regex.test(password)) {
        return validation.error;
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    // Check if password and confirm password match
    if (registerData.password !== registerData.confirm_password) {
      return setError("Passwords do not match");
    }

    // Check if all required fields are present and not empty
    const requiredFields = ['username', 'email', 'mobileNumber', 'password', 'confirm_password'];
    const emptyFields = requiredFields.filter(
      (field) => !registerData[field] || registerData[field].trim() === ''
    );

    if (emptyFields.length > 0) {
      return setError("All fields are required");
    }

    // Validate password
    const passwordError = validatePassword(registerData.password);
    if (passwordError) {
      return setError(passwordError);
    }

    //Check email 
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email)){
        return setError("Invalid email");  
    }

    // Validate mobile number contains only numbers
    if (!/^[0-9]+$/.test(registerData.mobileNumber)) {
      return setError("Only numbers are allowed in the mobile number field");
    }

    // Validate mobile number format (exactly 10 digits, starting with 0)
    if (!/^0[0-9]{9}$/.test(registerData.mobileNumber)) {
      return setError("Invalid mobile number format");
    }

    // Destructure to remove confirm_password
    const { confirm_password, ...rest } = registerData;
    try {
        setLoading(true)
         const response = await axios.post(
        'http://localhost:3000/api/medicare/user/register',
        { ...rest },
        {
          withCredentials: true,
        }
      );
       setLoading(false)
       toast.success("Registered Successfully !", {
        className: 'custom-toast',
       });
       navigate("/");
       console.log(response.data.message);
     } catch (error) {
      setLoading(false)
      toast.error(error.response.data.message, {
        className: 'custom-toast',
       });
     }
  };

  return (
    <div className="register-bg flex justify-center items-center h-screen bg-cover bg-center">
     <img className="absolute top-10 left-10 w-[250px]" src={logo} alt="" />
      <div className="glass-card flex flex-col w-[500px]  items-center gap-6 p-10 rounded-md">
        <p className="font-semibold text-lg">Get Started</p>
        <form className="flex flex-col gap-6 w-full items-center" onSubmit={handleSubmit}>
          <input
            className="py-2 px-4 w-full rounded-md outline-none bg-white bg-opacity-60 text-black placeholder-gray-500"
            type="text"
            placeholder="Enter your name"
            value={registerData.username || ""}
            name="username"
            onChange={handleOnChange}
          />
          <input
            className="py-2 px-4 w-full rounded-md outline-none bg-white bg-opacity-60 text-black placeholder-gray-500"
            type="email"
            placeholder="Enter email address"
            value={registerData.email || ""}
            name="email"
            onChange={handleOnChange}
          />
          <input
            className="py-2 px-4 w-full rounded-md outline-none bg-white bg-opacity-60 text-black placeholder-gray-500"
            type="tel"
            placeholder="Enter phone number"
            value={registerData.mobileNumber || ""}
            name="mobileNumber"
            onChange={handleOnChange}
          />
          <input
            className="py-2 px-4 w-full rounded-md outline-none bg-white bg-opacity-60 text-black placeholder-gray-500"
            type="password"
            placeholder="Enter password"
            value={registerData.password || ""}
            name="password"
            onChange={handleOnChange}
          />
          <input
            className="py-2 px-4 w-full rounded-md outline-none bg-white bg-opacity-60 text-black placeholder-gray-500"
            type="password"
            placeholder="Confirm password"
            value={registerData.confirm_password || ""}
            name="confirm_password"
            onChange={handleOnChange}
          />
          <button className="w-[200px] rounded-md bg-[#333d6a] bg-opacity-80 text-white py-2 px-6 hover:bg-opacity-50" type="submit">
            {loading ?'Loading':'Register'}
          </button>
          <p>Already have an account ? <Link to={'/login'}>Login</Link></p>
        </form>
        {error && (
          <p
            className="bg-red-200 bg-opacity-60 w-full py-2 text-center border border-red-500 rounded-md text-red-700"
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default Register;