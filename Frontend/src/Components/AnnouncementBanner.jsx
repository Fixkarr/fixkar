import React from "react";
import { FaArrowRight, FaBullhorn } from "react-icons/fa";
import "../css/announcement-banner.css";

const AnnouncementBanner = ({ announcement }) => {
  if (!announcement) return null;

  const { title, message, imageUrl, link } = announcement;

  const handleClick = () => {
    if (!link) return;

    const formattedLink = link.startsWith("http")
      ? link
      : `https://${link}`;

    window.open(formattedLink, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className={`announcement-wrapper ${
        link ? "announcement-clickable" : ""
      }`}
      onClick={handleClick}
      role={link ? "button" : undefined}
      tabIndex={link ? 0 : undefined}
      onKeyDown={(e) => {
        if (link && (e.key === "Enter" || e.key === " ")) {
          handleClick();
        }
      }}
    >
      <div className="announcement-card">

        {/* Banner Image */}
        <img
          src={imageUrl || "/Images/banner.webp"}
          alt={title || "Announcement banner"}
          className="announcement-image"
        />

        {/* Dark / Blue Gradient */}
        <div className="announcement-gradient"></div>

        {/* Animated Shine */}
        <div className="announcement-shine"></div>

        {/* Decorative Glow */}
        <div className="announcement-glow announcement-glow-one"></div>
        <div className="announcement-glow announcement-glow-two"></div>

        {/* Floating Particles */}
        <span className="banner-particle particle-one"></span>
        <span className="banner-particle particle-two"></span>
        <span className="banner-particle particle-three"></span>

        {/* Content */}
        <div className="announcement-content">

          <div className="announcement-top">
            <span className="announcement-badge">
              <FaBullhorn />
              <span>Special Offer</span>
            </span>
          </div>

          <div className="announcement-text">

            {title && (
              <h3 className="announcement-title">
                {title}
              </h3>
            )}

            {message && (
              <p className="announcement-message">
                {message}
              </p>
            )}

            {link && (
              <span className="announcement-cta">
                Explore Offer
                <FaArrowRight />
              </span>
            )}

          </div>
        </div>

        {/* Bottom Progress Line */}
        <div className="announcement-progress"></div>

      </div>
    </div>
  );
};

export default AnnouncementBanner;