import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReCAPTCHA from 'react-google-recaptcha'; // Import reCAPTCHA component
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';
import logo from '../assets/logo.jpg';

const Login = () => {
  const [data, setData] = useState({
    email: '',
    password: '',
  });
  const [captchaToken, setCaptchaToken] = useState(''); // Store reCAPTCHA token
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token); // Set reCAPTCHA token when solved
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return setError('Please enter a valid email address');
    }

    // Validate password
    if (!data.password || data.password.length < 8) {
      return setError('Password must be at least 8 characters long');
    }

    // Validate reCAPTCHA
    if (!captchaToken) {
      return setError('Please complete the reCAPTCHA');
    }

    setError('');
    setLoading(true);

    console.log({...data, captchaToken})
    try {
      const response = await axios.post(
        'http://localhost:3000/api/medicare/user/login',
        { ...data, captchaToken }, // Include reCAPTCHA token in the payload
        {
          withCredentials: true,
        }
      );
      setLoading(false);
      toast.success('Login successful!', {
        className: 'custom-toast',
      });
      navigate('/');
      console.log(response.data.message);
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || 'Login failed', {
        className: 'custom-toast',
      });
    }
  };

  return (
    <div className="login-bg flex justify-center items-center h-screen bg-cover bg-center">
      <img className="absolute top-10 left-10 w-[250px]" src={logo} alt="" />
      <div className="glass-card flex flex-col w-[500px] items-center gap-6 p-10 rounded-md">
        <p className="font-semibold text-lg">Welcome Back</p>
        <form className="flex flex-col gap-6 w-full items-center" onSubmit={handleSubmit}>
          <input
            className="py-2 px-4 w-full rounded-md outline-none bg-white bg-opacity-60 text-black placeholder-gray-500"
            type="email"
            placeholder="Enter email address"
            value={data.email}
            name="email"
            onChange={handleOnChange}
          />
          <input
            className="py-2 px-4 w-full rounded-md outline-none bg-white bg-opacity-60 text-black placeholder-gray-500"
            type="password"
            placeholder="Enter password"
            value={data.password}
            name="password"
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
            {loading ? 'Loading...' : 'Login'}
          </button>
          <p>
            Don't have an account? <Link to="/register">Register</Link>
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

export default Login;
