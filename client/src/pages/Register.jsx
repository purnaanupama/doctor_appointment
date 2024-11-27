import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReCAPTCHA from 'react-google-recaptcha'; // Import reCAPTCHA component
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';
import logo from '../assets/logo.jpg';

const Register = () => {
  const [registerData, setRegisterData] = useState({});
  const [captchaToken, setCaptchaToken] = useState(''); // Store reCAPTCHA token
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token); // Set reCAPTCHA token when solved
  };

  const validatePassword = (password) => {
    const validations = [
      { regex: /[A-Z]/, error: 'Password must include at least one uppercase letter' },
      { regex: /[a-z]/, error: 'Password must include at least one lowercase letter' },
      { regex: /^.{8,20}$/, error: 'Password must be between 8 and 20 characters long' },
      { regex: /[#@%&!]/, error: 'Password must include at least one special character (#, @, %, &, or !)' },
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

    if (registerData.password !== registerData.confirm_password) {
      return setError('Passwords do not match');
    }

    const requiredFields = ['username', 'email', 'mobileNumber', 'password', 'confirm_password'];
    const emptyFields = requiredFields.filter(
      (field) => !registerData[field] || registerData[field].trim() === ''
    );

    if (emptyFields.length > 0) {
      return setError('All fields are required');
    }

    const passwordError = validatePassword(registerData.password);
    if (passwordError) {
      return setError(passwordError);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email)) {
      return setError('Invalid email');
    }

    if (!/^[0-9]+$/.test(registerData.mobileNumber)) {
      return setError('Only numbers are allowed in the mobile number field');
    }

    if (!/^0[0-9]{9}$/.test(registerData.mobileNumber)) {
      return setError('Invalid mobile number format');
    }

    // Validate reCAPTCHA
    if (!captchaToken) {
      return setError('Please complete the reCAPTCHA');
    }

    const { confirm_password, ...rest } = registerData;

    try {
      setLoading(true);
      const response = await axios.post(
        'http://localhost:3000/api/medicare/user/register',
        { ...rest, captchaToken }, // Include reCAPTCHA token in the payload
        {
          withCredentials: true,
        }
      );
      setLoading(false);
      toast.success('Registered Successfully!', {
        className: 'custom-toast',
      });
      navigate('/');
      console.log(response.data.message);
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || 'Registration failed', {
        className: 'custom-toast',
      });
    }
  };

  return (
    <div className="register-bg flex justify-center items-center h-screen bg-cover bg-center">
      <img className="absolute top-10 left-10 w-[250px]" src={logo} alt="" />
      <div className="glass-card flex flex-col w-[500px] items-center gap-6 p-10 rounded-md">
        <p className="font-semibold text-lg">Get Started</p>
        <form className="flex flex-col gap-6 w-full items-center" onSubmit={handleSubmit}>
          <input
            className="py-2 px-4 w-full rounded-md outline-none bg-white bg-opacity-60 text-black placeholder-gray-500"
            type="text"
            placeholder="Enter your name"
            value={registerData.username || ''}
            name="username"
            onChange={handleOnChange}
          />
          <input
            className="py-2 px-4 w-full rounded-md outline-none bg-white bg-opacity-60 text-black placeholder-gray-500"
            type="email"
            placeholder="Enter email address"
            value={registerData.email || ''}
            name="email"
            onChange={handleOnChange}
          />
          <input
            className="py-2 px-4 w-full rounded-md outline-none bg-white bg-opacity-60 text-black placeholder-gray-500"
            type="tel"
            placeholder="Enter phone number"
            value={registerData.mobileNumber || ''}
            name="mobileNumber"
            onChange={handleOnChange}
          />
          <input
            className="py-2 px-4 w-full rounded-md outline-none bg-white bg-opacity-60 text-black placeholder-gray-500"
            type="password"
            placeholder="Enter password"
            value={registerData.password || ''}
            name="password"
            onChange={handleOnChange}
          />
          <input
            className="py-2 px-4 w-full rounded-md outline-none bg-white bg-opacity-60 text-black placeholder-gray-500"
            type="password"
            placeholder="Confirm password"
            value={registerData.confirm_password || ''}
            name="confirm_password"
            onChange={handleOnChange}
          />
          <ReCAPTCHA
            sitekey={import.meta.env.VITE_RECAPCHA_SITE_KEY} // Replace with your reCAPTCHA site key
            onChange={handleCaptchaChange}
          />
          <button
            className="w-[200px] rounded-md bg-[#333d6a] bg-opacity-80 text-white py-2 px-6 hover:bg-opacity-50"
            type="submit"
          >
            {loading ? 'Loading...' : 'Register'}
          </button>
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
        {error && (
          <p className="bg-red-200 bg-opacity-60 w-full py-2 text-center border border-red-500 rounded-md text-red-700">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default Register;
