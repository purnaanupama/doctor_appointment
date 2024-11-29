import React, { useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FaHome } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { HiUsers } from "react-icons/hi2";
import { useSelector } from 'react-redux';

const Admin = () => {
  const user = useSelector(state=>state.user.user);
  const navigate = useNavigate();
  useEffect(()=>{
   if(user?.data?.role !== 'admin'){
     navigate("/")
   }
  },[user])
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-72 bg-gray-800 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-gray-700">
          Admin Panel
        </div>
        <div className="flex-1 p-4 space-y-4">
          {/* Appointments Link */}
          <Link to={'dashboard'} className="block">
            <button className="w-full px-4 py-3 flex items-center gap-4 text-left rounded-md bg-gray-700 hover:bg-gray-600">
              <MdAdminPanelSettings size={20} /> {/* Icon size for consistency */}
              <span>Appointments</span>
            </button>
          </Link>
          {/* Users Link */}
          <Link to={'user'} className="block">
            <button className="w-full px-4 py-3 flex items-center gap-4 text-left rounded-md bg-gray-700 hover:bg-gray-600">
              <HiUsers size={20} />
              <span>Users</span>
            </button>
          </Link>
          {/* Back to Home Link */}
          <Link to={'/'} className="block">
            <button className="w-full px-4 py-3 flex items-center gap-4 text-left rounded-md bg-gray-700 hover:bg-gray-600">
              <FaHome size={20} />
              <span>Back to Home</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;

