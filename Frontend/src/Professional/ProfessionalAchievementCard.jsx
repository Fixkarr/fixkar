import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { FaArrowRight, FaCheck, FaLock, FaMedal, FaStar, FaTrophy } from "react-icons/fa";
import socket from "../socket.js";
import { setCurrentUserData } from "../redux/user.slice.js";

const server_url = import.meta.env.VITE_SERVER_URL;

const RANKS = [
  { tier: "BRONZE", label: "Bronze", icon: "🥉", accent: "#cd7f32" },
  { tier: "SILVER", label: "Silver", icon: "🥈", accent: "#94a3b8" },
  { tier: "GOLD", label: "Gold", icon: "🏆", accent: "#f59e0b" },
  { tier: "PLATINUM", label: "Platinum", icon: "💠", accent: "#38bdf8" },
  { tier: "DIAMOND", label: "Diamond", icon: "💎", accent: "#6366f1" },
];

const LEVEL_BOOKING_OFFSETS = [0, 1, 3, 6, 10];
const THRESHOLDS = RANKS.flatMap((rank, tierIndex) =>
  LEVEL_BOOKING_OFFSETS.map((offset, levelIndex) => ({
    ...rank,
    level: levelIndex + 1,
    requiredBookings: tierIndex * 25 + offset,
  }))
);

const getRank = (completed) => {
  let current = THRESHOLDS[0];
  for (const item of THRESHOLDS) {
    if (completed >= item.requiredBookings) current = item;
    else break;
  }
  return current;
};

const getCompleted = (professional) =>
  Math.max(
    0,
    Number(
      professional?.professionalRank?.completedBookings ??
        professional?.achievements?.completedBookings ??
        0
    )
  );

const ProfessionalAchievementCard = ({ professional }) => {
  const dispatch = useDispatch();
  const [liveCompleted, setLiveCompleted] = useState(() => getCompleted(professional));
  const [celebrating, setCelebrating] = useState(false);

  useEffect(() => {
    setLiveCompleted(getCompleted(professional));
  }, [professional]);

  useEffect(() => {
    let refreshTimer;

    const refreshProfessional = async (milestone = null) => {
      const incoming = Number(milestone?.completedBookings);
      if (Number.isFinite(incoming) && incoming > 0) {
        setLiveCompleted(incoming);
        setCelebrating(true);
        window.clearTimeout(refreshTimer);
        refreshTimer = window.setTimeout(() => setCelebrating(false), 2200);
      }

      try {
        const result = await axios.get(`${server_url}/api/user/current`, {
          withCredentials: true,
        });
        dispatch(setCurrentUserData(result.data));
        setLiveCompleted(getCompleted(result.data?.user));
      } catch (error) {
        console.error("Failed to refresh professional milestone data", error);
      }
    };

    const handleMilestone = (data) => refreshProfessional(data);
    const handleBookingUpdate = (booking) => {
      if (booking?.status === "completed") refreshProfessional();
    };

    socket.on("professionalMilestoneUnlocked", handleMilestone);
    socket.on("bookingUpdated", handleBookingUpdate);

    return () => {
      window.clearTimeout(refreshTimer);
      socket.off("professionalMilestoneUnlocked", handleMilestone);
      socket.off("bookingUpdated", handleBookingUpdate);
    };
  }, [dispatch]);

  const completed = liveCompleted;
  const current = getRank(completed);
  const currentIndex = THRESHOLDS.findIndex(
    (item) => item.tier === current.tier && item.level === current.level
  );
  const next = THRESHOLDS[currentIndex + 1] || null;
  const previousRequirement = current.requiredBookings;
  const nextRequirement = next?.requiredBookings ?? current.requiredBookings;
  const progress = next
    ? Math.min(
        100,
        Math.max(
          0,
          Math.round(
            ((completed - previousRequirement) /
              Math.max(1, nextRequirement - previousRequirement)) *
              100
          )
        )
      )
    : 100;

  const currentRank = useMemo(
    () => RANKS.find((rank) => rank.tier === current.tier) || RANKS[0],
    [current.tier]
  );

  return (
    <section className={`milestone-card ${celebrating ? "milestone-card--celebrate" : ""}`}>
      <style>{`
        .milestone-card{position:relative;overflow:hidden;border:1px solid rgba(15,23,42,.08);border-radius:24px;background:#fff;box-shadow:0 14px 40px rgba(15,23,42,.08)}
        .milestone-card:before{content:"";position:absolute;inset:0 0 auto;height:5px;background:linear-gradient(90deg,#0d6efd,#6366f1,#06b6d4)}
        .milestone-hero{position:relative;padding:24px;background:linear-gradient(135deg,#f8fbff 0%,#eef5ff 55%,#f8f7ff 100%)}
        .milestone-orb{width:64px;height:64px;display:grid;place-items:center;border-radius:20px;font-size:30px;background:rgba(255,255,255,.85);box-shadow:0 10px 24px rgba(15,23,42,.1)}
        .milestone-pill{display:inline-flex;align-items:center;gap:7px;padding:7px 12px;border-radius:999px;background:#fff;border:1px solid rgba(15,23,42,.08);font-size:12px;font-weight:700;color:#475569}
        .milestone-progress{height:10px;border-radius:999px;background:#e8eef7;overflow:hidden}
        .milestone-progress>span{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,#0d6efd,#6366f1);transition:width .65s cubic-bezier(.2,.8,.2,1)}
        .milestone-level{min-height:96px;border:1px solid #e8edf5;border-radius:16px;background:#fff;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease}
        .milestone-level:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(15,23,42,.08)}
        .milestone-level.active{border-color:#0d6efd;background:linear-gradient(145deg,#f0f6ff,#fff)}
        .milestone-level.locked{background:#f8fafc;color:#94a3b8}
        .milestone-level .level-icon{font-size:20px}
        .milestone-card--celebrate{animation:milestonePulse .55s ease}
        @keyframes milestonePulse{0%{transform:scale(1)}45%{transform:scale(1.012)}100%{transform:scale(1)}}
        @media(max-width:576px){.milestone-hero{padding:18px}.milestone-orb{width:54px;height:54px;font-size:25px}.milestone-level{min-height:88px}}
      `}</style>

      <div className="milestone-hero">
        <div className="d-flex align-items-start justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="milestone-orb">{current.icon}</div>
            <div>
              <div className="small fw-bold text-primary text-uppercase mb-1">Professional Milestones</div>
              <h5 className="fw-bold mb-1">{current.label} {current.level}</h5>
              <div className="small text-secondary">
                {completed} completed {completed === 1 ? "booking" : "bookings"}
              </div>
            </div>
          </div>
          <span className="milestone-pill"><FaStar className="text-warning" /> {completed}</span>
        </div>

        <div className="mt-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="small fw-bold">{next ? `Progress to ${next.label} ${next.level}` : "Maximum rank reached"}</span>
            <span className="small fw-bold text-primary">{progress}%</span>
          </div>
          <div className="milestone-progress"><span style={{ width: `${progress}%` }} /></div>
          <div className="d-flex justify-content-between mt-2 small text-secondary">
            <span>{current.requiredBookings === 0 ? "Journey started" : `${current.requiredBookings} bookings`}</span>
            {next && <span>{Math.max(0, next.requiredBookings - completed)} to go</span>}
          </div>
        </div>
      </div>

      <div className="p-3 p-md-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div><div className="fw-bold">Your journey</div><div className="small text-secondary">Every genuine completed booking moves you forward.</div></div>
          <FaTrophy className="text-warning" />
        </div>

        <div className="row g-2">
          {THRESHOLDS.map((item) => {
            const unlocked = completed >= item.requiredBookings;
            const active = current.tier === item.tier && current.level === item.level;
            return (
              <div className="col-6 col-md-4 col-xl-3" key={`${item.tier}-${item.level}`}>
                <div className={`milestone-level p-3 ${active ? "active" : ""} ${!unlocked ? "locked" : ""}`}>
                  <div className="d-flex justify-content-between align-items-start gap-2">
                    <span className="level-icon">{item.icon}</span>
                    {unlocked ? <FaCheck className="text-success mt-1" size={12} /> : <FaLock className="text-secondary mt-1" size={11} />}
                  </div>
                  <div className="small fw-bold mt-2">{item.label} {item.level}</div>
                  <div className="small text-secondary mt-1">{item.requiredBookings === 0 ? "Start" : `${item.requiredBookings} bookings`}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="d-flex align-items-center gap-2 mt-4 p-3 rounded-4" style={{ background: "#f8fafc" }}>
          <FaMedal style={{ color: currentRank.accent }} />
          <div className="small text-secondary flex-grow-1">Keep completing quality work to unlock the next milestone and its reward.</div>
          {next && <span className="small fw-bold text-primary d-inline-flex align-items-center gap-1">{next.requiredBookings - completed} left <FaArrowRight size={10} /></span>}
        </div>
      </div>
    </section>
  );
};

export default ProfessionalAchievementCard;
