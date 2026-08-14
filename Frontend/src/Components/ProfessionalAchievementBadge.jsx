import React from "react";
import { FaAward } from "react-icons/fa";

const RANK_META = {
  NEWCOMER: { icon: "🌱", label: "Newcomer", className: "badge-newcomer" },
  BRONZE: { icon: "🥉", label: "Bronze", className: "badge-bronze" },
  SILVER: { icon: "🥈", label: "Silver", className: "badge-silver" },
  GOLD: { icon: "🏆", label: "Gold", className: "badge-gold" },
  PLATINUM: { icon: "👑", label: "Platinum", className: "badge-platinum" },
  DIAMOND: { icon: "💎", label: "Diamond", className: "badge-diamond" },
};

const ProfessionalAchievementBadge = ({ professional, variant = "light" }) => {
  const rank = professional?.professionalRank?.tier || professional?.achievements?.rank || "NEWCOMER";
  const meta = RANK_META[rank] || RANK_META.NEWCOMER;
  const completedBookings = Math.max(
    0,
    Number(professional?.professionalRank?.completedBookings ?? professional?.achievements?.completedBookings ?? 0)
  );

  return (
    <div className={`professional-achievement ${variant === "dark" ? "professional-achievement-dark" : ""}`}>
      <span className={`professional-achievement-rank ${meta.className}`}>
        <FaAward size={10} />
        <span>{meta.icon}</span>
        <span>{meta.label}</span>
      </span>
      <span className="professional-achievement-bookings">
        <strong>{completedBookings}</strong> completed {completedBookings === 1 ? "booking" : "bookings"} on Fixkar
      </span>
      <style>{`
        .professional-achievement{display:flex;align-items:center;flex-wrap:wrap;gap:6px}
        .professional-achievement-rank,.professional-achievement-bookings{display:inline-flex;align-items:center;gap:4px;border-radius:999px;padding:4px 8px;font-size:.68rem;font-weight:700;line-height:1.1;white-space:nowrap}
        .professional-achievement-rank{color:#fff;box-shadow:0 2px 8px rgba(15,23,42,.12)}
        .professional-achievement-bookings{background:#f1f5f9;color:#475569;border:1px solid #e2e8f0}
        .professional-achievement-dark .professional-achievement-bookings{background:rgba(255,255,255,.14);color:#fff;border-color:rgba(255,255,255,.28)}
        .badge-newcomer{background:linear-gradient(135deg,#64748b,#94a3b8)}
        .badge-bronze{background:linear-gradient(135deg,#92400e,#d97706)}
        .badge-silver{background:linear-gradient(135deg,#475569,#94a3b8)}
        .badge-gold{background:linear-gradient(135deg,#b45309,#f59e0b)}
        .badge-platinum{background:linear-gradient(135deg,#4338ca,#818cf8)}
        .badge-diamond{background:linear-gradient(135deg,#0369a1,#22d3ee)}
        @media(max-width:575.98px){.professional-achievement-rank,.professional-achievement-bookings{font-size:.61rem;padding:4px 6px}}
      `}</style>
    </div>
  );
};

export default ProfessionalAchievementBadge;
