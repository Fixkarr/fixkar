import React from "react";
import {
    FaTools,
    FaMapMarkerAlt,
    FaClock,
    FaCalendarAlt,
    FaBolt,
    FaRupeeSign,
} from "react-icons/fa";

const ServiceInfo = ({ request }) => {
    const serviceName =
        request?.serviceName || "Service";

    const taskName =
        request?.taskName || "Task";

    const distance =
        Number(request?.distanceInKm);

    const duration =
        Number(request?.durationInMinutes);

    const taskPrice =
        Number(request?.charge?.taskPrice || 0);

    const visitingCharge =
        Number(request?.charge?.visitingCharge || 0);

    const totalAmount =
        Number(request?.charge?.totalAmount || 0);

    const formatDate = (date) => {
        if (!date) return "Not specified";

        return new Date(`${date}T00:00:00`).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
            }
        );
    };

    return (
        <div className="row g-3 mb-4">

            {/* SERVICE + TASK */}
            <div className="col-12">
                <div className="border rounded-4 p-3 bg-white shadow-sm">

                    <div className="d-flex align-items-center">

                        <div
                            className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                            style={{
                                width: "52px",
                                height: "52px",
                            }}
                        >
                            <FaTools className="text-primary fs-5" />
                        </div>

                        <div className="ms-3 min-w-0">
                            <small className="text-secondary d-block">
                                Service
                            </small>

                            <h6 className="fw-bold mb-1 text-truncate">
                                {serviceName}
                            </h6>

                            <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill">
                                {taskName}
                            </span>
                        </div>

                        <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill ms-auto d-flex align-items-center gap-1">
                            <FaBolt size={11} />
                            New
                        </span>

                    </div>

                </div>
            </div>

            {/* DISTANCE */}
            <div className="col-6">
                <div className="border rounded-4 p-3 h-100 bg-white shadow-sm">

                    <div className="d-flex align-items-center">

                        <FaMapMarkerAlt className="text-danger fs-5 flex-shrink-0" />

                        <div className="ms-2">
                            <small className="text-secondary d-block">
                                Distance
                            </small>

                            <span className="fw-semibold">
                                {Number.isFinite(distance)
                                    ? `${distance.toFixed(1)} km`
                                    : "N/A"}
                            </span>
                        </div>

                    </div>

                </div>
            </div>

            {/* REACH TIME */}
            <div className="col-6">
                <div className="border rounded-4 p-3 h-100 bg-white shadow-sm">

                    <div className="d-flex align-items-center">

                        <FaClock className="text-success fs-5 flex-shrink-0" />

                        <div className="ms-2">
                            <small className="text-secondary d-block">
                                Reach Time
                            </small>

                            <span className="fw-semibold">
                                {Number.isFinite(duration)
                                    ? `${duration} mins`
                                    : "N/A"}
                            </span>
                        </div>

                    </div>

                </div>
            </div>

            {/* WORK DATE */}
            <div className="col-6">
                <div className="border rounded-4 p-3 h-100 bg-white shadow-sm">

                    <div className="d-flex align-items-center">

                        <FaCalendarAlt className="text-primary fs-5 flex-shrink-0" />

                        <div className="ms-2">
                            <small className="text-secondary d-block">
                                Work Date
                            </small>

                            <span className="fw-semibold small">
                                {formatDate(request?.workDate)}
                            </span>
                        </div>

                    </div>

                </div>
            </div>

            {/* WORK TIME */}
            <div className="col-6">
                <div className="border rounded-4 p-3 h-100 bg-white shadow-sm">

                    <div className="d-flex align-items-center">

                        <FaClock className="text-warning fs-5 flex-shrink-0" />

                        <div className="ms-2">
                            <small className="text-secondary d-block">
                                Work Time
                            </small>

                            <span className="fw-semibold">
                                {request?.workTime || "N/A"}
                            </span>
                        </div>

                    </div>

                </div>
            </div>

            {/* PRICE BREAKDOWN */}
            <div className="col-12">
                <div className="border rounded-4 p-3 bg-white shadow-sm">

                    <div className="d-flex align-items-center justify-content-between mb-3">

                        <div className="d-flex align-items-center gap-2">
                            <div
                                className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center"
                                style={{
                                    width: "38px",
                                    height: "38px",
                                }}
                            >
                                <FaRupeeSign />
                            </div>

                            <div>
                                <h6 className="fw-bold mb-0">
                                    Estimated Charges
                                </h6>

                                <small className="text-muted">
                                    Amount you'll receive
                                </small>
                            </div>
                        </div>

                    </div>

                    <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted small">
                            Task charge
                        </span>

                        <span className="fw-semibold">
                            ₹{taskPrice}
                        </span>
                    </div>

                    <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted small">
                            Visiting charge
                        </span>

                        <span className="fw-semibold">
                            ₹{visitingCharge}
                        </span>
                    </div>

                    <hr className="my-2" />

                    <div className="d-flex justify-content-between">
                        <span className="fw-bold">
                            Total
                        </span>

                        <span className="fw-bold text-success fs-5">
                            ₹{totalAmount}
                        </span>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default ServiceInfo;