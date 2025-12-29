import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaClock, FaShieldAlt } from "react-icons/fa";
import { MdOutlinePendingActions } from "react-icons/md";

const Pending = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3">
      <div
        className="card border-0 shadow-lg rounded-4 overflow-hidden"
        style={{ maxWidth: "460px", width: "100%" }}
      >
        {/* ===== Header ===== */}
        <div
          className="p-4 text-white text-center"
          style={{
            background: "linear-gradient(135deg, #0d6efd, #6ea8fe)",
          }}
        >
          <MdOutlinePendingActions size={48} className="mb-2" />
          <h4 className="fw-bold mb-1">Application Under Review</h4>
          <small className="opacity-75">
            Please wait while we verify your details
          </small>
        </div>

        {/* ===== Body ===== */}
        <div className="card-body text-center p-4">

          {/* Status Badge */}
          <span className="badge bg-warning text-dark px-3 py-2 rounded-pill mb-3">
            <FaClock className="me-1" />
            Pending Verification
          </span>

          <p className="text-muted mb-4">
            Your application is currently being reviewed by our team.  
            This usually takes a short time. Once approved, you’ll be able
            to start receiving work requests.
          </p>

          {/* Spinner */}
          <div className="d-flex justify-content-center mb-3">
            <div
              className="spinner-border text-primary"
              role="status"
              style={{ width: "2.5rem", height: "2.5rem" }}
            ></div>
          </div>

          {/* Trust Message */}
          <div className="d-flex align-items-center justify-content-center gap-2 text-muted small">
            <FaShieldAlt className="text-success" />
            Your information is securely verified by Fixkar
          </div>
        </div>

        {/* ===== Footer ===== */}
        <div className="bg-light text-center py-3 small text-muted">
          Thank you for choosing <strong>Fixkar</strong>.  
          We appreciate your patience 🙏
        </div>
      </div>
    </div>
  );
};

export default Pending;
