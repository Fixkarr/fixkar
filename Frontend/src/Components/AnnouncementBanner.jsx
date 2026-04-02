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
        height: "260px",
        borderRadius: "18px",
        marginTop: "28px",
      }}
    >
      {/* Background */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="announcement"
          className="w-100 h-100 banner-img"
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      ) : (
        <div
          className="w-100 h-100 fallback-bg"
        ></div>
      )}

      {/* Bottom Overlay */}
      <div className="overlay position-absolute bottom-0 start-0 w-100 text-white">
        
        {/* Content Wrapper */}
        <div className="p-4">
          
          {/* Badge */}
          <div className="badge-pill mb-2">
            <FaBullhorn size={14} />
            <span>Announcement</span>
          </div>

          {/* Title */}
          {title && (
            <h5 className="fw-bold mb-1 title-text">
              {title}
            </h5>
          )}

          {/* Message */}
          {message && (
            <p className="mb-0 message-text">
              {message}
            </p>
          )}
        </div>
      </div>

      {/* Styles */}
      <style>
        {`
          .banner-img {
            transition: transform 0.4s ease;
          }

          .fallback-bg {
            background: linear-gradient(135deg, #0d6efd, #0b5ed7);
          }

          /* Overlay gradient (Uber style) */
          .overlay {
            background: linear-gradient(
              to top,
              rgba(0,0,0,0.85),
              rgba(0,0,0,0.4),
              transparent
            );
          }

          /* Badge */
          .badge-pill {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 5px 12px;
            border-radius: 50px;
            font-size: 12px;
            font-weight: 600;
            background: rgba(255,255,255,0.15);
            backdrop-filter: blur(6px);
          }

          /* Title */
          .title-text {
            font-size: 1.2rem;
            line-height: 1.3;
          }

          /* Message */
          .message-text {
            font-size: 0.9rem;
            opacity: 0.9;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          /* Hover (subtle premium) */
          .announcement-card {
            transition: all 0.25s ease;
          }

          .announcement-card:hover {
            box-shadow: 0 10px 25px rgba(0,0,0,0.18);
            transform: translateY(-2px);
          }

          .announcement-card:hover .banner-img {
            transform: scale(1.03);
          }

          /* Responsive */
          @media (max-width: 768px) {
            .announcement-card {
              height: 200px !important;
            }

            .title-text {
              font-size: 1rem;
            }

            .message-text {
              font-size: 0.8rem;
            }
          }
        `}
      </style>
    </div>
  );
};

export default AnnouncementBanner;