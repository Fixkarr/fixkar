import React from "react";
import { FaExclamationTriangle, FaMobileAlt, FaShieldAlt } from "react-icons/fa";
import { IoArrowForward } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const MobileNotVerified = () => {
  const navigate = useNavigate();

  return (
    <div className="card border-0 shadow-lg rounded-4 overflow-hidden">

      {/* ===== Header ===== */}
      <div
        className="p-4 text-white text-center"
        style={{
          background: "linear-gradient(135deg, #ffc107, #ffda6a)",
        }}
      >
        <FaExclamationTriangle size={42} className="mb-2" />
        <h5 className="fw-bold mb-0">Action Required</h5>
        <small className="opacity-75">
          Mobile verification pending
        </small>
      </div>

      {/* ===== Body ===== */}
      <div className="card-body p-4 text-center bg-light">

        {/* Icon */}
        <div className="mb-3">
          <FaShieldAlt size={36} className="text-warning" />
        </div>

        {/* English */}
        <h6 className="fw-bold text-dark">
          Mobile Number Not Verified
        </h6>
        <p className="text-muted mb-3">
          Your mobile number is not verified yet.  
          Please verify it to hire any professional on Fixkar.
        </p>

        <hr />

        {/* Hindi */}
        <p className="text-secondary mb-4 small">
          आपका मोबाइल नंबर अभी तक <b>verify</b> नहीं है।  
          किसी भी professional को hire करने के लिए  
          पहले अपना मोबाइल नंबर verify करना अनिवार्य है।
        </p>

        {/* Button */}
        <button
          className="btn btn-primary px-4 rounded-pill d-inline-flex align-items-center gap-2 fw-semibold"
          onClick={() => navigate("/customer/verify-mobile")}
        >
          <FaMobileAlt />
          Verify Mobile Number
          <IoArrowForward />
        </button>
      </div>

      {/* ===== Footer ===== */}
      <div className="bg-warning-subtle text-center py-2 small text-muted">
        Secure verification helps keep Fixkar safe 🔒
      </div>
    </div>
  );
};

export default MobileNotVerified;
