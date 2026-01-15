// components/ProfessionalCard.jsx
import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaUserTie, FaRoute } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setDistance } from "../redux/distance.slice";
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
    if (!mapsLoaded) return;

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

  const handleVisitProfile = () => {
    dispatch(setDistance(distance));
    navigate(`/professional/profile/visit/${data?.userId?._id}`);
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">

      {/* ===== Top Gradient Strip ===== */}
      <div
        className="p-3 text-white"
        style={{
          background: "linear-gradient(135deg, #0d6efd, #4f9cff)",
        }}
      >
        <div className="d-flex align-items-center gap-3">
          <img
            src={data?.profilePicture || "/Images/placeholderProfile.avif"}
            alt={data?.userId?.fullName || "User"}
            className="rounded-circle border border-2 border-white"
            style={{ width: "64px", height: "64px", objectFit: "cover" }}
          />

          <div>
            <h6 className="mb-0 fw-semibold">
              {data?.userId?.fullName || "Unknown User"}
            </h6>
            <small className="opacity-75 d-flex flex-column gap-1">
            <span className="d-flex align-items-center gap-1">
                <FaUserTie />
              {data?.profession.name || "Not specified"}
            </span>
             {skillsToShow.length > 0 && (
                <span className="text-white-50 small">
                  {skillsToShow.map((skill, index) => (
                    <span key={skill._id}>
                      {skill.name}
                      {index !== skillsToShow.length - 1 && ", "}
                    </span>
                  ))}
                  {hasMoreSkills && " ..."}
                </span>
              )}
            </small>
          </div>
        </div>
      </div>

      {/* ===== Body ===== */}
      <div className="card-body">

        {/* Address */}
        <div className="d-flex align-items-start gap-2 mb-2">
          <FaMapMarkerAlt className="text-primary mt-1" />
          <p className="text-muted small mb-0">
            {data?.address?.addressLine || "Address not provided"}
          </p>
        </div>

        {/* Distance */}
        {distance?.distance?.text && (
          <div className="d-flex align-items-center gap-2 mb-3">
            <FaRoute className="text-success" />
            <span className="small fw-semibold text-success">
              {distance.distance.text} away
            </span>
          </div>
        )}

        <hr className="my-3" />

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={handleVisitProfile}
            className="btn btn-primary rounded-pill px-4 btn-sm"
          >
            Visit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalCard;
