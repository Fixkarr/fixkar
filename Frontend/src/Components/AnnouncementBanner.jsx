import React from "react";
import { FaBullhorn } from "react-icons/fa";

const AnnouncementBanner = ({ announcement }) => {
  if (!announcement) return null;

  const { title, message, imageUrl, link } = announcement;
     const handleClick = () => {
    if (!link) return;

    const formattedLink = link.startsWith("http")
      ? link
      : `https://${link}`;

    window.open(formattedLink, "_blank");
  };

 return (
  <div
    onClick={handleClick}
    className="announcement-card position-relative overflow-hidden mb-4"
    style={{
      cursor: link ? "pointer" : "default",
      height: "240px",
      borderRadius: "20px",
    }}
  >
    {/* Background */}
    {imageUrl ? (
      <img
        src={imageUrl}
        alt="announcement"
        className="w-100 h-100 object-fit-cover"
        style={{
          filter: "brightness(0.7)",
          transition: "transform 0.5s ease",
        }}
      />
    ) : (
      <div
        className="w-100 h-100"
        style={{
          background:
            "linear-gradient(135deg, #4f46e5, #9333ea, #ec4899)",
        }}
      ></div>
    )}

    {/* Glass Overlay */}
    <div
      className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-end p-4"
      style={{
        background:
          "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.1))",
        backdropFilter: "blur(6px)",
      }}
    >
      {/* Badge */}
      <div className="d-flex align-items-center mb-2">
        <div
          className="d-flex align-items-center px-3 py-1"
          style={{
            background: "rgba(255,255,255,0.15)",
            borderRadius: "50px",
            backdropFilter: "blur(10px)",
          }}
        >
          <FaBullhorn size={16} className="me-2 text-warning" />
          <span style={{ fontSize: "12px", fontWeight: "600" }}>
            ANNOUNCEMENT
          </span>
        </div>
      </div>

      {/* Title */}
      {title && (
        <h4
          className="fw-bold mb-2"
          style={{
            fontSize: "1.4rem",
            lineHeight: "1.4",
          }}
        >
          {title}
        </h4>
      )}

      {/* Message */}
      {message && (
        <p
          className="mb-0"
          style={{
            fontSize: "0.95rem",
            opacity: 0.9,
            maxHeight: "60px",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {message}
        </p>
      )}
    </div>

    {/* Hover Effect */}
    <style>
      {`
        .announcement-card:hover img {
          transform: scale(1.1);
        }

        .announcement-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .announcement-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
      `}
    </style>
  </div>
);
};

export default AnnouncementBanner;