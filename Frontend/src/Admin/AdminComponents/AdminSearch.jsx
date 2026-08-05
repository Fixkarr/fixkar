import React, { useState, useMemo } from "react";
import {
  FaUsers,
  FaUserTie,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaBan,
} from "react-icons/fa";
import ProfessionalDetailCard from "./Utils/ProfessionalDetailCard";

const AdminSearch = ({ customers, professionals }) => {
  const [selectedType, setSelectedType] = useState("customer");
  const [userId, setUserId] = useState("");
  const [entityId, setEntityId] = useState("");
  const [email, setEmail] = useState("");

  // 🔍 FILTER LOGIC
  const filteredData = useMemo(() => {
    const source = selectedType === "customer" ? customers : professionals;

    return source?.filter((item) => {
      const matchUserId = userId
        ? item.userId?._id.toLowerCase().includes(userId.toLowerCase())
        : true;

      const matchEntityId = entityId
        ? item._id?.toLowerCase().includes(entityId.toLowerCase())
        : true;

      const matchEmail = email
        ? item.userId.email?.toLowerCase().includes(email.toLowerCase())
        : true;

      return matchUserId && matchEntityId && matchEmail;
    });
  }, [selectedType, userId, entityId, email, customers, professionals]);

  return (
    <div className="container-fluid">
      {/* ================= SEARCH PANEL ================= */}
      <div className="card shadow-sm border-0 rounded-4 mb-4">
        <div className="card-body  shadow-lg bg-light rounded-3">
          <div className="row g-3 align-items-end">
            <div className="col-md-3">
              <label className="form-label fw-semibold">User ID</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">
                {selectedType === "customer"
                  ? "Customer ID"
                  : "Professional ID"}
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by ID"
                value={entityId}
                onChange={(e) => setEntityId(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Search by Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">User Type</label>
              <select
                className="form-select"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="customer">Customer</option>
                <option value="professional">Professional</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ================= CUSTOMER TABLE ================= */}
      <div className="row">
        {selectedType === "customer" && (
          <div className="col-12">
            <div className="card border-0 shadow-lg rounded-4 d-flex flex-column mb-4">
              <div className="card-header bg-dark text-white fw-semibold">
                <FaUsers className="me-2 text-success" />
                Customers
              </div>

              <div className="flex-grow-1 overflow-auto p-3">
                {filteredData.length === 0 ? (
                  <div className="text-center text-muted py-5">
                    No customers found
                  </div>
                ) : (
                  filteredData?.map((c) => (
                    <div
                      key={c?._id}
                      className="card border-0 shadow-sm rounded-3 mb-3"
                    >
                      <div className="card-body">
                        <div className="row align-items-center">
                          {/* LEFT */}
                          <div className="col-md-4">
                            <h6 className="fw-bold mb-1">
                              {c.userId.fullName}
                            </h6>
                            <div className="text-muted small">
                              {c.userId.email}
                            </div>
                            <div className="text-muted small">
                              User ID: {c.userId._id}
                            </div>
                            <div className="text-muted small">
                              Customer ID: {c._id}
                            </div>
                          </div>

                          {/* Center  */}
                          <div className="col-md-4 text-center">
                            <div className="fw-muted mb-1">
                              Terms Accepted At :{" "}
                              {c.userId.termsAcceptance.acceptedAt
                                ? new Date(
                                    c.userId.termsAcceptance.acceptedAt,
                                  ).toLocaleString()
                                : "—"}
                            </div>
                            <div className="text-primary-emphasis small">
                              {c.userId.termsAcceptance.acceptedIP}
                            </div>
                            <div className="text-muted small">
                              {c.userId.termsAcceptance.policyVersion}
                            </div>
                          </div>

                          {/* Right */}
                          <div className="col-md-4 text-center">
                            {c.userId.isMobileVerified ? (
                              <span className="badge bg-success">
                                <FaCheckCircle className="me-1" />
                                Verified
                              </span>
                            ) : (
                              <span className="badge bg-danger">
                                <FaTimesCircle className="me-1" />
                                Not Verified
                              </span>
                            )}

                            <div className="small text-muted mt-2">
                              {c.userId.isMobileVerified
                                ? c.userId.mobile
                                : "N/A"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= PROFESSIONAL TABLE ================= */}
        {selectedType === "professional" && (
          <div className="col-12">
            <div className="card border-0 shadow-lg rounded-4 d-flex flex-column mb-4">
              <div className="card-header bg-dark text-white fw-semibold">
                <FaUserTie className="me-2 text-warning" />
                Professionals
              </div>

              <div className="flex-grow-1 overflow-auto p-3">
                {filteredData?.length === 0 ? (
                  <div className="text-center text-muted py-5">
                    No professionals found
                  </div>
                ) : (
                  filteredData?.map((p) => (
                    <div
                      key={p._id}
                      className="card border-0 shadow-sm rounded-3 mb-3"
                    >
                      <div className="card-body">
                        <div className="row align-items-center">
                          {/* LEFT */}
                          <div className="col-md-4">
                            <h6 className="fw-bold mb-1">
                              {p.userId.fullName}
                            </h6>
                            <div className="text-muted small">
                              {p.userId.email}
                            </div>
                            <div className="text-muted small">
                              User ID: {p.userId._id}
                            </div>
                            <div className="text-muted small">
                              Professional ID: {p._id}
                            </div>
                          </div>

                          {/* CENTER */}
                          <div className="col-md-4 text-center">
                            <span className="badge bg-info me-2">
                              {p.profession?.name}
                            </span>

                            <span
                              className={`badge ${
                                p.status === "approved"
                                  ? "bg-success"
                                  : p.status === "pending"
                                    ? "bg-warning text-dark"
                                    : "bg-danger"
                              }`}
                            >
                              {p.status}
                            </span>

                            <div className="small text-muted mt-2">
                              {p.userId.isMobileVerified ? (
                                <>
                                  <FaCheckCircle className="text-success me-1" />
                                  {p.userId.mobile}
                                </>
                              ) : (
                                <>
                                  <FaTimesCircle className="text-danger me-1" />
                                  N/A
                                </>
                              )}
                            </div>
                          </div>

                          {/* RIGHT */}
                          <div className="col-md-4 text-end">
                            <div className="small text-muted mb-2">
                              {p.address?.addressLine}
                            </div>
                            <button
                              className="btn btn-sm btn-outline-primary me-2"
                              data-bs-toggle="offcanvas"
                              data-bs-target={`#collapse-${p._id}`}
                              aria-expanded="false"
                              aria-controls={`collapse-${p._id}`}
                            >
                              <FaEye />
                            </button>
                            <button className="btn btn-sm btn-outline-danger">
                              <FaBan />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div
                        className="offcanvas offcanvas-top"
                        tabindex="-1"
                        id={`collapse-${p._id}`}
                        aria-labelledby="offcanvasTopLabel"
                        style={{ height: "100vh" }}
                      >
                        <div className="offcanvas-header">
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="offcanvas"
                            aria-label="Close"
                          ></button>
                        </div>
                        <div className="offcanvas-body">
                          <ProfessionalDetailCard p={p} />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSearch;
