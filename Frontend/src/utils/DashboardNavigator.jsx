import React from "react";
import {
  FaBell,
  FaClipboardList,
  FaHome,
  FaUserCircle,
} from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { MdOutlineEngineering } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import "../css/DashboardNavigator.css";

const DashboardNavigator = () => {
  const { currentUserData } = useSelector((state) => state.user);

  const unreadNotifications = useSelector(
    (state) => state.notifications.unreadCount
  );

  const unreadMessages = useSelector(
    (state) => state.messages.totalUnreadCount
  );

  const role = currentUserData?.user?.userId?.role;

  const navigate = useNavigate();

  const IconWithUnreadDot = ({
    hasUnread,
    children,
    onClick,
    label,
  }) => (
    <button
      type="button"
      aria-label={label}
      className="dashboard-nav-icon dashboard-nav-button position-relative"
      onClick={onClick}
    >
      {children}

      {hasUnread > 0 && (
        <span
          className="dashboard-nav-unread-dot position-absolute"
          aria-label={`${hasUnread} unread`}
        />
      )}
    </button>
  );

  return (
    <nav className="dashboard-navigator">
      <div className="dashboard-navigator-inner">

        {/* Home */}
        <button
          type="button"
          aria-label="Home"
          className="dashboard-nav-icon dashboard-nav-button"
          onClick={() => navigate(`/${role}/home`)}
        >
          <FaHome size={20} />
        </button>

        {/* Bookings */}
        <button
          type="button"
          aria-label="Bookings"
          className="dashboard-nav-icon dashboard-nav-button"
          onClick={() => navigate(`/${role}/bookings`)}
        >
          <FaClipboardList size={20} />
        </button>

        {/* Notifications */}
        <IconWithUnreadDot
          hasUnread={unreadNotifications}
          label="Notifications"
          onClick={() => navigate(`/${role}/notifications`)}
        >
          <FaBell size={20} />
        </IconWithUnreadDot>

        {/* Messages */}
        <IconWithUnreadDot
          hasUnread={unreadMessages}
          label="Messages"
          onClick={() => navigate(`/${role}/messages`)}
        >
          <FaMessage size={20} />
        </IconWithUnreadDot>

        {/* Customer */}
        {role === "customer" && (
          <button
            type="button"
            aria-label="Hire Professionals"
            className="dashboard-nav-icon dashboard-nav-button"
            onClick={() =>
              navigate("/customer/hire-professionals")
            }
          >
            <MdOutlineEngineering size={20} />
          </button>
        )}

        {/* Professional */}
        {role === "professional" && (
          <button
            type="button"
            aria-label="Profile"
            className="dashboard-nav-icon dashboard-nav-button"
            onClick={() =>
              navigate("/professional/profile")
            }
          >
            <FaUserCircle size={20} />
          </button>
        )}
      </div>
    </nav>
  );
};

export default DashboardNavigator;