import React from 'react'
import { Outlet } from 'react-router-dom'
import '../css/dashboardLayout.css'
import { MdEmail } from "react-icons/md";
import { IoCall } from "react-icons/io5";
import { RiLogoutCircleRLine } from "react-icons/ri";
import axios from "axios"
import { server_url } from '../App';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCurrentUserData } from '../redux/user.slice';

const OnBoard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async ()=>{
      try {
      const response  = await axios.post(`${server_url}/api/auth/logout`, {}, {withCredentials : true})
      dispatch(setCurrentUserData(null))
      navigate("/")
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  return (
    <>
      
    <div className='onboard'>
         <main className='p-6'>
            <section className='upper border'>
                <div className="logo">
            {/* <img src="/Images/final logo.png" alt="logo" className='img-fluid'/> */}
           <h2 className="navbar-brand">
                       Fixkar
                     </h2>
        </div>
           <div className='d-flex gap-4'>
             <span className='text-primary'><IoCall/> +10 92 92988 28</span> 
            <span className='text-primary'><MdEmail/> @fixkar.com</span>
            <span className='text-danger' role='button' onClick={handleLogout}><RiLogoutCircleRLine/></span>
           </div>
        </section>
        <div className='outlets'>
          <Outlet/>
        </div>
        </main>
    </div>
    </>
  )
}

export default OnBoard
