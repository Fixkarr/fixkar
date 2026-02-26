import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FaBullhorn,
  FaCalendarCheck,
  FaEnvelopeOpenText,
  FaBellSlash,
  FaCalendarTimes,
  FaHome,
  FaClipboardList,
  FaTrash,
} from "react-icons/fa";
import { LuCalendarCheck2 } from "react-icons/lu";
import { MdOutlineEngineering, MdOutlinePendingActions } from "react-icons/md";
import { FaRegCalendarXmark } from "react-icons/fa6";
import { RiMotorbikeFill } from "react-icons/ri";
import { formatDate } from "../utils/formatTime&Date";

const getIcon = (type) => {
  switch (type) {
    case "announcement":
      return <FaBullhorn className="text-warning fs-5" />;
    case "booking_pending":
      return <MdOutlinePendingActions className="text-warning fs-5" />;
    case "booking_accepted":
      return <FaCalendarCheck className="text-primary fs-5" />;
    case "booking_rejected":
      return <FaCalendarTimes className="text-danger fs-5" />;
    case "booking_cancelled":
      return <FaRegCalendarXmark className="text-danger fs-5" />;
    case "booking_completed":
      return <LuCalendarCheck2 className="text-success fs-5" />;
    case "booking_reached":
      return <RiMotorbikeFill className="text-info fs-5" />;
    case "message":
      return <FaEnvelopeOpenText className="text-primary fs-5" />;
    default:
      return null;
  }
};

const Notifications = () => {
  const navigate = useNavigate();
  const notifications = useSelector(
    (state) => state.notifications.notifications
  );

  const total = notifications?.length || 0;

  return (
    <div className="container-fluid p-0">

      {/* 🔵 Gradient Header */}
      <div
        className="text-white p-4"
        style={{
          background: "linear-gradient(135deg,#0d6efd,#00c6ff)",
          borderBottomLeftRadius: "25px",
          borderBottomRightRadius: "25px",
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="fw-bold mb-0">Notifications</h5>

          <div className="d-flex gap-3 fs-5">
            <FaHome role="button" size={20} onClick={() => navigate("/customer/home")} />
            <FaClipboardList
              role="button"
              size={20}
              onClick={() => navigate("/customer/bookings")}
            />
            <MdOutlineEngineering
              size={20}
              role="button"
              onClick={() => navigate("/customer/hire-professionals")}
            />
          </div>
        </div>

        <p className="mt-2 small opacity-75">
          Stay updated with your Fixkar services
        </p>
      </div>

      {/* 🔵 Stats Section */}
      {total > 0 && (
        <div className="container mt-4">
          <div className="card shadow-sm border-0 rounded-4 text-center">
            <div className="card-body">
              <h6 className="fw-bold">{total}</h6>
              <small className="text-muted">Total Notifications</small>
            </div>
          </div>
        </div>
      )}

      {/* 🔵 Empty State */}
      {(!notifications || notifications.length === 0) && (
        <div className="d-flex flex-column align-items-center justify-content-center text-center py-5">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center mb-3 shadow-sm"
            style={{
              width: "80px",
              height: "80px",
              backgroundColor: "#f5f7fa",
            }}
          >
            <FaBellSlash className="fs-2 text-secondary" />
          </div>

          <h6 className="fw-semibold mb-1">No notifications yet</h6>
          <p className="text-muted small mb-0">
            You’re all caught up. New updates will appear here.
          </p>
        </div>
      )}

      {/* 🔵 Notification List */}
      {notifications && notifications.length > 0 && (
        <div className="container mt-4 mb-5 d-flex flex-column gap-3">
          {notifications.map((item) => (
            <div
              key={item._id}
              className="card border-0 shadow-sm rounded-4"
            >
              <div className="card-body d-flex gap-3 align-items-start">

                {/* Icon */}
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: "#f1f5ff",
                  }}
                >
                  {getIcon(item.type)}
                </div>

                {/* Content */}
                <div className="flex-grow-1">
                  <h6 className="fw-semibold mb-1">{item.title}</h6>
                  <p className="text-muted small mb-1">{item.message}</p>
                  <small className="text-secondary">
                    {formatDate(item.createdAt) || "Just now"}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🔵 Floating Clear Button */}
      {total > 0 && (
        <button
          className="btn btn-danger rounded-circle shadow-lg"
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "60px",
            height: "60px",
          }}
        >
          <FaTrash />
        </button>
      )}
    </div>
  );
};

export default Notifications;