import React from "react";
import { useSelector } from "react-redux";
import {
  FaBullhorn,
  FaCalendarCheck,
  FaEnvelopeOpenText,
  FaBellSlash,
} from "react-icons/fa";
import { formatDate } from "../utils/formatTime&Date";

const getIcon = (type) => {
  switch (type) {
    case "announcement":
      return <FaBullhorn className="text-warning fs-4" />;
    case "booking":
      return <FaCalendarCheck className="text-success fs-4" />;
    case "message":
      return <FaEnvelopeOpenText className="text-primary fs-4" />;
    default:
      return null;
  }
};

const Notifications = () => {
  const notifications = useSelector(
    (state) => state.notifications.notifications
  );

  return (
    <div className="container py-4">
      <h4 className="fw-bold mb-4">🔔 Notifications</h4>

      {/* 🔹 PLACEHOLDER */}
      {(!notifications || notifications.length === 0) && (
        <div className="d-flex flex-column align-items-center justify-content-center text-center py-5">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center mb-3"
            style={{
              width: "70px",
              height: "70px",
              backgroundColor: "#f5f7fa",
            }}
          >
            <FaBellSlash className="fs-2 text-secondary" />
          </div>

          <h6 className="fw-semibold mb-1">
            No notifications yet
          </h6>
          <p className="text-muted small mb-0">
            You’re all caught up. New updates will appear here.
          </p>
        </div>
      )}

      {/* 🔹 NOTIFICATION LIST */}
      {notifications && notifications.length > 0 && (
        <div className="d-flex flex-column gap-3">
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
                    width: "45px",
                    height: "45px",
                    backgroundColor: "#f5f7fa",
                  }}
                >
                  {getIcon(item.type)}
                </div>

                {/* Content */}
                <div className="flex-grow-1">
                  <h6 className="fw-semibold mb-1">
                    {item.title}
                  </h6>
                  <p className="text-muted small mb-1">
                    {item.message}
                  </p>
                  <small className="text-secondary">
                    {formatDate(item.createdAt)}
                  </small>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
