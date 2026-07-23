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
    <Card className="profile-health-card border-0 shadow-sm overflow-hidden rounded-3">
      {/* ================= COMPACT HEADER ================= */}
      <div className="profile-health-header p-3">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
          
          {/* Title & Badge */}
          <div className="d-flex align-items-center gap-2">
            <div>
              <h6 className="fw-bold text-white mb-0">Profile Health</h6>
              <small className="text-white-50" style={{ fontSize: "0.75rem" }}>
                Complete your profile to get more customers
              </small>
            </div>
            <LevelBadge level={level} />
          </div>

          {/* Compact Score & Circular Progress */}
          <div className="d-flex align-items-center gap-3">
            <CircularProgress percentage={percentage} size={55} />
            
            <div className="text-end">
              <div className="d-flex align-items-baseline justify-content-end">
                <span className="text-white fw-bold h5 mb-0">{score}</span>
                <span className="text-white-50 ms-1" style={{ fontSize: "0.8rem" }}>/{maxScore}</span>
              </div>
              <small className="text-warning fw-bold d-block" style={{ fontSize: "0.75rem" }}>
                {percentage}% ({completedSections}/{totalSections} Done)
              </small>
            </div>
          </div>

        </div>

        {/* Thin Linear Progress */}
        <ProgressBar 
          now={percentage} 
          className="profile-progress mt-2" 
          style={{ height: "4px" }} 
        />
      </div>

      {/* ================= NEXT RECOMMENDATION (RECTANGULAR STRIP) ================= */}
      {nextRecommendation && (
        <div className="px-3 py-2 border-bottom bg-white d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div className="d-flex align-items-center gap-2 overflow-hidden me-2">
            <span className="badge bg-warning-subtle text-warning-emphasis border border-warning px-2 py-1">
              <FaBolt className="me-1" />+{nextRecommendation.scoreGain}
            </span>
            <div className="text-truncate">
              <span className="fw-semibold text-dark me-2" style={{ fontSize: "0.85rem" }}>
                {nextRecommendation.title}:
              </span>
              <small className="text-muted text-truncate d-none d-sm-inline" style={{ fontSize: "0.8rem" }}>
                {nextRecommendation.message}
              </small>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            className="rounded-pill px-3 py-1 ms-auto"
            onClick={() => navigate?.(nextRecommendation.action)}
            style={{ fontSize: "0.8rem" }}
          >
            Fix <FaArrowRight className="ms-1" />
          </Button>
        </div>
      )}

      {/* ================= EXPAND TOGGLE BAR ================= */}
      <div className="text-center py-1 bg-light border-top">
        <Button
          variant="link"
          size="sm"
          className="text-decoration-none fw-semibold text-secondary py-0"
          style={{ fontSize: "0.75rem" }}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Less Details" : "View Details"}
          {expanded ? <FaChevronUp className="ms-1" /> : <FaChevronDown className="ms-1" />}
        </Button>
      </div>

      {/* ================= EXPANDABLE SECTION ================= */}
      <Collapse in={expanded}>
        <div>
          {/* SECTION PROGRESS */}
          <div className="p-3">
            <h6 className="fw-bold mb-3" style={{ fontSize: "0.85rem" }}>Section Progress</h6>
            <div className="row g-2">
              {sections.map((section) => (
                <div key={section.id} className="col-md-6">
                  <SectionProgress section={section} navigate={navigate} />
                </div>
              ))}
            </div>
          </div>

          {/* RECOMMENDATIONS */}
          {recommendations.length > 0 && (
            <div className="border-top p-3">
              <h6 className="fw-bold mb-3" style={{ fontSize: "0.85rem" }}>Recommended Improvements</h6>
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