import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserCheck,
  FaArrowRight,
  FaExclamationCircle,
} from "react-icons/fa";

const CompleteProfileToast = () => {
  const navigate = useNavigate();

  return (
    <div className="alert alert-warning border-0 shadow rounded-4 p-4 mt-3 d-flex flex-column flex-md-row align-items-start align-items-md-center gap-3">
      
      {/* Icon */}
      <div className="bg-warning bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
           style={{ width: "52px", height: "52px" }}>
        <FaExclamationCircle className="text-warning fs-4" />
      </div>

      {/* Content */}
      <div className="flex-grow-1">
        <h5 className="fw-bold mb-1 d-flex align-items-center gap-2">
          <FaUserCheck className="text-primary" />
          Complete Your Profile
        </h5>

        <p className="mb-2 text-dark small">
          Your profile is currently incomplete. Completing your profile helps
          customers understand your services better and significantly increases
          your chances of getting hired.
        </p>

        <ul className="mb-0 ps-3 small text-dark">
          <li>Profile description is missing</li>
          <li>Service charges are not set</li>
          <li>Incomplete profiles receive fewer bookings</li>
        </ul>
      </div>

      {/* CTA */}
      <div className="text-end">
        <button
          onClick={() => navigate("/professional/complete-profile")}
          className="btn btn-primary rounded-pill px-4 d-inline-flex align-items-center gap-2 fw-semibold"
        >
          Complete Now
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default CompleteProfileToast;
