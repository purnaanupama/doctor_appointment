import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import { ToastContainer } from 'react-toastify';
import {useDispatch} from 'react-redux'
import { setUserDetails } from './store/userSlice';
import axios from 'axios';
import { useEffect } from 'react';
import Context from './context/context';


const App = () => {
  const dispatch = useDispatch();
  const fetchUserDetails = async()=>{
    try {
     const response = await axios.get('http://localhost:3000/api/medicare/user/current-user', {
      withCredentials:true
    }) 
    dispatch(setUserDetails(response.data))
    console.log(response.data);
    } catch (error) {
     console.log(error);
    }
}
useEffect(()=>{
  fetchUserDetails();

},[])

  return (
    <Context.Provider value={{fetchUserDetails}}>
    <BrowserRouter>
      <ToastContainer/>
         <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
         </Routes>
    </BrowserRouter>
    </Context.Provider>
   
  )
}

export default App;