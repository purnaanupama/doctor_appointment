import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import { ToastContainer } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setUserDetails } from './store/userSlice';
import axios from 'axios';
import { useEffect } from 'react';
import Context from './context/context';
import Admin from './pages/Admin';
import Appointment_Admin from './pages/Appointment_Admin';
import User_Admin from './pages/User_Admin';
import Appointment_Patient from './pages/Appointment_Patient';

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Access the navigation function

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/current-user`, {
        withCredentials: true,
      });
      if (response.data) {
        dispatch(setUserDetails(response.data));
        console.log(response.data);  
      } else {
        // Redirect to login if no user data is found
        navigate('/login');
      }
    } catch (error) {
      console.log(error);
      navigate('/login'); // Redirect to login on error
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <Context.Provider value={{ fetchUserDetails }}>
    <ToastContainer />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<Admin />}>
        {/* Nested route for dashboard inside /admin */}
        <Route path="dashboard" element={<Appointment_Admin />}/>
        <Route path="user" element={<User_Admin />} />
      </Route>
      <Route path='/appointment' element={<Appointment_Patient/>}/>
    </Routes>
</Context.Provider>
  );
};

export default App;
