import { Card, Button } from "react-bootstrap";
import {
    FaArrowRight,
    FaBolt,
    FaCheckCircle,
} from "react-icons/fa";

const RecommendationCard = ({
    recommendation,
    navigate,
}) => {

    const {
        title,
        message,
        scoreGain,
        action,
    } = recommendation;

    return (

        <Card className="recommendation-card h-100 border-0">

            <Card.Body>

                <div className="d-flex justify-content-between align-items-start">

                    <div className="d-flex">

                        <div className="recommendation-icon">

                            <FaBolt />

                        </div>

                        <div className="ms-3">

                            <h6 className="fw-bold mb-1">

                                {title}

                            </h6>

                            <p className="text-muted mb-0">

                                {message}

                            </p>

                        </div>

                    </div>

                    <span className="score-pill">

                        +{scoreGain}

                    </span>

                </div>

                <hr />

                <div className="d-flex justify-content-between align-items-center">

                    <small className="text-success fw-semibold">

                        <FaCheckCircle className="me-1" />

                        Improve profile ranking

                    </small>

                    <Button

                        size="sm"

                        variant="primary"
                        className="rounded-pill px-3"

                        onClick={() =>
                            navigate?.(action)
                        }

                    >

                        Complete

                        <FaArrowRight className="ms-2" />

                    </Button>

                </div>

            </Card.Body>

        </Card>

    );

};

export default RecommendationCard;