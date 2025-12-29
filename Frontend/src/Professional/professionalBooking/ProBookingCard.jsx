import React from "react";
import { GetStatusBadge } from "../../utils/GetStatusBadge";
import { formatDate, formatTime } from "../../utils/formatTime&Date";
import { useNavigate } from "react-router-dom";

import {
  FaUserCircle,
  FaRupeeSign,
  FaClock,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaArrowRight,
} from "react-icons/fa";

const ProBookingCard = ({ booking }) => {
  const navigate = useNavigate();

  return (
    booking && (
      <div
        className="booking-card card border-0 shadow-sm rounded-4 mb-3 cursor-pointer"
        onClick={() =>
          navigate(`/professional/bookings/${booking?._id}`)
        }
      >
        <div className="card-body p-3">

          {/* ===== Header ===== */}
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div className="d-flex gap-2 align-items-center">
              <FaUserCircle className="text-primary fs-4" />
              <div>
                <h6 className="fw-semibold mb-0 text-dark">
                  {booking?.customerName}
                </h6>
                <small className="text-muted">
                  ID: {booking?._id}
                </small>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <GetStatusBadge status={booking?.status} />
              <FaArrowRight className="text-muted" />
            </div>
          </div>

          <hr className="my-2" />

          {/* ===== Details ===== */}
          <div className="row g-3">

            {/* Visiting Charge */}
            <div className="col-6">
              <div className="d-flex align-items-center gap-2">
                <FaRupeeSign className="text-success" />
                <div>
                  <small className="text-muted d-block">
                    Visiting Charge
                  </small>
                  <span className="fw-semibold">
                    ₹{booking?.visitingCharge}
                  </span>
                </div>
              </div>
            </div>

            {/* Work Time */}
            <div className="col-6">
              <div className="d-flex align-items-center gap-2">
                <FaClock className="text-warning" />
                <div>
                  <small className="text-muted d-block">
                    Work Time
                  </small>
                  <span className="fw-semibold">
                    {formatTime(booking?.workTime)}
                  </span>
                </div>
              </div>
            </div>

            {/* Work Date */}
            <div className="col-6">
              <div className="d-flex align-items-center gap-2">
                <FaCalendarAlt className="text-primary" />
                <div>
                  <small className="text-muted d-block">
                    Work Date
                  </small>
                  <span className="fw-semibold">
                    {formatDate(booking?.workDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="col-12">
              <div className="d-flex align-items-start gap-2">
                <FaMapMarkerAlt className="text-danger mt-1" />
                <div>
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
      </div>
    )
  );
};

export default ProBookingCard;
