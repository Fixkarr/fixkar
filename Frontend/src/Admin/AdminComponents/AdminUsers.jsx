import React from "react";
import {
  FaUsers,
  FaUserTie,
  FaCheckCircle,
  FaTimesCircle,
  FaUserShield,
  FaBan,
  FaEye,
} from "react-icons/fa";

import StatCard from "./Utils/StatCard";
import AdminSearch from "./AdminSearch";
import useGetAllCustomers from "../../hooks/useGetAllCustomers";
import useGetAllProfessionals from "../../hooks/useGetAllProfessionals";

const AdminUsers = () => {
  const customers = useGetAllCustomers();
  const professionals = useGetAllProfessionals();

  return (
    <div
      className="container-fluid py-4"
      style={{
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        minHeight: "100vh",
      }}
    >
      {/* ================= HEADER ================= */}
      <div
        className="card border-0 shadow-lg rounded-4 mb-4 text-white"
        style={{
          background: "linear-gradient(135deg, #141e30, #243b55)",
        }}
      >
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <h4 className="fw-bold mb-1 d-flex align-items-center">
              <FaUserShield className="me-2 text-warning fs-3" />
              User Management
            </h4>
            <p className="mb-0 text-light opacity-75">
              Manage customers & professionals on FixKar
            </p>
          </div>
          <span className="badge rounded-pill bg-warning text-dark px-3 py-2">
            Admin Panel
          </span>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="row g-4 mb-4">
        <StatCard
          title="Total Users"
          value={(customers?.length || 0) + (professionals?.length || 0)}
          icon={<FaUsers className="fs-3" />}
          color="linear-gradient(135deg,#0ea5e9,#2563eb)"
        />

        <StatCard
          title="Customers"
          value={customers?.length || 0}
          icon={<FaUsers className="fs-3" />}
          color="linear-gradient(135deg,#f59e0b,#d97706)"
        />

        <StatCard
          title="Professionals"
          value={professionals?.length || 0}
          icon={<FaUserTie className="fs-3" />}
          color="linear-gradient(135deg,#ec4899,#be185d)"
        />
      </div>


      {/* ================= LISTS ================= */}
      <div className="row justify-content-center mt-4"> 
        <AdminSearch customers={customers} professionals={professionals} />
      </div>
    </div>
  );
};

export default AdminUsers;
