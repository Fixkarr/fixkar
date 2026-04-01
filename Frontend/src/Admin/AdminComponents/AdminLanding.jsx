import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserShield, FaLock } from "react-icons/fa";

import { useSelector } from "react-redux";

const AdminLanding = () => {

    const navigate = useNavigate();
    const {currentAdmin} = useSelector(state => state.admin);

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
      }}
    >
      <div
        className="card border-0 shadow-lg text-white p-4 text-center"
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(10px)",
          borderRadius: "18px",
        }}
      >
        {/* Icon */}
        <div className="mb-3">
          <FaUserShield size={55} className="text-warning" />
        </div>

        {/* Heading */}
        <h3 className="fw-bold mb-2">Admin Panel</h3>
        <p className="text-light small">
          Secure access required to manage the platform
        </p>

        <hr className="border-secondary" />

        {/* Message */}
        <div className="mb-4">
          <FaLock className="me-2 text-danger" />
          <span>You are not logged in</span>
        </div>

        {/* Buttons */}
        <div className="d-grid gap-3">
          <button
            className="btn btn-warning fw-semibold"
            onClick={() => navigate(`${import.meta.env.VITE_ADMIN_PATH}/login`)}
          >
            Login as Admin
          </button>
        </div>

        {/* Footer Note */}
        <p className="mt-4 small text-secondary">
          Unauthorized access is strictly prohibited.
        </p>
      </div>
    </div>
  );
};

export default AdminLanding;
