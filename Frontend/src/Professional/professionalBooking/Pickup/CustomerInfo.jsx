import React from "react";
import {
    FaUserCircle,
    FaCheckCircle,
    FaPhoneAlt,
    FaMapMarkerAlt,
    FaRoute,
} from "react-icons/fa";

const CustomerInfo = ({ request }) => {
    const customerName =
        request?.customerName || "Customer";

    const mobileNumber =
        request?.mobileNumber;

    const distance =
        Number(request?.distanceInKm);

    const handleCall = () => {
        if (!mobileNumber) return;

        window.location.href = `tel:${mobileNumber}`;
    };

    return (
        <div className="mb-4">

            {/* Customer Header */}
            <div className="d-flex align-items-center justify-content-between gap-3">

                <div className="d-flex align-items-center min-w-0">

                    {/* Avatar */}
                    <div
                        className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{
                            width: "58px",
                            height: "58px",
                        }}
                    >
                        <FaUserCircle size={34} />
                    </div>

                    {/* Customer Details */}
                    <div className="ms-3 min-w-0">

                        <h5
                            className="fw-bold mb-1 text-dark text-truncate"
                            style={{ maxWidth: "210px" }}
                        >
                            {customerName}
                        </h5>

                        <div className="d-flex align-items-center flex-wrap gap-2">

                            <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-2 py-1">
                                <FaCheckCircle className="me-1" />
                                Request Verified
                            </span>

                        </div>

                    </div>

                </div>

                {/* Call Button */}
                <button
                    type="button"
                    onClick={handleCall}
                    disabled={!mobileNumber}
                    className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm"
                    style={{
                        width: "46px",
                        height: "46px",
                    }}
                    aria-label="Call customer"
                >
                    <FaPhoneAlt />
                </button>

            </div>

            {/* Customer Request Meta */}
            <div className="row g-2 mt-3">

                {/* Distance */}
                <div className="col-6">

                    <div className="bg-light border rounded-3 p-2 h-100">

                        <div className="d-flex align-items-center gap-2">

                            <div className="text-primary">
                                <FaRoute />
                            </div>

                            <div className="min-w-0">
                                <small className="text-muted d-block">
                                    Distance
                                </small>

                                <span className="fw-semibold small">
                                    {Number.isFinite(distance)
                                        ? `${distance.toFixed(1)} km`
                                        : "N/A"}
                                </span>
                            </div>

                        </div>

                    </div>

                </div>

                {/* Location */}
                <div className="col-6">

                    <div className="bg-light border rounded-3 p-2 h-100">

                        <div className="d-flex align-items-center gap-2">

                            <div className="text-danger">
                                <FaMapMarkerAlt />
                            </div>

                            <div className="min-w-0">
                                <small className="text-muted d-block">
                                    Service location
                                </small>

                                <span className="fw-semibold small">
                                    Nearby
                                </span>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default CustomerInfo;