import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaClipboardList,
  FaClock,
  FaCheckCircle,
  FaSearch,
  FaCalendarAlt,
  FaTimes,
} from "react-icons/fa";

import NoBookingsPlaceholder from "../Components/NoBookingsPlaceholder";
import ProBookingCard from "./professionalBooking/ProBookingCard";
import useGetMyBookings from "../hooks/useGetMyBookings";
import FixkarLoader from "../Components/FixkarLoader";
import DashboardNavigator from "../utils/DashboardNavigator";
import { useMemo, useState } from "react";

import '../css/professionalBooking.css'

export default function ProfessionalBookings() {
  useGetMyBookings();

  const navigate = useNavigate();
  const { myBookings } = useSelector((state) => state.bookings);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const total = myBookings?.length || 0;
  const completed = myBookings?.filter(b => b.status === "completed").length;
  const pending = myBookings?.filter(b => b.status !== "completed").length;

  const filteredBookings = useMemo(() => {
  if (!myBookings) return [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return myBookings.filter((booking) => {
    // 🔎 Search
    const query = search.trim().toLowerCase();

    const matchesSearch =
      !query ||
      booking?.customerName?.toLowerCase().includes(query) ||
      booking?._id?.toLowerCase().includes(query) ||
      booking?.workAddress?.toLowerCase().includes(query);

    if (!matchesSearch) return false;

    // 📅 Booking date
    const bookingDate = booking?.workDate
      ? new Date(booking.workDate)
      : null;

    if (bookingDate) {
      bookingDate.setHours(0, 0, 0, 0);
    }

    // From date
    if (fromDate && bookingDate) {
      const from = new Date(fromDate);
      from.setHours(0, 0, 0, 0);

      if (bookingDate < from) return false;
    }

    // To date
    if (toDate && bookingDate) {
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);

      if (bookingDate > to) return false;
    }

    // Quick filters
    if (activeFilter === "today") {
      if (!bookingDate || bookingDate.getTime() !== today.getTime()) {
        return false;
      }
    }

    if (activeFilter === "upcoming") {
      if (!bookingDate || bookingDate < today) {
        return false;
      }
    }

    if (activeFilter === "completed") {
      if (booking?.status !== "completed") {
        return false;
      }
    }

    return true;
  });
}, [
  myBookings,
  search,
  fromDate,
  toDate,
  activeFilter,
]);

  if (!myBookings) {
  return <FixkarLoader />
}

  return (
    <div className="professional-bookings-page container-fluid p-0">

      {/* 🔵 Gradient Header */}
      <div className="professional-bookings-hero">
  <div className="professional-bookings-hero-glow professional-bookings-glow-one" />
  <div className="professional-bookings-hero-glow professional-bookings-glow-two" />

  <div className="professional-bookings-hero-content">
    <div>
      <div className="professional-bookings-eyebrow">
        <span className="professional-bookings-live-dot" />
        PROFESSIONAL DASHBOARD
      </div>

      <h1>My Bookings</h1>

      <p>
        Manage, track and organize your Fixkar bookings effortlessly.
      </p>
    </div>

    <DashboardNavigator />
  </div>
</div>

      <div className="container professional-bookings-search-wrap">

  <div
    className="professional-bookings-filter-card"
  >

    <div className="p-3 p-md-4">

      {/* Search */}
      <div
       className="professional-bookings-search-box"
      >
        <FaSearch className="text-primary" />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customer, booking ID or address..."
          className="border-0 bg-transparent w-100"
          style={{
            outline: "none",
            fontSize: "14px",
          }}
        />

        {search && (
          <button
            type="button"
            className="btn btn-sm p-0 text-muted"
            onClick={() => setSearch("")}
          >
            <FaTimes />
          </button>
        )}
      </div>

      {/* Date filters */}
      <div className="row g-2 mt-2">

     <div className="col-6">
  <div className="professional-bookings-date-box">

            <FaCalendarAlt className="text-primary" />

            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border-0 bg-transparent w-100"
              style={{ outline: "none", fontSize: "13px" }}
            />
          </div>
        </div>

        <div className="col-6">
  <div className="professional-bookings-date-box">

            <FaCalendarAlt className="text-primary" />

            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border-0 bg-transparent w-100"
              style={{ outline: "none", fontSize: "13px" }}
            />
          </div>
        </div>

      </div>

      {/* Quick filters */}
     <div className="professional-bookings-filter-pill">
  {[
    ["all", "All"],
    ["today", "Today"],
    ["upcoming", "Upcoming"],
    ["completed", "Completed"],
  ].map(([value, label]) => (
    <button
      key={value}
      type="button"
      onClick={() => setActiveFilter(value)}
      className={`btn btn-sm rounded-pill px-3 flex-shrink-0 ${
        activeFilter === value ? "active" : ""
      }`}
    >
      {label}
    </button>
  ))}
</div>

      {/* Result count */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <small className="text-muted">
          Showing{" "}
          <strong className="text-dark">
            {filteredBookings.length}
          </strong>{" "}
          of {total} bookings
        </small>

        {(search || fromDate || toDate || activeFilter !== "all") && (
          <button
            type="button"
            className="btn btn-sm text-primary fw-semibold"
            onClick={() => {
              setSearch("");
              setFromDate("");
              setToDate("");
              setActiveFilter("all");
            }}
          >
            Clear filters
          </button>
        )}
      </div>

    </div>
  </div>

</div>

      {/* 🔵 Stats Section */}
      <div className="container professional-bookings-stats">
        <div className="row g-3">

          <div className="col-4">
           <div className="professional-stat-card">
              <div className="card-body">
                <FaClipboardList className="text-primary mb-2" />
                <h6 className="fw-bold">{total}</h6>
                <small>Total</small>
              </div>
            </div>
          </div>

          <div className="col-4">
           <div className="professional-stat-card">
              <div className="card-body">
                <FaClock className="text-warning mb-2" />
                <h6 className="fw-bold">{pending}</h6>
                <small>Pending</small>
              </div>
            </div>
          </div>

          <div className="col-4">
          <div className="professional-stat-card">
              <div className="card-body">
                <FaCheckCircle className="text-success mb-2" />
                <h6 className="fw-bold">{completed}</h6>
                <small>Completed</small>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 🔵 Booking List */}
     <div className="container professional-bookings-list mt-4 mb-5">
       {filteredBookings.length === 0 ? (
  <div
    className="text-center py-5"
    style={{
      background: "#f8fafc",
      borderRadius: "20px",
      border: "1px dashed #dbe4ef",
    }}
  >
    <div
      className="mx-auto mb-3 d-flex align-items-center justify-content-center"
      style={{
        width: 54,
        height: 54,
        borderRadius: "16px",
        background: "#eaf3ff",
        color: "#0d6efd",
      }}
    >
      <FaSearch />
    </div>

    <h6 className="fw-bold mb-1">
      No bookings found
    </h6>

    <p className="text-muted small mb-3">
      Try another customer, booking ID or date range.
    </p>

    <button
      type="button"
      className="btn btn-sm btn-primary rounded-pill px-4"
      onClick={() => {
        setSearch("");
        setFromDate("");
        setToDate("");
        setActiveFilter("all");
      }}
    >
      Clear filters
    </button>
  </div>
) : (
  filteredBookings.map((booking) => (
    <div
      key={booking._id}
      className="card border-0 shadow-sm mb-4 rounded-4"
    >
      <ProBookingCard booking={booking} />
    </div>
  ))
)}
      </div>

    </div>
  ) 
}