import React from "react";
import { FaClock, FaShieldAlt, FaCheckCircle } from "react-icons/fa";
import { MdOutlinePendingActions } from "react-icons/md";

const Pending = () => {
  return (
    <>
      <style>{`

.fixkar-pending-page {
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px 14px;

  box-sizing: border-box;
}



@media (max-width: 575.98px) {
  .fixkar-pending-page {
    height: 100dvh;
    min-height: 100dvh;

    padding: 8px;
  }

  .pending-card {
    max-height: calc(100dvh - 16px);
  }
}
        /* ================= BACKGROUND ================= */

        .pending-bg {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .pending-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(2px);
        }

        .pending-orb-one {
          width: 300px;
          height: 300px;
          top: -170px;
          left: -100px;

          background:
            radial-gradient(
              circle,
              rgba(13, 110, 253, 0.14),
              transparent 70%
            );
        }

        .pending-orb-two {
          width: 360px;
          height: 360px;
          right: -180px;
          bottom: -180px;

          background:
            radial-gradient(
              circle,
              rgba(25, 135, 84, 0.11),
              transparent 70%
            );
        }

        .pending-grid {
          position: absolute;
          inset: 0;

          opacity: 0.25;

          background-image:
            linear-gradient(
              rgba(13, 110, 253, 0.04) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(13, 110, 253, 0.04) 1px,
              transparent 1px
            );

          background-size: 42px 42px;

          mask-image:
            linear-gradient(
              to bottom,
              black,
              transparent 85%
            );
        }

        /* ================= CARD ================= */

        .pending-card {
          position: relative;
          z-index: 2;
  max-height: calc(100vh - 30px);
          width: 100%;
          max-width: 510px;


          border-radius: 25px;

          background: rgba(255, 255, 255, 0.94);

          border: 1px solid rgba(255, 255, 255, 0.9);

          box-shadow:
            0 25px 70px rgba(15, 23, 42, 0.10);

          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);

          animation: pendingEnter 0.55s ease both;
        }

        .pending-card::before {
          content: "";

          position: absolute;

          top: 0;
          left: 0;
          right: 0;

          height: 3px;

          background:
            linear-gradient(
              90deg,
              #0d6efd,
              #20a66a
            );
        }

        /* ================= HEADER ================= */

        .pending-header {
          position: relative;

          padding: 25px 22px 23px;

          color: white;

          text-align: center;

          background:
            linear-gradient(
              135deg,
              #0d6efd,
              #4f8dfd 58%,
              #5b6ee1
            );

          overflow: hidden;
        }

        .pending-header::after {
          content: "";

          position: absolute;

          width: 180px;
          height: 180px;

          right: -70px;
          top: -95px;

          border-radius: 50%;

          background: rgba(255, 255, 255, 0.09);
        }

        .pending-icon {
          position: relative;
          z-index: 1;

          width: 68px;
          height: 68px;

          display: flex;
          align-items: center;
          justify-content: center;

          margin: 0 auto 13px;

          border-radius: 20px;

          background: rgba(255, 255, 255, 0.16);

          border: 1px solid rgba(255, 255, 255, 0.24);

          box-shadow:
            0 12px 25px rgba(0, 0, 0, 0.10);

          animation: pendingPulse 2.4s ease-in-out infinite;
        }

        .pending-icon svg {
          font-size: 31px;
        }

        .pending-header h4 {
          position: relative;
          z-index: 1;

          margin-bottom: 5px;

          font-size: 21px;
          font-weight: 800;
        }

        .pending-header p {
          position: relative;
          z-index: 1;

          max-width: 340px;

          margin: auto;

          font-size: 10px;

          line-height: 1.5;

          opacity: 0.82;
        }

        /* ================= BODY ================= */

        .pending-body {
          padding: 22px;
        }

        .pending-status {
          display: inline-flex;
          align-items: center;
          gap: 7px;

          padding: 7px 11px;

          border-radius: 999px;

          color: #9a6700;

          background: #fff7df;

          border: 1px solid #f6e7b8;

          font-size: 9px;
          font-weight: 700;
        }

        .pending-status-dot {
          width: 7px;
          height: 7px;

          border-radius: 50%;

          background: #f0ad00;

          box-shadow:
            0 0 0 4px rgba(240, 173, 0, 0.12);

          animation: statusPulse 1.8s infinite;
        }

        .pending-message {
          margin: 16px auto 20px;

          max-width: 430px;

          color: #64748b;

          font-size: 11px;

          line-height: 1.7;
        }

        /* ================= PROGRESS ================= */

        .pending-progress-card {
          padding: 14px;

          margin-bottom: 15px;

          border-radius: 15px;

          background:
            linear-gradient(
              135deg,
              #f5f9ff,
              #fafcff
            );

          border: 1px solid #e5edf8;

          text-align: left;
        }

        .pending-progress-top {
          display: flex;
          align-items: center;
          justify-content: space-between;

          margin-bottom: 8px;
        }

        .pending-progress-top strong {
          color: #334155;

          font-size: 10px;
        }

        .pending-progress-top span {
          color: #0d6efd;

          font-size: 9px;
          font-weight: 700;
        }

        .pending-progress {
          height: 5px;

          overflow: hidden;

          border-radius: 999px;

          background: #e8eef6;
        }

        .pending-progress-bar {
          width: 70%;
          height: 100%;

          border-radius: inherit;

          background:
            linear-gradient(
              90deg,
              #0d6efd,
              #20a66a
            );

          animation: progressMove 2s ease-in-out infinite;
        }

        /* ================= INFO ITEMS ================= */

        .pending-info-grid {
          display: grid;

          grid-template-columns: repeat(2, 1fr);

          gap: 10px;

          margin-bottom: 16px;
        }

        .pending-info-item {
          display: flex;
          align-items: center;

          gap: 9px;

          padding: 11px;

          border-radius: 13px;

          background: #fafbfd;

          border: 1px solid #edf1f6;
        }

        .pending-info-icon {
          width: 30px;
          height: 30px;

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 9px;

          color: #198754;

          background: #eaf8f1;

          font-size: 12px;
        }

        .pending-info-item strong {
          display: block;

          color: #3b4758;

          font-size: 9px;
        }

        .pending-info-item small {
          display: block;

          margin-top: 2px;

          color: #94a3b8;

          font-size: 8px;
        }

        /* ================= TRUST ================= */

        .pending-trust {
          display: flex;
          align-items: center;

          gap: 9px;

          padding: 11px 12px;

          border-radius: 13px;

          background: #f1fbf6;

          border: 1px solid #dff2e8;

          text-align: left;
        }

        .pending-trust-icon {
          width: 30px;
          height: 30px;

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          color: #fff;

          background: #20a66a;

          font-size: 12px;
        }

        .pending-trust strong {
          display: block;

          color: #24704e;

          font-size: 9px;
        }

        .pending-trust small {
          display: block;

          margin-top: 2px;

          color: #789888;

          font-size: 8px;

          line-height: 1.4;
        }

        /* ================= FOOTER ================= */

        .pending-footer {
          padding: 13px 18px;

          text-align: center;

          border-top: 1px solid #edf1f6;

          color: #94a3b8;

          background: #fafbfd;

          font-size: 9px;
        }

        .pending-footer strong {
          color: #0d6efd;
        }

        /* ================= ANIMATIONS ================= */

        @keyframes pendingEnter {
          from {
            opacity: 0;
            transform: translateY(14px) scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes pendingPulse {
          0%,
          100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.05);
          }
        }

        @keyframes statusPulse {
          0% {
            box-shadow:
              0 0 0 0 rgba(240, 173, 0, 0.25);
          }

          70% {
            box-shadow:
              0 0 0 6px rgba(240, 173, 0, 0);
          }

          100% {
            box-shadow:
              0 0 0 0 rgba(240, 173, 0, 0);
          }
        }

        @keyframes progressMove {
          0% {
            transform: translateX(-35%);
          }

          50% {
            transform: translateX(10%);
          }

          100% {
            transform: translateX(-35%);
          }
        }

        /* ================= MOBILE ================= */

        @media (max-width: 575.98px) {
          .pending-header {
            padding: 21px 15px 19px;
          }

          .pending-icon {
            width: 57px;
            height: 57px;

            border-radius: 17px;

            margin-bottom: 10px;
          }

          .pending-icon svg {
            font-size: 26px;
          }

          .pending-header h4 {
            font-size: 18px;
          }

          .pending-header p {
            font-size: 9px;
          }

          .pending-body {
            padding: 16px 13px;
          }

          .pending-message {
            margin:
              13px
              auto
              16px;

            font-size: 10px;

            line-height: 1.6;
          }

          .pending-info-grid {
            gap: 7px;
          }

          .pending-info-item {
            padding: 9px;

            gap: 7px;
          }

          .pending-info-icon {
            width: 27px;
            height: 27px;

            font-size: 10px;
          }

          .pending-info-item strong {
            font-size: 8px;
          }

          .pending-info-item small {
            font-size: 7px;
          }

          .pending-trust {
            padding: 9px;
          }

          .pending-footer {
            padding: 11px;
          }
        }

        @media (max-width: 360px) {

          .pending-info-grid {
            grid-template-columns: 1fr;
          }

          .pending-info-item {
            min-height: 45px;
          }
        }
      `}</style>

      <div className="fixkar-pending-page">

        {/* Decorative background */}
        <div className="pending-bg">
          <span className="pending-orb pending-orb-one"></span>
          <span className="pending-orb pending-orb-two"></span>
          <div className="pending-grid"></div>
        </div>

        <div className="pending-card">

          {/* ================= HEADER ================= */}

          <div className="pending-header">

            <div className="pending-icon">
              <MdOutlinePendingActions />
            </div>

            <h4>
              Your Journey Has Started
            </h4>

            <p>
              Your professional application is being carefully
              reviewed by the Fixkar team.
            </p>

          </div>

          {/* ================= BODY ================= */}

          <div className="pending-body">

            <div className="text-center">

              <span className="pending-status">
                <span className="pending-status-dot"></span>

                <FaClock />

                Verification in progress
              </span>

              <p className="pending-message">
                You're one step closer to joining Fixkar.
                Our team is reviewing your submitted details
                and documents. Once approved, you'll be able
                to start receiving work requests from customers.
              </p>

            </div>

            {/* ================= PROGRESS ================= */}

            <div className="pending-progress-card">

              <div className="pending-progress-top">

                <strong>
                  Application review
                </strong>

                <span>
                  In progress
                </span>

              </div>

              <div className="pending-progress">
                <div className="pending-progress-bar"></div>
              </div>

            </div>

            {/* ================= INFO ================= */}

            <div className="pending-info-grid">

              <div className="pending-info-item">

                <div className="pending-info-icon">
                  <FaShieldAlt />
                </div>

                <div>
                  <strong>
                    Details submitted
                  </strong>

                  <small>
                    Information received
                  </small>
                </div>

              </div>

              <div className="pending-info-item">

                <div className="pending-info-icon">
                  <FaClock />
                </div>

                <div>
                  <strong>
                    Team review
                  </strong>

                  <small>
                    Currently checking
                  </small>
                </div>

              </div>

            </div>

            {/* ================= TRUST ================= */}

            <div className="pending-trust">

              <div className="pending-trust-icon">
                <FaShieldAlt />
              </div>

              <div>
                <strong>
                  Your information is secure
                </strong>

                <small>
                  Fixkar keeps your submitted information
                  protected during the verification process.
                </small>
              </div>

            </div>

          </div>

          {/* ================= FOOTER ================= */}

          <div className="pending-footer">
            Thank you for choosing{" "}
            <strong>Fixkar</strong>. Your patience means a lot to us. 🙏
          </div>

        </div>

      </div>
    </>
  );
};

export default Pending;