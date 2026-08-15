import React from "react";
import {
  FaExclamationTriangle,
  FaMobileAlt,
  FaShieldAlt,
} from "react-icons/fa";
import { IoArrowForward } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const MobileNotVerified = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        .mobile-verify-card {
          position: relative;
          max-width: 680px;
          margin: 0 auto;
          border: 1px solid rgba(13, 110, 253, 0.10) !important;
          border-radius: 18px !important;
          background: rgba(255, 255, 255, 0.96);
          box-shadow:
            0 10px 35px rgba(20, 35, 70, 0.08),
            0 2px 8px rgba(20, 35, 70, 0.04);
          overflow: hidden;
          animation: verifyCardIn 0.45s ease-out;
        }

        .mobile-verify-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(
            90deg,
            #ffc107,
            #ffca2c,
            #0d6efd
          );
        }

        .verify-content {
          padding: 18px 20px !important;
        }

        .verify-icon {
          width: 48px;
          height: 48px;
          flex: 0 0 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          color: #e39b00;
          background: linear-gradient(
            135deg,
            #fff8dc,
            #fff1b8
          );
          box-shadow: inset 0 0 0 1px rgba(255, 193, 7, 0.12);
          animation: iconFloat 2.8s ease-in-out infinite;
        }

        .verify-title {
          font-size: 15px;
          line-height: 1.25;
          color: #172033;
          letter-spacing: -0.15px;
        }

        .verify-description {
          font-size: 12.5px;
          line-height: 1.5;
          color: #6c757d;
          max-width: 500px;
        }

        .verify-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 9px;
          border-radius: 50px;
          background: #fff8df;
          color: #a66b00;
          font-size: 10px;
          font-weight: 600;
          white-space: nowrap;
        }

        .verify-action {
          min-height: 38px;
          padding: 8px 15px !important;
          border-radius: 10px !important;
          font-size: 12px;
          box-shadow: 0 5px 15px rgba(13, 110, 253, 0.18);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .verify-action:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(13, 110, 253, 0.25);
        }

        .verify-action:active {
          transform: translateY(0);
        }

        .verify-footer {
          padding: 7px 15px;
          background: #f8fafc;
          border-top: 1px solid #edf0f4;
          color: #7b8492;
          font-size: 10.5px;
        }

        .verify-shield {
          color: #198754;
          font-size: 11px;
        }

        @keyframes verifyCardIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes iconFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        @media (max-width: 576px) {
          .mobile-verify-card {
            border-radius: 15px !important;
          }

          .verify-content {
            padding: 14px !important;
          }

          .verify-icon {
            width: 42px;
            height: 42px;
            flex-basis: 42px;
            border-radius: 12px;
          }

          .verify-title {
            font-size: 14px;
          }

          .verify-description {
            font-size: 11.5px;
          }

          .verify-action {
            width: 100%;
            justify-content: center;
          }

          .verify-badge {
            font-size: 9px;
          }
        }
      `}</style>

      <div className="mobile-verify-card card border-0">

        {/* Compact Main Content */}
        <div className="verify-content card-body">

          <div className="d-flex align-items-center gap-3">

            {/* Icon */}
            <div className="verify-icon">
              <FaMobileAlt size={21} />
            </div>

            {/* Content */}
            <div className="flex-grow-1 min-width-0">

              <div className="d-flex align-items-center justify-content-between gap-2 mb-1">
                <h6 className="verify-title fw-bold mb-0">
                  Mobile verification required
                </h6>

                <span className="verify-badge">
                  <FaExclamationTriangle size={9} />
                  Action Required
                </span>
              </div>

              <p className="verify-description mb-0">
                Verify your mobile number to securely hire professionals
                on Fixkar.
              </p>

            </div>

            {/* Button */}
            <button
              type="button"
              className="verify-action btn btn-primary d-inline-flex align-items-center gap-2 fw-semibold flex-shrink-0"
              onClick={() => navigate("/customer/verify-mobile")}
            >
              <FaMobileAlt size={12} />
              <span>Verify</span>
              <IoArrowForward size={14} />
            </button>

          </div>

          {/* Hindi micro-copy */}
          <div className="mt-2 ms-sm-5 ps-sm-2">
            <small className="text-muted" style={{ fontSize: "10.5px" }}>
              आपका मोबाइल नंबर verify नहीं है। आगे बढ़ने के लिए पहले
              verification पूरा करें।
            </small>
          </div>

        </div>

        {/* Compact Footer */}
        <div className="verify-footer d-flex align-items-center justify-content-center gap-1">
          <FaShieldAlt className="verify-shield" />
          Secure verification keeps your Fixkar account protected
        </div>

      </div>
    </>
  );
};

export default MobileNotVerified;