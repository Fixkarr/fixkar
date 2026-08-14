import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaArrowRight,
  FaAward,
  FaCheck,
  FaCrown,
  FaGem,
  FaLock,
  FaMedal,
  FaRocket,
  FaTrophy,
} from "react-icons/fa";
import socket from "../socket.js";
import { setCurrentUserData } from "../redux/user.slice.js";

const RANK_META = {
  NEWCOMER: { label: "Newcomer", Icon: FaRocket },
  BRONZE: { label: "Bronze", Icon: FaMedal },
  SILVER: { label: "Silver", Icon: FaMedal },
  GOLD: { label: "Gold", Icon: FaTrophy },
  PLATINUM: { label: "Platinum", Icon: FaCrown },
  DIAMOND: { label: "Diamond", Icon: FaGem },
};
const TIER_ORDER = [
  "NEWCOMER",
  "BRONZE",
  "SILVER",
  "GOLD",
  "PLATINUM",
  "DIAMOND",
];

// Presentation fallback for older records that do not yet contain the newer
// next-milestone metadata. Backend remains the source of truth for rewards.
const RANK_MILESTONES = [
  ["BRONZE", 2, 1, 10000],
  ["BRONZE", 3, 3, 50],
  ["BRONZE", 4, 6, 75],
  ["BRONZE", 5, 10, 100],
  ["SILVER", 1, 15, 150],
  ["SILVER", 2, 20, 175],
  ["SILVER", 3, 25, 200],
  ["SILVER", 4, 30, 225],
  ["SILVER", 5, 35, 250],
  ["GOLD", 1, 40, 300],
  ["GOLD", 2, 45, 325],
  ["GOLD", 3, 50, 350],
  ["GOLD", 4, 55, 375],
  ["GOLD", 5, 60, 400],
  ["PLATINUM", 1, 65, 450],
  ["PLATINUM", 2, 70, 475],
  ["PLATINUM", 3, 75, 500],
  ["PLATINUM", 4, 80, 525],
  ["PLATINUM", 5, 85, 550],
  ["DIAMOND", 1, 90, 600],
  ["DIAMOND", 2, 95, 625],
  ["DIAMOND", 3, 100, 650],
  ["DIAMOND", 4, 105, 675],
  ["DIAMOND", 5, 110, 700],
].map(([tier, level, requiredBookings, credits]) => ({
  tier,
  level,
  requiredBookings,
  credits,
}));

const getFallbackMilestones = (completedBookings) => {
  const next =
    RANK_MILESTONES.find((item) => completedBookings < item.requiredBookings) ||
    null;
  const current =
    [...RANK_MILESTONES]
      .reverse()
      .find((item) => completedBookings >= item.requiredBookings) || null;
  return { current, next };
};

const getRankState = (professional) => {
  const rank = professional?.professionalRank || {};
  const completedBookings = Math.max(
    0,
    Number(
      rank.completedBookings ??
        professional?.achievements?.completedBookings ??
        0,
    ),
  );
  const fallback = getFallbackMilestones(completedBookings);
  const nextRequired = Number(rank.nextMilestoneBookings);
  const hasPersistedNext =
    Number.isFinite(nextRequired) && nextRequired > completedBookings;
  const requiredBookings = Math.max(
    0,
    Number(rank.milestoneBookings ?? fallback.current?.requiredBookings ?? 0),
  );

  return {
    completedBookings,
    tier:
      completedBookings === 0
        ? "NEWCOMER"
        : rank.tier || fallback.current?.tier || "BRONZE",
    level: Number(rank.level || fallback.current?.level || 1),
    requiredBookings,
    nextTier: rank.nextTier || fallback.next?.tier || null,
    nextLevel: rank.nextLevel ?? fallback.next?.level ?? null,
    nextRequiredBookings: hasPersistedNext
      ? nextRequired
      : (fallback.next?.requiredBookings ?? 0),
    nextRewardCredits: Number(
      rank.nextRewardCredits ?? fallback.next?.credits ?? 0,
    ),
  };
};

const mergeMilestoneIntoUser = (currentUserData, milestone) => {
  if (!currentUserData?.user || !milestone?.rank) return currentUserData;
  const rank = milestone.rank;
  return {
    ...currentUserData,
    user: {
      ...currentUserData.user,
      achievements: {
        ...currentUserData.user.achievements,
        completedBookings: milestone.completedBookings,
        rank: rank.tier,
      },
      professionalRank: {
        ...currentUserData.user.professionalRank,
        tier: rank.tier,
        level: rank.level,
        score: rank.score,
        completedBookings: milestone.completedBookings,
        milestoneBookings: rank.requiredBookings,
        nextMilestoneBookings: rank.nextRequiredBookings ?? 0,
        nextTier: rank.nextTier ?? null,
        nextLevel: rank.nextLevel ?? null,
        nextRewardCredits: rank.nextRewardCredits ?? 0,
      },
    },
  };
};
const formatRank = (tier, level) =>
  tier === "NEWCOMER"
    ? "Newcomer"
    : `${RANK_META[tier]?.label || tier} ${level}`;

const ProfessionalAchievementCard = ({ professional }) => {
  const dispatch = useDispatch();
  const currentUserData = useSelector((state) => state.user.currentUserData);
  const [liveRank, setLiveRank] = useState(() => getRankState(professional));
  const [celebrating, setCelebrating] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);

  useEffect(() => setLiveRank(getRankState(professional)), [professional]);

  useEffect(() => {
    let timer;
    const handleMilestone = (data) => {
      if (!data?.rank) return;
      const fallback = getRankState({
        professionalRank: {
          ...data.rank,
          completedBookings: data.completedBookings,
        },
      });
      const nextState = {
        ...fallback,
        completedBookings: Number(data.completedBookings ?? 0),
        tier: data.rank.tier,
        level: Number(data.rank.level || 1),
        requiredBookings: Number(
          data.rank.requiredBookings ?? fallback.requiredBookings,
        ),
        nextTier: data.rank.nextTier ?? fallback.nextTier,
        nextLevel: data.rank.nextLevel ?? fallback.nextLevel,
        nextRequiredBookings: Number(
          data.rank.nextRequiredBookings ?? fallback.nextRequiredBookings,
        ),
        nextRewardCredits: Number(
          data.rank.nextRewardCredits ?? fallback.nextRewardCredits,
        ),
      };
      setLiveRank(nextState);
      setCelebrating(true);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setCelebrating(false), 1800);
      const merged = mergeMilestoneIntoUser(currentUserData, data);
      if (merged) dispatch(setCurrentUserData(merged));
    };
    socket.on("professionalMilestoneUnlocked", handleMilestone);
    return () => {
      window.clearTimeout(timer);
      socket.off("professionalMilestoneUnlocked", handleMilestone);
    };
  }, [currentUserData, dispatch]);

  const currentMeta = RANK_META[liveRank.tier] || RANK_META.NEWCOMER;
  const CurrentIcon = currentMeta.Icon;
  const hasNext = Boolean(
    liveRank.nextTier &&
    liveRank.nextRequiredBookings > liveRank.completedBookings,
  );
  const progress = hasNext
    ? Math.min(
        100,
        Math.max(
          0,
          Math.round(
            ((liveRank.completedBookings - liveRank.requiredBookings) /
              Math.max(
                1,
                liveRank.nextRequiredBookings - liveRank.requiredBookings,
              )) *
              100,
          ),
        ),
      )
    : 100;
  const bookingsRemaining = hasNext
    ? Math.max(0, liveRank.nextRequiredBookings - liveRank.completedBookings)
    : 0;
  const currentTierIndex = TIER_ORDER.indexOf(liveRank.tier);
  const tierJourney = useMemo(
    () =>
      TIER_ORDER.map((tier, index) => ({
        ...RANK_META[tier],
        tier,
        unlocked: index <= currentTierIndex,
        active: tier === liveRank.tier,
      })),
    [currentTierIndex, liveRank.tier],
  );

  return (
    <section
      className={`milestone-card ${celebrating ? "milestone-card--celebrate" : ""}`}
    >
      <style>{`.milestone-card{position:relative;overflow:hidden;border:1px solid #e7edf5;border-radius:24px;background:#fff;box-shadow:0 14px 42px rgba(15,23,42,.07)}.milestone-card:before{content:"";position:absolute;inset:0 0 auto;height:4px;background:linear-gradient(90deg,#0d6efd,#6366f1,#06b6d4)}.milestone-hero{padding:26px;background:linear-gradient(135deg,#f7fbff 0%,#eef5ff 58%,#faf8ff 100%)}.milestone-icon{width:68px;height:68px;display:grid;place-items:center;border-radius:20px;background:#fff;border:1px solid #e4ebf5;box-shadow:0 10px 26px rgba(15,23,42,.08);color:#0d6efd}.milestone-badge{display:inline-flex;align-items:center;gap:7px;padding:7px 11px;border-radius:999px;background:#fff;border:1px solid #e4ebf5;color:#475569;font-size:12px;font-weight:700}.milestone-progress{height:10px;border-radius:999px;background:#e8eef7;overflow:hidden}.milestone-progress>span{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,#0d6efd,#6366f1);transition:width .7s cubic-bezier(.2,.8,.2,1)}.milestone-next{border:1px solid #e5eaf2;border-radius:18px;background:#fff}.journey-step{position:relative;min-width:92px;text-align:center;color:#94a3b8}.journey-step:not(:last-child):after{content:"";position:absolute;top:18px;left:calc(50% + 18px);width:calc(100% - 36px);height:2px;background:#e6ebf2}.journey-step.active{color:#0d6efd}.journey-step.unlocked{color:#475569}.journey-dot{width:36px;height:36px;margin:0 auto 8px;display:grid;place-items:center;border-radius:50%;background:#f1f5f9;border:1px solid #e2e8f0;position:relative;z-index:1}.journey-step.active .journey-dot{background:#eaf2ff;border-color:#b9d3ff;color:#0d6efd;box-shadow:0 0 0 5px rgba(13,110,253,.07)}.journey-step.unlocked .journey-dot{background:#eef7f1;border-color:#cce8d5;color:#198754}.roadmap-toggle{border:0;background:transparent;color:#0d6efd;font-weight:700;font-size:13px}.milestone-card--celebrate{animation:milestonePulse .5s ease}@keyframes milestonePulse{0%{transform:scale(1)}45%{transform:scale(1.012)}100%{transform:scale(1)}}@media(max-width:768px){.milestone-hero{padding:20px}.milestone-icon{width:58px;height:58px}.journey-wrap{overflow-x:auto;padding-bottom:6px}.journey{min-width:620px}}`}</style>
      <div className="milestone-hero">
        <div className="d-flex align-items-start justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="milestone-icon">
              <CurrentIcon size={28} />
            </div>
            <div>
              <div className="small fw-bold text-primary text-uppercase mb-1">
                Professional Progress
              </div>
              <h4 className="fw-bold mb-1">
                {formatRank(liveRank.tier, liveRank.level)}
              </h4>
              <div className="small text-secondary">
                {liveRank.completedBookings} completed{" "}
                {liveRank.completedBookings === 1 ? "booking" : "bookings"}
              </div>
            </div>
          </div>
          <span className="milestone-badge">
            <FaAward /> Rank progress
          </span>
        </div>
        {liveRank.tier === "NEWCOMER" ? (
          <div className="mt-4 p-3 p-md-4 rounded-4 bg-white border">
            <div className="small text-secondary mb-1">
              Your first milestone
            </div>
            <div className="fw-bold">Bronze 2</div>
            <div className="small text-secondary mt-1">
              Complete 1 booking to unlock your first professional reward.
            </div>
            <div className="d-flex align-items-center gap-2 mt-3 small fw-bold text-primary">
              <FaTrophy /> {liveRank.nextRewardCredits.toLocaleString()} credits
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="small fw-bold">
                {hasNext
                  ? `Progress to ${formatRank(liveRank.nextTier, liveRank.nextLevel)}`
                  : "Top rank reached"}
              </span>
              <span className="small fw-bold text-primary">{progress}%</span>
            </div>
            <div className="milestone-progress">
              <span style={{ width: `${progress}%` }} />
            </div>
            <div className="d-flex justify-content-between mt-2 small text-secondary">
              <span>{liveRank.completedBookings} completed</span>
              {hasNext && (
                <span>
                  {bookingsRemaining}{" "}
                  {bookingsRemaining === 1 ? "booking" : "bookings"} to go
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="p-3 p-md-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <div className="fw-bold">Rank journey</div>
            <div className="small text-secondary">
              Your progression is calculated from completed bookings.
            </div>
          </div>
          <button
            type="button"
            className="roadmap-toggle"
            onClick={() => setShowRoadmap((v) => !v)}
          >
            {showRoadmap ? "Hide roadmap" : "View roadmap"}
          </button>
        </div>
        <div className="journey-wrap">
          <div className="journey d-flex align-items-start justify-content-between gap-2">
            {tierJourney.map(({ tier, label, Icon, unlocked, active }) => (
              <div
                className={`journey-step ${active ? "active" : ""} ${unlocked ? "unlocked" : ""}`}
                key={tier}
              >
                <div className="journey-dot">
                  {unlocked ? <FaCheck size={12} /> : <FaLock size={11} />}
                </div>
                <div className="small fw-bold">{label}</div>
                <Icon size={13} className="mt-1" />
              </div>
            ))}
          </div>
        </div>
        <div className="milestone-next mt-4 p-3 p-md-4">
          <div className="d-flex align-items-start gap-3">
            <div
              className="milestone-icon"
              style={{ width: 48, height: 48, borderRadius: 14 }}
            >
              {hasNext ? <FaTrophy size={19} /> : <FaGem size={19} />}
            </div>
            <div className="flex-grow-1">
              <div className="small text-secondary">
                {hasNext ? "Next milestone" : "Achievement complete"}
              </div>
              <div className="fw-bold mt-1">
                {hasNext
                  ? formatRank(liveRank.nextTier, liveRank.nextLevel)
                  : "Diamond journey complete"}
              </div>
              {hasNext ? (
                <div className="small text-secondary mt-1">
                  {" "}
                  complete {liveRank.nextRequiredBookings} bookings ·{" "}
                  {bookingsRemaining} remaining
                </div>
              ) : (
                <div className="small text-secondary mt-1">
                  You have reached the highest professional rank.
                </div>
              )}
            </div>
            {hasNext && (
              <div className="text-end">
                <div className="small text-secondary">Reward</div>
                <div className="fw-bold text-primary">
                  {liveRank.nextRewardCredits.toLocaleString()}
                </div>
                <div className="small text-secondary">credits</div>
              </div>
            )}
          </div>
        </div>
        {showRoadmap && (
          <div className="mt-4 p-3 rounded-4" style={{ background: "#f8fafc" }}>
            <div className="small fw-bold mb-3">Professional rank roadmap</div>
            <div className="row g-2">
              {tierJourney.map(({ tier, label, Icon, unlocked, active }) => (
                <div className="col-6 col-md-4" key={`roadmap-${tier}`}>
                  <div
                    className={`d-flex align-items-center gap-2 p-3 rounded-4 border bg-white ${active ? "border-primary" : ""}`}
                  >
                    <Icon
                      className={unlocked ? "text-primary" : "text-secondary"}
                    />
                    <div>
                      <div className="small fw-bold">{label}</div>
                      <div className="small text-secondary">
                        {active ? "Current" : unlocked ? "Unlocked" : "Locked"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div
          className="d-flex align-items-center gap-2 mt-4 p-3 rounded-4"
          style={{ background: "#f8fafc" }}
        >
          <FaArrowRight className="text-primary" />
          <div className="small text-secondary">
            Complete genuine bookings to move forward. Rank and rewards update
            from the backend milestone state.
          </div>
        </div>
      </div>
    </section>
  );
};
export default ProfessionalAchievementCard;
