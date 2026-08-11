import React from "react";
import {
  FaUsers,
  FaUserTie,
  FaUserShield,
  FaDatabase,
} from "react-icons/fa";

import StatCard from "./Utils/StatCard";
import AdminSearch from "./AdminSearch";

import useGetAllCustomers from "../../hooks/useGetAllCustomers";
import useGetAllProfessionals from "../../hooks/useGetAllProfessionals";

const AdminUsers = () => {
  const {
    customers,
    pagination: customerPagination,
    loading: customerLoading,
    fetchCustomers,
  } = useGetAllCustomers();

  const {
    professionals,
    pagination: professionalPagination,
    loading: professionalLoading,
    fetchProfessionals,
  } = useGetAllProfessionals();

  const customerTotal = customerPagination?.total || 0;
  const professionalTotal = professionalPagination?.total || 0;

  return (
    <main
      className="container-fluid py-4"
      style={{
        background:
          "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        minHeight: "100vh",
      }}
    >
      <div className="container-fluid px-0" style={{ maxWidth: "1600px" }}>
        {/* ================= PAGE HEADER ================= */}
        <section
          className="card border-0 shadow-lg rounded-4 mb-4 overflow-hidden text-white"
          style={{
            background:
              "linear-gradient(135deg, #141e30 0%, #243b55 100%)",
          }}
        >
          <div className="card-body p-4 p-lg-5">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">
              <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span
                    className="rounded-3 bg-warning text-dark d-inline-flex align-items-center justify-content-center"
                    style={{ width: 42, height: 42 }}
                  >
                    <FaUserShield size={19} />
                  </span>

                  <span className="badge rounded-pill bg-white bg-opacity-10 border border-light border-opacity-25 px-3 py-2">
                    Admin Panel
                  </span>
                </div>

                <h2 className="fw-bold mb-2">User Management</h2>

                <p className="mb-0 text-light opacity-75">
                  Search, review and manage FixKar customers and professionals.
                </p>
              </div>

              <div className="text-md-end">
                <div className="small text-light opacity-50 mb-1">
                  Records are loaded on demand
                </div>
                <div className="d-flex align-items-center justify-content-md-end gap-2">
                  <FaDatabase className="text-info" />
                  <span className="small text-light opacity-75">
                    10 records per page
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SUMMARY ================= */}
        <section className="row g-3 mb-4">
          <div className="col-md-6 col-xl-4">
            <StatCard
              title="Customers"
              value={customerTotal}
              icon={<FaUsers className="fs-3" />}
              color="linear-gradient(135deg,#f59e0b,#d97706)"
            />
          </div>

          <div className="col-md-6 col-xl-4">
            <StatCard
              title="Professionals"
              value={professionalTotal}
              icon={<FaUserTie className="fs-3" />}
              color="linear-gradient(135deg,#ec4899,#be185d)"
            />
          </div>

          <div className="col-md-12 col-xl-4">
            <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
              <div className="card-body d-flex align-items-center justify-content-between p-4">
                <div>
                  <div className="small text-muted mb-1">Current data scope</div>
                  <h5 className="fw-bold mb-1">On-demand management</h5>
                  <p className="small text-muted mb-0">
                    Only the selected user type is fetched.
                  </p>
                </div>

                <div
                  className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: 52, height: 52 }}
                >
                  <FaDatabase />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SEARCH + RESULTS ================= */}
        <section>
          <AdminSearch
            customers={customers}
            professionals={professionals}
            customerPagination={customerPagination}
            professionalPagination={professionalPagination}
            customerLoading={customerLoading}
            professionalLoading={professionalLoading}
            fetchCustomers={fetchCustomers}
            fetchProfessionals={fetchProfessionals}
          />
        </section>
      </div>
    </main>
  );
};

export default AdminUsers;
