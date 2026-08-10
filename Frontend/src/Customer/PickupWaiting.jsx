import React, { useEffect, useState } from "react";
import {
    FaSearch,
    FaUserClock,
    FaCheckCircle,
    FaMapMarkerAlt,
    FaClock,
    FaShieldAlt,
    FaPhoneAlt,
    FaTools,
    FaRupeeSign,
    FaRoute,
    FaCalendarAlt,
    FaInfoCircle,
    FaCheck,
} from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    resetPickupState,
    setSearchStatus,
} from "../redux/pickup.slice";

const PickupWaiting = ({ expiresAt, onConfirmHire }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        isSearching,
        searchStatus,
        acceptedProfessionals,
    } = useSelector((state) => state.pickup);

    console.log(
        "Accepted Professionals:",
        acceptedProfessionals
    );

    // =====================================================
    // CANCEL
    // =====================================================

    const handleCancel = () => {
        dispatch(resetPickupState());
        navigate("/customer/home");
    };

    // =====================================================
    // TRY AGAIN
    // =====================================================

    const handleTryAgain = () => {
        dispatch(resetPickupState());
        navigate("/customer/home");
    };

    // =====================================================
    // SEARCHING STATUS
    // =====================================================

    useEffect(() => {
        if (
            acceptedProfessionals.length === 0 &&
            searchStatus === "idle"
        ) {
            dispatch(setSearchStatus("searching"));
        }
    }, [
        acceptedProfessionals.length,
        searchStatus,
        dispatch,
    ]);

    // =====================================================
    // COUNTDOWN
    // =====================================================

    const calculateRemaining = () => {
        if (!expiresAt) return 60;

        const remaining = Math.ceil(
            (new Date(expiresAt).getTime() - Date.now()) /
                1000
        );

        return Math.max(0, remaining);
    };

    const [remaining, setRemaining] = useState(
        calculateRemaining
    );

    useEffect(() => {
        setRemaining(calculateRemaining());

        const timer = setInterval(() => {
            setRemaining(calculateRemaining());
        }, 1000);

        return () => clearInterval(timer);
    }, [expiresAt]);

    // =====================================================
    // EXPIRED
    // =====================================================

    useEffect(() => {
        /*
         * Agar kisi professional ne accept kar liya hai,
         * to "No Professional Found" nahi dikhana.
         */
        if (
            remaining <= 0 &&
            searchStatus === "searching" &&
            acceptedProfessionals.length === 0
        ) {
            dispatch(setSearchStatus("expired"));
        }
    }, [
        remaining,
        searchStatus,
        acceptedProfessionals.length,
        dispatch,
    ]);

    // =====================================================
    // TIMER UI
    // =====================================================

    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;

    const formattedTime = `${String(minutes).padStart(
        2,
        "0"
    )}:${String(seconds).padStart(2, "0")}`;

    const progress = Math.min(
        100,
        Math.max(0, (remaining / 60) * 100)
    );

    // =====================================================
    // PROFESSIONAL CARD
    // =====================================================

    const renderProfessionalCard = (item, index) => {
        const professional = item.professional || {};

        const charge = item.charge || {};

        const professionalName =
            professional.name || "Professional";

        const profession =
            professional.profession || item.serviceName;

        const profilePicture =
            professional.profilePicture;

        const distance =
            Number(item.distanceInKm || 0).toFixed(1);

        const eta = item.durationInMinutes;

        return (
            <div
                key={
                    item.pickupRequestId ||
                    professional._id ||
                    index
                }
                className="card border-0 shadow-sm rounded-4 overflow-hidden mb-3"
            >
                {/* ACCEPTED HEADER */}

                <div className="bg-success bg-opacity-10 px-3 px-md-4 py-3 border-bottom">
                    <div className="d-flex align-items-center gap-2">
                        <div
                            className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center"
                            style={{
                                width: "34px",
                                height: "34px",
                            }}
                        >
                            <FaCheck size={14} />
                        </div>

                        <div>
                            <div className="fw-bold text-success">
                                Professional Accepted
                            </div>

                            <small className="text-muted">
                                This professional is available for your request
                            </small>
                        </div>
                    </div>
                </div>

                <div className="card-body p-3 p-md-4">

                    {/* PROFESSIONAL */}

                    <div className="d-flex align-items-center justify-content-between gap-3 mb-4">

                        <div className="d-flex align-items-center gap-3">

                            {profilePicture ? (
                                <img
                                    src={profilePicture}
                                    alt={professionalName}
                                    className="rounded-circle object-fit-cover"
                                    style={{
                                        width: "62px",
                                        height: "62px",
                                    }}
                                />
                            ) : (
                                <div
                                    className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center"
                                    style={{
                                        width: "62px",
                                        height: "62px",
                                    }}
                                >
                                    <FaTools size={25} />
                                </div>
                            )}

                            <div>
                                <h5 className="fw-bold mb-1">
                                    {professionalName}
                                </h5>

                                <small className="text-muted d-block">
                                    {profession}
                                </small>

                                <span className="badge bg-success bg-opacity-10 text-success rounded-pill mt-1">
                                    <FaCheckCircle
                                        className="me-1"
                                    />
                                    Available
                                </span>
                            </div>

                        </div>

                        {professional.mobile && (
                            <a
                                href={`tel:${professional.mobile}`}
                                className="btn btn-light border rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                                style={{
                                    width: "44px",
                                    height: "44px",
                                }}
                            >
                                <FaPhoneAlt className="text-primary" />
                            </a>
                        )}

                    </div>

                    {/* DISTANCE / ETA */}

                    <div className="row g-2 mb-4">

                        <div className="col-6">
                            <div className="bg-light rounded-4 p-3 h-100">
                                <div className="d-flex align-items-center gap-2">
                                    <FaRoute className="text-primary" />

                                    <div>
                                        <small className="text-muted d-block">
                                            Distance
                                        </small>

                                        <strong>
                                            {distance} km
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-6">
                            <div className="bg-light rounded-4 p-3 h-100">
                                <div className="d-flex align-items-center gap-2">
                                    <FaClock className="text-success" />

                                    <div>
                                        <small className="text-muted d-block">
                                            Reach Time
                                        </small>

                                        <strong>
                                            {eta != null
                                                ? `${Math.round(
                                                      eta
                                                  )} min`
                                                : "N/A"}
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* SERVICE */}

                    <div className="border rounded-4 p-3 mb-3">

                        <div className="d-flex align-items-center gap-3">

                            <div
                                className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center"
                                style={{
                                    width: "44px",
                                    height: "44px",
                                }}
                            >
                                <FaTools />
                            </div>

                            <div>
                                <small className="text-muted d-block">
                                    {item.serviceName ||
                                        "Service"}
                                </small>

                                <strong>
                                    {item.taskName ||
                                        "Service Request"}
                                </strong>
                            </div>

                        </div>

                    </div>

                    {/* SCHEDULE */}

                    <div className="border rounded-4 p-3 mb-3">

                        <div className="d-flex align-items-center gap-3">

                            <div
                                className="rounded-circle bg-warning bg-opacity-10 text-warning d-flex align-items-center justify-content-center"
                                style={{
                                    width: "44px",
                                    height: "44px",
                                }}
                            >
                                <FaCalendarAlt />
                            </div>

                            <div>
                                <small className="text-muted d-block">
                                    Service Schedule
                                </small>

                                <strong>
                                    {item.workDate
                                        ? new Date(
                                              item.workDate
                                          ).toLocaleDateString(
                                              "en-IN",
                                              {
                                                  day: "2-digit",
                                                  month: "short",
                                                  year: "numeric",
                                              }
                                          )
                                        : "Date not available"}
                                </strong>

                                <span className="text-muted ms-2">
                                    {item.workTime || ""}
                                </span>
                            </div>

                        </div>

                    </div>

                    {/* ADDRESS */}

                    <div className="border rounded-4 p-3 mb-3">

                        <div className="d-flex gap-3">

                            <div
                                className="rounded-circle bg-danger bg-opacity-10 text-danger d-flex align-items-center justify-content-center flex-shrink-0"
                                style={{
                                    width: "44px",
                                    height: "44px",
                                }}
                            >
                                <FaMapMarkerAlt />
                            </div>

                            <div className="flex-grow-1">

                                <small className="text-muted d-block mb-1">
                                    Service Address
                                </small>

                                <div className="fw-semibold">
                                    {item.workAddress ||
                                        "Address not available"}
                                </div>

                                {item.customerLocation && (
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${item.customerLocation.customerLat},${item.customerLocation.customerLng}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn btn-sm btn-outline-primary rounded-pill mt-2"
                                    >
                                        <FaMapMarkerAlt className="me-1" />
                                        View on Map
                                    </a>
                                )}

                            </div>

                        </div>

                    </div>

                    {/* PROBLEM */}

                    {item.problemDescription && (
                        <div className="alert alert-light border rounded-4">

                            <div className="d-flex gap-2">

                                <FaInfoCircle className="text-primary mt-1" />

                                <div>
                                    <small className="fw-semibold d-block">
                                        Problem Description
                                    </small>

                                    <span className="small text-muted">
                                        {item.problemDescription}
                                    </span>
                                </div>

                            </div>

                        </div>
                    )}

                    {/* PRICE */}

                    <div className="bg-primary bg-opacity-10 rounded-4 p-3 mt-3">

                        <div className="d-flex align-items-center justify-content-between mb-3">

                            <div className="d-flex align-items-center gap-2">
                                <FaRupeeSign className="text-primary" />

                                <strong>
                                    Estimated Cost
                                </strong>
                            </div>

                            <h5 className="fw-bold text-primary mb-0">
                                ₹
                                {Number(
                                    charge.totalAmount || 0
                                ).toLocaleString("en-IN")}
                            </h5>

                        </div>

                        <div className="d-flex justify-content-between small mb-2">
                            <span className="text-muted">
                                Task Charge
                            </span>

                            <span className="fw-semibold">
                                ₹
                                {Number(
                                    charge.taskPrice || 0
                                ).toLocaleString("en-IN")}
                            </span>
                        </div>

                        <div className="d-flex justify-content-between small">
                            <span className="text-muted">
                                Visiting Charge
                            </span>

                            <span className="fw-semibold">
                                ₹
                                {Number(
                                    charge.visitingCharge || 0
                                ).toLocaleString("en-IN")}
                            </span>
                        </div>

                    </div>

                    {/* CONFIRM */}

                    <button
                        type="button"
                        className="btn btn-primary w-100 rounded-4 py-3 fw-semibold mt-3 shadow-sm"
                        onClick={() =>
                            onConfirmHire?.(item)
                        }
                    >
                        <FaCheckCircle className="me-2" />

                        Confirm & Hire This Professional
                    </button>

                </div>
            </div>
        );
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <>
            {/* =================================================
                ACCEPTED PROFESSIONALS
            ================================================= */}

            {acceptedProfessionals.length > 0 && (
                <div className="container-fluid bg-light min-vh-100 py-3 py-md-4">

                    <div className="container">

                        {/* HEADER */}

                        <div className="text-center mb-4">

                            <div
                                className="mx-auto mb-3 rounded-circle bg-success bg-opacity-10 text-success d-flex align-items-center justify-content-center"
                                style={{
                                    width: "70px",
                                    height: "70px",
                                }}
                            >
                                <FaCheckCircle size={32} />
                            </div>

                            <h4 className="fw-bold mb-1">
                                Professionals Found
                            </h4>

                            <p className="text-muted small mb-0">
                                {acceptedProfessionals.length === 1
                                    ? "A professional has accepted your request."
                                    : `${acceptedProfessionals.length} professionals have accepted your request.`}
                            </p>

                        </div>

                        {/* CARDS */}

                        <div className="mx-auto" style={{ maxWidth: "650px" }}>

                            {acceptedProfessionals.map(
                                renderProfessionalCard
                            )}

                            <div className="alert alert-light border rounded-4 d-flex gap-3">

                                <FaShieldAlt className="text-primary mt-1" />

                                <div>
                                    <strong className="small">
                                        Choose the professional you prefer
                                    </strong>

                                    <p className="small text-muted mb-0 mt-1">
                                        Review the distance, charges and
                                        professional details before confirming.
                                    </p>
                                </div>

                            </div>

                        </div>

                    </div>
                </div>
            )}

            {/* =================================================
                SEARCHING
            ================================================= */}

            {acceptedProfessionals.length === 0 &&
                searchStatus === "searching" && (
                    <div className="container-fluid bg-light min-vh-100 py-3 py-md-4">

                        <div className="container">

                            <div
                                className="mx-auto bg-white rounded-4 shadow-sm overflow-hidden"
                                style={{
                                    maxWidth: "650px",
                                }}
                            >

                                <div
                                    className="p-4 text-white text-center"
                                    style={{
                                        background:
                                            "linear-gradient(135deg,#0d6efd,#4f46e5)",
                                    }}
                                >

                                    <div
                                        className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle bg-white bg-opacity-25"
                                        style={{
                                            width: "72px",
                                            height: "72px",
                                        }}
                                    >
                                        <FaSearch size={28} />
                                    </div>

                                    <h4 className="fw-bold mb-2">
                                        Finding a Professional
                                    </h4>

                                    <p className="mb-0 small opacity-75">
                                        We're contacting nearby professionals
                                        for your work.
                                    </p>

                                </div>

                                <div className="card-body p-4">

                                    <div className="text-center mb-4">

                                        <small className="text-muted d-block mb-2">
                                            Waiting for professional acceptance
                                        </small>

                                        <div className="fw-bold text-primary display-6">
                                            {formattedTime}
                                        </div>

                                        <div
                                            className="progress mt-3"
                                            style={{
                                                height: "7px",
                                            }}
                                        >
                                            <div
                                                className="progress-bar"
                                                role="progressbar"
                                                style={{
                                                    width: `${progress}%`,
                                                }}
                                            />
                                        </div>

                                    </div>

                                    {/* TIMELINE */}

                                    <div className="position-relative">

                                        <div className="d-flex gap-3 mb-4">

                                            <div
                                                className="rounded-circle bg-success bg-opacity-10 text-success d-flex align-items-center justify-content-center flex-shrink-0"
                                                style={{
                                                    width: "42px",
                                                    height: "42px",
                                                }}
                                            >
                                                <FaCheckCircle />
                                            </div>

                                            <div>
                                                <h6 className="fw-bold mb-1">
                                                    Request sent
                                                </h6>

                                                <small className="text-muted">
                                                    Your request has been sent
                                                    to nearby professionals.
                                                </small>
                                            </div>

                                        </div>

                                        <div className="d-flex gap-3 mb-4">

                                            <div
                                                className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center flex-shrink-0"
                                                style={{
                                                    width: "42px",
                                                    height: "42px",
                                                }}
                                            >
                                                <FaUserClock />
                                            </div>

                                            <div>
                                                <h6 className="fw-bold mb-1">
                                                    Waiting for acceptance
                                                </h6>

                                                <small className="text-muted">
                                                    Nearby professionals can
                                                    accept your request.
                                                </small>
                                            </div>

                                        </div>

                                        <div className="d-flex gap-3">

                                            <div
                                                className="rounded-circle bg-light text-secondary d-flex align-items-center justify-content-center flex-shrink-0"
                                                style={{
                                                    width: "42px",
                                                    height: "42px",
                                                }}
                                            >
                                                <FaMapMarkerAlt />
                                            </div>

                                            <div>
                                                <h6 className="fw-bold mb-1">
                                                    Professional assigned
                                                </h6>

                                                <small className="text-muted">
                                                    You'll be notified when a
                                                    professional accepts.
                                                </small>
                                            </div>

                                        </div>

                                    </div>

                                    <div className="alert alert-light border rounded-4 mt-4 mb-0">

                                        <div className="d-flex gap-3">

                                            <div className="text-primary pt-1">
                                                <FaShieldAlt />
                                            </div>

                                            <div>
                                                <div className="fw-semibold small">
                                                    You don't need to do anything
                                                </div>

                                                <small className="text-muted">
                                                    Please stay on this page.
                                                    We'll automatically update
                                                    you when a professional
                                                    accepts your request.
                                                </small>
                                            </div>

                                        </div>

                                    </div>

                                    <div className="d-flex justify-content-center align-items-center gap-2 text-muted small mt-4">

                                        <FaClock />

                                        <span>
                                            Searching nearby professionals...
                                        </span>

                                        <span className="spinner-grow spinner-grow-sm text-primary" />

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                )}

            {/* =================================================
                EXPIRED
            ================================================= */}

            {acceptedProfessionals.length === 0 &&
                searchStatus === "expired" && (
                    <div className="container-fluid bg-light min-vh-100 py-5">

                        <div
                            className="card border-0 shadow-sm rounded-4 mx-auto"
                            style={{
                                maxWidth: "430px",
                            }}
                        >

                            <div className="card-body text-center p-4 p-md-5">

                                <div
                                    className="rounded-circle bg-warning bg-opacity-10 text-warning d-flex align-items-center justify-content-center mx-auto mb-3"
                                    style={{
                                        width: "70px",
                                        height: "70px",
                                    }}
                                >
                                    <FaClock size={28} />
                                </div>

                                <h5 className="fw-bold">
                                    No Professional Found
                                </h5>

                                <p className="text-muted small">
                                    No professional accepted your request
                                    within 1 minute.
                                </p>

                                <div className="d-grid gap-2 mt-4">

                                    <button
                                        className="btn btn-primary rounded-pill fw-semibold"
                                        onClick={handleTryAgain}
                                    >
                                        Try Again
                                    </button>

                                    <button
                                        className="btn btn-light border rounded-pill"
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>
                )}
        </>
    );
};

export default PickupWaiting;