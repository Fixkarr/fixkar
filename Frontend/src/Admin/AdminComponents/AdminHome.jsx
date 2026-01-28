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


const AdminHome = () => {
  const { currentAdmin } = useSelector((state) => state.admin);

  const bgGradient = `linear-gradient(135deg, ${
    currentAdmin ? "#0f2027" : "#0d6efd"
  }, ${currentAdmin ? "#2c5364" : "#4f9cff"})`;

  return (
    <div
      className="container-fluid min-vh-100 text-white py-4"
      style={{ background: bgGradient }}
    >
      {/* ================= HEADER ================= */}
      <div className="mb-4">
        <h2 className="fw-bold">👑 Super Admin Dashboard</h2>
        <p className="text-light opacity-75 mb-0">
          Platform health • Users • Bookings • Revenue
        </p>
      </div>

      {/* ================= SUMMARY CARDS ================= */}
      <div className="row g-4 mb-4">
        <StatCard
          title="Total Users"
          value="2,450"
          icon={<FaUsers />}
          color="primary"
        />
        <StatCard
          title="Total Customers"
          value="1,780"
          icon={<FaUsers />}
          color="success"
        />
        <StatCard
          title="Total Professionals"
          value="670"
          icon={<FaUserTie />}
          color="warning"
        />
        <StatCard
          title="Total Earnings"
          value="₹ 3,45,000"
          icon={<FaRupeeSign />}
          color="info"
        />
         <StatCard
          title="Pending Applications"
          value="110"
          icon={<FaUserClock />}
          color="warning"
        />
         <StatCard
          title="Total Bookings"
          value="4,820"
          icon={<FaClipboardList />}
          color="primary"
        />
         <StatCard
          title="Total Services"
          value="10"
          icon={<FaClipboardList />}
          color="warning"
        />
      </div>

      <AdminWithdrawRequests/>
    </div>
  );
};

/* ================= REUSABLE COMPONENTS ================= */




export default AdminHome;
