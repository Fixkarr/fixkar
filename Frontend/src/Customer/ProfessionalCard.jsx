// components/ProfessionalCard.jsx
import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setDistance } from "../redux/distance.slice";
import useLoadGoogleMaps from "../hooks/useLoadGoogleMap";
import { getDistanceMatrixData } from "../utils/getDistanceMatrixData";
import { toast } from "react-toastify";

const ProfessionalCard = ({ data }) => {
  const mapsLoaded = useLoadGoogleMaps()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {selectedLocation} = useSelector(state=> state.location);
  //  const {distance} = useSelector(state=>state.distance);
  const [distance, SetDistance] = useState(null)

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

        SetDistance(result)

      } catch (err) {
        toast.error(err.message)
        console.error("Distance Error ❌", err);
      }
    };

    fetchDistance();
  }, [mapsLoaded, selectedLocation, data]);
 

  const handleVisitProfile = ()=>{
    dispatch(setDistance(distance));
    navigate(`/professional/profile/visit/${data?.userId?._id}`)
  }
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
          <p className="text-primary small mt-2 mb-1">{distance?.distance?.text} away</p>
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
        <button
          onClick={handleVisitProfile}
          className="btn btn-primary btn-sm px-4 rounded-pill"
        >
          Visit Profile
        </button>
      </div>

    </div>
  );
};

export default ProfessionalCard;
