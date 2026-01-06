import React, { useState } from 'react'
import '../css/services.css'
import { FaWpforms } from "react-icons/fa";
import { FaBusinessTime } from "react-icons/fa6";
import { MdOutlineContactEmergency } from "react-icons/md";
import { FaHandshake } from "react-icons/fa";
import { useSelector } from 'react-redux';
import useGetServices from '../hooks/useGetServices';
const Services = () => {
  useGetServices()
  const {services} = useSelector(state => state.services)

  return (
    <>

    <div className="Services py-5"
  style={{
    background: "linear-gradient(180deg, #f8f9ff 0%, #eef3ff 100%)"
  }}
>

  {/* ===== Header ===== */}
  <div className="text-center mb-5">
    <span className="badge rounded-pill px-4 py-2 mb-3"
      style={{
        background: "linear-gradient(135deg, #0d6efd, #4f9cff)",
        color: "#fff"
      }}
    >
      🔧 Home Services
    </span>

    <h2 className="fw-bold display-6">
      Trusted <span className="text-primary">Professionals</span>
    </h2>

    <p className="text-muted mt-2 fs-6">
      One platform for electricians, plumbers, carpenters & more
    </p>
  </div>

  {/* ===== SERVICES GRID ===== */}
  <div className="container">
    <div className="row g-4 justify-content-center">

      {services?.map((item) => (
        <div className="col-xl-3 col-lg-4 col-md-6" key={item._id}>
          <div
            className="card h-100 border-0 rounded-4 overflow-hidden service-glass"
            style={{
              background: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(12px)"
            }}
          >

            {/* Image */}
            <div className="ratio ratio-4x3 position-relative">
              <img
                src={item.image}
                alt={item.name}
                className="img-fluid object-fit-cover"
              />
              <div
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.45))",
                }}
              />
            </div>

            {/* Body */}
            <div className="card-body text-center">
              <h5 className="fw-semibold">{item.name}</h5>
              <p className="text-muted small">{item.description}</p>
            </div>

            {/* CTA */}
            <div className="card-footer bg-transparent border-0 text-center pb-4">
              <button className="btn btn-primary rounded-pill px-4">
                Explore Service →
              </button>
            </div>

          </div>
        </div>
      ))}

    </div>
  </div>

  {/* ===== JOIN FIXKAR FAMILY ===== */}
  <div className="container mt-5 pt-5">

    <div className="text-center mb-5">
      <span className="badge rounded-pill px-4 py-2 mb-3"
        style={{
          background: "linear-gradient(135deg, #198754, #42c985)",
          color: "#fff"
        }}
      >
        💼 Career Opportunity
      </span>

      <h2 className="fw-bold">
        Join the <span className="text-success">Fixkar Family</span>
      </h2>

      <p className="text-muted mt-2">
        Turn your skills into income — start working today
      </p>
    </div>

    <div className="row g-4">

      {/* STEP 1 */}
      <div className="col-lg-3 col-md-6">
        <div className="card border-0 shadow-sm rounded-4 text-center p-4 h-100 step-card">
          <FaWpforms size={42} className="text-primary mb-3" />
          <h5 className="fw-semibold">Sign Up</h5>
          <p className="text-muted small">
            Register as a professional & submit your details
          </p>
        </div>
      </div>

      {/* STEP 2 */}
      <div className="col-lg-3 col-md-6">
        <div className="card border-0 shadow-sm rounded-4 text-center p-4 h-100 step-card">
          <MdOutlineContactEmergency size={42} className="text-success mb-3" />
          <h5 className="fw-semibold">Verification</h5>
          <p className="text-muted small">
            Our team verifies your skills & documents
          </p>
        </div>
      </div>

      {/* STEP 3 */}
      <div className="col-lg-3 col-md-6">
        <div className="card border-0 shadow-sm rounded-4 text-center p-4 h-100 step-card">
          <FaBusinessTime size={42} className="text-warning mb-3" />
          <h5 className="fw-semibold">Approval</h5>
          <p className="text-muted small">
            Wait for confirmation from our team
          </p>
        </div>
      </div>

      {/* STEP 4 */}
      <div className="col-lg-3 col-md-6">
        <div className="card border-0 shadow-sm rounded-4 text-center p-4 h-100 step-card">
          <FaHandshake size={42} className="text-info mb-3" />
          <h5 className="fw-semibold">Start Earning</h5>
          <p className="text-muted small">
            Receive job requests & grow your income
          </p>
        </div>
      </div>

    </div>
  </div>

</div>


    </>
  )
}

export default Services
