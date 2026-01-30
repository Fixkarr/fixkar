import React from "react";
import { Outlet } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { IoCall } from "react-icons/io5";
import { RiLogoutCircleRLine } from "react-icons/ri";
import axios from "axios";
import { server_url } from "../App";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentUserData } from "../redux/user.slice";

const OnBoard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${server_url}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      dispatch(setCurrentUserData(null));
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="min-vh-100 bg-light">

      {/* ===== Top Header ===== */}
      <header
        className="px-4 py-3 text-white shadow-sm"
        style={{
          background: "linear-gradient(135deg, #0d6efd, #4f9cff)",
        }}
      >
        <div className="container-fluid d-flex justify-content-between align-items-center flex-wrap gap-3">

          {/* Logo */}
          <div className="d-flex align-items-center gap-2">
            <h3 className="fw-bold m-0">Fixkar</h3>
            <span className="badge bg-white text-primary fw-semibold">
              Onboarding
            </span>
          </div>

          {/* Contact + Logout */}
          <div className="d-flex align-items-center gap-4 flex-wrap">
            <span className="d-flex align-items-center gap-1 small">
              <IoCall />
              +10 92 92988 28
            </span>

            <span className="d-flex align-items-center gap-1 small">
              <MdEmail />
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
      </header>

      {/* ===== Content Area ===== */}
      <main className="container my-4">
        <div className="card border-0 shadow-sm rounded-4 p-3">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default OnBoard;
