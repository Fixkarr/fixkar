import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaUserTie, FaRoute, FaStar, FaAward } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useLoadGoogleMaps from "../hooks/useLoadGoogleMap";
import { getDistanceMatrixData } from "../utils/getDistanceMatrixData";
import { toast } from "react-toastify";

const MAX_SKILLS = 3;
const rankMeta = {
  NEWCOMER: { icon: "🌱", label: "Newcomer", className: "professional-rank-newcomer" },
  BRONZE: { icon: "🥉", label: "Bronze", className: "professional-rank-bronze" },
  SILVER: { icon: "🥈", label: "Silver", className: "professional-rank-silver" },
  GOLD: { icon: "🏆", label: "Gold", className: "professional-rank-gold" },
  PLATINUM: { icon: "👑", label: "Platinum", className: "professional-rank-platinum" },
  DIAMOND: { icon: "💎", label: "Diamond", className: "professional-rank-diamond" },
};

const getRank = (data) => {
  const rank = data?.professionalRank?.tier || data?.achievements?.rank || "NEWCOMER";
  return rankMeta[rank] ? rank : "NEWCOMER";
};

const getCompletedBookings = (data) => Math.max(
  0,
  Number(data?.professionalRank?.completedBookings ?? data?.achievements?.completedBookings ?? 0)
);

const ProfessionalCard = ({ data }) => {
  const mapsLoaded = useLoadGoogleMaps();
  const navigate = useNavigate();
  const { selectedLocation } = useSelector((state) => state.location);
  const [distance, setDistance] = useState(null);
  const skillsToShow = data?.selectedSkills?.slice(0, MAX_SKILLS) || [];
  const hasMoreSkills = data?.selectedSkills && data.selectedSkills.length > MAX_SKILLS;
  const rank = getRank(data);
  const rankInfo = rankMeta[rank];
  const completedBookings = getCompletedBookings(data);

  useEffect(() => {
    if (!mapsLoaded || !selectedLocation?.lat || !selectedLocation?.lng || Number.isFinite(data?.distance)) return;
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
    ? data.distance >= 1000 ? `${(data.distance / 1000).toFixed(1)} km` : `${Math.round(data.distance)} m`
    : null;
  const distanceText = directDistance || distance?.distance?.text;
  const handleVisitProfile = () => navigate(`/professional/profile/visit/${data?.userId?._id}/${data?.slug}`);

  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 professional-card">
      <div className="px-3 py-3 professional-card-header" style={{ background: "linear-gradient(135deg, #0d6efd, #4f9cff)", color: "#fff" }}>
        <div className="d-flex align-items-center gap-2">
          <img src={data?.profilePicture || "/Images/placeholderProfile.avif"} alt={data?.userId?.fullName || "User"} className="rounded-circle border border-2 border-white flex-shrink-0" style={{ width: 48, height: 48, objectFit: "cover" }} />
          <div className="min-w-0 flex-grow-1">
            <div className="fw-bold text-truncate" style={{ fontSize: "0.95rem" }}>{data?.userId?.fullName || "Unknown User"}</div>
            <div className="d-flex align-items-center gap-1 text-truncate small">
              <FaUserTie size={10} className="flex-shrink-0" />
              <span className="text-truncate">{data?.profession?.name || "Not specified"}</span>
            </div>
          </div>
          <div className="text-end flex-shrink-0 lh-1">
            <div className="d-flex align-items-center gap-1 fw-semibold small"><FaStar className="text-warning" size={10} />{Number(data?.averageRating || 0).toFixed(1)}</div>
            <small style={{ fontSize: "0.68rem", opacity: 0.85 }}>{data?.reviewCount || 0} reviews</small>
          </div>
        </div>

        <div className="d-flex align-items-center flex-wrap gap-2 mt-2">
          <span className={`professional-rank-badge ${rankInfo.className}`}>
            <FaAward size={11} /> {rankInfo.icon} {rankInfo.label}
          </span>
          <span className="professional-booking-badge">
            <strong>{completedBookings}</strong> completed {completedBookings === 1 ? "booking" : "bookings"} on Fixkar
          </span>
        </div>
      </div>

      <div className="card-body p-3 d-flex flex-column">
        {skillsToShow.length > 0 && (
          <div className="d-flex flex-wrap gap-1 mb-2">
            {skillsToShow.map((skill) => (
              <span key={skill._id} className="badge rounded-pill bg-primary-subtle text-primary px-2 py-1" style={{ fontSize: "0.70rem" }}>{skill.name}</span>
            ))}
            {hasMoreSkills && <span className="badge rounded-pill bg-light text-muted border px-2 py-1" style={{ fontSize: "0.68rem" }}>+{data.selectedSkills.length - MAX_SKILLS}</span>}
          </div>
        )}
        <div className="d-flex align-items-start gap-2 mb-2">
          <FaMapMarkerAlt className="text-primary mt-1 flex-shrink-0" size={12} />
          <span className="text-muted small text-truncate" title={data?.address?.addressLine || "Address not provided"}>{data?.address?.addressLine || "Address not provided"}</span>
        </div>
        {distanceText && <div className="d-flex align-items-center gap-2 mb-2"><FaRoute className="text-success flex-shrink-0" size={12} /><span className="small fw-semibold text-success">{distanceText} away</span></div>}
        <button onClick={handleVisitProfile} className="btn btn-primary btn-sm w-100 rounded-3 fw-semibold mt-auto" style={{ fontSize: "0.82rem", padding: "7px 10px" }}>Visit Profile</button>
      </div>

      <style>{`
        .professional-card{min-height:260px}
        .professional-rank-badge,.professional-booking-badge{display:inline-flex;align-items:center;gap:5px;border-radius:999px;padding:4px 9px;font-size:.68rem;font-weight:700;line-height:1.1;white-space:nowrap}
        .professional-rank-badge{color:#fff;border:1px solid rgba(255,255,255,.45);box-shadow:0 2px 8px rgba(0,0,0,.12)}
        .professional-rank-newcomer{background:linear-gradient(135deg,#64748b,#94a3b8)}
        .professional-rank-bronze{background:linear-gradient(135deg,#92400e,#d97706)}
        .professional-rank-silver{background:linear-gradient(135deg,#475569,#94a3b8)}
        .professional-rank-gold{background:linear-gradient(135deg,#b45309,#f59e0b)}
        .professional-rank-platinum{background:linear-gradient(135deg,#4338ca,#818cf8)}
        .professional-rank-diamond{background:linear-gradient(135deg,#0369a1,#22d3ee)}
        .professional-booking-badge{background:rgba(255,255,255,.16);color:#fff;border:1px solid rgba(255,255,255,.25)}
        @media(max-width:575.98px){.professional-card{min-height:235px}.professional-card-header{padding-top:10px!important;padding-bottom:10px!important}.professional-card .card-body{padding:11px!important}.professional-card .badge{font-size:.66rem!important;padding:4px 7px!important}.professional-card .btn{padding-top:6px!important;padding-bottom:6px!important}.professional-rank-badge,.professional-booking-badge{font-size:.61rem;padding:4px 7px}}
      `}</style>
    </div>
  );
};
export default ProfessionalCard;
