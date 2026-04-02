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
      }}
    >
      {/* Background */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="announcement"
          className="w-100 h-100 banner-img"
        />
      ) : (
        <div className="w-100 h-100 fallback-bg d-flex justify-content-center align-items-center text-center text-white px-4">
          <div>
            {title && <h2 className="fallback-title">{title}</h2>}
            {message && <p className="fallback-message">{message}</p>}
          </div>
        </div>
      )}

      {/* Overlay only if image exists */}
      {imageUrl && (
        <div className="overlay position-absolute bottom-0 start-0 w-100 text-white">
          <div className="p-4">
            {title && <h5 className="fw-bold mb-1 title-text">{title}</h5>}
            {message && <p className="mb-0 message-text">{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementBanner;