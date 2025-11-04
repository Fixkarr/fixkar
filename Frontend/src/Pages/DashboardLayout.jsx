import React from 'react'
import Sidebar from '../Components/Sidebar'
import { Outlet } from 'react-router-dom'
import '../css/dashboardLayout.css'
import { MdEmail } from "react-icons/md";
import { IoCall } from "react-icons/io5";
const DashboardLayout = () => {
  return (
    <>
      <div className='dashboardLayout'>
        <Sidebar/>
        <main className='p-6'>
            <section className='upper border'>
                <span className='text-primary'><IoCall/> +10 92 92988 28</span> 
                <span className='text-primary'><MdEmail/> @fixkar.com</span>
            </section>
            <Outlet/>
        </main>
      </div>
    </>
  )
}

export default DashboardLayout
