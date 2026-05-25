import React, { useState } from 'react'
import '../css/services.css'

import { FaBusinessTime } from "react-icons/fa6";
import { MdOutlineContactEmergency } from "react-icons/md";
import { useSelector } from 'react-redux';
import useGetServices from '../hooks/useGetServices';
import { FaArrowRight, FaTools } from "react-icons/fa";

import {
  FaWpforms,
  FaUserCheck,
  FaPhoneAlt,
  FaChalkboardTeacher,
  FaClipboardCheck,
  FaHandshake
} from "react-icons/fa";
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from './Navbar';
import Footer from './Footer';

const Services = () => {
  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();

  useGetServices()
  const {services} = useSelector(state => state.services)

  return (
    <>
   {pathname !== '/' &&
         <>
          <Helmet>
    <title>Fixkar Services - Explore Fixkar Services</title>
    <meta
      name="description"
      content="Contact Fixkar for support, service queries, or assistance. Our team is available to help you connect with skilled professionals efficiently."
    />
  </Helmet>
  
        <Navbar/>
        </>
        }
    <div className="Services py-5 mt-5"
  style={{
    background: "linear-gradient(180deg, #f8f9ff 0%, #eef3ff 100%)",
    paddingTop : "5vh"
  }}
>

  {/* ===== Header ===== */}
  <div className="text-center mb-5">
    <span className="badge rounded-pill px-4 py-2 mb-3"
      style={{
        background: "linear-gradient(135deg, #0d6efd, #4f9cff)",
        color: "#fff",
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
   <div
  className="col-6 col-sm-4 col-md-3 col-lg-3 col-xl-2 mb-3"
  key={item._id}
>
  <div
    className="card border-0 rounded-4 overflow-hidden h-100 service-card-premium"
    style={{
      background: "#fff",
      transition: "0.3s ease",
      boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
    }}
  >

    {/* Image */}
    <div
      className="overflow-hidden"
      style={{
        aspectRatio: "1 / 1",
        background: "#f8f9fa",
      }}
    >
      <img
        src={item.image}
        alt={item.name}
        className="w-100 h-100"
        style={{
          objectFit: "cover",
          transition: "0.4s ease",
        }}
      />
    </div>

    {/* Body */}
    <div className="card-body p-2 text-center">

      {/* Title */}
      <h6
        className="fw-bold mb-1"
        style={{
          fontSize: "0.88rem",
          color: "#111827",
        }}
      >
        {item.name}
      </h6>

      {/* Description */}
      <p
        className="text-muted mb-2"
        style={{
          fontSize: "0.72rem",
          lineHeight: "1.3",
          minHeight: "34px",
        }}
      >
        {item.description?.slice(0, 45)}...
      </p>

      {/* Button */}
      <button
        className="btn btn-primary btn-sm rounded-pill px-3 py-1 border-0"
        style={{
          fontSize: "0.72rem",
          fontWeight: "600",
          background:
            "linear-gradient(135deg,#2563eb,#1d4ed8)",
        }}
        onClick={() => {
          navigate(`/explore`);
        }}
      >
        Explore <FaArrowRight size={10} className="ms-1" />
      </button>
    </div>
  </div>
</div>


      ))}

    </div>
  </div>

  {/* ===== JOIN FIXKAR FAMILY ===== */}
<div className="container mt-5 pt-5">

  {/* Heading */}
  <div className="text-center mb-5">
    <span
      className="badge rounded-pill px-4 py-2 mb-3"
      style={{
        background: "linear-gradient(135deg, #0d6efd, #4da3ff)",
        color: "#fff"
      }}
    >
      🔧 Professional Journey
    </span>

    <h2 className="fw-bold">
      How Professionals Join <span className="text-primary">FixKar</span>
    </h2>

    <p className="text-muted mt-2">
      A step-by-step onboarding path followed by every professional
    </p>
  </div>

  {/* Timeline Wrapper */}
  <div className="position-relative">

    {/* DESKTOP HORIZONTAL DOTTED PATH */}
    <div
      className="d-none d-lg-block position-absolute top-50 start-0 w-100"
      style={{
        borderTop: "3px dotted #0d6efd",
        transform: "translateY(-50%)",
        zIndex: 0
      }}
    />

    {/* MOBILE VERTICAL DOTTED PATH */}
    <div
      className="d-lg-none position-absolute top-0 start-50"
      style={{
        height: "100%",
        borderLeft: "3px dotted #0d6efd",
        transform: "translateX(-50%)",
        zIndex: 0
      }}
    />

    <div className="row g-5 position-relative">

      {[
        {
          icon: <FaWpforms size={26}/>,
          title: "Register",
          text: "Professional signs up on FixKar with basic personal & service details.",
          color: "primary"
        },
        {
          icon: <FaUserCheck size={26}/>,
          title: "Application Review",
          text: "Application is internally reviewed after onboarding.",
          color: "success"
        },
        {
          icon: <FaPhoneAlt size={26}/>,
          title: "Personal Contact",
          text: "Our team contacts and calls the professional to the nearest branch.",
          color: "warning"
        },
        {
          icon: <FaChalkboardTeacher size={26}/>,
          title: "Training & Guidance",
          text: "Professional completes verification, training & guidance modules.",
          color: "info"
        },
        {
          icon: <FaClipboardCheck size={26}/>,
          title: "Final Approval",
          text: "Approval is granted after successful verification & training.",
          color: "secondary"
        },
        {
          icon: <FaHandshake size={26}/>,
          title: "Start Working",
          text: "Professional officially joins FixKar and starts receiving jobs.",
          color: "primary",
          solid: true
        }
      ].map((step, index) => (
        <div key={index} className="col-lg-2 col-md-6 col-12 text-center">

          {/* Step Node */}
          <div
            className={`rounded-circle shadow d-flex align-items-center justify-content-center mx-auto mb-3 ${
              step.solid ? "bg-primary" : "bg-white"
            }`}
            style={{
              width: 70,
              height: 70,
              zIndex: 1,
              border: step.solid ? "none" : "2px solid #0d6efd"
            }}
          >
            <span
              className={step.solid ? "text-white" : `text-${step.color}`}
            >
              {step.icon}
            </span>
          </div>

          <h6 className="fw-semibold">{step.title}</h6>
          <p className="text-muted small mb-0">{step.text}</p>
        </div>
      ))}

    </div>
  </div>
</div>



</div>

 {pathname !== '/' && <Footer/>}
    </>
  )
}

export default Services
