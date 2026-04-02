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
    className="announcement-card position-relative overflow-hidden container-fluid"
    style={{
      cursor: link ? "pointer" : "default",
      height: "240px",
      borderRadius: "16px",
      marginTop: "20px", // top spacing
    }}
  >
    {/* Background */}
    {imageUrl ? (
      <img
        src={imageUrl}
        alt="announcement"
        className="w-100 h-100 object-fit-cover"
        style={{
          objectPosition: "center",
        }}
      />
    ) : (
      <div
        className="w-100 h-100"
        style={{
          background:
            "linear-gradient(135deg, #0d6efd, #0b5ed7)", // Fixkar primary theme
        }}
      ></div>
    )}

    {/* Bottom Overlay (only where text is) */}
    <div
      className="position-absolute bottom-0 start-0 w-100 p-3 text-white"
      style={{
        background:
          "linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0))",
      }}
    >
      {/* Badge */}
      <div className="d-flex align-items-center mb-1">
        <FaBullhorn size={30} className="me-2 text-warning" />
        <span
          style={{
            fontSize: "2vmin",
            fontWeight: "600",
            letterSpacing: "0.5px",
          }}
        >
          ANNOUNCEMENT
        </span>
      </div>

      {/* Title */}
      {title && (
        <h5
          className="fw-bold mb-1"
          style={{
            fontSize: "1.1vmin",
            lineHeight: "1.3",
          }}
        >
          {title}
        </h5>
      )}

      {/* Message */}
      {message && (
        <p
          className="mb-0"
          style={{
            fontSize: "0.9rem",
            opacity: 0.9,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {message}
        </p>
      )}
    </div>

    {/* Simple Hover */}
    <style>
      {`
        .announcement-card {
          transition: box-shadow 0.2s ease;
        }

        .announcement-card:hover {
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }
      `}
    </style>
  </div>
);
};

export default AnnouncementBanner;