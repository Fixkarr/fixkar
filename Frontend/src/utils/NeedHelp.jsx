import React from "react";
import { FaHeadset, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const NeedHelp = ({user}) => {
  const navigate = useNavigate();

  return (
    <div
      className="card border-0 shadow-sm rounded-4"
      style={{
        background:
          "linear-gradient(135deg,#0d6efd,#4f8dfd)",
      }}
    >
      <div className="card-body py-3 px-4 d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <div
            className="rounded-circle bg-white d-flex align-items-center justify-content-center me-3"
            style={{
              width: 42,
              height: 42,
              color: "#0d6efd",
            }}
          >
            <FaHeadset size={18} />
          </div>

          <div className="text-white">
            <h6 className="fw-bold mb-0">
              Need Help?
            </h6>
            <small style={{ opacity: 0.9 }}>
              Contact our support team
            </small>
          </div>
        </div>

        <button
          onClick={() => navigate(`/${user}/contact`)}
          className="btn btn-light btn-sm rounded-pill px-3 fw-semibold d-flex align-items-center gap-2"
        >
          Help
          <FaArrowRight size={12} />
        </button>
      </div>
    </div>
  );
};

export default NeedHelp;