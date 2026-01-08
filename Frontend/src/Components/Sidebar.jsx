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
      className="d-flex flex-column p-3 text-white"
      style={{
        width: "100px",
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${currentAdmin ? '#0f2027' : '#0d6efd'}, ${currentAdmin ? '#2c5364' : '#4f9cff'})`,
      }}
    >
      {/* ===== Logo ===== */}
      <div className="text-center mb-4">
        <h3 className="fw-bold m-0">Fixkar</h3>
        <small className="opacity-75">Service Dashboard</small>
      </div>

      {/* ===== Links ===== */}
      <ul className="nav nav-pills flex-column gap-2">

        {currentAdmin && (
          currentAdmin?.role == "super_admin" && <>
            <li className="nav-item">
              <NavLink
                to={`${adminpath}/home`}
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-2 rounded-3 ${
                    isActive ? "bg-white text-primary fw-semibold" : "text-white"
                  }`
                }
              >
                <GoHome /> <span className="hide">Home</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to={`${adminpath}/signup`}
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-2 rounded-3 ${
                    isActive ? "bg-white text-primary fw-semibold" : "text-white"
                  }`
                }
              >
                <FaRegAddressBook /> <span className="hide">Create an Admin</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to={`${adminpath}/manage-services`}
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-2 rounded-3 ${
                    isActive ? "bg-white text-primary fw-semibold" : "text-white"
                  }`
                }
              >
                <FaTools />{" "}
                <span className="hide">Manage Services</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to={`${adminpath}/manage-users`}
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-2 rounded-3 ${
                    isActive ? "bg-white text-primary fw-semibold" : "text-white"
                  }`
                }
              >
                <FaUserShield />{" "}
                <span className="hide">Manage Users</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/customer/contact"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-2 rounded-3 ${
                    isActive ? "bg-white text-primary fw-semibold" : "text-white"
                  }`
                }
              >
                <FiMessageSquare /> <span className="hide">Manage Enquiry</span>
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
                  `nav-link d-flex align-items-center gap-2 rounded-3 ${
                    isActive ? "bg-white text-primary fw-semibold" : "text-white"
                  }`
                }
              >
                <GoHome /> <span className="hide">Home</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/customer/bookings"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-2 rounded-3 ${
                    isActive ? "bg-white text-primary fw-semibold" : "text-white"
                  }`
                }
              >
                <FaRegAddressBook /> <span className="hide">My Bookings</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/customer/hire-professionals"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-2 rounded-3 ${
                    isActive ? "bg-white text-primary fw-semibold" : "text-white"
                  }`
                }
              >
                <MdOutlineEngineering />{" "}
                <span className="hide">Hire Professionals</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/customer/contact"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-2 rounded-3 ${
                    isActive ? "bg-white text-primary fw-semibold" : "text-white"
                  }`
                }
              >
                <FiMessageSquare /> <span className="hide">Help & Support</span>
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
                  `nav-link d-flex align-items-center gap-2 rounded-3 ${
                    isActive ? "bg-white text-primary fw-semibold" : "text-white"
                  }`
                }
              >
                <GoHome /> <span className="hide">Home</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/professional/bookings"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-2 rounded-3 ${
                    isActive ? "bg-white text-primary fw-semibold" : "text-white"
                  }`
                }
              >
                <FaRegAddressBook />{" "}
                <span className="hide">My Bookings</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/professional/profile"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-2 rounded-3 ${
                    isActive ? "bg-white text-primary fw-semibold" : "text-white"
                  }`
                }
              >
                <CgProfile /> <span className="hide">Profile</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/professional/messages"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-2 rounded-3 ${
                    isActive ? "bg-white text-primary fw-semibold" : "text-white"
                  }`
                }
              >
                <FiMessageSquare /> <span className="hide">Messages</span>
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;
