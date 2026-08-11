import React, { useEffect, useRef, useState } from "react";
import {
  FaUsers,
  FaUserTie,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaBan,
  FaSearch,
  FaFilter,
  FaRedo,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { ClipLoader } from "react-spinners";

import ProfessionalDetailCard from "./Utils/ProfessionalDetailCard";

const AdminSearch = ({
  customers = [],
  professionals = [],

  customerPagination,
  professionalPagination,

  customerLoading,
  professionalLoading,

  fetchCustomers,
  fetchProfessionals,
}) => {
  // ==========================================
  // STATES
  // ==========================================

  const [selectedType, setSelectedType] = useState("customer");

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");

  const [verified, setVerified] = useState("");

  const [page, setPage] = useState(1);

  const limit = 10;

  const firstRender = useRef(true);

  // ==========================================
  // CURRENT DATA
  // ==========================================

  const isCustomer = selectedType === "customer";

  const currentData = isCustomer
    ? customers
    : professionals;

  const currentPagination = isCustomer
    ? customerPagination
    : professionalPagination;

  const loading = isCustomer
    ? customerLoading
    : professionalLoading;

  const total = currentPagination?.total || 0;

  const totalPages = currentPagination?.totalPages || 0;

  // ==========================================
  // FETCH DATA
  // ==========================================

  const loadData = ({
    targetPage = 1,
    targetSearch = search,
    targetStatus = status,
    targetVerified = verified,
  } = {}) => {
    if (isCustomer) {
      fetchCustomers({
        page: targetPage,
        limit,
        search: targetSearch,
      });
    } else {
      fetchProfessionals({
        page: targetPage,
        limit,
        search: targetSearch,
        status: targetStatus,
        verified: targetVerified,
      });
    }
  };

  // ==========================================
  // SEARCH / FILTER DEBOUNCE
  // ==========================================

  useEffect(() => {
    // Initial render par hook already API call kar raha hai
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      setPage(1);

      loadData({
        targetPage: 1,
        targetSearch: search.trim(),
        targetStatus: status,
        targetVerified: verified,
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [search, status, verified, selectedType]);

  // ==========================================
  // PAGE CHANGE
  // ==========================================

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) {
      return;
    }

    setPage(newPage);

    loadData({
      targetPage: newPage,
      targetSearch: search.trim(),
      targetStatus: status,
      targetVerified: verified,
    });
  };

  // ==========================================
  // USER TYPE CHANGE
  // ==========================================

  const handleTypeChange = (type) => {
    setSelectedType(type);

    setSearch("");
    setStatus("");
    setVerified("");
    setPage(1);
  };

  // ==========================================
  // RESET
  // ==========================================

  const handleReset = () => {
    setSearch("");
    setStatus("");
    setVerified("");
    setPage(1);

    if (isCustomer) {
      fetchCustomers({
        page: 1,
        limit: 10,
        search: "",
      });
    } else {
      fetchProfessionals({
        page: 1,
        limit: 10,
        search: "",
        status: "",
        profession: "",
        verified: "",
      });
    }
  };

  // ==========================================
  // PAGE NUMBERS
  // ==========================================

  const getPageNumbers = () => {
    if (!totalPages) return [];

    const pages = [];

    let start = Math.max(page - 2, 1);
    let end = Math.min(start + 4, totalPages);

    if (end - start < 4) {
      start = Math.max(end - 4, 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  // ==========================================
  // SHOWING TEXT
  // ==========================================

  const startItem =
    total === 0 ? 0 : (page - 1) * limit + 1;

  const endItem = Math.min(page * limit, total);

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="container-fluid px-0">

      {/* ==========================================
          SEARCH HEADER
      ========================================== */}

      <div className="card border-0 shadow-lg rounded-4 mb-4 overflow-hidden">

        <div
          className="card-header border-0 text-white p-4"
          style={{
            background:
              "linear-gradient(135deg, #0d6efd, #084298)",
          }}
        >
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">

            <div>
              <h5 className="fw-bold mb-1">
                <FaSearch className="me-2" />
                User Search
              </h5>

              <p className="mb-0 opacity-75 small">
                Search and manage FixKar users efficiently
              </p>
            </div>

            <div className="d-flex gap-2">

              <button
                type="button"
                className={`btn ${
                  isCustomer
                    ? "btn-light text-primary"
                    : "btn-outline-light"
                } rounded-pill px-3`}
                onClick={() =>
                  handleTypeChange("customer")
                }
              >
                <FaUsers className="me-2" />
                Customers
              </button>

              <button
                type="button"
                className={`btn ${
                  !isCustomer
                    ? "btn-light text-primary"
                    : "btn-outline-light"
                } rounded-pill px-3`}
                onClick={() =>
                  handleTypeChange("professional")
                }
              >
                <FaUserTie className="me-2" />
                Professionals
              </button>

            </div>
          </div>
        </div>

        {/* ==========================================
            FILTER AREA
        ========================================== */}

        <div className="card-body p-4 bg-white">

          <div className="row g-3">

            {/* SEARCH */}

            <div
              className={
                isCustomer
                  ? "col-lg-9"
                  : "col-lg-6"
              }
            >
              <label className="form-label fw-semibold small">
                Search
              </label>

              <div className="input-group">

                <span className="input-group-text bg-light border-end-0">
                  <FaSearch className="text-muted" />
                </span>

                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder={
                    isCustomer
                      ? "Name, email, mobile, User ID or Customer ID"
                      : "Name, email, mobile, User ID or Professional ID"
                  }
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>
            </div>

            {/* PROFESSIONAL STATUS */}

            {!isCustomer && (
              <div className="col-lg-3">

                <label className="form-label fw-semibold small">
                  Status
                </label>

                <select
                  className="form-select"
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value)
                  }
                >
                  <option value="">
                    All Status
                  </option>

                  <option value="pending">
                    Pending
                  </option>

                  <option value="approved">
                    Approved
                  </option>

                  <option value="rejected">
                    Rejected
                  </option>

                  <option value="suspended">
                    Suspended
                  </option>
                </select>

              </div>
            )}

            {/* PROFESSIONAL VERIFICATION */}

            {!isCustomer && (
              <div className="col-lg-3">

                <label className="form-label fw-semibold small">
                  Mobile Verification
                </label>

                <select
                  className="form-select"
                  value={verified}
                  onChange={(e) =>
                    setVerified(e.target.value)
                  }
                >
                  <option value="">
                    All Users
                  </option>

                  <option value="true">
                    Verified
                  </option>

                  <option value="false">
                    Not Verified
                  </option>
                </select>

              </div>
            )}

            {/* RESET */}

            <div
              className={
                isCustomer
                  ? "col-lg-3 d-flex align-items-end"
                  : "col-lg-3 d-flex align-items-end"
              }
            >
              <button
                type="button"
                className="btn btn-outline-secondary w-100"
                onClick={handleReset}
              >
                <FaRedo className="me-2" />
                Reset Filters
              </button>
            </div>

          </div>

          {/* ACTIVE FILTER INFO */}

          {(search || status || verified) && (
            <div className="mt-3 pt-3 border-top">

              <div className="d-flex align-items-center gap-2 flex-wrap">

                <span className="text-muted small">
                  <FaFilter className="me-1" />
                  Active filters:
                </span>

                {search && (
                  <span className="badge bg-primary-subtle text-primary rounded-pill">
                    Search: {search}
                  </span>
                )}

                {status && (
                  <span className="badge bg-warning-subtle text-warning-emphasis rounded-pill">
                    Status: {status}
                  </span>
                )}

                {verified === "true" && (
                  <span className="badge bg-success-subtle text-success rounded-pill">
                    Mobile Verified
                  </span>
                )}

                {verified === "false" && (
                  <span className="badge bg-danger-subtle text-danger rounded-pill">
                    Mobile Not Verified
                  </span>
                )}

              </div>

            </div>
          )}

        </div>
      </div>

      {/* ==========================================
          RESULTS HEADER
      ========================================== */}

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-3">

        <div>
          <h5 className="fw-bold mb-1 text-white">

            {isCustomer ? (
              <>
                <FaUsers className="me-2 text-info" />
                Customers
              </>
            ) : (
              <>
                <FaUserTie className="me-2 text-warning" />
                Professionals
              </>
            )}

          </h5>

          <small className="text-white-50">
            {total > 0
              ? `Showing ${startItem}–${endItem} of ${total}`
              : "No users found"}
          </small>
        </div>

        <span className="badge bg-light text-dark rounded-pill px-3 py-2">
          {total} Total
        </span>

      </div>

      {/* ==========================================
          LOADING
      ========================================== */}

      {loading ? (
        <div className="card border-0 shadow-sm rounded-4">

          <div
            className="d-flex flex-column justify-content-center align-items-center"
            style={{ minHeight: "300px" }}
          >

            <ClipLoader
              size={40}
              color="#0d6efd"
            />

            <div className="text-muted mt-3">
              Loading users...
            </div>

          </div>

        </div>
      ) : currentData.length === 0 ? (

        /* ==========================================
            EMPTY STATE
        ========================================== */

        <div className="card border-0 shadow-sm rounded-4">

          <div className="text-center py-5">

            <div
              className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center bg-light"
              style={{
                width: "70px",
                height: "70px",
              }}
            >
              {isCustomer ? (
                <FaUsers
                  size={28}
                  className="text-muted"
                />
              ) : (
                <FaUserTie
                  size={28}
                  className="text-muted"
                />
              )}
            </div>

            <h6 className="fw-bold">
              No {isCustomer ? "customers" : "professionals"} found
            </h6>

            <p className="text-muted small mb-3">
              Try changing your search or filters.
            </p>

            <button
              className="btn btn-sm btn-outline-primary rounded-pill px-3"
              onClick={handleReset}
            >
              <FaRedo className="me-2" />
              Clear Filters
            </button>

          </div>

        </div>
      ) : (

        /* ==========================================
            RESULTS
        ========================================== */

        <div className="d-flex flex-column gap-3">

          {/* ========================================
              CUSTOMER CARDS
          ======================================== */}

          {isCustomer &&
            currentData.map((c) => (
              <div
                key={c?._id}
                className="card border-0 shadow-sm rounded-4"
              >
                <div className="card-body p-3 p-md-4">

                  <div className="row align-items-center g-3">

                    {/* USER INFO */}

                    <div className="col-lg-5">

                      <div className="d-flex align-items-center">

                        <div
                          className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center me-3 fw-bold"
                          style={{
                            width: "48px",
                            height: "48px",
                          }}
                        >
                          {c?.userId?.fullName
                            ?.charAt(0)
                            ?.toUpperCase() || "U"}
                        </div>

                        <div className="overflow-hidden">

                          <h6 className="fw-bold mb-1 text-truncate">
                            {c?.userId?.fullName ||
                              "Unknown User"}
                          </h6>

                          <div className="small text-muted text-truncate">
                            {c?.userId?.email || "No email"}
                          </div>

                        </div>

                      </div>

                      <div className="mt-3 d-flex flex-column gap-1">

                        <small className="text-muted">
                          <strong>User ID:</strong>{" "}
                          {c?.userId?._id}
                        </small>

                        <small className="text-muted">
                          <strong>Customer ID:</strong>{" "}
                          {c?._id}
                        </small>

                      </div>

                    </div>

                    {/* TERMS */}

                    <div className="col-lg-4">

                      <div className="small text-muted mb-1">
                        Terms Accepted
                      </div>

                      <div className="fw-semibold small">

                        {c?.userId?.termsAcceptance
                          ?.acceptedAt
                          ? new Date(
                              c.userId.termsAcceptance.acceptedAt
                            ).toLocaleString()
                          : "Not available"}

                      </div>

                      <div className="small text-muted mt-1">
                        Policy:{" "}
                        {c?.userId?.termsAcceptance
                          ?.policyVersion || "—"}
                      </div>

                      <div className="small text-muted">
                        IP:{" "}
                        {c?.userId?.termsAcceptance
                          ?.acceptedIP || "—"}
                      </div>

                    </div>

                    {/* VERIFICATION */}

                    <div className="col-lg-3 text-lg-end">

                      {c?.userId?.isMobileVerified ? (
                        <span className="badge bg-success-subtle text-success rounded-pill px-3 py-2">

                          <FaCheckCircle className="me-1" />

                          Verified

                        </span>
                      ) : (
                        <span className="badge bg-danger-subtle text-danger rounded-pill px-3 py-2">

                          <FaTimesCircle className="me-1" />

                          Not Verified

                        </span>
                      )}

                      <div className="small text-muted mt-2">

                        {c?.userId?.isMobileVerified
                          ? c?.userId?.mobile
                          : "Mobile not verified"}

                      </div>

                    </div>

                  </div>

                </div>
              </div>
            ))}

          {/* ========================================
              PROFESSIONAL CARDS
          ======================================== */}

          {!isCustomer &&
            currentData.map((p) => (
              <div
                key={p?._id}
                className="card border-0 shadow-sm rounded-4"
              >
                <div className="card-body p-3 p-md-4">

                  <div className="row align-items-center g-3">

                    {/* USER INFO */}

                    <div className="col-lg-4">

                      <div className="d-flex align-items-center">

                        <div
                          className="rounded-circle bg-warning-subtle text-warning-emphasis d-flex align-items-center justify-content-center me-3 fw-bold"
                          style={{
                            width: "48px",
                            height: "48px",
                          }}
                        >
                          {p?.userId?.fullName
                            ?.charAt(0)
                            ?.toUpperCase() || "P"}
                        </div>

                        <div className="overflow-hidden">

                          <h6 className="fw-bold mb-1 text-truncate">
                            {p?.userId?.fullName ||
                              "Unknown Professional"}
                          </h6>

                          <div className="small text-muted text-truncate">
                            {p?.userId?.email ||
                              "No email"}
                          </div>

                        </div>

                      </div>

                      <div className="mt-3">

                        <small className="text-muted d-block text-truncate">
                          User ID: {p?.userId?._id}
                        </small>

                        <small className="text-muted d-block text-truncate">
                          Professional ID: {p?._id}
                        </small>

                      </div>

                    </div>

                    {/* PROFESSION + STATUS */}

                    <div className="col-lg-4">

                      <div className="d-flex flex-wrap gap-2 mb-2">

                        <span className="badge bg-info-subtle text-info-emphasis rounded-pill px-3 py-2">
                          {p?.profession?.name ||
                            "Profession not set"}
                        </span>

                        <span
                          className={`badge rounded-pill px-3 py-2 ${
                            p?.status === "approved"
                              ? "bg-success-subtle text-success"
                              : p?.status === "pending"
                                ? "bg-warning-subtle text-warning-emphasis"
                                : "bg-danger-subtle text-danger"
                          }`}
                        >
                          {p?.status || "Unknown"}
                        </span>

                      </div>

                      <div className="small text-muted">

                        {p?.userId?.isMobileVerified ? (
                          <>
                            <FaCheckCircle className="text-success me-1" />
                            {p?.userId?.mobile}
                          </>
                        ) : (
                          <>
                            <FaTimesCircle className="text-danger me-1" />
                            Mobile not verified
                          </>
                        )}

                      </div>

                    </div>

                    {/* ACTIONS */}

                    <div className="col-lg-4 text-lg-end">

                      <div className="small text-muted text-truncate mb-3">
                        {p?.address?.addressLine ||
                          "Address not available"}
                      </div>

                      <div className="d-flex justify-content-lg-end gap-2">

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary rounded-pill px-3"
                          data-bs-toggle="offcanvas"
                          data-bs-target={`#professional-${p?._id}`}
                          aria-controls={`professional-${p?._id}`}
                        >
                          <FaEye className="me-1" />
                          View
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger rounded-pill px-3"
                        >
                          <FaBan className="me-1" />
                          Ban
                        </button>

                      </div>

                    </div>

                  </div>

                </div>

                {/* ====================================
                    PROFESSIONAL DETAIL OFFCANVAS
                ==================================== */}

                <div
                  className="offcanvas offcanvas-top"
                  tabIndex="-1"
                  id={`professional-${p?._id}`}
                  aria-labelledby={`professional-label-${p?._id}`}
                  style={{
                    height: "100vh",
                  }}
                >

                  <div className="offcanvas-header border-bottom">

                    <div>

                      <h5
                        className="offcanvas-title fw-bold"
                        id={`professional-label-${p?._id}`}
                      >
                        Professional Details
                      </h5>

                      <small className="text-muted">
                        {p?.userId?.fullName}
                      </small>

                    </div>

                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="offcanvas"
                      aria-label="Close"
                    />

                  </div>

                  <div className="offcanvas-body bg-light">

                    <ProfessionalDetailCard p={p} />

                  </div>

                </div>

              </div>
            ))}

        </div>
      )}

      {/* ==========================================
          PAGINATION
      ========================================== */}

      {!loading && totalPages > 1 && (
        <div className="card border-0 shadow-sm rounded-4 mt-4">

          <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">

            <div className="small text-muted">
              Page <strong>{page}</strong> of{" "}
              <strong>{totalPages}</strong>
            </div>

            <nav>
              <ul className="pagination pagination-sm mb-0">

                {/* PREVIOUS */}

                <li
                  className={`page-item ${
                    page === 1 ? "disabled" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="page-link"
                    onClick={() =>
                      handlePageChange(page - 1)
                    }
                    disabled={page === 1}
                  >
                    <FaChevronLeft />
                  </button>
                </li>

                {/* PAGE NUMBERS */}

                {getPageNumbers().map((pageNumber) => (
                  <li
                    key={pageNumber}
                    className={`page-item ${
                      pageNumber === page
                        ? "active"
                        : ""
                    }`}
                  >
                    <button
                      type="button"
                      className="page-link"
                      onClick={() =>
                        handlePageChange(pageNumber)
                      }
                    >
                      {pageNumber}
                    </button>
                  </li>
                ))}

                {/* NEXT */}

                <li
                  className={`page-item ${
                    page >= totalPages
                      ? "disabled"
                      : ""
                  }`}
                >
                  <button
                    type="button"
                    className="page-link"
                    onClick={() =>
                      handlePageChange(page + 1)
                    }
                    disabled={page >= totalPages}
                  >
                    <FaChevronRight />
                  </button>
                </li>

              </ul>
            </nav>

          </div>

        </div>
      )}

    </div>
  );
};

export default AdminSearch;