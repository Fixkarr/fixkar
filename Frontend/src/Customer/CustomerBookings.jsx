// pages/MyBookings.jsx

import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaClipboardList,
  FaCheckCircle,
  FaClock,
  FaArrowRight,
  FaCalendarCheck,
} from "react-icons/fa";

import NoBookingsPlaceholder from "../Components/NoBookingsPlaceholder";
import CusBookingCard from "./customerBooking/CusBookingCard";
import useGetMyBookings from "../hooks/useGetMyBookings";
import FixkarLoader from "../Components/FixkarLoader";
import DashboardNavigator from "../utils/DashboardNavigator";

import "../css/customerBookings.css";

const CustomerBookings = () => {
  useGetMyBookings();

  const { myBookings } = useSelector((state) => state.bookings);
  const navigate = useNavigate();

  // Loader check MUST come before using myBookings
  if (!myBookings) {
    return <FixkarLoader />;
  }

  const total = myBookings.length;
  const completed = myBookings.filter(
    (b) => b.status === "completed"
  ).length;

  const active = myBookings.filter(
    (b) => b.status !== "completed"
  ).length;

  return total !== 0 ? (
    <div className="customer-bookings-page">

      {/* =========================================
          PREMIUM HERO SECTION
      ========================================= */}
      <section className="customer-bookings-hero">

        {/* Decorative glow */}
        <div className="customer-bookings-glow customer-bookings-glow-one" />
        <div className="customer-bookings-glow customer-bookings-glow-two" />

        <div className="customer-bookings-hero-content">

          <div className="customer-bookings-hero-text">

            <div className="customer-bookings-eyebrow">
              <span className="customer-bookings-live-dot" />
              CUSTOMER DASHBOARD
            </div>

            <h1>
              My Bookings
            </h1>

            <p>
              Track, manage and review your Fixkar services
              effortlessly.
            </p>

            <div className="customer-bookings-hero-meta">
              <div className="customer-bookings-meta-icon">
                <FaCalendarCheck />
              </div>

              <div>
                <span>YOUR SERVICE ACTIVITY</span>
                <strong>
                  {total} {total === 1 ? "Booking" : "Bookings"}
                </strong>
              </div>
            </div>

          </div>

          <div className="customer-bookings-dashboard-nav">
            <DashboardNavigator />
          </div>

        </div>
      </section>


      {/* =========================================
          QUICK STATS
      ========================================= */}
      <section className="customer-bookings-stats-section">

        <div className="customer-bookings-container">

          <div className="customer-bookings-stats-grid">

            {/* Total */}
            <div className="customer-stat-card customer-stat-total">

              <div className="customer-stat-top">

                <div className="customer-stat-icon">
                  <FaClipboardList />
                </div>

                <span className="customer-stat-label">
                  TOTAL
                </span>

              </div>

              <div className="customer-stat-value">
                {total}
              </div>

              <div className="customer-stat-description">
                All your Fixkar bookings
              </div>

              <div className="customer-stat-line" />

            </div>


            {/* Active */}
            <div className="customer-stat-card customer-stat-active">

              <div className="customer-stat-top">

                <div className="customer-stat-icon">
                  <FaClock />
                </div>

                <span className="customer-stat-label">
                  ACTIVE
                </span>

              </div>

              <div className="customer-stat-value">
                {active}
              </div>

              <div className="customer-stat-description">
                Services currently in progress
              </div>

              <div className="customer-stat-line" />

            </div>


            {/* Completed */}
            <div className="customer-stat-card customer-stat-completed">

              <div className="customer-stat-top">

                <div className="customer-stat-icon">
                  <FaCheckCircle />
                </div>

                <span className="customer-stat-label">
                  COMPLETED
                </span>

              </div>

              <div className="customer-stat-value">
                {completed}
              </div>

              <div className="customer-stat-description">
                Successfully completed services
              </div>

              <div className="customer-stat-line" />

            </div>

          </div>

        </div>

      </section>


      {/* =========================================
          BOOKING LIST HEADER
      ========================================= */}
      <section className="customer-bookings-list-section">

        <div className="customer-bookings-container">

          <div className="customer-bookings-list-header">

            <div>
              <span className="customer-section-eyebrow">
                SERVICE HISTORY
              </span>

              <h2>
                Your Bookings
              </h2>

              <p>
                View and manage all your requested services.
              </p>
            </div>

            <div className="customer-bookings-count">
              <span>{total}</span>
              <small>
                {total === 1 ? "Booking" : "Bookings"}
              </small>
            </div>

          </div>


          {/* =========================================
              BOOKING LIST
          ========================================= */}
          <div className="customer-bookings-list">

            {myBookings.map((booking) => (

              <div
                className="customer-booking-wrapper"
                key={booking._id}
              >
                <CusBookingCard booking={booking} />
              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =========================================
          FLOATING HIRE BUTTON
      ========================================= */}
      <button
        type="button"
        className="customer-hire-floating-btn"
        onClick={() =>
          navigate("/customer/hire-professionals")
        }
        aria-label="Hire a professional"
      >
        <span className="customer-hire-icon">
          <FaPlus />
        </span>

        <span className="customer-hire-text">
          <strong>Hire Professional</strong>
          <small>Book a new service</small>
        </span>

        <span className="customer-hire-arrow">
          <FaArrowRight />
        </span>
      </button>

    </div>
  ) : (
    <NoBookingsPlaceholder />
  );
};

export default CustomerBookings;