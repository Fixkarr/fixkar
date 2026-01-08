import React from "react";
import Sidebar from "../Components/Sidebar";
import { Outlet } from "react-router-dom";
import "../css/dashboardLayout.css";
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

const DashboardLayout = () => {
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
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="dashboardLayout d-flex">

      {/* Sidebar */}

        <Sidebar />


      {/* Main Area */}
      <main className="flex-grow-1 p-1 bg-light">

        {/* ===== Top Bar ===== */}
        <section
          className="card border-0 shadow-sm rounded-4 mb-3 overflow-hidden"
        >
          {/* Gradient Header */}
          <div
            className="px-4 py-1 text-white d-flex align-items-center flex-wrap gap-3"
            style={{
              background: `linear-gradient(135deg, ${currentAdmin ? '#0f2027' : '#0d6efd'}, ${currentAdmin ? '#2c5364' : '#4f9cff'})`,
            }}
          >
            {/* Back Button */}
            <div
              className="d-flex align-items-center gap-2 fw-semibold"
              role="button"
              onClick={() => navigate(-1)}
            >
              <IoMdArrowRoundBack size={18} />
              <span>Back</span>
            </div>

            {/* Right Info */}
            <div className="d-flex align-items-center gap-4 flex-wrap">
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
                <RiLogoutCircleRLine size={18} />
                Logout
              </span>
            </div>
          </div>
        </section>

        {/* ===== Page Content ===== */}
        <div className="card border-0 shadow-sm rounded-4 p-1">
          <Outlet />
        </div>

      </main>
    </div>
  );
};

export default DashboardLayout;
