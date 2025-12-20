import React from "react";
import { FaExclamationTriangle, FaMobileAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const MobileNotVerified = () => {
    const navigate = useNavigate();
  return (
    <div className="card border-0 shadow-sm rounded-4 p-4 text-center bg-warning-subtle">

      {/* Icon */}
      <div className="mb-3">
        <FaExclamationTriangle size={40} className="text-warning" />
      </div>

      {/* English Message */}
      <h6 className="fw-bold text-dark">
        Mobile Number Not Verified
      </h6>
      <p className="text-muted mb-2">
        Your mobile number is not verified. Please verify your mobile number to
        hire any professional.
      </p>

      <hr />

      {/* Hindi Message */}
      <p className="mb-3 text-secondary">
        आपका मोबाइल नंबर अभी तक verified नहीं है।  
        किसी भी professional को hire करने के लिए पहले अपना मोबाइल नंबर verify करना अनिवार्य है।
      </p>

      {/* Button */}
      <button
        className="btn btn-primary px-4 rounded-pill d-inline-flex align-items-center justify-content-center gap-2"
        onClick={()=>navigate('/customer/verify-mobile')}
      >
        <FaMobileAlt />
        Verify Mobile Number
      </button>

    </div>
  );
};

export default MobileNotVerified;
