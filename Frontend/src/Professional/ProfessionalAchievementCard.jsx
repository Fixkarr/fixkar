import React from "react";

const rankMeta = {
  NEWCOMER: { label: "Newcomer", icon: "🌱", className: "text-success" },
  BRONZE: { label: "Bronze Professional", icon: "🥉", className: "text-warning" },
  SILVER: { label: "Silver Professional", icon: "🥈", className: "text-secondary" },
  DIAMOND: { label: "Diamond Professional", icon: "💎", className: "text-primary" },
};

const ProfessionalAchievementCard = ({ professional }) => {
  const achievements = professional?.achievements || {};
  const completed = Number(achievements.completedBookings || 0);
  const rank = rankMeta[achievements.rank] ? achievements.rank : "NEWCOMER";
  const next = completed < 1 ? 1 : completed < 5 ? 5 : completed < 10 ? 10 : null;
  const progress = next ? Math.min(100, Math.round((completed / next) * 100)) : 100;

  return <div className="card border-0 shadow-sm rounded-4 p-4">
    <div className="d-flex justify-content-between align-items-start gap-3"><div><div className="small text-muted fw-semibold">Professional Achievement</div><h5 className={`fw-bold mb-1 ${rankMeta[rank].className}`}>{rankMeta[rank].icon} {rankMeta[rank].label}</h5><div className="text-muted small">{completed} completed {completed === 1 ? "booking" : "bookings"}</div></div><span className="badge rounded-pill bg-light text-dark px-3 py-2">{rank}</span></div>
    {next ? <div className="mt-3"><div className="d-flex justify-content-between small mb-1"><span>Next milestone: {next} completed bookings</span><span>{completed}/{next}</span></div><div className="progress" style={{ height: 8 }}><div className="progress-bar" role="progressbar" style={{ width: `${progress}%` }} aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100" /></div><div className="small text-muted mt-2">Complete genuine Fixkar jobs to unlock higher rewards and badges.</div></div> : <div className="alert alert-primary py-2 px-3 mt-3 mb-0 small">💎 Diamond achieved. Keep completing quality jobs to maintain your reputation.</div>}
  </div>;
};
export default ProfessionalAchievementCard;
