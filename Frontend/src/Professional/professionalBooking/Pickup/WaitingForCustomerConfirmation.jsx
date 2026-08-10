import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaClock, FaMapMarkerAlt, FaRupeeSign, FaUserClock } from "react-icons/fa";

const getRemainingSeconds = (expiresAt) => {
    if (!expiresAt) return 60;

    return Math.max(
        0,
        Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 1000)
    );
};

const WaitingForCustomerConfirmation = ({ request, onExpired }) => {
    const expiresAt = request.customerConfirmationExpiresAt;
    const [remaining, setRemaining] = useState(() => getRemainingSeconds(expiresAt));

    useEffect(() => {
        const updateRemaining = () => setRemaining(getRemainingSeconds(expiresAt));
        updateRemaining();

        const timer = setInterval(updateRemaining, 1000);
        return () => clearInterval(timer);
    }, [expiresAt]);

    useEffect(() => {
        if (remaining === 0) onExpired?.();
    }, [remaining, onExpired]);

    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    const charge = request.charge || {};
    const commissionPercentage = Number(charge.commissionPercentage) || 0;
    const platformCommission = Number(charge.platformCommission) || 0;
    const professionalAmount = Number(charge.professionalAmount) || Number(charge.totalAmount) || 0;

    return (
        <div className="card border-0 shadow rounded-4 overflow-hidden">
            <div className="bg-primary bg-opacity-10 border-bottom px-3 px-md-4 py-3 d-flex align-items-center gap-3">
                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: 42, height: 42 }}>
                    <FaUserClock />
                </div>
                <div>
                    <div className="fw-bold text-primary">Waiting for customer confirmation</div>
                    <small className="text-muted">You accepted this pickup request. Please wait while the customer confirms and hires.</small>
                </div>
            </div>

            <div className="card-body p-3 p-md-4">
                <div className="text-center border rounded-4 bg-light py-3 mb-4">
                    <small className="text-muted d-block mb-1">Customer confirmation time remaining</small>
                    <div className="fs-2 fw-bold text-primary"><FaClock className="me-2" />{formattedTime}</div>
                    <div className="progress mx-auto mt-2" style={{ height: 6, maxWidth: 280 }}>
                        <div className="progress-bar" style={{ width: `${(remaining / 60) * 100}%` }} />
                    </div>
                </div>

                <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3 gap-3">
                    <div>
                        <small className="text-muted d-block">Customer</small>
                        <strong>{request.customerName || "Customer"}</strong>
                    </div>
                    <span className="badge text-bg-success rounded-pill px-3 py-2"><FaCheckCircle className="me-1" />Accepted</span>
                </div>

                <div className="row g-3 small">
                    <div className="col-6"><div className="border rounded-3 p-3 h-100"><span className="text-muted d-block">Service</span><strong>{request.serviceName || "Service"}</strong><div>{request.taskName}</div></div></div>
                    <div className="col-6"><div className="border rounded-3 p-3 h-100"><span className="text-muted d-block">You'll receive</span><strong><FaRupeeSign size={12} />{professionalAmount.toLocaleString("en-IN")}</strong><div>Commission: -₹{platformCommission.toLocaleString("en-IN")} ({commissionPercentage}%)</div></div></div>
                    <div className="col-12"><div className="border rounded-3 p-3"><FaMapMarkerAlt className="text-danger me-2" /><strong>{request.workAddress || "Customer address will be shared after confirmation"}</strong></div></div>
                </div>
            </div>
        </div>
    );
};

export default WaitingForCustomerConfirmation;
