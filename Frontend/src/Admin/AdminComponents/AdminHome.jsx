import React from "react";
import {
  FaUsers,
  FaUserTie,
  FaUserClock,
  FaClipboardList,
  FaShieldAlt,
  FaChartLine,
  FaArrowUp,
  FaRupeeSign,
} from "react-icons/fa";
import { MdPendingActions } from "react-icons/md";
import { useSelector } from "react-redux";
import StatCard from "./Utils/StatCard";
import AdminWithdrawRequests from "./AdminWithdrawRequests";
import useGetPlatformTransactions from "../../hooks/useGetPlatformTransactions.jsx";
import ManagePlatformTransactions from "./ManagePlatformTransaction.jsx";
import useGetSiteHealth from "../../hooks/useGetSiteHealth.jsx";

const AdminHome = () => {
  const { currentAdmin } = useSelector((state) => state.admin);

  const platformTransaction = useGetPlatformTransactions();
  const { health, revenueHealth } = useGetSiteHealth();

  return (
    <>
      <style>{`
        .fixkar-admin-dashboard {
          position: relative;
          min-height: 100vh;
          overflow: hidden;

          background:
            radial-gradient(
              circle at 5% 5%,
              rgba(59, 130, 246, 0.13),
              transparent 25%
            ),
            radial-gradient(
              circle at 95% 90%,
              rgba(139, 92, 246, 0.11),
              transparent 28%
            ),
            #0b1120;

          color: #fff;
        }

        .fixkar-admin-dashboard::before {
          content: "";
          position: absolute;
          inset: 0;

          pointer-events: none;

          opacity: 0.18;

          background-image:
            linear-gradient(
              rgba(255,255,255,0.035) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,0.035) 1px,
              transparent 1px
            );

          background-size: 42px 42px;

          mask-image:
            linear-gradient(
              to bottom,
              black,
              transparent 90%
            );
        }

        .admin-orb {
          position: absolute;

          border-radius: 50%;

          pointer-events: none;

          filter: blur(2px);
        }

        .admin-orb-one {
          width: 320px;
          height: 320px;

          top: -180px;
          right: 10%;

          background:
            radial-gradient(
              circle,
              rgba(59,130,246,0.13),
              transparent 70%
            );
        }

        .admin-orb-two {
          width: 380px;
          height: 380px;

          bottom: -220px;
          left: -170px;

          background:
            radial-gradient(
              circle,
              rgba(139,92,246,0.12),
              transparent 70%
            );
        }

        .admin-dashboard-content {
          position: relative;
          z-index: 1;
        }

        /* ================= HEADER ================= */

        .admin-header {
          position: relative;

          padding: 20px 22px;

          border-radius: 20px;

          background:
            linear-gradient(
              135deg,
              rgba(255,255,255,0.075),
              rgba(255,255,255,0.035)
            );

          border: 1px solid rgba(255,255,255,0.09);

          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);

          box-shadow:
            0 15px 45px rgba(0,0,0,0.20);

          overflow: hidden;
        }

        .admin-header::after {
          content: "";

          position: absolute;

          width: 180px;
          height: 180px;

          right: -80px;
          top: -110px;

          border-radius: 50%;

          background:
            radial-gradient(
              circle,
              rgba(99,102,241,0.20),
              transparent 70%
            );
        }

        .admin-brand-icon {
          width: 48px;
          height: 48px;

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 14px;

          color: white;

          background:
            linear-gradient(
              135deg,
              #6366f1,
              #8b5cf6
            );

          box-shadow:
            0 10px 25px rgba(99,102,241,0.28);

          font-size: 21px;
        }

        .admin-eyebrow {
          display: block;

          color: #93c5fd;

          font-size: 8px;
          font-weight: 800;

          letter-spacing: 1.2px;

          margin-bottom: 3px;
        }

        .admin-header h2 {
          font-size: 19px;

          margin: 0;

          font-weight: 800;
        }

        .admin-header-description {
          color: #94a3b8;

          font-size: 9px;

          margin: 4px 0 0;
        }

        .admin-live-status {
          display: inline-flex;
          align-items: center;

          gap: 6px;

          padding: 7px 10px;

          border-radius: 999px;

          color: #86efac;

          background: rgba(34,197,94,0.08);

          border: 1px solid rgba(34,197,94,0.14);

          font-size: 8px;
          font-weight: 700;
        }

        .admin-live-dot {
          width: 6px;
          height: 6px;

          border-radius: 50%;

          background: #22c55e;

          box-shadow:
            0 0 0 4px rgba(34,197,94,0.10);

          animation: adminPulse 2s infinite;
        }

        /* ================= SECTION TITLE ================= */

        .admin-section-title {
          display: flex;
          align-items: center;
          justify-content: space-between;

          margin: 22px 0 10px;
        }

        .admin-section-title h5 {
          font-size: 13px;

          margin: 0;

          font-weight: 800;
        }

        .admin-section-title p {
          color: #64748b;

          font-size: 8px;

          margin: 2px 0 0;
        }

        .admin-section-icon {
          width: 30px;
          height: 30px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 9px;

          color: #93c5fd;

          background: rgba(59,130,246,0.10);

          border: 1px solid rgba(59,130,246,0.12);
        }

        /* ================= STAT AREA ================= */

        .admin-stats {
          margin-bottom: 4px;
        }

        .admin-stat-wrapper {
          transition:
            transform 0.2s ease;
        }

        .admin-stat-wrapper:hover {
          transform: translateY(-3px);
        }

        /* ================= TRANSACTIONS ================= */

        .admin-panel {
          position: relative;

          padding: 18px;

          border-radius: 19px;

          background:
            linear-gradient(
              135deg,
              rgba(255,255,255,0.065),
              rgba(255,255,255,0.035)
            );

          border: 1px solid rgba(255,255,255,0.075);

          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);

          box-shadow:
            0 15px 45px rgba(0,0,0,0.16);
        }

        .admin-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 12px;

          margin-bottom: 14px;
        }

        .admin-panel-heading {
          display: flex;
          align-items: center;

          gap: 10px;
        }

        .admin-panel-icon {
          width: 38px;
          height: 38px;

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 11px;

          color: #93c5fd;

          background:
            rgba(59,130,246,0.10);

          border: 1px solid rgba(59,130,246,0.14);
        }

        .admin-panel h4 {
          font-size: 13px;

          margin: 0;

          font-weight: 800;
        }

        .admin-panel-subtitle {
          color: #64748b;

          font-size: 8px;

          margin: 3px 0 0;
        }

        .admin-view-btn {
          border: 1px solid rgba(255,255,255,0.10);

          background: rgba(255,255,255,0.04);

          color: #cbd5e1;

          border-radius: 999px;

          padding: 6px 12px;

          font-size: 8px;
          font-weight: 700;

          transition: 0.2s ease;
        }

        .admin-view-btn:hover {
          color: white;

          background: rgba(255,255,255,0.09);

          border-color: rgba(255,255,255,0.18);
        }

        .admin-empty-state {
          padding: 25px 10px;

          text-align: center;

          color: #64748b;

          font-size: 9px;
        }

        /* ================= WITHDRAW ================= */

        .admin-withdraw-panel {
          margin-top: 16px;

          padding: 15px;

          border-radius: 18px;

          background:
            rgba(255,255,255,0.035);

          border: 1px solid rgba(255,255,255,0.065);

          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
        }

        /* ================= ANIMATION ================= */

        @keyframes adminPulse {
          0% {
            box-shadow:
              0 0 0 0 rgba(34,197,94,0.25);
          }

          70% {
            box-shadow:
              0 0 0 6px rgba(34,197,94,0);
          }

          100% {
            box-shadow:
              0 0 0 0 rgba(34,197,94,0);
          }
        }

        /* ================= TABLET ================= */

        @media (max-width: 991.98px) {

          .admin-header {
            padding: 17px;
          }

          .admin-panel {
            padding: 15px;
          }
        }

        /* ================= MOBILE ================= */

        @media (max-width: 575.98px) {

          .fixkar-admin-dashboard {
            padding-left: 8px !important;
            padding-right: 8px !important;
            padding-top: 12px !important;
          }

          .admin-header {
            padding: 13px;

            border-radius: 15px;
          }

          .admin-brand-icon {
            width: 39px;
            height: 39px;

            border-radius: 11px;

            font-size: 17px;
          }

          .admin-header h2 {
            font-size: 15px;
          }

          .admin-header-description {
            font-size: 8px;
          }

          .admin-live-status {
            padding: 6px 8px;

            font-size: 7px;
          }

          .admin-section-title {
            margin-top: 16px;
          }

          .admin-section-title h5 {
            font-size: 11px;
          }

          .admin-panel {
            padding: 12px;

            border-radius: 15px;
          }

          .admin-panel-header {
            align-items: flex-start;
          }

          .admin-panel-icon {
            width: 33px;
            height: 33px;

            border-radius: 9px;
          }

          .admin-panel h4 {
            font-size: 11px;
          }

          .admin-view-btn {
            padding: 5px 9px;
          }

          .admin-withdraw-panel {
            padding: 10px;

            border-radius: 14px;
          }
        }
      `}</style>

      <div className="fixkar-admin-dashboard container-fluid py-3 py-lg-4 px-2 px-md-3 px-lg-4">

        {/* Decorative graphics */}
        <div className="admin-orb admin-orb-one"></div>
        <div className="admin-orb admin-orb-two"></div>

        <div className="admin-dashboard-content">

          {/* ================= HEADER ================= */}

          <div className="admin-header">

            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">

              <div className="d-flex align-items-center gap-3">

                <div className="admin-brand-icon">
                  <FaShieldAlt />
                </div>

                <div>

                  <span className="admin-eyebrow">
                    FIXKAR CONTROL CENTER
                  </span>

                  <h2>
                    Super Admin Dashboard
                  </h2>

                  <p className="admin-header-description">
                    Monitor users, services, bookings and platform revenue.
                  </p>

                </div>

              </div>

              <div className="admin-live-status">
                <span className="admin-live-dot"></span>
                Platform Online
              </div>

            </div>

          </div>

          {/* ================= OVERVIEW ================= */}

          <div className="admin-section-title">

            <div className="d-flex align-items-center gap-2">

              <div className="admin-section-icon">
                <FaChartLine />
              </div>

              <div>
                <h5>Platform Overview</h5>

                <p>
                  Current platform statistics
                </p>
              </div>

            </div>

          </div>

          <div className="row g-2 g-md-3 admin-stats">

            <div className="col-6 col-xl-2 admin-stat-wrapper">
              <StatCard
                title="Total Users"
                value={health.totalUsers}
                icon={<FaUsers />}
                color="linear-gradient(135deg,#0ea5e9,#2563eb)"
              />
            </div>

            <div className="col-6 col-xl-2 admin-stat-wrapper">
              <StatCard
                title="Total Customers"
                value={health?.customers}
                icon={<FaUsers />}
                color="linear-gradient(135deg,#f59e0b,#d97706)"
              />
            </div>

            <div className="col-6 col-xl-2 admin-stat-wrapper">
              <StatCard
                title="Total Professionals"
                value={health.professionals}
                icon={<FaUserTie />}
                color="linear-gradient(135deg,#ec4899,#be185d)"
              />
            </div>

            <div className="col-6 col-xl-2 admin-stat-wrapper">
              <StatCard
                title="Pending Applications"
                value={health.pendingApplications}
                icon={<FaUserClock />}
                color="linear-gradient(135deg,#14b8a6,#0f766e)"
              />
            </div>

            <div className="col-6 col-xl-2 admin-stat-wrapper">
              <StatCard
                title="Total Bookings"
                value={health.bookings}
                icon={<FaClipboardList />}
                color="linear-gradient(135deg,#8b5cf6,#6d28d9)"
              />
            </div>

            <div className="col-6 col-xl-2 admin-stat-wrapper">
              <StatCard
                title="Total Services"
                value={health.services}
                icon={<FaClipboardList />}
                color="linear-gradient(135deg,#64748b,#334155)"
              />
            </div>

          </div>

          {/* ================= TRANSACTIONS ================= */}

          <div className="admin-section-title">

            <div className="d-flex align-items-center gap-2">

              <div className="admin-section-icon">
                <FaRupeeSign />
              </div>

              <div>
                <h5>Financial Activity</h5>

                <p>
                  Platform earnings and payout activity
                </p>
              </div>

            </div>

          </div>

          <div className="admin-panel">

            <div className="admin-panel-header">

              <div className="admin-panel-heading">

                <div className="admin-panel-icon">
                  <FaRupeeSign />
                </div>

                <div>

                  <h4>
                    Platform Transactions
                  </h4>

                  <p className="admin-panel-subtitle">
                    Recent earnings & payout activities
                  </p>

                </div>

              </div>

              <button
                type="button"
                className="admin-view-btn"
              >
                View All
              </button>

            </div>

            {platformTransaction.length > 0 ? (
              <ManagePlatformTransactions
                platformTransactions={platformTransaction}
                revenueHealth={revenueHealth}
              />
            ) : (
              <div className="admin-empty-state">
                No platform transactions available yet.
              </div>
            )}

          </div>

          {/* ================= WITHDRAW REQUESTS ================= */}

          <div className="admin-section-title">

            <div className="d-flex align-items-center gap-2">

              <div className="admin-section-icon">
                <FaArrowUp />
              </div>

              <div>
                <h5>Withdrawals</h5>

                <p>
                  Manage professional payout requests
                </p>
              </div>

            </div>

          </div>

          <div className="admin-withdraw-panel">
            <AdminWithdrawRequests />
          </div>

        </div>

      </div>
    </>
  );
};

export default AdminHome;