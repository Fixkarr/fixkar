import React from "react";
import { FaHeadset, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const NeedHelp = () => {
  const navigate = useNavigate();

  return (
    <div
      className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg,#0d6efd 0%, #b8cef3 60%, #f9fafc 100%)",
      }}
    >
      <div className="card-body p-4 text-white d-flex flex-column justify-content-between">
        <div>
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle bg-white bg-opacity-25 mb-3"
            style={{ width: 60, height: 60 }}
          >
            <FaHeadset size={28} />
          </div>

          <h5 className="fw-bold mb-2">
            Need Help?
          </h5>

          <p
            className="mb-0"
            style={{ opacity: 0.9 }}
          >
            Have any questions or facing an issue?
            Our support team is always ready to help you.
          </p>
        </div>

        <button
          onClick={() => navigate("/professional/contact")}
          className="btn btn-light rounded-pill fw-semibold mt-4 d-flex align-items-center justify-content-center gap-2"
        >
          Contact Support
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default NeedHelp;