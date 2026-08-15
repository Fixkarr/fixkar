import React from "react";
import { Outlet } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { IoCall } from "react-icons/io5";
import { RiLogoutCircleRLine } from "react-icons/ri";
import axios from "axios";
import { server_url } from "../App";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentUserData } from "../redux/user.slice";

const OnBoard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${server_url}/api/auth/logout`,
        {},
        { withCredentials: true }
      );

      dispatch(setCurrentUserData(null));
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <style>{`
        .fixkar-onboard-page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 0% 0%,
              rgba(13, 110, 253, 0.10),
              transparent 28%
            ),
            radial-gradient(
              circle at 100% 100%,
              rgba(111, 66, 193, 0.08),
              transparent 28%
            ),
            #f6f9fd;
        }

        /* ================= HEADER ================= */

        .fixkar-onboard-header {
          position: sticky;
          top: 0;
          z-index: 1030;

          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);

          border-bottom: 1px solid rgba(15, 23, 42, 0.06);

          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.05);
        }

        .fixkar-onboard-header-inner {
          min-height: 68px;
        }

        /* ================= BRAND ================= */

        .fixkar-onboard-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .fixkar-onboard-logo {
          width: 38px;
          height: 38px;

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 12px;

          color: #fff;

          font-size: 17px;
          font-weight: 800;

          background: linear-gradient(
            135deg,
            #0d6efd,
            #6f42c1
          );

          box-shadow:
            0 8px 18px rgba(13, 110, 253, 0.20);
        }

        .fixkar-onboard-brand-name {
          color: #172033;
          font-size: 17px;
          font-weight: 800;
          line-height: 1;
        }

        .fixkar-onboard-badge {
          display: inline-flex;
          align-items: center;

          padding: 4px 8px;

          border-radius: 999px;

          color: #0d6efd;
          background: #edf5ff;

          border: 1px solid #dceaff;

          font-size: 9px;
          font-weight: 700;

          white-space: nowrap;
        }

        /* ================= HEADER ACTIONS ================= */

        .fixkar-onboard-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .fixkar-contact-item {
          display: inline-flex;
          align-items: center;
          gap: 6px;

          padding: 7px 10px;

          color: #64748b;

          border: 1px solid #e9eef5;
          background: #fff;

          border-radius: 10px;

          font-size: 10px;

          transition: 0.2s ease;
        }

        .fixkar-contact-item svg {
          color: #0d6efd;
          font-size: 14px;
        }

        .fixkar-contact-item:hover {
          border-color: #cfe0f8;
          background: #f8fbff;
        }

        .fixkar-logout-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;

          border: 1px solid #ffe0e0;

          background: #fff7f7;

          color: #dc3545;

          padding: 7px 11px;

          border-radius: 10px;

          font-size: 10px;
          font-weight: 700;

          cursor: pointer;

          transition: 0.2s ease;
        }

        .fixkar-logout-btn:hover {
          background: #fff0f0;
          border-color: #ffcaca;
          transform: translateY(-1px);
        }

        /* ================= CONTENT ================= */

        .fixkar-onboard-content {
          position: relative;

          padding-top: 24px;
          padding-bottom: 40px;
        }

        .fixkar-onboard-card {
          position: relative;

          background: rgba(255, 255, 255, 0.94);

          border: 1px solid rgba(226, 232, 240, 0.9);

          border-radius: 22px;

          box-shadow:
            0 18px 50px rgba(15, 23, 42, 0.07);

          overflow: hidden;
        }

        .fixkar-onboard-card::before {
          content: "";

          position: absolute;

          top: 0;
          left: 0;
          right: 0;

          height: 3px;

          background: linear-gradient(
            90deg,
            #0d6efd,
            #6f42c1
          );
        }

        .fixkar-onboard-card-body {
          padding: 20px;
        }

        /* ================= MOBILE ================= */

        @media (max-width: 767.98px) {

          .fixkar-onboard-header-inner {
            min-height: 62px;
          }

          .fixkar-onboard-logo {
            width: 34px;
            height: 34px;

            border-radius: 10px;

            font-size: 15px;
          }

          .fixkar-onboard-brand-name {
            font-size: 15px;
          }

          .fixkar-onboard-badge {
            font-size: 8px;
            padding: 3px 7px;
          }

          .fixkar-contact-item {
            width: 34px;
            height: 34px;

            padding: 0;

            justify-content: center;

            border-radius: 10px;
          }

          .fixkar-contact-item span {
            display: none;
          }

          .fixkar-contact-item svg {
            font-size: 15px;
          }

          .fixkar-logout-btn {
            width: 34px;
            height: 34px;

            padding: 0;

            justify-content: center;

            border-radius: 10px;
          }

          .fixkar-logout-btn span {
            display: none;
          }

          .fixkar-onboard-content {
            padding-top: 12px;
            padding-bottom: 24px;
          }

          .fixkar-onboard-card {
            border-radius: 17px;
          }

          .fixkar-onboard-card-body {
            padding: 12px;
          }
        }

        @media (max-width: 380px) {

          .fixkar-onboard-brand {
            gap: 7px;
          }

          .fixkar-onboard-badge {
            display: none;
          }

          .fixkar-onboard-actions {
            gap: 5px;
          }

          .fixkar-onboard-card-body {
            padding: 9px;
          }
        }
      `}</style>

      <div className="fixkar-onboard-page">

        {/* ================= TOP HEADER ================= */}

        <header className="fixkar-onboard-header">
          <div className="container-fluid px-3 px-md-4">

            <div className="fixkar-onboard-header-inner d-flex align-items-center justify-content-between">

              {/* BRAND */}
              <div className="fixkar-onboard-brand">

                <div className="fixkar-onboard-logo">
                  F
                </div>

                <div className="d-flex align-items-center gap-2">

                  <span className="fixkar-onboard-brand-name">
                    Fixkar
                  </span>

                  <span className="fixkar-onboard-badge">
                    Onboarding
                  </span>

                </div>

              </div>

              {/* ACTIONS */}
            {/* ACTIONS */}
<div className="fixkar-onboard-actions">

  {/* CALL */}
  <a
    href="tel:+918795213106"
    className="fixkar-contact-item text-decoration-none"
    aria-label="Call Fixkar support"
  >
    <IoCall />
    <span>+91 8795213106</span>
  </a>

  {/* EMAIL */}
  <a
    href="mailto:info@fixkarr.com"
    className="fixkar-contact-item text-decoration-none"
    aria-label="Email Fixkar support"
  >
    <MdEmail />
    <span>info@fixkarr.com</span>
  </a>

  {/* LOGOUT */}
  <button
    type="button"
    onClick={handleLogout}
    className="fixkar-logout-btn"
  >
    <RiLogoutCircleRLine size={16} />
    <span>Logout</span>
  </button>

</div>

            </div>

          </div>
        </header>

        {/* ================= CONTENT ================= */}

        <main className="container fixkar-onboard-content">

          <div className="fixkar-onboard-card">

            <div className="fixkar-onboard-card-body">
              <Outlet />
            </div>

          </div>

        </main>

      </div>
    </>
  );
};

export default OnBoard;