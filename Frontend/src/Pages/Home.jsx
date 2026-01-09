import React from 'react'
import Navbar from '../Components/Navbar'
import '../css/home.css'
import Services from '../Components/Services'
import Values from '../Components/Values'
import Testimonial from '../Components/Testimonial'
import Contact from '../Components/Contact'
import Footer from '../Components/Footer'
import { FaTools, FaMapMarkerAlt, FaBolt } from "react-icons/fa";
import { IoSearchCircle } from "react-icons/io5";
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()
  return (
   <>
  <Navbar />

  {/* ===== HERO SECTION ===== */}
<section className="position-relative overflow-hidden">

  {/* ===== OVERLAY (OUTSIDE carousel-inner) ===== */}
  <div
    className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-end align-items-md-center  p-5"
    style={{ 
      background:
        "linear-gradient(135deg, rgba(13, 109, 253, 0.93), rgba(0,0,0,0))",
      zIndex: 2,
      pointerEvents: "none", // IMPORTANT
    }}
  >
    <div className="container text-white">
      <div className="row">
        <div className="col-lg-7">

          <span className="badge bg-warning text-dark mb-3 px-3 py-2 rounded-pill">
            <FaBolt className="me-1" />
            Fast • Reliable • Trusted
          </span>

          <h1 className="fw-bold display-5 mb-3">
            Find Skilled Professionals <br />
            <span className="text-warning">Near You</span>
          </h1>

          <p className="fs-5 opacity-75 mb-4">
            Electricians, Plumbers, Carpenters, Painters & more —  
            all verified and ready to help.
          </p>

          <div className="d-flex flex-wrap gap-3">
            <button
              className="btn btn-primary btn-lg rounded-pill px-4"
              style={{ pointerEvents: "auto" }}   // buttons clickable
              onClick={() => navigate("/login")}
            >
              <IoSearchCircle className="me-2" />
              Find Professionals
            </button>

            <button
              className="btn btn-outline-light btn-lg rounded-pill px-4"
              style={{ pointerEvents: "auto" }}
              onClick={() => navigate("/login")}
            >
              <FaMapMarkerAlt className="me-2" />
              Choose Location
            </button>
          </div>

          {/* Trust Points */}
          <div className="d-flex gap-4 mt-4 flex-wrap small">
            <span>
              <FaTools className="me-1 text-warning" />
              Skilled Experts
            </span>
            <span>
              <FaMapMarkerAlt className="me-1 text-warning" />
              Nearby Services
            </span>
            <span>
              <FaBolt className="me-1 text-warning" />
              Quick Response
            </span>
          </div>

        </div>
      </div>
    </div>
  </div>

  {/* ===== CAROUSEL ===== */}
  <div
    id="carouselExampleInterval"
    className="carousel slide"
    data-bs-ride="carousel"
  >
    <div className="carousel-inner">

      <div className="carousel-item active" data-bs-interval="2500">
        <img
          src="Images/electrician.jpg"
          className="d-block w-100 object-fit-cover"
          alt="Electrician"
        />
      </div>

      <div className="carousel-item" data-bs-interval="2500">
        <img
          src="Images/workerProfile.jpg"
          className="d-block w-100  object-fit-cover"
          alt="Carpenter"
        />
      </div>

      <div className="carousel-item" data-bs-interval="2500">
        <img
          src="Images/plumbing.jpg"
          className="d-block w-100 object-fit-cover"
          alt="Plumber"
        />
      </div>

      <div className="carousel-item" data-bs-interval="2500">
        <img
          src="Images/Engineering.webp"
          className="d-block w-100  object-fit-cover"
          alt="Engineer"
        />
      </div>

      <div className="carousel-item">
        <img
          src="Images/painter.webp"
          className="d-block w-100  object-fit-cover"
          alt="Painter"
        />
      </div>

      <div className="carousel-item">
        <img
          src="Images/construction.jpg"
          className="d-block w-100  object-fit-cover"
          alt="Construction"
        />
      </div>

    </div>

    {/* Controls */}
    <button
      className="carousel-control-prev"
      type="button"
      data-bs-target="#carouselExampleInterval"
      data-bs-slide="prev"
      style={{ zIndex: 3 }}
    >
      <span className="carousel-control-prev-icon" />
    </button>

    <button
      className="carousel-control-next"
      type="button"
      data-bs-target="#carouselExampleInterval"
      data-bs-slide="next"
      style={{ zIndex: 3 }}
    >
      <span className="carousel-control-next-icon" />
    </button>
  </div>
</section>


  {/* ===== SERVICES ===== */}
 
    <Services />
    <Values />
    <Testimonial />
    <Contact />
  <Footer />
</>

  ) 
}

export default Home
