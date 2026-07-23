import { useState } from "react";
import { Card, Button, Collapse, ProgressBar } from "react-bootstrap";
import {
    FaChevronDown,
    FaChevronUp,
    FaBolt,
    FaArrowRight,
    FaCheckCircle,
    FaRegCircle,
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

        <Card className="profile-health-card border-0 shadow-lg overflow-hidden">

            {/* ================= HEADER ================= */}

            <div className="profile-health-header p-4">

                <div className="d-flex justify-content-between align-items-start">

                    <div>

                        <h5 className="fw-bold text-white mb-1">
                            Profile Health
                        </h5>

                        <small className="text-white-50">
                            Complete your profile to get more customers
                        </small>

                    </div>

                    <LevelBadge level={level} />

                </div>

                <div className="row align-items-center mt-4">

                    <div className="col-md-4 text-center">

                        <CircularProgress
                            percentage={percentage}
                            size={145}
                        />

                    </div>

                    <div className="col-md-8 mt-4 mt-md-0">

                        <div className="d-flex align-items-end">

                            <h2 className="text-white fw-bold mb-0">

                                {score}

                            </h2>

                            <span className="text-white-50 ms-2">

                                / {maxScore}

                            </span>

                        </div>

                        <div className="text-white-50 mb-3">

                            Overall Profile Score

                        </div>

                        <ProgressBar
                            now={percentage}
                            className="profile-progress"
                        />

                        <div className="d-flex justify-content-between mt-3">

                            <div>

                                <small className="text-white-50">

                                    Sections Completed

                                </small>

                                <div className="fw-semibold text-white">

                                    {completedSections} / {totalSections}

                                </div>

                            </div>

                            <div className="text-end">

                                <small className="text-white-50">

                                    Completion

                                </small>

                                <div className="fw-bold text-warning">

                                    {percentage}%

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* ================= NEXT RECOMMENDATION ================= */}

            {
                nextRecommendation &&

                <div className="p-4 border-bottom bg-white">

                    <div className="d-flex justify-content-between align-items-center mb-3">

                        <h6 className="fw-bold mb-0">

                            <FaBolt className="text-warning me-2" />

                            Highest Impact Improvement

                        </h6>

                        <span className="score-pill">

                            +{nextRecommendation.scoreGain}

                        </span>

                    </div>

                    <div className="recommendation-preview">

                        <div>

                            <div className="fw-semibold">

                                {nextRecommendation.title}

                            </div>

                            <small className="text-muted">

                                {nextRecommendation.message}

                            </small>

                        </div>

                        <Button

                            variant="primary"

                            className="rounded-pill"

                            onClick={() =>
                                navigate?.(
                                    nextRecommendation.action
                                )
                            }

                        >

                            Complete

                            <FaArrowRight className="ms-2" />

                        </Button>

                    </div>

                </div>

            }

            {/* ================= EXPAND BUTTON ================= */}

            <div className="text-center py-3 bg-light">

                <Button

                    variant="link"

                    className="text-decoration-none fw-semibold"

                    onClick={() =>
                        setExpanded(!expanded)
                    }

                >

                    {
                        expanded
                            ? "Hide Details"
                            : "View Full Profile Health"
                    }

                    {
                        expanded
                            ? <FaChevronUp className="ms-2" />
                            : <FaChevronDown className="ms-2" />
                    }

                </Button>

            </div>

            {/* ================= EXPANDABLE AREA ================= */}

            <Collapse in={expanded}>

                <div>

                    {/* SECTION STATUS */}

                    <div className="p-4">

                        <h6 className="fw-bold mb-4">

                            Section Progress

                        </h6>

                        <div className="row g-3">

                            {

                                sections.map(section => (

                                    <div
                                        key={section.id}
                                        className="col-md-6"
                                    >

                                        <SectionProgress
                                            section={section}
                                            navigate={navigate}
                                        />

                                    </div>

                                ))

                            }

                        </div>

                    </div>

                    {/* RECOMMENDATIONS */}

                    {

                        recommendations.length > 0 &&

                        <div className="border-top p-4">

                            <h6 className="fw-bold mb-4">

                                Recommended Improvements

                            </h6>

                            <div className="row g-3">

                                {

                                    recommendations.map((item, index) => (

                                        <div
                                            key={index}
                                            className="col-lg-6"
                                        >

                                            <RecommendationCard
                                                recommendation={item}
                                                navigate={navigate}
                                            />

                                        </div>

                                    ))

                                }

                            </div>

                        </div>

                    }

                </div>

            </Collapse>

        </Card>

    );

};

export default ProfileHealthCard;