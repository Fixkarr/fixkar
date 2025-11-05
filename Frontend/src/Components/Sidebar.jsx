import React, { useState } from 'react'
import '../css/sidebar.css'
import { GoHome } from "react-icons/go";
import { FaRegAddressBook } from "react-icons/fa6";
import { IoConstructOutline } from "react-icons/io5";
import { FaRegBell } from "react-icons/fa";
import { FiMessageSquare } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { MdOutlineEngineering } from "react-icons/md";
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className='sidebar border'>
        <div className="logo">
            {/* <img src="/Images/final logo.png" alt="logo" className='img-fluid'/> */}
           <h2 className="navbar-brand">
                       Fixkar
                     </h2>
        </div>
        <div className='links'>
            <ul>
                <li><NavLink  to="/customer/home"><GoHome /><span className='hide'>Home</span></NavLink></li>
                <li><NavLink to="/customer/bookings"><FaRegAddressBook /><span className='hide'> My Bookings</span></NavLink></li>
                <li><NavLink to="/customer/hire-professionals"><MdOutlineEngineering /> <span className='hide'>Hire Professionals</span></NavLink></li>
                <li><NavLink to="/customer/notifications"><FaRegBell /> <span className='hide'>Notifications</span></NavLink></li>
                <li><NavLink to="/customer/contact"><FiMessageSquare /> <span className='hide'>Contact</span></NavLink></li>
                <li><NavLink to="/customer/profile"><CgProfile /> <span className='hide'>Profile</span></NavLink></li>
            </ul>
        </div>
    </div>
  )
}

export default Sidebar
