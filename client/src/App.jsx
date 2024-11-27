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

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Access the navigation function

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/medicare/user/current-user', {
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
        </Routes>
    </Context.Provider>
  );
};

export default App;
