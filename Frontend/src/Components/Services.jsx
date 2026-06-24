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
import ProfessionalJoin from './ProfessionalJoin';

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
    <title>Fixkar Services in Varanasi</title>
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
  className="col-6 col-sm-4 col-md-3 col-lg-2 mb-2"
  key={item._id}
>
  <div
    className="card border-0 rounded-4 overflow-hidden h-100 service-card-mini"
    style={{
      background: "#fff",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      transition: "0.3s ease",
    }}
  >

    {/* Image */}
    <div
      style={{
        aspectRatio: "1 / 1",
        overflow: "hidden",
        background: "#f3f4f6",
      }}
    >
      <img
        src={item.image}
        alt={item.name}
        className="w-100 h-100"
        style={{
          objectFit: "cover",
          transition: "0.3s ease",
        }}
      />
    </div>

    {/* Body */}
    <div className="card-body p-2 text-center">

      {/* Title */}
      <h6
        className="fw-semibold mb-1"
        style={{
          fontSize: "0.78rem",
          color: "#111827",
        }}
      >
        {item.name}
      </h6>

      {/* Tiny Description */}
      <p
        className="text-muted mb-2"
        style={{
          fontSize: "0.65rem",
          lineHeight: "1.2",
          minHeight: "28px",
        }}
      >
        {item.description?.slice(0, 100)}...
      </p>

      {/* Small Button */}
      <button
        className="btn btn-primary border-0 rounded-pill"
        style={{
          fontSize: "0.65rem",
          padding: "4px 10px",
          background:
            "linear-gradient(135deg,#2563eb,#1d4ed8)",
        }}
        onClick={() => navigate(`/explore`)}
      >
        Explore
      </button>
    </div>
  </div>
</div>


      ))}

    </div>
  </div>

  {/* ===== JOIN FIXKAR FAMILY ===== */}
      <ProfessionalJoin/>



</div>

 {pathname !== '/' && <Footer/>}
    </>
  )
}

export default Services
