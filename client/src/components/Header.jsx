import axios from 'axios';
import logo from '../assets/logo.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setUserDetails } from '../store/userSlice.js';
import { toast } from 'react-toastify';
import Context from '../context/context.js';
import { useContext, useEffect } from 'react';

const Header = () => {
    const user = useSelector(state => state.user.user);
    const { fetchUserDetails } = useContext(Context);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleLogout=async()=>{
      try {
       const response = await axios.get('${import.meta.env.VITE_BASE_URL}/user/logout',{
        withCredentials: true,
       })
       console.log(response);
       toast.success('Logout success!', {
        className: 'custom-toast',
      });
       dispatch(setUserDetails(""));
       navigate("/login");
      } catch (error) {
       console.log(error);
      } 
    }
    useEffect(()=>{
      fetchUserDetails();
    },[])
  return (
    <div className="h-[70px] flex items-center justify-between px-6 pr-8 bg-[#004aad] text-white">
      <div>
        <img src={logo} alt="Logo" className="h-[55px] border border-white" />
      </div>
      <div className="flex items-center space-x-4">
        {user.data?.role === 'patient' && 
          <Link to="/appointment"><button className="bg-[#012d68] px-4 py-2 rounded-md hover:bg-[#1e225e]">Appointment</button></Link>
        }
        {user.data?.role === 'admin' &&
          <Link to="/admin"><button className="bg-[#012d68] px-4 py-2 rounded-md hover:bg-[#1e225e]">Admin Panel</button></Link>}
        {user.data?.email ? (
          <button onClick={handleLogout} className="bg-slate-200 text-black px-4 py-2 font-semibold rounded-md hover:bg-slate-300">
            Logout
          </button>
        ) : (
          <Link to="/login">
            <button className="bg-slate-200 text-black px-4 py-2 font-semibold rounded-md hover:bg-slate-300">
            Login
            </button>
          </Link>
        )}
        <p className="font-semibold">{user.data?.username || 'Username'}</p>
      </div>
    </div>
  )
}

export default Header