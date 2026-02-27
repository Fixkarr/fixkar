// pages/MyBookings.jsx
import React, { useEffect } from "react";
import { useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBell,
  FaPlus,
  FaClipboardList,
  FaCheckCircle,
  FaClock
} from "react-icons/fa";

import NoBookingsPlaceholder from "../Components/NoBookingsPlaceholder";

import CusBookingCard from "./customerBooking/CusBookingCard";
import useGetMyBookings from "../hooks/useGetMyBookings";

const CustomerBookings = () => {
  useGetMyBookings();
  const { myBookings } = useSelector((state) => state.bookings);
  const navigate = useNavigate();

  const total = myBookings.length;
  const completed = myBookings.filter(b => b.status === "completed").length;
  const active = myBookings.filter(b => b.status !== "completed").length;

  return total !== 0 ? (
    <div className="container-fluid p-0">

      {/* 🔵 Header Section */}
      <div
        className="text-white p-4"
        style={{
          background: "linear-gradient(135deg,#0d6efd,#00c6ff)",
          borderBottomLeftRadius: "25px",
          borderBottomRightRadius: "25px"
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="fw-bold mb-0">My Bookings</h5>

          <div className="d-flex gap-3 fs-5">
            <FaHome role="button" size={20} onClick={() => navigate("/customer/home")} />
            <FaBell role="button" size={20} onClick={() => navigate("/customer/notifications")} />
          </div>
        </div>

        <p className="mt-2 small opacity-75">
          Track, manage and review your Fixkar services
        </p>
      </div>

      {/* 🔵 Quick Stats */}
      <div className="container mt-4">
        <div className="row g-3">

          <div className="col-4">
            <div className="card shadow-sm text-center border-0">
              <div className="card-body">
                <FaClipboardList className="text-primary mb-2" />
                <h6 className="fw-bold">{total}</h6>
                <small>Total</small>
              </div>
            </div>
          </div>

          <div className="col-4">
            <div className="card shadow-sm text-center border-0">
              <div className="card-body">
                <FaClock className="text-warning mb-2" />
                <h6 className="fw-bold">{active}</h6>
                <small>Active</small>
              </div>
            </div>
          </div>

          <div className="col-4">
            <div className="card shadow-sm text-center border-0">
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
      <div className="container mt-4 mb-5">
        {myBookings.map((booking) => (
          <div className="card border-0 shadow-sm mb-4 rounded-4" key={booking._id}>
            <CusBookingCard booking={booking} />
          </div>
        ))}
      </div>

      {/* 🔵 Floating Hire Button */}
      <button
        className="btn btn-primary rounded-circle shadow-lg"
        style={{
          position: "fixed",
          bottom: "80px",
          right: "20px",
          width: "60px",
          height: "60px"
        }}
        onClick={() => navigate("/customer/hire-professionals")}
      >
        <FaPlus />
      </button>

    </div>
  ) : (
    <NoBookingsPlaceholder />
  );
};

export default CustomerBookings;