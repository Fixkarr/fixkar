import React from "react";

const RANKS = [
  { tier: "BRONZE", label: "Bronze", icon: "🥉" },
  { tier: "SILVER", label: "Silver", icon: "🥈" },
  { tier: "GOLD", label: "Gold", icon: "🏆" },
  { tier: "PLATINUM", label: "Platinum", icon: "💠" },
  { tier: "DIAMOND", label: "Diamond", icon: "💎" },
];

const THRESHOLDS = RANKS.flatMap((rank, tierIndex) =>
  Array.from({ length: 5 }, (_, levelIndex) => ({
    ...rank,
    level: levelIndex + 1,
    requiredBookings: tierIndex * 25 + levelIndex * 5,
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

const ProfessionalAchievementCard = ({ professional }) => {
  const completed = Math.max(0, Number(professional?.professionalRank?.completedBookings ?? professional?.achievements?.completedBookings ?? 0));
  const current = getRank(completed);
  const currentIndex = THRESHOLDS.findIndex((item) => item.tier === current.tier && item.level === current.level);
  const next = THRESHOLDS[currentIndex + 1] || null;
  const remaining = next ? Math.max(0, next.requiredBookings - completed) : 0;

  return (
    <div className="card border-0 shadow-sm rounded-4">
      <div className="card-body p-4">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
          <div>
            <div className="small text-muted fw-semibold">Professional Milestones</div>
            <h5 className="fw-bold mb-1">{current.icon} {current.label} {current.level}</h5>
            <div className="small text-muted">{completed} completed bookings · {next ? `${remaining} more to ${next.label} ${next.level}` : "Highest rank reached"}</div>
          </div>
          <span className="badge rounded-pill bg-light text-dark px-3 py-2">{completed} Stars</span>
        </div>

        <div className="d-flex flex-column gap-3">
          {RANKS.map((rank) => {
            const levels = THRESHOLDS.filter((item) => item.tier === rank.tier);
            return (
              <div key={rank.tier}>
                <div className="d-flex align-items-center gap-2 mb-2"><span>{rank.icon}</span><strong>{rank.label}</strong></div>
                <div className="d-flex flex-wrap gap-2">
                  {levels.map((item) => {
                    const unlocked = completed >= item.requiredBookings;
                    const active = current.tier === item.tier && current.level === item.level;
                    return (
                      <div key={`${item.tier}-${item.level}`} className={`border rounded-3 px-3 py-2 ${active ? "border-primary bg-primary bg-opacity-10" : unlocked ? "border-success bg-success bg-opacity-10" : "bg-light"}`}>
                        <div className="small fw-bold">{item.label} {item.level}</div>
                        <div className="small text-muted">{item.requiredBookings === 0 ? "Start" : `${item.requiredBookings} bookings`}</div>
                        <div className={`small mt-1 ${unlocked ? "text-success" : "text-muted"}`}>{unlocked ? "✓ Unlocked" : `${item.requiredBookings - completed} to go`}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {next && <div className="mt-4"><div className="d-flex justify-content-between small fw-semibold mb-1"><span>Next: {next.label} {next.level}</span><span>{completed}/{next.requiredBookings}</span></div><div className="progress" style={{ height: 8 }}><div className="progress-bar" style={{ width: `${Math.min(100, Math.round((completed / next.requiredBookings) * 100))}%` }} /></div></div>}
        <div className="small text-muted mt-3">Every completed Fixkar booking adds one milestone score. Rank rewards are credited automatically when a new level is unlocked.</div>
      </div>
    </div>
  );
};

export default ProfessionalAchievementCard;
