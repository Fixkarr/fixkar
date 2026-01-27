import React from "react";
import "../css/sidebar.css";
import { GoHome } from "react-icons/go";
import { FaRegAddressBook, FaUserShield } from "react-icons/fa6";
import { IoConstructOutline } from "react-icons/io5";
import { FaHeadset, FaRegBell, FaTools } from "react-icons/fa";
import { FiBell, FiMessageSquare } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { MdOutlineEngineering, MdWorkHistory } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { server_url } from "../App";
import { markAllAsRead } from "../redux/notification.slice";
import { toast } from "react-toastify";
import useGetMyConversations from "../hooks/useGetMyConversations";
import { LuNotebookPen } from "react-icons/lu";


const Sidebar = ({isOpen}) => {
  useGetMyConversations();
  const { currentUserData } = useSelector((state) => state.user);
  const {currentAdmin} = useSelector(state=> state.admin)
  const unreadCount = useSelector(
    state => state.notifications.unreadCount
  );
  const totalUnreadMessages = useSelector(
  (state) => state.messages.totalUnreadCount
);
  const role = currentUserData?.user?.userId?.role;
const adminpath = import.meta.env.VITE_ADMIN_PATH
const dispatch = useDispatch()

 const handleBellClick = async () => {
    try {
      // 🔹 Backend update
      await axios.get(
        `${server_url}/api/notification/mark-all-as-read`,
        { withCredentials: true }
      );

      // 🔹 Redux update
      dispatch(markAllAsRead());

    } catch (error) {
      toast.error(error.response.data.message)
    }
  };

  return (
    <aside
  className={`d-flex flex-column p-2 p-md-3 text-white sidebar ${isOpen ? "open" : "closed"}`}
  style={{
    // width: "100px", // mobile slim
    minHeight: "100vh",
    background: `linear-gradient(135deg, ${currentAdmin ? "#0f2027" : "#0d6efd"}, ${currentAdmin ? "#2c5364" : "#4f9cff"})`,
  }}
>
  {/* ===== Logo ===== */}
  <div className="text-center mb-4">
    <img src="/Images/logo1.png" className="img-fluid" alt="fixkar logo" style={{
      maxHeight : "25px", maxWidth : "100px",
    }}/>
    <small className="opacity-75 d-block">
      Service Dashboard
    </small>
  </div>

  {/* ===== Links ===== */}
  <ul className="nav nav-pills flex-column gap-2">

    {currentAdmin && (
      currentAdmin?.role == "super_admin" && <>
        <li className="nav-item" style={{fontSize : "0.5vmax"}}>
          <NavLink
            to={`${adminpath}/home`}
            className={({ isActive }) =>
              `nav-link d-flex align-items-center justify-content-md-start gap-2 rounded-3 ${
                isActive ? "bg-white text-primary fw-semibold" : "text-white"
              }`
            }
          >
            <GoHome />
            <span className="d-md-inline" style={{fontSize : "0.8vmax"}}>Home</span>
          </NavLink>
        </li>

        <li className="nav-item" style={{fontSize : "0.5vmax"}}>
          <NavLink
            to={`${adminpath}/signup`}
            className={({ isActive }) =>
              `nav-link d-flex align-items-center  justify-content-md-start gap-2 rounded-3 ${
                isActive ? "bg-white text-primary fw-semibold" : "text-white"
              }`
            }
          >
            <FaRegAddressBook />
            <span className=" d-md-inline" style={{fontSize : "0.8vmax"}}>Create an Admin</span>
          </NavLink>
        </li> 

        <li className="nav-item" style={{fontSize : "0.5vmax"}}>
          <NavLink
            to={`${adminpath}/manage-services`}
            className={({ isActive }) =>
              `nav-link d-flex align-items-center  justify-content-md-start gap-2 rounded-3 ${
                isActive ? "bg-white text-primary fw-semibold" : "text-white"
              }`
            }
          >
            <FaTools />
            <span className=" d-md-inline" style={{fontSize : "0.8vmax"}}>Manage Services</span>
          </NavLink>
        </li>

        <li className="nav-item" style={{fontSize : "0.5vmax"}}>
          <NavLink
            to={`${adminpath}/manage-users`}
            className={({ isActive }) =>
              `nav-link d-flex align-items-center  justify-content-md-start gap-2 rounded-3 ${
                isActive ? "bg-white text-primary fw-semibold" : "text-white"
              }`
            }
          >
            <FaUserShield />
            <span className=" d-md-inline" style={{fontSize : "0.8vmax"}}>Manage Users</span>
          </NavLink>
        </li>
        <li className="nav-item" style={{fontSize : "0.5vmax"}}>
          <NavLink
            to={`${adminpath}/manage-bookings`}
            className={({ isActive }) =>
              `nav-link d-flex align-items-center  justify-content-md-start gap-2 rounded-3 ${
                isActive ? "bg-white text-primary fw-semibold" : "text-white"
              }`
            }
          >
            <LuNotebookPen  />
            <span className=" d-md-inline" style={{fontSize : "0.8vmax"}}>Manage Bookings</span>
          </NavLink>
        </li>

        <li className="nav-item" style={{fontSize : "0.5vmax"}}>
          <NavLink
            to="/customer/contact"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center  justify-content-md-start gap-2 rounded-3 ${
                isActive ? "bg-white text-primary fw-semibold" : "text-white"
              }`
            }
          >
            <FiMessageSquare />
            <span className=" d-md-inline" style={{fontSize : "0.8vmax"}}>Manage Enquiry</span>
          </NavLink>
        </li>
      </>
    )}

    {role === "customer" && (
      <>
        <li className="nav-item" style={{fontSize : "0.5vmax"}}>
          <NavLink
            to="/customer/home"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center  justify-content-md-start gap-2 rounded-3 ${
                isActive ? "bg-white text-primary fw-semibold" : "text-white"
              }`
            }
          >
            <GoHome />
            <span className=" d-md-inline" style={{fontSize : "0.8vmax"}}>Home</span>
          </NavLink>
        </li>

        <li className="nav-item" style={{fontSize : "0.5vmax"}}>
          <NavLink
            to="/customer/bookings"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center  justify-content-md-start gap-2 rounded-3 ${
                isActive ? "bg-white text-primary fw-semibold" : "text-white"
              }`
            }
          >
            <FaRegAddressBook />
            <span className=" d-md-inline" style={{fontSize : "0.8vmax"}}>Bookings</span>
          </NavLink>
        </li>

        <li className="nav-item" style={{fontSize : "0.5vmax"}}>
          <NavLink
            to="/customer/hire-professionals"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center  justify-content-md-start gap-2 rounded-3 ${
                isActive ? "bg-white text-primary fw-semibold" : "text-white"
              }`
            }
          >
            <MdOutlineEngineering />
            <span className=" d-md-inline" style={{fontSize : "0.8vmax"}}>Hire</span>
          </NavLink>
        </li>

        
        <li className="nav-item position-relative" style={{fontSize : "0.5vmax"}}>
          <NavLink
            to="/customer/messages"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center  justify-content-md-start gap-2 rounded-3 ${
                isActive ? "bg-white text-primary fw-semibold" : "text-white"
              }`
            }
          >
            <FiMessageSquare />
            <span className=" d-md-inline" style={{fontSize : "0.8vmax"}}>Messages</span>
          </NavLink>
           {totalUnreadMessages > 0 && (
    <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
      {totalUnreadMessages}
    </span>
  )}
        </li>
        <li className="nav-item position-relative" style={{fontSize : "0.5vmax"}} onClick={handleBellClick}>
          <NavLink
            to="/customer/notifications"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center  justify-content-md-start gap-2 rounded-3 ${
                isActive ? "bg-white text-primary fw-semibold" : "text-white"
              }`
            }
          >
            <FiBell />
           
            <span className="d-md-inline" style={{fontSize : "0.8vmax"}}>Notifications</span>
          </NavLink>
           {unreadCount > 0 && (
              <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                {unreadCount}
              </span>
            )}
        </li>
        <li className="nav-item" style={{fontSize : "0.5vmax"}}>
          <NavLink
            to="/customer/contact"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center  justify-content-md-start gap-2 rounded-3 ${
                isActive ? "bg-white text-primary fw-semibold" : "text-white"
              }`
            }
          >
            <FaHeadset />
            <span className=" d-md-inline" style={{fontSize : "0.8vmax"}}>Help & Support</span>
          </NavLink>
        </li>
      </>
    )}

    {role === "professional" && (
      <>
        <li className="nav-item" style={{fontSize : "0.5vmax"}}>
          <NavLink
            to="/professional/home"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center  justify-content-md-start gap-2 rounded-3 ${
                isActive ? "bg-white text-primary fw-semibold" : "text-white"
              }`
            }
          >
            <GoHome />
            <span className=" d-md-inline" style={{fontSize : "0.8vmax"}}>Home</span>
          </NavLink>
        </li>

        <li className="nav-item" style={{fontSize : "0.5vmax"}}>
          <NavLink
            to="/professional/bookings"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center  justify-content-md-start gap-2 rounded-3 ${
                isActive ? "bg-white text-primary fw-semibold" : "text-white"
              }`
            }
          >
            <FaRegAddressBook />
            <span className=" d-md-inline" style={{fontSize : "0.8vmax"}}>Bookings</span>
          </NavLink>
        </li>
         <li className="nav-item position-relative" style={{fontSize : "0.5vmax"}} onClick={handleBellClick}>
          <NavLink
            to="professional/notifications"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center  justify-content-md-start gap-2 rounded-3 ${
                isActive ? "bg-white text-primary fw-semibold" : "text-white"
              }`
            }
          >
            <FiBell />
           
            <span className=" d-md-inline" style={{fontSize : "0.8vmax"}}>Notifications</span>
          </NavLink>
            {unreadCount > 0 && (
              <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                {unreadCount}
              </span>
            )}
        </li>

        <li className="nav-item" style={{fontSize : "0.5vmax"}}>
          <NavLink
            to="/professional/profile"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center  justify-content-md-start gap-2 rounded-3 ${
                isActive ? "bg-white text-primary fw-semibold" : "text-white"
              }`
            }
          >
            <CgProfile />
            <span className=" d-md-inline" style={{fontSize : "0.8vmax"}}>Profile</span>
          </NavLink>
        </li>

        <li className="nav-item position-relative" style={{fontSize : "0.5vmax"}}>
          <NavLink
            to="/professional/messages"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center  justify-content-md-start gap-2 rounded-3 ${
                isActive ? "bg-white text-primary fw-semibold" : "text-white"
              }`
            }
          >
            <FiMessageSquare />
            <span className=" d-md-inline" style={{fontSize : "0.8vmax"}}>Messages</span>
          </NavLink>
                {totalUnreadMessages > 0 && (
          <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
            {totalUnreadMessages}
          </span>
                )}
        </li>

        <li className="nav-item position-relative" style={{fontSize : "0.5vmax"}}>
          <NavLink
            to="/professional/transaction-history"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center  justify-content-md-start gap-2 rounded-3 ${
                isActive ? "bg-white text-primary fw-semibold" : "text-white"
              }`
            }
          >
            <MdWorkHistory />
            <span className=" d-md-inline" style={{fontSize : "0.8vmax"}}>Transaction History</span>
          </NavLink>
        </li>
      </>
    )}
  </ul>
</aside>

  );
};

export default Sidebar;
