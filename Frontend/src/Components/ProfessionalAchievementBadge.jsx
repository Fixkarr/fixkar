import React from "react";
import { FaAward } from "react-icons/fa";
import { FaMedal, FaSeedling } from "react-icons/fa6";
import { GiFireGem, GiLaurelsTrophy } from "react-icons/gi";
import { PiMedalFill } from "react-icons/pi";


const RANK_META = {
  NEWCOMER: { icon: <FaSeedling size={20}/>, label: "Newcomer", className: "badge-newcomer" },
  BRONZE: { icon: <PiMedalFill size={20}/>, label: "Bronze", className: "badge-bronze" },
  SILVER: { icon: <FaMedal size={20}/>, label: "Silver", className: "badge-silver" },
  GOLD: { icon: <GiLaurelsTrophy size={20}/>, label: "Gold", className: "badge-gold" },
  PLATINUM: { icon: <GiFireGem size={20}/>, label: "Platinum", className: "badge-platinum" },
  DIAMOND: { icon: <GiCutDiamond size={20}/>, label: "Diamond", className: "badge-diamond" },
};

const ProfessionalAchievementBadge = ({ professional, variant = "light" }) => {
  const rank = professional?.professionalRank?.tier || professional?.achievements?.rank || "NEWCOMER";
  const meta = RANK_META[rank] || RANK_META.NEWCOMER;
  const level = professional?.professionalRank?.level
  const completedBookings = Math.max(
    0,
    Number(professional?.achievements?.completedBookings ?? 0)
  );

  return (
    <div className={`professional-achievement ${variant === "dark" ? "professional-achievement-dark" : ""}`}>
      <span className={`professional-achievement-rank ${meta.className}`}>
        <FaAward size={10} />
        <span>{meta.icon}</span>
        <span>{meta.label}</span>
        <span>{level}</span>
      </span>
      <span className="professional-achievement-bookings">
        <strong>{completedBookings}</strong> completed {completedBookings === 1 ? "booking" : "bookings"} on Fixkar
      </span>
    <style>{`
  /* =========================================================
     FIXKAR — PROFESSIONAL ACHIEVEMENT BADGE
     ========================================================= */

  .professional-achievement {
    width: 100%;
    min-width: 0;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 7px;
    line-height: 1;
  }

  /* ---------- Rank Badge ---------- */

  .professional-achievement-rank {
    position: relative;
    min-width: 0;
    min-height: 30px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px 6px 8px;

    border: 1px solid rgba(255,255,255,.24);
    border-radius: 999px;

    color: #fff;
    font-size: 11px;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .01em;

    white-space: nowrap;

    box-shadow:
      0 4px 12px rgba(15,23,42,.14),
      inset 0 1px 0 rgba(255,255,255,.24);

    overflow: hidden;

    transition:
      transform .2s ease,
      box-shadow .2s ease,
      filter .2s ease;
  }

  .professional-achievement-rank::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;

    background:
      linear-gradient(
        120deg,
        rgba(255,255,255,.22),
        transparent 35%,
        transparent 65%,
        rgba(255,255,255,.08)
      );
  }

  .professional-achievement-rank > * {
    position: relative;
    z-index: 1;
  }

  .professional-achievement-rank:hover {
    transform: translateY(-1px);
    filter: brightness(1.04);
    box-shadow:
      0 7px 18px rgba(15,23,42,.18),
      inset 0 1px 0 rgba(255,255,255,.28);
  }

  /* Award icon */

  .professional-achievement-rank > svg {
    flex: 0 0 auto;
    width: 13px;
    height: 13px;
    opacity: .95;
  }

  /* Rank emoji / icon */

  .professional-achievement-rank > span:nth-of-type(1) {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    font-size: 13px;
    line-height: 1;
  }

  /* Rank name */

  .professional-achievement-rank > span:nth-of-type(2) {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Level */

  .professional-achievement-rank > span:nth-of-type(3) {
    min-width: 18px;
    height: 18px;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    padding: 0 5px;

    border-radius: 999px;

    background: rgba(255,255,255,.18);
    border: 1px solid rgba(255,255,255,.15);

    font-size: 9px;
    font-weight: 900;

    box-shadow: inset 0 1px 1px rgba(255,255,255,.12);
  }


  /* =========================================================
     RANK COLORS
     ========================================================= */

  .badge-newcomer {
    background:
      linear-gradient(135deg, #475569 0%, #64748b 48%, #94a3b8 100%);
  }

  .badge-bronze {
    background:
      linear-gradient(135deg, #78350f 0%, #a16207 48%, #d97706 100%);
  }

  .badge-silver {
    background:
      linear-gradient(135deg, #334155 0%, #64748b 48%, #cbd5e1 100%);
  }

  .badge-gold {
    background:
      linear-gradient(135deg, #92400e 0%, #d97706 48%, #fbbf24 100%);
  }

  .badge-platinum {
    background:
      linear-gradient(135deg, #312e81 0%, #6366f1 48%, #a5b4fc 100%);
  }

  .badge-diamond {
    background:
      linear-gradient(135deg, #075985 0%, #0284c7 48%, #22d3ee 100%);
  }


  /* =========================================================
     COMPLETED BOOKINGS
     ========================================================= */

  .professional-achievement-bookings {
    min-width: 0;
    min-height: 30px;

    display: inline-flex;
    align-items: center;

    padding: 6px 10px;

    border: 1px solid #e2e8f0;
    border-radius: 999px;

    background: rgba(255,255,255,.9);

    color: #64748b;

    font-size: 11px;
    font-weight: 600;
    line-height: 1.25;

    box-shadow:
      0 2px 8px rgba(15,23,42,.05);

    overflow-wrap: anywhere;
  }

  .professional-achievement-bookings strong {
    flex: 0 0 auto;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    min-width: 21px;
    height: 21px;

    padding: 0 6px;

    border-radius: 999px;

    background: #eff6ff;
    color: #2563eb;

    font-size: 10px;
    font-weight: 900;
    line-height: 1;

    box-shadow:
      inset 0 0 0 1px rgba(37,99,235,.08);
  }


  /* =========================================================
     DARK VARIANT
     ========================================================= */

  .professional-achievement-dark .professional-achievement-bookings {
    border-color: rgba(255,255,255,.16);
    background: rgba(255,255,255,.08);
    color: rgba(255,255,255,.78);

    box-shadow:
      inset 0 1px 0 rgba(255,255,255,.08),
      0 3px 12px rgba(0,0,0,.12);

    backdrop-filter: blur(10px);
  }

  .professional-achievement-dark
  .professional-achievement-bookings strong {
    background: rgba(255,255,255,.15);
    color: #fff;
    box-shadow: inset 0 0 0 1px rgba(255,255,255,.12);
  }


  /* =========================================================
     MOBILE
     ========================================================= */

  @media (max-width: 575.98px) {

    .professional-achievement {
      width: 100%;
      gap: 6px;
    }

    .professional-achievement-rank {
      min-height: 28px;
      padding: 5px 8px 5px 7px;
      gap: 5px;

      font-size: 10px;
    }

    .professional-achievement-rank > svg {
      width: 11px;
      height: 11px;
    }

    .professional-achievement-rank > span:nth-of-type(1) {
      font-size: 12px;
    }

    .professional-achievement-rank > span:nth-of-type(3) {
      min-width: 17px;
      height: 17px;
      padding-inline: 4px;
      font-size: 8px;
    }

    .professional-achievement-bookings {
      min-height: 28px;
      padding: 5px 8px;
      font-size: 9px;
      gap: 4px;
    }

    .professional-achievement-bookings strong {
      min-width: 19px;
      height: 19px;
      padding-inline: 5px;
      font-size: 9px;
    }
  }


  /* =========================================================
     VERY SMALL DEVICES
     ========================================================= */

  @media (max-width: 380px) {

    .professional-achievement {
      align-items: stretch;
      flex-direction: column;
      gap: 5px;
    }

    .professional-achievement-rank,
    .professional-achievement-bookings {
      width: fit-content;
      max-width: 100%;
    }

    .professional-achievement-rank {
      min-height: 27px;
      font-size: 9px;
    }

    .professional-achievement-bookings {
      font-size: 9px;
    }
  }


  /* =========================================================
     REDUCED MOTION
     ========================================================= */

  @media (prefers-reduced-motion: reduce) {
    .professional-achievement-rank {
      transition: none;
    }
  }
`}</style>
    </div>
  );
};

export default ProfessionalAchievementBadge;
