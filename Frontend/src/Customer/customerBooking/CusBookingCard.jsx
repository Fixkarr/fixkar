import React from "react";
import { useNavigate } from "react-router-dom";
import { GetStatusBadge } from "../../utils/GetStatusBadge";
import { formatDate, formatTime } from "../../utils/formatTime&Date";

const CusBookingCard = ({ booking }) => {
  const navigate = useNavigate();

  return (
    booking && (
      <div
        className="booking-card"
        style={{ cursor: "pointer" }}
        onClick={() => navigate(`/customer/bookings/${booking?._id}`)}
      >
        <div className="card border-0 shadow-sm rounded-4 mb-3">
          <div className="card-body p-3 rounded-4">

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="d-flex align-items-center gap-2">
                <img
                  src={booking?.professionalId?.profilePicture}
                  alt="professional"
                  width="45"
                  height="45"
                  className="rounded-circle border"
                />

                <div>
                  <h6 className="fw-semibold text-primary mb-0">
                    {booking?.professionalId?.userId?.fullName}
                  </h6>
                  <small className="text-muted">
                    {booking?.profession}
                  </small>
                </div>
              </div>

              <GetStatusBadge status={booking?.status} />
            </div>

            <small className="text-muted">
              Booking ID: {booking?._id}
            </small>

            <hr className="my-2" />

            {/* Details */}
            <div className="row g-2">
              <div className="col-6">
                <small className="text-muted d-block">
                  Visiting Charge
                </small>
                <span className="fw-semibold">
                  ₹{booking?.visitingCharge}
                </span>
              </div>

              <div className="col-6">
                <small className="text-muted d-block">
                  Charge Type
                </small>
                <span className="fw-semibold text-capitalize">
                  {booking?.chargeType}
                </span>
              </div>

              <div className="col-6">
                <small className="text-muted d-block">
                  Work Date
                </small>
                <span className="fw-semibold">
                  {formatDate(booking?.workDate)}
                </span>
              </div>

              <div className="col-6">
                <small className="text-muted d-block">
                  Work Time
                </small>
                <span className="fw-semibold">
                  {formatTime(booking?.workTime)}
                </span>
              </div>

              <div className="col-12 mt-2">
                <small className="text-muted d-block">
                  Work Address
                </small>
                <span className="fw-semibold text-dark">
                  {booking?.workAddress}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    )
  );
};

export default CusBookingCard;
