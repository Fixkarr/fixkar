// components/ProfessionalCard.jsx
import React, { useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom"

const ProfessionalCard = ({ data }) => {
  const km = (data?.distance/1000).toFixed(2);
  return (
    <div className="professionalCard card shadow-sm border-0 p-3 rounded-4 h-100">

      <div className="d-flex align-items-center gap-3 justify-content-between">
        <div className="profilePic">
          <img
            src={data?.profilePicture || "/Images/placeholderProfile.avif"}
            alt={data?.userId?.fullName || "User"}
            className="rounded-circle"
            style={{ width: "60px", height: "60px", objectFit: "cover" }}
          />
        </div>

        <div style={{ flex: 1 }}>
          <h5 className="mb-1 fw-semibold">{data?.userId?.fullName || "Unknown User"}</h5>
          <p className="text-muted m-0">{data?.profession || "Not specified"}</p>

          <p className="text-muted small mt-2 mb-1">
            <strong>Address:</strong> {data?.address?.addressLine || "Not Provided"}
          </p>
          <p className="text-muted small mt-2 mb-1">{km} km away</p>
          <div className="d-flex align-items-center gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                size={16}
                color={i < data?.ratings ? "#ffc107" : "#ddd"}
              />
            ))}
            <span className="ms-2 small text-muted">({data?.ratings || 0})</span>
          </div>
        </div>
      </div>

      <hr />

      {/* ✅ Visit Profile Button */}
      <div className="text-center">
        <Link
          to={`/professional/profile/visit/${data?.userId?._id}`}
          className="btn btn-primary btn-sm px-4 rounded-pill"
        >
          Visit Profile
        </Link>
      </div>

    </div>
  );
};

export default ProfessionalCard;
