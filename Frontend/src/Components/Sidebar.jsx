import React from "react";
import "../css/sidebar.css";
import { GoHome } from "react-icons/go";
import { FaRegAddressBook, FaUserShield } from "react-icons/fa6";
import { IoConstructOutline } from "react-icons/io5";
import { FaRegBell, FaTools } from "react-icons/fa";
import { FiMessageSquare } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { MdOutlineEngineering } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";


const Sidebar = () => {
  const { currentUserData } = useSelector((state) => state.user);
  const {currentAdmin} = useSelector(state=> state.admin)
  const role = currentUserData?.user?.userId?.role;
const adminpath = import.meta.env.VITE_ADMIN_PATH

  return (
    <aside
  className="d-flex flex-column p-2 p-md-3 text-white"
  style={{
    // width: "100px", // mobile slim
    minHeight: "100vh",
    background: `linear-gradient(135deg, ${currentAdmin ? "#0f2027" : "#0d6efd"}, ${currentAdmin ? "#2c5364" : "#4f9cff"})`,
  }}
>
  {/* ===== Logo ===== */}
  <div className="text-center mb-4">
    <img src="/Images/logo1.png" className="img-fluid" alt="fixkar logo" style={{
      height : "30px", width : "108px",
    }}/>
    <small className="opacity-75 d-none d-md-block">
      Service Dashboard
    </small>
  </div>

  {/* ===== Links ===== */}
  <ul className="nav nav-pills flex-column gap-2">

    {currentAdmin && (
      currentAdmin?.role == "super_admin" && <>
        <li className="nav-item">
          <NavLink
            to={`${adminpath}/home`}
            className={({ isActive }) =>
              `nav-link d-flex align-items-center justify-content-center justify-content-md-start gap-2 rounded-3 ${
                isActive ? "bg-white text-primary fw-semibold" : "text-white"
              }`
            }
          >
            <GoHome />
            <span className="d-none d-md-inline">Home</span>
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to={`${adminpath}/signup`}
            className={({ isActive }) =>
              `nav-link d-flex align-items-center justify-content-center justify-content-md-start gap-2 rounded-3 ${
                isActive ? "bg-white text-primary fw-semibold" : "text-white"
              }`
            }
          >
            <FaRegAddressBook />
            <span className="d-none d-md-inline">Create an Admin</span>
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to={`${adminpath}/manage-services`}
            className={({ isActive }) =>
              `nav-link d-flex align-items-center justify-content-center justify-content-md-start gap-2 rounded-3 ${
                isActive ? "bg-white text-primary fw-semibold" : "text-white"
              }`
            }
          >
            <FaTools />
            <span className="d-none d-md-inline">Manage Services</span>
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to={`${adminpath}/manage-users`}
            className={({ isActive }) =>
              `nav-link d-flex align-items-center justify-content-center justify-content-md-start gap-2 rounded-3 ${
                isActive ? "bg-white text-primary fw-semibold" : "text-white"
              }`
            }
          >
            <FaUserShield />
            <span className="d-none d-md-inline">Manage Users</span>
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/customer/contact"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center justify-content-center justify-content-md-start gap-2 rounded-3 ${
                isActive ? "bg-white text-primary fw-semibold" : "text-white"
              }`
            }
          >
            <FiMessageSquare />
            <span className="d-none d-md-inline">Manage Enquiry</span>
          </NavLink>
        </li>
      </>
    )}

    {role === "customer" && (
      <>
        <li className="nav-item">
          <NavLink
            to="/customer/home"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center justify-content-center justify-content-md-start gap-2 rounded-3 ${
                isActive ? "bg-white text-primary fw-semibold" : "text-white"
              }`
            }
          >
            <GoHome />
            <span className="d-none d-md-inline">Home</span>
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/customer/bookings"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center justify-content-center justify-content-md-start gap-2 rounded-3 ${
                isActive ? "bg-white text-primary fw-semibold" : "text-white"
              }`
            }
          >
            <FaRegAddressBook />
            <span className="d-none d-md-inline">My Bookings</span>
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/customer/hire-professionals"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center justify-content-center justify-content-md-start gap-2 rounded-3 ${
                isActive ? "bg-white text-primary fw-semibold" : "text-white"
              }`
            }
          >
            <MdOutlineEngineering />
            <span className="d-none d-md-inline">Hire Professionals</span>
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/customer/contact"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center justify-content-center justify-content-md-start gap-2 rounded-3 ${
                isActive ? "bg-white text-primary fw-semibold" : "text-white"
              }`
            }
          >
            <FiMessageSquare />
            <span className="d-none d-md-inline">Help & Support</span>
          </NavLink>
        </li>
      </>
    )}

    {role === "professional" && (
      <>
        <li className="nav-item">
          <NavLink
            to="/professional/home"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center justify-content-center justify-content-md-start gap-2 rounded-3 ${
                isActive ? "bg-white text-primary fw-semibold" : "text-white"
              }`
            }
          >
            <GoHome />
            <span className="d-none d-md-inline">Home</span>
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/professional/bookings"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center justify-content-center justify-content-md-start gap-2 rounded-3 ${
                isActive ? "bg-white text-primary fw-semibold" : "text-white"
              }`
            }
          >
            <FaRegAddressBook />
            <span className="d-none d-md-inline">My Bookings</span>
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/professional/profile"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center justify-content-center justify-content-md-start gap-2 rounded-3 ${
                isActive ? "bg-white text-primary fw-semibold" : "text-white"
              }`
            }
          >
            <CgProfile />
            <span className="d-none d-md-inline">Profile</span>
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/professional/messages"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center justify-content-center justify-content-md-start gap-2 rounded-3 ${
                isActive ? "bg-white text-primary fw-semibold" : "text-white"
              }`
            }
          >
            <FiMessageSquare />
            <span className="d-none d-md-inline">Messages</span>
          </NavLink>
        </li>
      </>
    )}
  </ul>
</aside>

  );
};

export default Sidebar;
