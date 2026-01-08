import React, {useEffect} from "react";
import { NavLink, Link, } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaHome, FaInfoCircle, FaTools, FaPhoneAlt, FaUserPlus } from "react-icons/fa";
import { MdLogin } from "react-icons/md";
import "../css/navbar.css";
const Navbar = () => {
  useEffect(() => {
  const handleScroll = () => {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 30) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  };
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

  const navigate = useNavigate()
  return (
    <>
    <nav
  className="navbar navbar-expand-lg fixed-top shadow-sm"
  style={{
    background: "rgba(255,255,255,0.75)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(0,0,0,0.05)",
  }}
>
  <div className="container-fluid px-md-4">

    {/* BRAND */}
    <NavLink className="navbar-brand fw-bold fs-4 text-primary" to="/">
      Fixkar
    </NavLink>

    {/* TOGGLER */}
    <button
      className="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon"></span>
    </button>

    {/* CONTENT */}
    <div className="collapse navbar-collapse" id="navbarSupportedContent">

      {/* LEFT LINKS */}
      <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-lg-2">
        <li className="nav-item">
          <NavLink className="nav-link fw-semibold" to="/">
            <FaHome className="me-1 text-primary" /> Home
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link fw-semibold" to="#">
            <FaInfoCircle className="me-1 text-info" /> About
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link fw-semibold" to="#">
            <FaTools className="me-1 text-warning" /> Services
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link fw-semibold" to="/contact">
            <FaPhoneAlt className="me-1 text-success" /> Contact
          </NavLink>
        </li>
      </ul>

      {/* RIGHT ACTIONS */}
      <ul className="navbar-nav mb-2 mb-lg-0 gap-2 align-items-lg-center">

        {/* LOGIN */}
        <li className="nav-item">
          <button
            className="btn btn-outline-primary rounded-pill px-4 fw-semibold"
            onClick={() => navigate("/login")}
          >
            <MdLogin className="me-1" />
            Login
          </button>
        </li>

        {/* SIGNUP */}
        <li className="nav-item dropdown">
          <button
            className="btn btn-primary rounded-pill px-4 fw-semibold dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <FaUserPlus className="me-1" />
            Signup
          </button>

          <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3">
            <li>
              <NavLink className="dropdown-item" to="/signup?role=customer">
                Signup as Customer
              </NavLink>
            </li>
            <li>
              <NavLink className="dropdown-item" to="/signup?role=professional">
                Signup as Professional
              </NavLink>
            </li>
          </ul>
        </li>

      </ul>
    </div>
  </div>
</nav>

    </>
  );
};

export default Navbar;
