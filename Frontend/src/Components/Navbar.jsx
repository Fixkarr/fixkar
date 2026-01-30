import React, {useEffect} from "react";
import { NavLink, Link, } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaHome, FaInfoCircle, FaTools, FaPhoneAlt, FaUserPlus } from "react-icons/fa";
import { MdLogin } from "react-icons/md";
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
  className="navbar fixed-top shadow-sm"
  style={{
    background: "rgba(255,255,255,0.75)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(0,0,0,0.05)",
  }}
>
  <div className="container-fluid px-3">

    {/* BRAND */}
    <NavLink className="navbar-brand fw-bold text-primary me-3" to="/">
      <img
        src="/Images/logo2.png"
        alt="fixkar logo"
        style={{ height: "30px", width: "108px" }}
      />
    </NavLink>

    {/* ALL MENUS – SINGLE LINE */}
    <div className="d-flex align-items-center flex-nowrap w-100 overflow-auto navbar-scroll">

      {/* LEFT LINKS */}
      <ul className="navbar-nav flex-row gap-3 me-auto">
        <li className="nav-item">
          <NavLink className="nav-link fw-semibold" to="/">
            <FaHome className="me-1 text-primary" /> Home
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink className="nav-link fw-semibold" to="/about">
            <FaInfoCircle className="me-1 text-info" /> About
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink className="nav-link fw-semibold" to="/services">
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
      <ul className="navbar-nav flex-row gap-2 ms-3">

        <li className="nav-item">
          <button
            className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-semibold"
            onClick={() => navigate("/login")}
          >
            <MdLogin className="me-1" />
            Login
          </button>
        </li>

        <li className="nav-item dropdown">
          <button
            className="btn btn-primary btn-sm rounded-pill px-3 fw-semibold dropdown-toggle"
            data-bs-toggle="dropdown"
          >
            <FaUserPlus className="me-1" />
            Signup
          </button>

          <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3">
            <li>
              <NavLink className="dropdown-item" to="/signup?role=customer">
                Customer
              </NavLink>
            </li>
            <li>
              <NavLink className="dropdown-item" to="/signup?role=professional">
                Professional
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
