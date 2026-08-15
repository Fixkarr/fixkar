import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  FaInfoCircle,
  FaTools,
  FaPhoneAlt,
  FaUserPlus,
  FaChevronDown,
} from "react-icons/fa";
import { MdLogin, MdMenu, MdClose } from "react-icons/md";

import "../css/navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setSignupOpen(false);
  };

  return (
    <>
      <nav
        className={`fixkar-navbar ${
          scrolled ? "fixkar-navbar-scrolled" : ""
        }`}
      >
        <div className="container-fluid fixkar-navbar-container">
          {/* ================= LOGO ================= */}
          <NavLink
            to="/"
            className="fixkar-navbar-brand"
            onClick={closeMobileMenu}
          >
            <img
              src="/Images/logo2.png"
              alt="Fixkar Smart Solutions Private Limited"
              className="fixkar-logo"
            />
          </NavLink>

          {/* ================= DESKTOP NAV ================= */}
          <div className="fixkar-desktop-nav">
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `fixkar-nav-link ${isActive ? "active" : ""}`
              }
            >
              <FaInfoCircle />
              <span>About</span>
            </NavLink>

            <NavLink
              to="/services"
              className={({ isActive }) =>
                `fixkar-nav-link ${isActive ? "active" : ""}`
              }
            >
              <FaTools />
              <span>Services</span>
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `fixkar-nav-link ${isActive ? "active" : ""}`
              }
            >
              <FaPhoneAlt />
              <span>Contact</span>
            </NavLink>
          </div>

          {/* ================= DESKTOP ACTIONS ================= */}
          <div className="fixkar-desktop-actions">
            <button
              type="button"
              className="fixkar-login-btn"
              onClick={() => navigate("/login")}
            >
              <MdLogin />
              <span>Login</span>
            </button>

            <div className="fixkar-signup-wrapper">
              <button
                type="button"
                className="fixkar-signup-btn"
                onClick={() => setSignupOpen(!signupOpen)}
              >
                <FaUserPlus />
                <span>Get Started</span>
                <FaChevronDown
                  className={`fixkar-chevron ${
                    signupOpen ? "rotate" : ""
                  }`}
                />
              </button>

              {signupOpen && (
                <div className="fixkar-signup-menu">
                  <div className="fixkar-signup-heading">
                    <small>Join Fixkar</small>
                    <span>Choose your account</span>
                  </div>

                  <NavLink
                    to="/signup?role=customer"
                    className="fixkar-signup-option"
                    onClick={() => setSignupOpen(false)}
                  >
                    <span className="fixkar-option-icon customer">
                      👤
                    </span>

                    <span>
                      <strong>Customer</strong>
                      <small>Hire trusted professionals</small>
                    </span>
                  </NavLink>

                  <NavLink
                    to="/signup?role=professional"
                    className="fixkar-signup-option"
                    onClick={() => setSignupOpen(false)}
                  >
                    <span className="fixkar-option-icon professional">
                      🛠️
                    </span>

                    <span>
                      <strong>Professional</strong>
                      <small>Grow your service business</small>
                    </span>
                  </NavLink>
                </div>
              )}
            </div>
          </div>

          {/* ================= MOBILE TOGGLE ================= */}
          <button
            type="button"
            className="fixkar-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <MdClose size={28} />
            ) : (
              <MdMenu size={28} />
            )}
          </button>
        </div>

        {/* ================= MOBILE MENU ================= */}
        <div
          className={`fixkar-mobile-menu ${
            mobileOpen ? "show" : ""
          }`}
        >
          <div className="fixkar-mobile-inner">
            {/* Mobile Navigation */}
            <div className="fixkar-mobile-links">
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `fixkar-mobile-link ${
                    isActive ? "active" : ""
                  }`
                }
                onClick={closeMobileMenu}
              >
                <span className="fixkar-mobile-icon">
                  <FaInfoCircle />
                </span>

                <span>
                  <strong>About</strong>
                  <small>Learn more about Fixkar</small>
                </span>
              </NavLink>

              <NavLink
                to="/services"
                className={({ isActive }) =>
                  `fixkar-mobile-link ${
                    isActive ? "active" : ""
                  }`
                }
                onClick={closeMobileMenu}
              >
                <span className="fixkar-mobile-icon">
                  <FaTools />
                </span>

                <span>
                  <strong>Services</strong>
                  <small>Explore our services</small>
                </span>
              </NavLink>

              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `fixkar-mobile-link ${
                    isActive ? "active" : ""
                  }`
                }
                onClick={closeMobileMenu}
              >
                <span className="fixkar-mobile-icon">
                  <FaPhoneAlt />
                </span>

                <span>
                  <strong>Contact</strong>
                  <small>Get in touch with us</small>
                </span>
              </NavLink>
            </div>

            {/* Mobile Actions */}
            <div className="fixkar-mobile-actions">
              <button
                type="button"
                className="fixkar-mobile-login"
                onClick={() => {
                  closeMobileMenu();
                  navigate("/login");
                }}
              >
                <MdLogin size={20} />
                Login
              </button>

              <div className="fixkar-mobile-signup">
                <div className="fixkar-mobile-section-title">
                  <FaUserPlus />
                  <span>Get started</span>
                </div>

                <NavLink
                  to="/signup?role=customer"
                  className="fixkar-mobile-signup-option"
                  onClick={closeMobileMenu}
                >
                  <span className="fixkar-option-icon customer">
                    👤
                  </span>

                  <span>
                    <strong>Customer</strong>
                    <small>Hire trusted professionals</small>
                  </span>
                </NavLink>

                <NavLink
                  to="/signup?role=professional"
                  className="fixkar-mobile-signup-option"
                  onClick={closeMobileMenu}
                >
                  <span className="fixkar-option-icon professional">
                    🛠️
                  </span>

                  <span>
                    <strong>Professional</strong>
                    <small>Grow your service business</small>
                  </span>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;