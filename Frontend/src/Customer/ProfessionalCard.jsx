import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaUserTie, FaRoute, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useLoadGoogleMaps from "../hooks/useLoadGoogleMap";
import { getDistanceMatrixData } from "../utils/getDistanceMatrixData";
import { toast } from "react-toastify";

const MAX_SKILLS = 3;

const ProfessionalCard = ({ data }) => {
  const mapsLoaded = useLoadGoogleMaps();
  const navigate = useNavigate();
  const { selectedLocation } = useSelector((state) => state.location);
  const [distance, setDistance] = useState(null);

  const skillsToShow = data?.selectedSkills?.slice(0, MAX_SKILLS) || [];
  const hasMoreSkills =
    data?.selectedSkills && data.selectedSkills.length > MAX_SKILLS;

  useEffect(() => {
    if (
      !mapsLoaded ||
      !selectedLocation?.lat ||
      !selectedLocation?.lng ||
      Number.isFinite(data?.distance)
    ) {
      return;
    }

    const fetchDistance = async () => {
      try {
        const result = await getDistanceMatrixData({
          customerLat: selectedLocation.lat,
          customerLng: selectedLocation.lng,
          professionalLat: data?.address?.lat,
          professionalLng: data?.address?.lng,
        });

        setDistance(result);
      } catch (err) {
        toast.error(err.message);
      }
    };

    fetchDistance();
  }, [mapsLoaded, selectedLocation, data]);

  const directDistance = Number.isFinite(data?.distance)
    ? data.distance >= 1000
      ? `${(data.distance / 1000).toFixed(1)} km`
      : `${Math.round(data.distance)} m`
    : null;

  const distanceText = directDistance || distance?.distance?.text;

  const handleVisitProfile = () => {
    navigate(`/professional/profile/visit/${data?.userId?._id}/${data?.slug}`);
  };

  return (
    <div
      className="card border-0 shadow-sm rounded-4 overflow-hidden mx-auto"
      style={{ width: "100%", maxWidth: "330px" }}
    >
      <div
        className="px-3 py-2"
        style={{
          background: "linear-gradient(135deg, #0d6efd, #4f9cff)",
          color: "#fff",
        }}
      >
        <div className="d-flex align-items-center gap-2">
          <img
            src={data?.profilePicture || "/Images/placeholderProfile.avif"}
            alt={data?.userId?.fullName || "User"}
            className="rounded-circle border border-2 border-white flex-shrink-0"
            style={{ width: 50, height: 50, objectFit: "cover" }}
          />

          <div className="min-w-0 flex-grow-1">
            <div className="fw-bold text-truncate">
              {data?.userId?.fullName || "Unknown User"}
            </div>
            <div className="d-flex align-items-center gap-1 small opacity-90 text-truncate">
              <FaUserTie size={11} className="flex-shrink-0" />
              <span className="text-truncate">
                {data?.profession?.name || "Not specified"}
              </span>
            </div>
          </div>

          <div className="text-end flex-shrink-0">
            <div className="d-flex align-items-center gap-1 fw-semibold small">
              <FaStar className="text-warning" size={11} />
              {Number(data?.averageRating || 0).toFixed(1)}
            </div>
            <small className="opacity-75">
              {data?.reviewCount || 0} reviews
            </small>
          </div>
        </div>
      </div>

      <div className="card-body p-3 d-flex flex-column">
        {skillsToShow.length > 0 && (
          <div className="d-flex flex-wrap gap-1 mb-2">
            {skillsToShow.map((skill) => (
              <span
                key={skill._id}
                className="badge rounded-pill bg-primary-subtle text-primary px-2 py-1"
                style={{ fontSize: "0.68rem" }}
              >
                {skill.name}
              </span>
            ))}

            {hasMoreSkills && (
              <span
                className="badge rounded-pill bg-light text-muted border px-2 py-1"
                style={{ fontSize: "0.68rem" }}
              >
                +{data.selectedSkills.length - MAX_SKILLS}
              </span>
            )}
          </div>
        )}

        <div className="d-flex align-items-start gap-2 mb-2">
          <FaMapMarkerAlt className="text-primary mt-1 flex-shrink-0" size={12} />
          <span
            className="text-muted small text-truncate"
            title={data?.address?.addressLine || "Address not provided"}
          >
            {data?.address?.addressLine || "Address not provided"}
          </span>
        </div>

        {distanceText && (
          <div className="d-flex align-items-center gap-2 mb-2">
            <FaRoute className="text-success flex-shrink-0" size={12} />
            <span className="small fw-semibold text-success">
              {distanceText} away
            </span>
          </div>
        )}

        <div className="pt-2">
          <button
            onClick={handleVisitProfile}
            className="btn btn-primary btn-sm w-100 rounded-3 fw-semibold"
          >
            Visit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalCard;
