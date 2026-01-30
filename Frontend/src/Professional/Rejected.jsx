import React from "react";

import { MdCancel, MdReplay } from "react-icons/md";
import { FaExclamationTriangle, FaHeadset } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const Rejected = () => {
  const navigate = useNavigate()
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3">
      <div
        className="card border-0 shadow-lg rounded-4 overflow-hidden"
        style={{ maxWidth: "480px", width: "100%" }}
      >
        {/* ===== Header ===== */}
        <div
          className="p-4 text-white text-center"
          style={{
            background: "linear-gradient(135deg, #dc3545, #ff6b6b)",
          }}
        >
          <MdCancel size={50} className="mb-2" />
          <h4 className="fw-bold mb-1">Application Rejected</h4>
          <small className="opacity-75">
            Please review the issues and try again
          </small>
        </div>

        {/* ===== Body ===== */}
        <div className="card-body p-4 text-center">

          {/* Status Badge */}
          <span className="badge bg-danger-subtle text-danger px-3 py-2 rounded-pill mb-3">
            <FaExclamationTriangle className="me-1" />
            Verification Failed
          </span>

          <p className="text-muted mb-4">
            Unfortunately, your application did not meet our verification
            requirements. Don’t worry — you can fix the issues and reattempt
            the onboarding process.
          </p>

          {/* Reattempt Steps */}
          <div className="alert alert-warning text-start small rounded-3">
            <strong className="d-block mb-2">
              Please ensure the following:
            </strong>
            <ul className="mb-0 ps-3">
              <li>All personal details are accurate and updated</li>
              <li>Profile photo is clear, front-facing, and recent</li>
              <li>Uploaded identity document is valid and readable</li>
            </ul>
          </div>

          {/* CTA */}
          <button className="btn btn-danger rounded-pill px-4 fw-semibold mt-3" onClick={()=>navigate('/onboard')}>
            <MdReplay size={18} className="me-1" />
            Reattempt Onboarding
          </button>

          {/* Support */}
          <div className="d-flex align-items-center justify-content-center gap-2 mt-4 small text-muted">
            <FaHeadset className="text-primary" />
            Need help? Contact <strong>Fixkar Support</strong>
          </div>
        </div>

        {/* ===== Footer ===== */}
        <div className="bg-light text-center py-3 small text-muted">
          We’re here to help you succeed on <strong>Fixkar</strong> 💪
        </div>
      </div>
    </div>
  );
};

export default Rejected;
