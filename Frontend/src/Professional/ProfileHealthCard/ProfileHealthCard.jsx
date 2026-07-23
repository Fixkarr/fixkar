import { useState } from "react";
import { Card, Button, Collapse, ProgressBar } from "react-bootstrap";
import {
  FaChevronDown,
  FaChevronUp,
  FaBolt,
  FaArrowRight,
} from "react-icons/fa";

import CircularProgress from "./CircularProgress";
import RecommendationCard from "./RecommendationCard";
import SectionProgress from "./SectionProgress";
import LevelBadge from "./LevelBadge";

const ProfileHealthCard = ({ profileCompletion, navigate }) => {
  const [expanded, setExpanded] = useState(false);

  if (!profileCompletion) return null;

  const {
    percentage,
    score,
    maxScore,
    level,
    completedSections,
    totalSections,
    nextRecommendation,
    recommendations,
    sections,
  } = profileCompletion;

  return (
    <Card className="profile-health-card w-100 border-0 shadow-sm overflow-hidden rounded-3 mb-3">
      {/* ================= HEADER BANNERS (FULL WIDTH & SLEEK) ================= */}
      <div 
        className="px-3 py-2 text-white" 
        style={{
          background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        }}
      >
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
          
          {/* Left: Info & Badge */}
          <div className="d-flex align-items-center gap-3">
            <CircularProgress percentage={percentage} size={48} />
            <div>
              <div className="d-flex align-items-center gap-2">
                <h6 className="fw-bold mb-0 text-white" style={{ fontSize: "0.95rem" }}>
                  Profile Health
                </h6>
                <LevelBadge level={level} />
              </div>
              <small className="text-white-50 d-block mt-1" style={{ fontSize: "0.75rem" }}>
                Complete your profile to get more customers
              </small>
            </div>
          </div>

          {/* Right: Score & Section Stats */}
          <div className="d-flex align-items-center gap-4">
            <div className="text-end">
              <span className="text-white-50" style={{ fontSize: "0.75rem" }}>Sections</span>
              <div className="fw-semibold text-white" style={{ fontSize: "0.85rem" }}>
                {completedSections} / {totalSections}
              </div>
            </div>

            <div className="text-end border-start border-secondary ps-3">
              <div className="d-flex align-items-baseline justify-content-end gap-1">
                <span className="text-white fw-bold h5 mb-0">{score}</span>
                <span className="text-white-50" style={{ fontSize: "0.75rem" }}>/{maxScore}</span>
              </div>
              <span className="badge bg-warning text-dark px-2 py-0 mt-1" style={{ fontSize: "0.7rem" }}>
                {percentage}% Completed
              </span>
            </div>
          </div>

        </div>

        {/* Sleek Line Progress Bar */}
        <ProgressBar 
          now={percentage} 
          className="mt-2 bg-secondary" 
          style={{ height: "3px", opacity: 0.8 }} 
        />
      </div>

      {/* ================= NEXT RECOMMENDATION BANNER ================= */}
      {nextRecommendation && (
        <div className="w-100 px-3 py-2 bg-light border-bottom d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div className="d-flex align-items-center gap-2 overflow-hidden">
            <span className="badge bg-warning text-dark d-flex align-items-center gap-1 px-2 py-1">
              <FaBolt style={{ fontSize: "0.75rem" }} />
              <span>+{nextRecommendation.scoreGain} pts</span>
            </span>

            <div className="text-truncate">
              <span className="fw-bold text-dark me-1" style={{ fontSize: "0.85rem" }}>
                {nextRecommendation.title}:
              </span>
              <small className="text-secondary text-truncate" style={{ fontSize: "0.8rem" }}>
                {nextRecommendation.message}
              </small>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            className="rounded-pill px-3 py-1 shadow-sm border-0 ms-auto"
            onClick={() => navigate?.(nextRecommendation.action)}
            style={{ fontSize: "0.75rem", fontWeight: "600" }}
          >
            Complete Now <FaArrowRight className="ms-1" style={{ fontSize: "0.7rem" }} />
          </Button>
        </div>
      )}

      {/* ================= TOGGLE BUTTON ================= */}
      <div className="w-100 text-center bg-white py-1">
        <Button
          variant="link"
          size="sm"
          className="text-decoration-none fw-semibold text-muted py-0"
          style={{ fontSize: "0.75rem" }}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Hide Details" : "View Details"}
          {expanded ? <FaChevronUp className="ms-1" style={{ fontSize: "0.65rem" }} /> : <FaChevronDown className="ms-1" style={{ fontSize: "0.65rem" }} />}
        </Button>
      </div>

      {/* ================= EXPANDABLE AREA ================= */}
      <Collapse in={expanded}>
        <div className="border-top bg-light">
          {/* Section Progress */}
          <div className="p-3">
            <h6 className="fw-bold mb-3 text-dark" style={{ fontSize: "0.85rem" }}>
              Section Progress
            </h6>
            <div className="row g-2">
              {sections.map((section) => (
                <div key={section.id} className="col-md-6">
                  <SectionProgress section={section} navigate={navigate} />
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="border-top p-3 bg-white">
              <h6 className="fw-bold mb-3 text-dark" style={{ fontSize: "0.85rem" }}>
                Recommended Improvements
              </h6>
              <div className="row g-2">
                {recommendations.map((item, index) => (
                  <div key={index} className="col-lg-6">
                    <RecommendationCard
                      recommendation={item}
                      navigate={navigate}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Collapse>
    </Card>
  );
};

export default ProfileHealthCard;