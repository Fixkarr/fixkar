import React, { useEffect, useState } from "react";
import {
    FaCheck,
    FaTimes,
    FaClock,
    FaHourglassHalf,
} from "react-icons/fa";

const ActionButtons = ({ request, onAccept, onReject }) => {
    const calculateRemaining = () => {
        if (!request?.expiresAt) return 0;

        const remaining = Math.ceil(
            (new Date(request.expiresAt).getTime() - Date.now()) / 1000
        );

        return Math.max(0, remaining);
    };

    const [remaining, setRemaining] = useState(calculateRemaining);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        setRemaining(calculateRemaining());

        const timer = setInterval(() => {
            setRemaining(calculateRemaining());
        }, 1000);

        return () => clearInterval(timer);
    }, [request?.expiresAt]);

    const isExpired = remaining <= 0;

    // =====================================================
    // ACCEPT
    // =====================================================

    const handleAccept = async () => {
        if (isExpired || actionLoading) return;

        try {
            setActionLoading(true);

            await onAccept?.(request);
        } catch (error) {
            console.error("Accept pickup request error:", error);
        } finally {
            setActionLoading(false);
        }
    };

    // =====================================================
    // REJECT
    // =====================================================

    const handleReject = async () => {
        if (isExpired || actionLoading) return;

        try {
            setActionLoading(true);

            await onReject?.(request);
        } catch (error) {
            console.error("Reject pickup request error:", error);
        } finally {
            setActionLoading(false);
        }
    };

    // =====================================================
    // TIMER
    // =====================================================

    const totalSeconds = 60;

    const progress = Math.min(
        100,
        Math.max(
            0,
            (remaining / totalSeconds) * 100
        )
    );

    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;

    const formattedTime = `${String(minutes).padStart(
        2,
        "0"
    )}:${String(seconds).padStart(2, "0")}`;

    return (
        <div className="mt-4">

            {/* ================================
                COUNTDOWN
            ================================= */}

            <div
                className={`rounded-4 p-3 mb-3 border ${
                    isExpired
                        ? "bg-danger bg-opacity-10 border-danger"
                        : remaining <= 15
                        ? "bg-danger bg-opacity-10 border-danger"
                        : "bg-warning bg-opacity-10 border-warning"
                }`}
            >
                <div className="d-flex justify-content-between align-items-center mb-2">

                    <div className="d-flex align-items-center gap-2">

                        <div
                            className={`rounded-circle d-flex align-items-center justify-content-center ${
                                isExpired
                                    ? "bg-danger text-white"
                                    : remaining <= 15
                                    ? "bg-danger text-white"
                                    : "bg-warning bg-opacity-25 text-warning"
                            }`}
                            style={{
                                width: "38px",
                                height: "38px",
                            }}
                        >
                            {isExpired ? (
                                <FaTimes />
                            ) : (
                                <FaHourglassHalf />
                            )}
                        </div>

                        <div>
                            <small className="text-muted d-block">
                                {isExpired
                                    ? "Request Expired"
                                    : "Response Required"}
                            </small>

                            <span className="fw-semibold small">
                                {isExpired
                                    ? "This request is no longer available."
                                    : "Please respond before the timer ends."}
                            </span>
                        </div>

                    </div>

                    {!isExpired && (
                        <div className="text-end ms-2">
                            <div
                                className={`fw-bold fs-5 ${
                                    remaining <= 15
                                        ? "text-danger"
                                        : "text-dark"
                                }`}
                            >
                                {formattedTime}
                            </div>

                            <small className="text-muted">
                                remaining
                            </small>
                        </div>
                    )}

                </div>

                {/* PROGRESS BAR */}

                <div
                    className="progress rounded-pill"
                    style={{ height: "7px" }}
                >
                    <div
                        className={`progress-bar ${
                            isExpired
                                ? "bg-danger"
                                : remaining <= 15
                                ? "bg-danger"
                                : "bg-warning"
                        }`}
                        role="progressbar"
                        style={{
                            width: `${progress}%`,
                            transition:
                                "width 1s linear",
                        }}
                    />
                </div>

                {!isExpired && (
                    <div className="d-flex align-items-center gap-2 mt-2 text-muted small">
                        <FaClock size={12} />

                        <span>
                            Accept or reject this request before it expires.
                        </span>
                    </div>
                )}
            </div>

            {/* ================================
                ACTION BUTTONS
            ================================= */}

            {!isExpired ? (
                <div className="row g-2">

                    {/* REJECT */}

                    <div className="col-6">
                        <button
                            type="button"
                            onClick={handleReject}
                            disabled={actionLoading}
                            className="btn btn-outline-danger w-100 rounded-4 py-3 fw-semibold d-flex align-items-center justify-content-center"
                        >
                            <FaTimes className="me-2" />

                            {actionLoading
                                ? "Please wait..."
                                : "Reject"}
                        </button>
                    </div>

                    {/* ACCEPT */}

                    <div className="col-6">
                        <button
                            type="button"
                            onClick={handleAccept}
                            disabled={actionLoading}
                            className="btn btn-primary w-100 rounded-4 py-3 fw-semibold d-flex align-items-center justify-content-center shadow-sm"
                        >
                            <FaCheck className="me-2" />

                            {actionLoading
                                ? "Accepting..."
                                : "Accept Request"}
                        </button>
                    </div>

                </div>
            ) : (

                /* ================================
                   EXPIRED
                ================================= */

                <div className="alert alert-danger rounded-4 mb-0 text-center">
                    <FaTimes className="me-2" />

                    This pickup request has expired.
                </div>
            )}
        </div>
    );
};

export default ActionButtons;