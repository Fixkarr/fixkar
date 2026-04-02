import React from "react";
import { FaBullhorn } from "react-icons/fa";

const AnnouncementBanner = ({ announcement }) => {
  if (!announcement) return null;

  const { title, message, imageUrl, link } = announcement;

  return (
    <div
      onClick={() => link && window.open(link, "_blank")}
      className="rounded-4 overflow-hidden shadow-lg mb-4 position-relative"
      style={{
        cursor: link ? "pointer" : "default",
        height: "220px",
      }}
    >
      {/* Background */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="announcement"
          className="w-100 h-100 object-fit-cover"
          style={{ filter: "brightness(0.6)" }}
        />
      ) : (
        <div
          className="w-100 h-100"
          style={{
            background:
              "linear-gradient(135deg, #0d6efd, #6610f2, #6f42c1)",
          }}
        ></div>
      )}

      {/* Overlay Content */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center px-4 text-white"
        style={{
          background: "rgba(0,0,0,0.2)",
        }}
      >
        <div className="d-flex align-items-center mb-2">
          <FaBullhorn size={20} className="me-2 text-warning" />
          <span className="fw-bold text-uppercase small">
            Announcement
          </span>
        </div>

        {title && (
          <h5 className="fw-bold mb-2" style={{ lineHeight: "1.3" }}>
            {title}
          </h5>
        )}

        {message && (
          <p className="mb-0 small" style={{ opacity: 0.9 }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default AnnouncementBanner;