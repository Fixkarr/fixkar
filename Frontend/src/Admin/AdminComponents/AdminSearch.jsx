import React, { useEffect, useMemo, useRef, useState } from "react";
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

const LIMIT = 10;

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
  const [selectedType, setSelectedType] = useState("customer");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [verified, setVerified] = useState("");
  const [page, setPage] = useState(1);

  const searchTimerRef = useRef(null);
  const initialLoadRef = useRef(false);

  const isCustomer = selectedType === "customer";
  const currentData = isCustomer ? customers : professionals;
  const currentPagination = isCustomer
    ? customerPagination
    : professionalPagination;
  const loading = isCustomer ? customerLoading : professionalLoading;

  const total = currentPagination?.total || 0;
  const totalPages = currentPagination?.totalPages || 0;

  const fetchCurrentData = ({
    targetPage = 1,
    targetSearch = search,
    targetStatus = status,
    targetVerified = verified,
  } = {}) => {
    if (isCustomer) {
      fetchCustomers({
        page: targetPage,
        limit: LIMIT,
        search: targetSearch.trim(),
      });
      return;
    }

    fetchProfessionals({
      page: targetPage,
      limit: LIMIT,
      search: targetSearch.trim(),
      status: targetStatus,
      profession: "",
      verified: targetVerified,
    });
  };

  // Only the default tab is loaded initially.
  useEffect(() => {
    if (initialLoadRef.current) return;

    initialLoadRef.current = true;

    fetchCustomers({
      page: 1,
      limit: LIMIT,
      search: "",
    });
  }, [fetchCustomers]);

  // Debounce backend search/filter requests.
  useEffect(() => {
    if (!initialLoadRef.current) return;

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    searchTimerRef.current = setTimeout(() => {
      setPage(1);
      fetchCurrentData({
        targetPage: 1,
        targetSearch: search,
        targetStatus: status,
        targetVerified: verified,
      });
    }, 500);

    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, [search, status, verified]);

  const handleTypeChange = (type) => {
    if (type === selectedType) return;

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    setSelectedType(type);
    setSearch("");
    setStatus("");
    setVerified("");
    setPage(1);

    if (type === "customer") {
      fetchCustomers({
        page: 1,
        limit: LIMIT,
        search: "",
      });
    } else {
      fetchProfessionals({
        page: 1,
        limit: LIMIT,
        search: "",
        status: "",
        profession: "",
        verified: "",
      });
    }
  };

  const handlePageChange = (newPage) => {
    if (loading || newPage < 1 || newPage > totalPages) return;

    setPage(newPage);
    fetchCurrentData({
      targetPage: newPage,
      targetSearch: search,
      targetStatus: status,
      targetVerified: verified,
    });
  };

  const handleReset = () => {
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    setSearch("");
    setStatus("");
    setVerified("");
    setPage(1);

    if (isCustomer) {
      fetchCustomers({
        page: 1,
        limit: LIMIT,
        search: "",
      });
    } else {
      fetchProfessionals({
        page: 1,
        limit: LIMIT,
        search: "",
        status: "",
        profession: "",
        verified: "",
      });
    }
  };

  const pageNumbers = useMemo(() => {
    if (totalPages <= 1) return [];

    const maxVisiblePages = 5;
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    return Array.from(
      { length: end - start + 1 },
      (_, index) => start + index,
    );
  }, [page, totalPages]);

  const startItem = total === 0 ? 0 : (page - 1) * LIMIT + 1;
  const endItem = Math.min(page * LIMIT, total);
  const hasActiveFilters = Boolean(search || status || verified);

  return (
    <div className="container-fluid px-0">
      <div className="card border-0 shadow-lg rounded-4 mb-4 overflow-hidden">
        <div
          className="card-header border-0 text-white p-4"
          style={{ background: "linear-gradient(135deg, #0d6efd, #084298)" }}
        >
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
            <div>
              <h5 className="fw-bold mb-1">
                <FaSearch className="me-2" />
                User Management
              </h5>
              <p className="mb-0 opacity-75 small">
                Search, filter and manage FixKar users
              </p>
            </div>

            <div className="btn-group" role="group" aria-label="User type">
              <button
                type="button"
                className={`btn ${
                  isCustomer ? "btn-light text-primary" : "btn-outline-light"
                } px-3`}
                onClick={() => handleTypeChange("customer")}
              >
                <FaUsers className="me-2" />
                Customers
              </button>
              <button
                type="button"
                className={`btn ${
                  !isCustomer ? "btn-light text-primary" : "btn-outline-light"
                } px-3`}
                onClick={() => handleTypeChange("professional")}
              >
                <FaUserTie className="me-2" />
                Professionals
              </button>
            </div>
          </div>
        </div>

        <div className="card-body p-4 bg-white">
          <div className="row g-3 align-items-end">
            <div className={isCustomer ? "col-lg-9" : "col-lg-6"}>
              <label className="form-label fw-semibold small mb-2">
                Search users
              </label>
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-light border-end-0">
                  <FaSearch className="text-muted" />
                </span>
                <input
                  type="search"
                  className="form-control bg-light border-start-0 ps-1"
                  placeholder={
                    isCustomer
                      ? "Name, email, mobile, User ID or Customer ID"
                      : "Name, email, mobile, User ID or Professional ID"
                  }
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            </div>

            {!isCustomer && (
              <div className="col-lg-3">
                <label className="form-label fw-semibold small mb-2">Status</label>
                <select
                  className="form-select form-select-lg"
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            )}

            {!isCustomer && (
              <div className="col-lg-3">
                <label className="form-label fw-semibold small mb-2">
                  Mobile Verification
                </label>
                <select
                  className="form-select form-select-lg"
                  value={verified}
                  onChange={(event) => setVerified(event.target.value)}
                >
                  <option value="">All Users</option>
                  <option value="true">Verified</option>
                  <option value="false">Not Verified</option>
                </select>
              </div>
            )}

            <div className="col-lg-3">
              <button
                type="button"
                className="btn btn-outline-secondary btn-lg w-100"
                onClick={handleReset}
              >
                <FaRedo className="me-2" />
                Reset
              </button>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-3 pt-3 border-top">
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <span className="small text-muted">
                  <FaFilter className="me-1" />
                  Active filters:
                </span>
                {search && (
                  <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2">
                    Search: {search}
                  </span>
                )}
                {status && (
                  <span className="badge bg-warning-subtle text-warning-emphasis rounded-pill px-3 py-2">
                    Status: {status}
                  </span>
                )}
                {verified === "true" && (
                  <span className="badge bg-success-subtle text-success rounded-pill px-3 py-2">
                    Mobile Verified
                  </span>
                )}
                {verified === "false" && (
                  <span className="badge bg-danger-subtle text-danger rounded-pill px-3 py-2">
                    Mobile Not Verified
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3">
        <div>
          <h5 className="fw-bold mb-1 text-white">
            {isCustomer ? (
              <>
                <FaUsers className="me-2 text-info" /> Customers
              </>
            ) : (
              <>
                <FaUserTie className="me-2 text-warning" /> Professionals
              </>
            )}
          </h5>
          <small className="text-white-50">
            {total > 0 ? `Showing ${startItem}–${endItem} of ${total}` : "No users found"}
          </small>
        </div>
        <span className="badge bg-light text-dark rounded-pill px-3 py-2">
          {total} Total
        </span>
      </div>

      {loading ? (
        <div className="card border-0 shadow-sm rounded-4">
          <div
            className="d-flex flex-column justify-content-center align-items-center"
            style={{ minHeight: "280px" }}
          >
            <ClipLoader size={40} color="#0d6efd" />
            <span className="text-muted mt-3 small">
              Loading {isCustomer ? "customers" : "professionals"}...
            </span>
          </div>
        </div>
      ) : currentData.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="text-center py-5 px-3">
            <div
              className="mx-auto mb-3 rounded-circle bg-light d-flex align-items-center justify-content-center"
              style={{ width: 72, height: 72 }}
            >
              {isCustomer ? (
                <FaUsers size={28} className="text-muted" />
              ) : (
                <FaUserTie size={28} className="text-muted" />
              )}
            </div>
            <h6 className="fw-bold mb-1">
              No {isCustomer ? "customers" : "professionals"} found
            </h6>
            <p className="text-muted small mb-3">
              Try another search term or clear the filters.
            </p>
            <button
              type="button"
              className="btn btn-outline-primary rounded-pill px-3"
              onClick={handleReset}
            >
              <FaRedo className="me-2" /> Clear Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {isCustomer &&
            currentData.map((customer) => (
              <div key={customer?._id} className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-3 p-md-4">
                  <div className="row align-items-center g-3">
                    <div className="col-lg-5">
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center me-3 fw-bold flex-shrink-0"
                          style={{ width: 48, height: 48 }}
                        >
                          {customer?.userId?.fullName?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div className="overflow-hidden">
                          <h6 className="fw-bold mb-1 text-truncate">
                            {customer?.userId?.fullName || "Unknown User"}
                          </h6>
                          <div className="small text-muted text-truncate">
                            {customer?.userId?.email || "No email"}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <small className="text-muted d-block text-truncate">
                          <strong>User ID:</strong> {customer?.userId?._id || "—"}
                        </small>
                        <small className="text-muted d-block text-truncate">
                          <strong>Customer ID:</strong> {customer?._id || "—"}
                        </small>
                      </div>
                    </div>

                    <div className="col-lg-4">
                      <div className="small text-muted mb-1">Terms Acceptance</div>
                      <div className="fw-semibold small">
                        {customer?.userId?.termsAcceptance?.acceptedAt
                          ? new Date(customer.userId.termsAcceptance.acceptedAt).toLocaleString()
                          : "Not available"}
                      </div>
                      <div className="small text-muted mt-1">
                        Policy: {customer?.userId?.termsAcceptance?.policyVersion || "—"}
                      </div>
                    </div>

                    <div className="col-lg-3 text-lg-end">
                      {customer?.userId?.isMobileVerified ? (
                        <span className="badge bg-success-subtle text-success rounded-pill px-3 py-2">
                          <FaCheckCircle className="me-1" /> Verified
                        </span>
                      ) : (
                        <span className="badge bg-danger-subtle text-danger rounded-pill px-3 py-2">
                          <FaTimesCircle className="me-1" /> Not Verified
                        </span>
                      )}
                      <div className="small text-muted mt-2">
                        {customer?.userId?.mobile || "Mobile not available"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          {!isCustomer &&
            currentData.map((professional) => (
              <div key={professional?._id} className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-3 p-md-4">
                  <div className="row align-items-center g-3">
                    <div className="col-lg-4">
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle bg-warning-subtle text-warning-emphasis d-flex align-items-center justify-content-center me-3 fw-bold flex-shrink-0"
                          style={{ width: 48, height: 48 }}
                        >
                          {professional?.userId?.fullName?.charAt(0)?.toUpperCase() || "P"}
                        </div>
                        <div className="overflow-hidden">
                          <h6 className="fw-bold mb-1 text-truncate">
                            {professional?.userId?.fullName || "Unknown Professional"}
                          </h6>
                          <div className="small text-muted text-truncate">
                            {professional?.userId?.email || "No email"}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <small className="text-muted d-block text-truncate">
                          User ID: {professional?.userId?._id || "—"}
                        </small>
                        <small className="text-muted d-block text-truncate">
                          Professional ID: {professional?._id || "—"}
                        </small>
                      </div>
                    </div>

                    <div className="col-lg-4">
                      <div className="d-flex flex-wrap gap-2 mb-2">
                        <span className="badge bg-info-subtle text-info-emphasis rounded-pill px-3 py-2">
                          {professional?.profession?.name || "Profession not set"}
                        </span>
                        <span
                          className={`badge rounded-pill px-3 py-2 ${
                            professional?.status === "approved"
                              ? "bg-success-subtle text-success"
                              : professional?.status === "pending"
                                ? "bg-warning-subtle text-warning-emphasis"
                                : "bg-danger-subtle text-danger"
                          }`}
                        >
                          {professional?.status || "Unknown"}
                        </span>
                      </div>
                      <div className="small text-muted">
                        {professional?.userId?.isMobileVerified ? (
                          <>
                            <FaCheckCircle className="text-success me-1" />
                            {professional?.userId?.mobile || "Verified"}
                          </>
                        ) : (
                          <>
                            <FaTimesCircle className="text-danger me-1" />
                            Mobile not verified
                          </>
                        )}
                      </div>
                    </div>

                    <div className="col-lg-4 text-lg-end">
                      <div className="small text-muted text-truncate mb-3">
                        {professional?.address?.addressLine || "Address not available"}
                      </div>
                      <div className="d-flex justify-content-lg-end gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary rounded-pill px-3"
                          data-bs-toggle="offcanvas"
                          data-bs-target={`#professional-${professional?._id}`}
                          aria-controls={`professional-${professional?._id}`}
                        >
                          <FaEye className="me-1" /> View
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger rounded-pill px-3"
                        >
                          <FaBan className="me-1" /> Ban
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="offcanvas offcanvas-top"
                  tabIndex="-1"
                  id={`professional-${professional?._id}`}
                  aria-labelledby={`professional-label-${professional?._id}`}
                  style={{ height: "100vh" }}
                >
                  <div className="offcanvas-header border-bottom">
                    <div>
                      <h5
                        className="offcanvas-title fw-bold"
                        id={`professional-label-${professional?._id}`}
                      >
                        Professional Details
                      </h5>
                      <small className="text-muted">
                        {professional?.userId?.fullName}
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
                    <ProfessionalDetailCard p={professional} />
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="card border-0 shadow-sm rounded-4 mt-4">
          <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <div className="small text-muted">
              Page <strong>{page}</strong> of <strong>{totalPages}</strong>
            </div>
            <nav aria-label="User pagination">
              <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                  <button
                    type="button"
                    className="page-link"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1 || loading}
                    aria-label="Previous page"
                  >
                    <FaChevronLeft />
                  </button>
                </li>

                {pageNumbers.map((pageNumber) => (
                  <li
                    key={pageNumber}
                    className={`page-item ${pageNumber === page ? "active" : ""}`}
                  >
                    <button
                      type="button"
                      className="page-link"
                      onClick={() => handlePageChange(pageNumber)}
                      disabled={loading}
                    >
                      {pageNumber}
                    </button>
                  </li>
                ))}

                <li className={`page-item ${page >= totalPages ? "disabled" : ""}`}>
                  <button
                    type="button"
                    className="page-link"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages || loading}
                    aria-label="Next page"
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
