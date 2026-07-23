import {
    FaTrophy,
    FaStar,
    FaChartLine,
    FaExclamationTriangle,
} from "react-icons/fa";

const LEVEL_CONFIG = {
    excellent: {
        icon: <FaTrophy />,
        text: "Excellent",
        bg: "linear-gradient(135deg,#16a34a,#22c55e)",
    },
    good: {
        icon: <FaStar />,
        text: "Good",
        bg: "linear-gradient(135deg,#0d6efd,#3b82f6)",
    },
    average: {
        icon: <FaChartLine />,
        text: "Average",
        bg: "linear-gradient(135deg,#f59e0b,#fbbf24)",
    },
    "needs improvement": {
        icon: <FaExclamationTriangle />,
        text: "Needs Improvement",
        bg: "linear-gradient(135deg,#dc3545,#ef4444)",
    },
};

const LevelBadge = ({ level = "Needs Improvement" }) => {

    const config =
        LEVEL_CONFIG[level.toLowerCase()] ||
        LEVEL_CONFIG["needs improvement"];

    return (

        <div
            className="level-badge"
            style={{
                background: config.bg,
            }}
        >
            <span className="me-2">
                {config.icon}
            </span>

            {config.text}
        </div>

    );

};

export default LevelBadge;