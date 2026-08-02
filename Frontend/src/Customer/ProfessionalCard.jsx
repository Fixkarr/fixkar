  // components/ProfessionalCard.jsx
  import React, { useEffect, useState } from "react";
  import { FaMapMarkerAlt, FaUserTie, FaRoute, FaStar } from "react-icons/fa";
  import { useNavigate } from "react-router-dom";
  import { useDispatch, useSelector } from "react-redux";
  import useLoadGoogleMaps from "../hooks/useLoadGoogleMap";
  import { getDistanceMatrixData } from "../utils/getDistanceMatrixData";
  import { toast } from "react-toastify";
  const MAX_SKILLS = 5;

  const ProfessionalCard = ({ data }) => {
    const mapsLoaded = useLoadGoogleMaps();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { selectedLocation } = useSelector((state) => state.location);

    const [distance, SetDistance] = useState(null);

    const skillsToShow = data?.selectedSkills?.slice(0, MAX_SKILLS) || [];
    const hasMoreSkills =
      data?.selectedSkills && data.selectedSkills.length > MAX_SKILLS;

    useEffect(() => {
      if (
        !mapsLoaded ||
        !selectedLocation?.lat ||
        !selectedLocation?.lng ||
        Number.isFinite(data?.distance)
      ) return;

      const fetchDistance = async () => {
        try {
          const result = await getDistanceMatrixData({
            customerLat: selectedLocation?.lat,
            customerLng: selectedLocation?.lng,
            professionalLat: data?.address?.lat,
            professionalLng: data?.address?.lng,
          });

          SetDistance(result);
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

    const handleVisitProfile = () => {
     
      navigate(`/professional/profile/visit/${data?.userId?._id}/${data?.slug}`);
    };

    return (
  <div className="card border-0 shadow h-100 rounded-4 overflow-hidden">

    {/* ===== HEADER ===== */}
    <div
      className="p-3"
      style={{
        background: "linear-gradient(135deg, #0d6efd, #4f9cff)",
        color: "#fff",
      }}
    >
      <div className="d-flex align-items-center gap-3">
        <img
          src={data?.profilePicture || "/Images/placeholderProfile.avif"}
          alt={data?.userId?.fullName || "User"}
          className="rounded-circle border border-2 border-white"
          style={{ width: 70, height: 70, objectFit: "cover" }}
        />

        <div className="flex-grow-1">
          <h6 className="fw-bold mb-1">
            {data?.userId?.fullName || "Unknown User"}
          </h6>

          <div className="d-flex align-items-center gap-2 small">
            <FaUserTie />
            <span>{data?.profession.name || "Not specified"}</span>
          </div>
        </div>
      </div>
    </div>

    {/* ===== BODY ===== */}
    <div className="card-body d-flex flex-column">

      {/* SKILLS */}
      {skillsToShow.length > 0 && (
        <div className="mb-3">
          <div className="fw-semibold small mb-2 text-muted">
            Skills
          </div>

          <div className="d-flex flex-wrap gap-2">
            {skillsToShow.map((skill) => (
              <span
                key={skill._id}
                className="badge rounded-pill bg-primary-subtle text-primary px-3 py-2"
                style={{ fontSize: "0.75rem" }}
              >
                {skill.name}
              </span>
            ))}

            {hasMoreSkills && (
              <span className="badge rounded-pill bg-secondary-subtle text-secondary px-3 py-2">
                + more
              </span>
            )}
          </div>
        </div>
      )}

      {/* ADDRESS */}
      <div className="d-flex gap-2 mb-2">
        <FaMapMarkerAlt className="text-primary mt-1" />
        <p className="text-muted small mb-0">
          {data?.address?.addressLine || "Address not provided"}
        </p>
      </div>

      <div className="d-flex align-items-center gap-2 mb-3">
        <FaStar className="text-warning" />
        <span className="small fw-semibold">{Number(data?.averageRating || 0).toFixed(1)}</span>
        <span className="small text-muted">({data?.reviewCount || 0} reviews)</span>
      </div>

      {/* DISTANCE */}
      {(directDistance || distance?.distance?.text) && (
        <div className="d-flex align-items-center gap-2 mb-3">
          <FaRoute className="text-success" />
          <span className="small fw-semibold text-success">
            {directDistance || distance.distance.text} away
          </span>
        </div>
      )}

      {/* PUSH BUTTON TO BOTTOM */}
      <div className="mt-auto pt-2">
        <button
          onClick={handleVisitProfile}
          className="btn btn-primary w-100 rounded-pill fw-semibold"
        >
          Visit Profile
        </button>
      </div>
    </div>
  </div>

    );
  };

  export default ProfessionalCard;
