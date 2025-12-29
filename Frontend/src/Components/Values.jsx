import React from 'react'
import '../css/values.css'
import {
  FaUserShield,
  FaRupeeSign,
  FaHeadset,
  FaHandshake,
  FaCalendarCheck
} from "react-icons/fa";

const Values = () => {
  return (
    <>
    <div
  className="values py-5 mt-5"
  style={{
    background: "linear-gradient(180deg, #f8f9ff 0%, #eef3ff 100%)",
  }}
>
  {/* ===== Header ===== */}
  <div className="text-center mb-5">
    <span
      className="badge rounded-pill px-4 py-2 mb-3"
      style={{
        background: "linear-gradient(135deg, #0d6efd, #4f9cff)",
        color: "#fff",
      }}
    >
      ⭐ Why Choose Fixkar
    </span>

    <h3 className="fw-bold display-6">
      Our <span className="text-primary">Core Values</span>
    </h3>

    <p className="text-muted mt-2">
      What makes Fixkar reliable, trusted & customer-first
    </p>
  </div>

  {/* ===== Values Grid ===== */}
  <div className="container">
    <div className="row g-4 justify-content-center">

      {/* Verified Professionals */}
      <div className="col-xl-3 col-lg-4 col-md-6">
        <div className="card border-0 shadow-sm rounded-4 p-4 h-100 value-card text-center">
          <div
            className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: "70px",
              height: "70px",
              background: "rgba(13,110,253,0.1)",
            }}
          >
            <FaUserShield size={30} className="text-primary" />
          </div>
          <h5 className="fw-semibold">Verified Professionals</h5>
          <p className="text-muted small mb-0">
            Trained, skilled & background-checked service providers
          </p>
        </div>
      </div>

      {/* Affordable Pricing */}
      <div className="col-xl-3 col-lg-4 col-md-6">
        <div className="card border-0 shadow-sm rounded-4 p-4 h-100 value-card text-center">
          <div
            className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: "70px",
              height: "70px",
              background: "rgba(25,135,84,0.1)",
            }}
          >
            <FaRupeeSign size={30} className="text-success" />
          </div>
          <h5 className="fw-semibold">Affordable Pricing</h5>
          <p className="text-muted small mb-0">
            Transparent pricing with no hidden charges
          </p>
        </div>
      </div>

      {/* 24x7 Support */}
      <div className="col-xl-3 col-lg-4 col-md-6">
        <div className="card border-0 shadow-sm rounded-4 p-4 h-100 value-card text-center">
          <div
            className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: "70px",
              height: "70px",
              background: "rgba(255,193,7,0.15)",
            }}
          >
            <FaHeadset size={30} className="text-warning" />
          </div>
          <h5 className="fw-semibold">24×7 Support</h5>
          <p className="text-muted small mb-0">
            Our support team is always ready to help you
          </p>
        </div>
      </div>

      {/* Trust & Reliability */}
      <div className="col-xl-3 col-lg-4 col-md-6">
        <div className="card border-0 shadow-sm rounded-4 p-4 h-100 value-card text-center">
          <div
            className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: "70px",
              height: "70px",
              background: "rgba(13,202,240,0.15)",
            }}
          >
            <FaHandshake size={30} className="text-info" />
          </div>
          <h5 className="fw-semibold">Trust & Reliability</h5>
          <p className="text-muted small mb-0">
            Building long-term trust with every service
          </p>
        </div>
      </div>

      {/* Quick Booking */}
      <div className="col-xl-3 col-lg-4 col-md-6">
        <div className="card border-0 shadow-sm rounded-4 p-4 h-100 value-card text-center">
          <div
            className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: "70px",
              height: "70px",
              background: "rgba(111,66,193,0.15)",
            }}
          >
            <FaCalendarCheck size={30} className="text-primary" />
          </div>
          <h5 className="fw-semibold">Quick & Easy Booking</h5>
          <p className="text-muted small mb-0">
            Book a service in just a few clicks
          </p>
        </div>
      </div>

    </div>
  </div>
</div>

    </>
  )
}

export default Values
