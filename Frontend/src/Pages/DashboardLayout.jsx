import React from 'react'
import Sidebar from '../Components/Sidebar'
import { Outlet } from 'react-router-dom'
import '../css/dashboardLayout.css'
import { MdEmail } from "react-icons/md";
import { IoCall } from "react-icons/io5";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { toast, ToastContainer } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setCurrentUserData } from '../redux/user.slice';
import { useNavigate } from 'react-router-dom';
import { server_url } from '../App';
import axios from 'axios'
import { IoMdArrowRoundBack } from "react-icons/io";

const DashboardLayout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

   const handleLogout = async ()=>{
      try {
      await axios.post(`${server_url}/api/auth/logout`, {}, {withCredentials : true})
      dispatch(setCurrentUserData(null))
      navigate("/")
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }
  return (
    <>
      <div className='dashboardLayout'>
        <Sidebar />

        <main className='p-2'>
            <section className='upper border p-2'>
              <div className='d-flex align-items-center gap-2' role='button' onClick={()=>navigate(-1)}>
                <span className='text-primary'> <IoMdArrowRoundBack/></span>
                <span className='text-primary'> Back</span>
              </div>
               <div className='upper p-2'>
                 <span className='text-primary'><IoCall/> +10 92 92988 28</span> 
                <span className='text-primary'><MdEmail/> @fixkar.com</span>
                <span className='text-danger' role='button' onClick={handleLogout}><RiLogoutCircleRLine/></span>
               </div>
            </section>
            <Outlet />
        </main>
      </div>
    </>
  )
}

export default DashboardLayout
