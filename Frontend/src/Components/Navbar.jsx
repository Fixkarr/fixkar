import React, {useEffect} from "react";
import { NavLink, Link, } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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
      <nav className="navbar navbar-expand-lg fixed-top"
          style={{
    background: "rgba(255,255,255,0.2)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(255,255,255,0.3)"
  }}
      >
        <div className="container-fluid">
          <NavLink className="navbar-brand" href="#">
            Fixkar
          </NavLink>
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
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link active" aria-current="page" to="/">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" href="#">
                  About
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" href="#">
                  Services
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" href="#">
                  Contact
                </NavLink>
              </li>
            </ul>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 flex gap-2">
              <li className="nav-item">
                <button className="btn border border-primary " onClick={()=>navigate('/login')}>Login</button>
              </li>
              <li className="nav-item">
               <div className="dropdown">
  <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
    Signup
  </button>
  <ul className="dropdown-menu">
    <li><NavLink className="dropdown-item" to="/signup?role=customer">Signup as customer</NavLink></li>
    <li><NavLink className="dropdown-item" to="/signup?role=professional">Signup as professional</NavLink></li>
  </ul>
</div>
              </li>
              {/* ----Collapse--- */}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
