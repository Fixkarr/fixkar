import { useEffect, useMemo, useState } from "react";

const CircularProgress = ({
    percentage = 0,
    size = 150,
    strokeWidth = 12,
}) => {

    const [progress, setProgress] = useState(0);

    useEffect(() => {

        const timer = setTimeout(() => {

            setProgress(percentage);

        }, 150);

        return () => clearTimeout(timer);

    }, [percentage]);

    const radius = useMemo(() => {

        return (size - strokeWidth) / 2;

    }, [size, strokeWidth]);

    const circumference = useMemo(() => {

        return 2 * Math.PI * radius;

    }, [radius]);

    const offset = useMemo(() => {

        return circumference - (progress / 100) * circumference;

    }, [progress, circumference]);

    const progressColor = useMemo(() => {

        if (percentage >= 90)
            return "#16a34a";

        if (percentage >= 75)
            return "#0d6efd";

        if (percentage >= 50)
            return "#f59e0b";

        return "#dc3545";

    }, [percentage]);

    const level = useMemo(() => {

        if (percentage >= 90)
            return "Excellent";

        if (percentage >= 75)
            return "Good";

        if (percentage >= 50)
            return "Average";

        return "Needs Work";

    }, [percentage]);

    return (

        <div
            className="position-relative d-inline-flex justify-content-center align-items-center"
            style={{
                width: size,
                height: size,
            }}
        >

            <svg
                width={size}
                height={size}
                style={{
                    transform: "rotate(-90deg)"
                }}
            >

                <defs>

                    <linearGradient
                        id="progressGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                    >

                        <stop
                            offset="0%"
                            stopColor={progressColor}
                        />

                        <stop
                            offset="100%"
                            stopColor="#3b82f6"
                        />

                    </linearGradient>

                    <filter id="glow">

                        <feGaussianBlur
                            stdDeviation="3"
                            result="coloredBlur"
                        />

                        <feMerge>

                            <feMergeNode in="coloredBlur" />

                            <feMergeNode in="SourceGraphic" />

                        </feMerge>

                    </filter>

                </defs>

                {/* Background */}

                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke="#e9ecef"
                    strokeWidth={strokeWidth}
                />

                {/* Progress */}

                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke="url(#progressGradient)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    filter="url(#glow)"
                    style={{
                        transition:
                            "stroke-dashoffset 1.2s ease",
                    }}
                />

            </svg>

            {/* Center */}

            <div
                className="position-absolute top-50 start-50 translate-middle text-center"
            >

                <h2
                    className="fw-bold mb-0"
                    style={{
                        color: progressColor,
                        lineHeight: 1,
                    }}
                >

                    {Math.round(progress)}%

                </h2>

                <small
                    className="text-muted fw-semibold"
                >

                    {level}

                </small>

            </div>

        </div>

    );

};

export default CircularProgress;