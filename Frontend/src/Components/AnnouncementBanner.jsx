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
      className="announcement-card position-relative overflow-hidden"
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
       <img
          src="/Images/banner.svg"
          alt="announcement"
          className="w-100 h-100 banner-img"
        />
      )}

 
     
        <div className="overlay position-absolute bottom-0 start-0 w-100 text-white">
          <div className="p-4">
            {title && <h5 className="fw-bold mb-1 title-text">{title}</h5>}
            {message && <p className="mb-0 message-text">{message}</p>}
          </div>
        </div>
     
    </div>
  );
};

export default AnnouncementBanner;