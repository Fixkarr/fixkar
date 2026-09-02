import {
  FaMobileAlt,
  FaShieldAlt,
  FaCheckCircle,
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
          width: 100%;
          max-width: 680px;
          margin: 0 auto;
          overflow: hidden;
          border: 1px solid rgba(13, 110, 253, 0.12);
          border-radius: 16px;
          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(13, 110, 253, 0.055),
              transparent 34%
            ),
            #ffffff;
          box-shadow:
            0 12px 35px rgba(15, 23, 42, 0.07),
            0 2px 8px rgba(15, 23, 42, 0.035);
          animation: verifyCardIn 0.35s ease-out;
        }

        .mobile-verify-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(
            90deg,
            #ffc107 0%,
            #0d6efd 55%,
            #6f42c1 100%
          );
        }

        .verify-main {
          padding: 14px 16px;
        }

        .verify-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        /* Icon */
        .verify-icon {
          position: relative;
          width: 44px;
          height: 44px;
          min-width: 44px;
          border-radius: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0d6efd;
          background: linear-gradient(
            145deg,
            #eef5ff,
            #f7faff
          );
          border: 1px solid rgba(13, 110, 253, 0.10);
          box-shadow:
            inset 0 1px 1px rgba(255,255,255,.9),
            0 4px 12px rgba(13, 110, 253, 0.08);
        }

        .verify-icon::after {
          content: "";
          position: absolute;
          right: -2px;
          bottom: -2px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 1px 5px rgba(0,0,0,.08);
        }

        .verify-icon-check {
          position: absolute;
          right: 0px;
          bottom: 0px;
          z-index: 2;
          color: #198754;
          font-size: 9px;
        }

        /* Text */
        .verify-content {
          min-width: 0;
          flex: 1;
        }

        .verify-heading {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 3px;
        }

        .verify-title {
          margin: 0;
          color: #172033;
          font-size: 14px;
          font-weight: 700;
          line-height: 1.25;
          letter-spacing: -0.2px;
        }

        .verify-status {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 7px;
          border-radius: 999px;
          background: #fff8e1;
          color: #a66b00;
          border: 1px solid rgba(255, 193, 7, .15);
          font-size: 9px;
          font-weight: 700;
          white-space: nowrap;
        }

        .verify-description {
          margin: 0;
          color: #70798a;
          font-size: 11.5px;
          line-height: 1.45;
        }

        /* Button */
        .verify-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          min-height: 36px;
          padding: 7px 13px;
          border: 0;
          border-radius: 10px;
          color: #fff;
          background: #0d6efd;
          font-size: 11.5px;
          font-weight: 700;
          white-space: nowrap;
          box-shadow:
            0 5px 14px rgba(13, 110, 253, .20);
          transition:
            transform .18s ease,
            box-shadow .18s ease,
            background .18s ease;
        }

        .verify-button:hover {
          color: #fff;
          background: #0b5ed7;
          transform: translateY(-1px);
          box-shadow:
            0 7px 18px rgba(13, 110, 253, .26);
        }

        .verify-button:active {
          transform: translateY(0);
        }

        .verify-arrow {
          transition: transform .18s ease;
        }

        .verify-button:hover .verify-arrow {
          transform: translateX(2px);
        }

        /* Hindi micro copy */
        .verify-hindi {
          margin-top: 7px;
          margin-left: 56px;
          color: #8a93a3;
          font-size: 9.5px;
          line-height: 1.35;
        }

        /* Footer */
        .verify-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          padding: 6px 12px;
          color: #8992a2;
          background: #fafbfc;
          border-top: 1px solid #edf0f4;
          font-size: 9px;
        }

        .verify-shield {
          color: #198754;
          font-size: 10px;
        }

        @keyframes verifyCardIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Tablet */
        @media (max-width: 640px) {
          .verify-main {
            padding: 13px;
          }

          .verify-row {
            gap: 10px;
          }

          .verify-icon {
            width: 42px;
            height: 42px;
            min-width: 42px;
          }

          .verify-title {
            font-size: 13px;
          }

          .verify-description {
            font-size: 11px;
          }

          .verify-button {
            min-height: 34px;
            padding: 7px 11px;
          }

          .verify-hindi {
            margin-left: 52px;
          }
        }

        /* Mobile */
        @media (max-width: 480px) {
          .mobile-verify-card {
            border-radius: 14px;
          }

          .verify-main {
            padding: 12px;
          }

          .verify-row {
            align-items: flex-start;
          }

          .verify-icon {
            width: 40px;
            height: 40px;
            min-width: 40px;
            border-radius: 11px;
          }

          .verify-heading {
            flex-wrap: wrap;
            gap: 5px;
          }

          .verify-title {
            font-size: 12.5px;
          }

          .verify-description {
            font-size: 10.5px;
          }

          .verify-status {
            font-size: 8px;
            padding: 2px 6px;
          }

          .verify-button {
            align-self: center;
            min-height: 34px;
            padding: 7px 10px;
            font-size: 10.5px;
            gap: 5px;
          }

          .verify-button svg:first-child {
            display: none;
          }

          .verify-hindi {
            margin-left: 50px;
            margin-top: 6px;
            font-size: 9px;
          }

          .verify-footer {
            padding: 5px 8px;
            font-size: 8.5px;
            text-align: center;
          }
        }

        /* Very small phones */
        @media (max-width: 360px) {
          .verify-status {
            display: none;
          }

          .verify-description {
            font-size: 10px;
          }

          .verify-button span {
            display: none;
          }

          .verify-button {
            width: 34px;
            padding: 0;
          }

          .verify-button svg:first-child {
            display: block;
          }

          .verify-hindi {
            margin-left: 50px;
          }
        }
      `}</style>

      <div className="mobile-verify-card">

        <div className="verify-main">

          <div className="verify-row">

            {/* Icon */}
            <div className="verify-icon">
              <FaMobileAlt size={18} />

              <FaCheckCircle className="verify-icon-check" />
            </div>

            {/* Content */}
            <div className="verify-content">

              <div className="verify-heading">

                <h6 className="verify-title">
                  Mobile verification required
                </h6>

                <span className="verify-status">
                  Action required
                </span>

              </div>

              <p className="verify-description">
                Verify your mobile number to start hiring professionals
                securely on Fixkar.
              </p>

            </div>

            {/* CTA */}
            <button
              type="button"
              className="verify-button"
              onClick={() =>
                navigate("/customer/verify-mobile")
              }
            >
              <FaMobileAlt size={11} />

              <span>Verify now</span>

              <IoArrowForward
                className="verify-arrow"
                size={13}
              />
            </button>

          </div>

          <div className="verify-hindi">
            आगे बढ़ने के लिए पहले मोबाइल verification पूरा करें।
          </div>

        </div>

        <div className="verify-footer">
          <FaShieldAlt className="verify-shield" />
          Secure verification • Your number stays protected
        </div>

      </div>
    </>
  );
};

export default MobileNotVerified;

