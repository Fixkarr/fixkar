import React, { useState } from "react";
import Sidebar from "../Components/Sidebar";
import { Outlet, useLocation } from "react-router-dom";

import "../css/sidebar.css";
import { MdEmail } from "react-icons/md";
import { IoCall } from "react-icons/io5";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUserData } from "../redux/user.slice";
import { useNavigate } from "react-router-dom";
import { server_url } from "../App";
import axios from "axios";
import { IoMdArrowRoundBack } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { currentUserData } = useSelector((state) => state.user);
  const { currentAdmin } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const adminpath = import.meta.env.VITE_ADMIN_PATH;
  const isAdminRoute =
    location.pathname === adminpath ||
    location.pathname.startsWith(`${adminpath}/`);

  // Admin state is only meaningful on admin URLs. This prevents a stale
  // admin Redux value from changing the professional/customer dashboard UI.
  const isAdminAuthenticated = Boolean(isAdminRoute && currentAdmin);
  const isUserAuthenticated = Boolean(!isAdminRoute && currentUserData?.user);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${server_url}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      // Continue clearing client state even if the logout request fails.
    } finally {
      dispatch({ type: "LOGOUT" });
      dispatch(setCurrentUserData(null));
      navigate("/");
    }
  };

  return (
    <>
      <div className="dashboardLayout d-flex">
        {isSidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        {(isUserAuthenticated || isAdminAuthenticated) && (
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Area */}
        <main className="dashboard-main bg-light">
          {/* ===== Top Bar ===== */}
          {(isUserAuthenticated || isAdminAuthenticated) && (
            <section
              className="dashboard-topbar"
              style={{
                background: `linear-gradient(135deg, ${
                  isAdminAuthenticated ? "#0f2027" : "#0d6efd"
                }, ${isAdminAuthenticated ? "#2c5364" : "#4f9cff"})`,
                fontSize: "1vmax",
              }}
            >
              <div
                className="px-2 py-2 text-white d-flex align-items-center flex-wrap gap-3"
                style={{
                  background: `linear-gradient(135deg, ${
                    isAdminAuthenticated ? "#0f2027" : "#0d6efd"
                  }, ${isAdminAuthenticated ? "#2c5364" : "#4f9cff"})`,
                  fontSize: "1vmax",
                }}
              >
                <GiHamburgerMenu
                  size={18}
                  role="button"
                  onClick={() => setIsSidebarOpen(true)}
                />

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
                    +91 8795213106
                  </span>

                  <span className="d-flex align-items-center gap-1 small">
                    <MdEmail size={16} />
                    info@fixkarr.com
                  </span>

                  <span
                    role="button"
                    onClick={handleLogout}
                    className="d-flex align-items-center gap-1 text-warning fw-semibold"
                  >
                    <RiLogoutCircleRLine />
                    Logout
                  </span>
                </div>
              </div>
            </section>
          )}

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
