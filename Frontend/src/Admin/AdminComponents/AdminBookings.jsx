import React, { useMemo, useState } from "react";
import {
  FaClipboardList,
  FaClock,
  FaSpinner,
  FaTimesCircle,
  FaBan,
  FaCheckCircle,
  FaSearch,
} from "react-icons/fa";
import StatCard from "./Utils/StatCard";
import useGetAllBookings from "../../hooks/useGetAllBookings";
import { GetStatusBadge } from "../../utils/GetStatusBadge";
import { getBookingCountByStatus } from "../AdminFunctions/getBookingCountByStatus";
import { useNavigate } from "react-router-dom";

const adminpath = import.meta.env.VITE_ADMIN_PATH

const AdminBookings = () => {
  const bookings = useGetAllBookings()
    const navigate = useNavigate();
  const [bookingId, setBookingId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [professionalId, setProfessionalId] = useState("");


  /* ================= FILTER ================= */
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchBookingId = bookingId
        ? b._id?.toLowerCase().includes(bookingId.toLowerCase())
        : true;

      const matchCustomerId = customerId
        ? b.customerId
            ?.toLowerCase()
            .includes(customerId.toLowerCase())
        : true;

      const matchProfessionalId = professionalId
        ? b.professionalId
            ?.toLowerCase()
            .includes(professionalId.toLowerCase())
        : true;

      return matchBookingId && matchCustomerId && matchProfessionalId;
    });
  }, [bookings, bookingId, customerId, professionalId]);

  return (
    <div className="container-fluid"
     style={{
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        minHeight: "100vh",
      }}
    >

      {/* ================= HEADER ================= */}
      <div className="card border-0 shadow-lg rounded-4 mb-4 bg-dark text-white">
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <h4 className="fw-bold mb-1 d-flex align-items-center">
              <FaClipboardList className="me-2 text-warning" />
              Booking Management
            </h4>
            <p className="mb-0 opacity-75">
              Monitor & manage all service bookings
            </p>
          </div>
          <span className="badge bg-warning text-dark px-3 py-2">
            Admin Panel
          </span>
        </div>
      </div>

      {/* ================= STATS CARDS ================= */}
      <div className="row g-4 mb-4">
        <StatCard
          title="Total Bookings"
          value={bookings?.length}
          icon={<FaClock />}
          color="primary"
        />
        <StatCard
          title="Cancelled Bookings"
          value={getBookingCountByStatus(bookings, 'cancelled')}
          icon={<FaSpinner />}
          color="success"
        />
        <StatCard
          title="Rejected Bookings"
          value={getBookingCountByStatus(bookings, 'rejected')}
          icon={<FaTimesCircle />}
          color="warning"
        />
        <StatCard
          title="Pending Bookings"
          value={getBookingCountByStatus(bookings, 'pending')}
          icon={<FaBan />}
          color="info"
        />
         <StatCard
          title="Accepted Bookings"
          value={getBookingCountByStatus(bookings, 'accepted')}
          icon={<FaCheckCircle />}
          color="warning"
        />
         <StatCard
          title="Completed Bookings"
          value={getBookingCountByStatus(bookings, 'completed')}
          icon={<FaCheckCircle />}
          color="warning"
        />
      </div>

      {/* ================= SEARCH PANEL ================= */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body bg-light rounded-4">
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label fw-semibold">Booking ID</label>
              <div className="input-group">
                <span className="input-group-text">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by Booking ID"
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">Customer ID</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by Customer ID"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">
                Professional ID
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by Professional ID"
                value={professionalId}
                onChange={(e) => setProfessionalId(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================= RESULT LIST ================= */}
      <div className="card border-0 shadow-lg rounded-4">
        <div className="card-header bg-dark text-white fw-semibold">
          Filtered Bookings
        </div>
        <div className="p-3">
          {filteredBookings.length === 0 ? (
            <div className="text-center text-muted py-5">
              No bookings found
            </div>
          ) : (
            filteredBookings.map((b) => (
              <div
                key={b._id}
                className="card border-0 shadow-sm rounded-3 mb-3"
                role="button"
                onClick={()=>navigate(`${adminpath}/manage-bookings/${b._id}`)}
              >
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-bold">Booking ID</div>
                    <div className="text-muted small">{b._id}</div>
                    <div className="small text-muted">
                      Customer: {b.customerId}
                    </div>
                    <div className="small text-muted">
                      Professional: {b.professionalId}
                    </div>
                  </div>
                    {<GetStatusBadge status={b.status}/>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

/* ================= SMALL STAT CARD ================= */


export default AdminBookings;
