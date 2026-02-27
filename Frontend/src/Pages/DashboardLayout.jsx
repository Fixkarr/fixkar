import React, { useState } from "react";
import Sidebar from "../Components/Sidebar";
import { Outlet } from "react-router-dom";

import "../css/sidebar.css";
import { MdEmail } from "react-icons/md";
import { IoCall } from "react-icons/io5";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUserData } from "../redux/user.slice";
import { useNavigate } from "react-router-dom";
import { server_url } from "../App";
import axios from "axios";
import { IoMdArrowRoundBack } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";


const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { currentUserData } = useSelector(state => state.user);
  const isAuthenticated = Boolean(currentUserData?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {currentAdmin} = useSelector(state=>state.admin);
  const handleLogout = async () => {
    try {
      await axios.post(
        `${server_url}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      dispatch({type : 'LOGOUT'});
      dispatch(setCurrentUserData(null))
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <>  
       {/* {(!isAuthenticated || !currentAdmin) && <Navbar />} */}
      <div className="dashboardLayout d-flex">

           {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      {(isAuthenticated || currentAdmin) && <Sidebar isOpen={isSidebarOpen}  onClose={() => setIsSidebarOpen(false)}/>}


      {/* Main Area */}
      <main className="dashboard-main bg-light">

        {/* ===== Top Bar ===== */}
       {(isAuthenticated || currentAdmin) &&  <section
          className="dashboard-topbar"
           style={{
              background: `linear-gradient(135deg, ${currentAdmin ? '#0f2027' : '#0d6efd'}, ${currentAdmin ? '#2c5364' : '#4f9cff'})`,
              fontSize : "1vmax" 
            }}  
        >
          {/* Gradient Header */}
          <div
            className="px-2 py-2 text-white d-flex align-items-center flex-wrap gap-3"
            style={{
              background: `linear-gradient(135deg, ${currentAdmin ? '#0f2027' : '#0d6efd'}, ${currentAdmin ? '#2c5364' : '#4f9cff'})`,
              fontSize : "1vmax" 
            }}  
          >

            <GiHamburgerMenu
            size={18}
            role="button"
           onClick={() => setIsSidebarOpen(true)}
          />

            {/* Back Button */}
           

            {/* Right Info */}
            <div className="d-flex align-items-center gap-4 flex-wrap">
               <div
              className="d-flex align-items-center gap-2 fw-semibold"
              role="button"
              onClick={() => navigate(-1)}
            >
              <IoMdArrowRoundBack size={18} />
              <span>Back</span>
            </div>

              <span className="d-flex align-items-center gap-1 small">
                <IoCall size={16} />
                +10 92 92988 28
              </span>

              <span className="d-flex align-items-center gap-1 small">
                <MdEmail size={16} />
                support@fixkar.com
              </span>

              <span
                role="button"
                onClick={handleLogout}
                className="d-flex align-items-center gap-1 text-warning fw-semibold"
              >
                <RiLogoutCircleRLine/>
                Logout
              </span>
            </div>
          </div>
        </section>}

        {/* ===== Page Content ===== */}
        <div className="card border-0 shadow-sm rounded-4 p-1">
          <Outlet />
        </div>

      </main>
    </div>
    </>
  );
};

export default DashboardLayout;
