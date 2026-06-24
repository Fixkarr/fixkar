import React, {useEffect} from "react";
import { NavLink, Link, } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import '../css/navbar.css'
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
   <nav className="navbar fixed-top fixkar-navbar shadow-sm">
      <div className="container-fluid px-2 fixkar-nav-wrapper">

        {/* LOGO */}
        <NavLink to="/" className="navbar-brand me-2">
          <img
            src="/Images/logo2.png"
            alt="fixkar smart solutions private limited"
            className="fixkar-logo"
          />
        </NavLink>

        {/* MENUS */}
        <ul className="navbar-nav flex-row fixkar-nav me-auto">
          <li className="nav-item">
            <NavLink to="/about" className="nav-link fixkar-link">
              <FaInfoCircle />
              <span>About</span>
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink to="/services" className="nav-link fixkar-link">
              <FaTools />
              <span>Services</span>
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink to="/contact" className="nav-link fixkar-link">
              <FaPhoneAlt />
              <span>Contact</span>
            </NavLink>
          </li>
        </ul>

        {/* ACTION BUTTONS */}
        <ul className="navbar-nav flex-row fixkar-nav">
          <li className="nav-item">
            <button
              className="btn btn-outline-primary fixkar-btn"
              onClick={() => navigate("/login")}
            >
              <MdLogin />
              <span>Login</span>
            </button>
          </li>

          <li className="nav-item dropdown">
            <button
              className="btn btn-primary fixkar-btn dropdown-toggle"
              data-bs-toggle="dropdown"
            >
              <FaUserPlus />
              <span>Signup</span>
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
    </nav>



    </>
  );
};

export default Navbar;
