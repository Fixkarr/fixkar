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

/**
 * bookings[] expected shape:
 * {
 *   _id,
 *   status: "pending" | "ongoing" | "completed" | "cancelled" | "rejected",
 *   customerId: {_id},
 *   professionalId: {_id}
 * }
 */

const AdminBookings = () => {
    const bookings = [
  {
    _id: "BK1001",
    status: "pending",
    customerId: {
      _id: "CUST001",
    },
    professionalId: {
      _id: "PROF001",
    },
  },
  {
    _id: "BK1002",
    status: "ongoing",
    customerId: {
      _id: "CUST002",
    },
    professionalId: {
      _id: "PROF002",
    },
  },
  {
    _id: "BK1003",
    status: "completed",
    customerId: {
      _id: "CUST003",
    },
    professionalId: {
      _id: "PROF001",
    },
  },
  {
    _id: "BK1004",
    status: "cancelled",
    customerId: {
      _id: "CUST004",
    },
    professionalId: {
      _id: "PROF003",
    },
  },
  {
    _id: "BK1005",
    status: "rejected",
    customerId: {
      _id: "CUST005",
    },
    professionalId: {
      _id: "PROF004",
    },
  },
  {
    _id: "BK1006",
    status: "pending",
    customerId: {
      _id: "CUST002",
    },
    professionalId: {
      _id: "PROF003",
    },
  },
  {
    _id: "BK1007",
    status: "ongoing",
    customerId: {
      _id: "CUST001",
    },
    professionalId: {
      _id: "PROF004",
    },
  },
  {
    _id: "BK1008",
    status: "completed",
    customerId: {
      _id: "CUST006",
    },
    professionalId: {
      _id: "PROF002",
    },
  },
  {
    _id: "BK1009",
    status: "cancelled",
    customerId: {
      _id: "CUST003",
    },
    professionalId: {
      _id: "PROF005",
    },
  },
  {
    _id: "BK1010",
    status: "completed",
    customerId: {
      _id: "CUST004",
    },
    professionalId: {
      _id: "PROF001",
    },
  },
];



  const [bookingId, setBookingId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [professionalId, setProfessionalId] = useState("");

  /* ================= STATS ================= */
  const stats = useMemo(() => {
    const base = {
      total: bookings.length,
      pending: 0,
      ongoing: 0,
      completed: 0,
      cancelled: 0,
      rejected: 0,
    };

    bookings.forEach((b) => {
      if (b.status === "pending") base.pending++;
      if (b.status === "ongoing") base.ongoing++;
      if (b.status === "completed") base.completed++;
      if (b.status === "cancelled") base.cancelled++;
      if (b.status === "rejected") base.rejected++;
    });

    return base;
  }, [bookings]);

  /* ================= FILTER ================= */
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchBookingId = bookingId
        ? b._id?.toLowerCase().includes(bookingId.toLowerCase())
        : true;

      const matchCustomerId = customerId
        ? b.customerId?._id
            ?.toLowerCase()
            .includes(customerId.toLowerCase())
        : true;

      const matchProfessionalId = professionalId
        ? b.professionalId?._id
            ?.toLowerCase()
            .includes(professionalId.toLowerCase())
        : true;

      return matchBookingId && matchCustomerId && matchProfessionalId;
    });
  }, [bookings, bookingId, customerId, professionalId]);

  return (
    <div className="container-fluid">

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
        <StatCard title="Total Bookings" value={stats.total} icon={<FaClipboardList />} color="primary" />
        <StatCard title="Pending" value={stats.pending} icon={<FaClock />} color="warning" />
        <StatCard title="Ongoing" value={stats.ongoing} icon={<FaSpinner />} color="info" />
        <StatCard title="Completed" value={stats.completed} icon={<FaCheckCircle />} color="success" />
        <StatCard title="Cancelled" value={stats.cancelled} icon={<FaTimesCircle />} color="secondary" />
        <StatCard title="Rejected" value={stats.rejected} icon={<FaBan />} color="danger" />
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
              >
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-bold">Booking ID</div>
                    <div className="text-muted small">{b._id}</div>
                    <div className="small text-muted">
                      Customer: {b.customerId?._id}
                    </div>
                    <div className="small text-muted">
                      Professional: {b.professionalId?._id}
                    </div>
                  </div>

                  <span
                    className={`badge px-3 py-2 ${
                      b.status === "completed"
                        ? "bg-success"
                        : b.status === "pending"
                        ? "bg-warning text-dark"
                        : b.status === "ongoing"
                        ? "bg-info"
                        : b.status === "cancelled"
                        ? "bg-secondary"
                        : "bg-danger"
                    }`}
                  >
                    {b.status}
                  </span>
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
