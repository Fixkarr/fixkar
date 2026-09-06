
import "../css/sidebar.css";
import { GoHome } from "react-icons/go";
import { FaRegAddressBook, FaUserShield, FaWpforms } from "react-icons/fa6";
import {  FaTools, FaBullhorn } from "react-icons/fa";
import {  FiMessageSquare } from "react-icons/fi";

import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

import { LuNotebookPen } from "react-icons/lu";
import { BiSolidOffer } from "react-icons/bi";

const Sidebar = ({ isOpen, onClose, isAdminMode = false }) => {
  const { currentAdmin } = useSelector((state) => state.admin);
  const adminpath = import.meta.env.VITE_ADMIN_PATH;

  // Never allow stale admin Redux state to affect the normal user dashboard.
  const adminMode = Boolean(isAdminMode && currentAdmin);

  return (
    <aside
      className={`d-flex flex-column p-2 p-md-3 text-white fixkar-sidebar ${
        isOpen ? "open" : ""
      }`}
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${
          adminMode ? "#0f2027" : "#0d6efd"
        }, ${adminMode ? "#2c5364" : "#4f9cff"})`,
      }}
    >
      <div className="text-center mb-4">
        <img
          src="/Images/logo1.png"
          className="img-fluid"
          alt="fixkar logo"
          style={{ maxHeight: "25px", maxWidth: "100px" }}
        />
        <small className="opacity-75 d-block sidebar-header">
          Service Dashboard
        </small>
      </div>

      <ul className="nav nav-pills flex-column gap-2">
        {adminMode && currentAdmin?.role === "super_admin" && (
          <>
            <li className="nav-item" style={{ fontSize: "0.5vmax" }}>
              <NavLink to={`${adminpath}/home`} className={({ isActive }) => `nav-link d-flex align-items-center justify-content-md-start gap-2 rounded-3 ${isActive ? "bg-white text-primary fw-semibold" : "text-white"}`}>
                <GoHome />
                <span className="d-md-inline" style={{ fontSize: "0.8vmax" }}>Home</span>
              </NavLink>
            </li>
            <li className="nav-item" style={{ fontSize: "0.5vmax" }}>
              <NavLink to={`${adminpath}/signup`} className={({ isActive }) => `nav-link d-flex align-items-center justify-content-md-start gap-2 rounded-3 ${isActive ? "bg-white text-primary fw-semibold" : "text-white"}`}>
                <FaRegAddressBook />
                <span className="d-md-inline" style={{ fontSize: "0.8vmax" }}>Create an Admin</span>
              </NavLink>
            </li>
            <li className="nav-item" style={{ fontSize: "0.5vmax" }}>
              <NavLink to={`${adminpath}/manage-services`} className={({ isActive }) => `nav-link d-flex align-items-center justify-content-md-start gap-2 rounded-3 ${isActive ? "bg-white text-primary fw-semibold" : "text-white"}`}>
                <FaTools />
                <span className="d-md-inline" style={{ fontSize: "0.8vmax" }}>Manage Services</span>
              </NavLink>
            </li>
            <li className="nav-item" style={{ fontSize: "0.5vmax" }}>
              <NavLink to={`${adminpath}/manage-users`} className={({ isActive }) => `nav-link d-flex align-items-center justify-content-md-start gap-2 rounded-3 ${isActive ? "bg-white text-primary fw-semibold" : "text-white"}`}>
                <FaUserShield />
                <span className="d-md-inline" style={{ fontSize: "0.8vmax" }}>Manage Users</span>
              </NavLink>
            </li>
            <li className="nav-item" style={{ fontSize: "0.5vmax" }}>
              <NavLink to={`${adminpath}/manage-bookings`} className={({ isActive }) => `nav-link d-flex align-items-center justify-content-md-start gap-2 rounded-3 ${isActive ? "bg-white text-primary fw-semibold" : "text-white"}`}>
                <LuNotebookPen />
                <span className="d-md-inline" style={{ fontSize: "0.8vmax" }}>Manage Bookings</span>
              </NavLink>
            </li>
            <li className="nav-item" style={{ fontSize: "0.5vmax" }}>
              <NavLink to={`${adminpath}/manage-offers`} className={({ isActive }) => `nav-link d-flex align-items-center justify-content-md-start gap-2 rounded-3 ${isActive ? "bg-white text-primary fw-semibold" : "text-white"}`}>
                <BiSolidOffer />
                <span className="d-md-inline" style={{ fontSize: "0.8vmax" }}>Manage Offers</span>
              </NavLink>
            </li>
            <li className="nav-item" style={{ fontSize: "0.5vmax" }}>
              <NavLink to={`${adminpath}/manage-forms`} className={({ isActive }) => `nav-link d-flex align-items-center justify-content-md-start gap-2 rounded-3 ${isActive ? "bg-white text-primary fw-semibold" : "text-white"}`}>
                <FaWpforms />
                <span className="d-md-inline" style={{ fontSize: "0.8vmax" }}>Create Forms</span>
              </NavLink>
            </li>
            <li className="nav-item" style={{ fontSize: "0.5vmax" }}>
              <NavLink to={`${adminpath}/manage-announcements`} className={({ isActive }) => `nav-link d-flex align-items-center justify-content-md-start gap-2 rounded-3 ${isActive ? "bg-white text-primary fw-semibold" : "text-white"}`}>
                <FaBullhorn />
                <span className="d-md-inline" style={{ fontSize: "0.8vmax" }}>Manage Announcements</span>
              </NavLink>
            </li>
            <li className="nav-item" style={{ fontSize: "0.5vmax" }}>
              <NavLink to={`${adminpath}/manage-enquiry`} className={({ isActive }) => `nav-link d-flex align-items-center justify-content-md-start gap-2 rounded-3 ${isActive ? "bg-white text-primary fw-semibold" : "text-white"}`}>
                <FiMessageSquare />
                <span className="d-md-inline" style={{ fontSize: "0.8vmax" }}>Manage Enquiry</span>
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;
