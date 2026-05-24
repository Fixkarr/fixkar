import React from "react";
import {
  FaUsers,
  FaUserTie,
  FaUserCheck,
  FaUserClock,
  FaClipboardList,
  FaCheckCircle,
  FaTimesCircle,
  FaBan,
  FaHourglassHalf,
  FaTools,
  FaRupeeSign,
} from "react-icons/fa";
import { MdPendingActions } from "react-icons/md";
import { useSelector } from "react-redux";
import StatCard from "./Utils/StatCard";
import AdminServices from "./AdminServices";
import AdminWithdrawRequests from "./AdminWithdrawRequests";
import useGetPlatformTransactions from "../../hooks/useGetPlatformTransactions.jsx";
import ManagePlatformTransactions from "./ManagePlatformTransaction.jsx";
import useGetSiteHealth from "../../hooks/useGetSiteHealth.jsx";


const AdminHome = () => {
  const { currentAdmin } = useSelector((state) => state.admin);

  const bgGradient = `linear-gradient(135deg, ${
    currentAdmin ? "#0f2027" : "#0d6efd"
  }, ${currentAdmin ? "#2c5364" : "#4f9cff"})`;

  const platformTransaction = useGetPlatformTransactions()
  const health = useGetSiteHealth();

  console.log(health);

 return (
  <div
    className="container-fluid min-vh-100 py-4 px-lg-4 px-3 text-white"
    style={{
      background:
        "linear-gradient(135deg, #0f172a 0%, #111827 35%, #1e293b 100%)",
    }}
  >
    {/* ================= HEADER ================= */}
    <div
      className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mb-4 p-4 rounded-4 border"
      style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(14px)",
        borderColor: "rgba(255,255,255,0.08)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
      }}
    >
      <div>
        <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
          <span
            className="d-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: "48px",
              height: "48px",
              background:
                "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
              fontSize: "22px",
            }}
          >
            👑
          </span>
          Super Admin Dashboard
        </h2>

        <p className="text-light opacity-75 mb-0 ms-lg-5">
          Platform health • Users • Bookings • Revenue
        </p>
      </div>

      <div className="mt-3 mt-lg-0">
        <button className="btn btn-light rounded-pill px-4 fw-semibold shadow-sm">
          View Reports
        </button>
      </div>
    </div>

    {/* ================= SUMMARY CARDS ================= */}
    <div className="row g-4 mb-4">
      <div className="col-12 col-sm-6 col-xl-2">
        <StatCard
          title="Total Users"
          value="2,450"
          icon={<FaUsers />}
          color="linear-gradient(135deg,#0ea5e9,#2563eb)"
        />
      </div>

      <div className="col-12 col-sm-6 col-xl-2">
        <StatCard
          title="Total Customers"
          value="1,780"
          icon={<FaUsers />}
          color="linear-gradient(135deg,#f59e0b,#d97706)"
        />
      </div>

      <div className="col-12 col-sm-6 col-xl-2">
        <StatCard
          title="Total Professionals"
          value="670"
          icon={<FaUserTie />}
          color="linear-gradient(135deg,#ec4899,#be185d)"
        />
      </div>

      <div className="col-12 col-sm-6 col-xl-2">
        <StatCard
          title="Pending Applications"
          value="110"
          icon={<FaUserClock />}
          color="linear-gradient(135deg,#14b8a6,#0f766e)"
        />
      </div>

      <div className="col-12 col-sm-6 col-xl-2">
        <StatCard
          title="Total Bookings"
          value="4,820"
          icon={<FaClipboardList />}
          color="linear-gradient(135deg,#8b5cf6,#6d28d9)"
        />
      </div>

      <div className="col-12 col-sm-6 col-xl-2">
        <StatCard
          title="Total Services"
          value="10"
          icon={<FaClipboardList />}
          color="linear-gradient(135deg,#64748b,#334155)"
        />
      </div>
    </div>

    {/* ================= TRANSACTIONS ================= */}
    <div
      className="rounded-4 border p-4 mb-4"
      style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(14px)",
        borderColor: "rgba(255,255,255,0.08)",
        boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">💳 Platform Transactions</h4>
          <p className="text-light opacity-75 small mb-0">
            Recent earnings & payout activities
          </p>
        </div>

        <button className="btn btn-outline-light rounded-pill px-3">
          View All
        </button>
      </div>

      {platformTransaction.length > 0 && (
        <ManagePlatformTransactions platformTransactions={platformTransaction}/>
      ) }
    </div>

    {/* ================= WITHDRAW REQUESTS ================= */}
    <div
      className="rounded-4 p-3"
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(12px)",
      }}
    >
      <AdminWithdrawRequests />
    </div>
  </div>
);
};

/* ================= REUSABLE COMPONENTS ================= */




export default AdminHome;
