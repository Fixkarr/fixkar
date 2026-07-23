import { Card, ProgressBar, Button } from "react-bootstrap";
import {
    FaCheckCircle,
    FaTimesCircle,
    FaArrowRight,
} from "react-icons/fa";

const SectionProgress = ({
    section,
    navigate,
}) => {

    const {
        title,
        score,
        maxScore,
        percentage,
        completed,
        total,
        action,
    } = section;

    const getColor = () => {

        if (percentage >= 90)
            return "success";

        if (percentage >= 70)
            return "primary";

        if (percentage >= 40)
            return "warning";

        return "danger";

    };

    const completedSection = percentage >= 100;

    return (

        <Card className="section-progress-card border-0 h-100">

            <Card.Body>

                <div className="d-flex justify-content-between align-items-start">

                    <div>

                        <h6 className="fw-bold mb-1">

                            {title}

                        </h6>

                        <small className="text-muted">

                            {completed} / {total} Completed

                        </small>

                    </div>

                    {

                        completedSection ? (

                            <FaCheckCircle
                                className="text-success fs-4"
                            />

                        ) : (

                            <FaTimesCircle
                                className="text-danger fs-4"
                            />

                        )

                    }

                </div>

                <div className="mt-4">

                    <ProgressBar

                        now={percentage}

                        variant={getColor()}

                        style={{
                            height: "10px",
                            borderRadius: "20px",
                        }}

                    />

                </div>

                <div className="d-flex justify-content-between mt-3">

                    <span
                        className={`fw-bold text-${getColor()}`}
                    >

                        {percentage.toFixed(0)}%

                    </span>

                    <span className="text-muted">

                        {score}/{maxScore}

                    </span>

                </div>

                {

                    action && percentage < 100 && (

                        <div className="mt-4">

                            <Button

                                variant="outline-primary"

                                size="sm"

                                className="rounded-pill"

                                onClick={() =>
                                    navigate?.(action)
                                }

                            >

                                Complete Section

                                <FaArrowRight className="ms-2"/>

                            </Button>

                        </div>

                    )

                }

            </Card.Body>

        </Card>

    );

};

export default SectionProgress;
