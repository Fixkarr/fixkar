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

const DashboardLayout = () => {
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
      <div className='dashboardLayout'>
        <Sidebar/>
        <main className='p-6'>
            <section className='upper border'>
                <span className='text-primary'><IoCall/> +10 92 92988 28</span> 
                <span className='text-primary'><MdEmail/> @fixkar.com</span>
                <span className='text-danger' role='button' onClick={handleLogout}><RiLogoutCircleRLine/></span>
            </section>
            <Outlet/>
        </main>
      </div>
    </>
  )
}

export default DashboardLayout
