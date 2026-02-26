import React from "react";
import { useNavigate } from "react-router-dom";
import { GetStatusBadge } from "../../utils/GetStatusBadge";
import { formatDate, formatTime } from "../../utils/formatTime&Date";
import { FaUserTie, FaCalendarAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { MdCurrencyRupee, MdWork } from "react-icons/md";


const CusBookingCard = ({ booking }) => {
  const navigate = useNavigate();

 return (
  booking && (
    <div
      onClick={() => navigate(`/customer/bookings/${booking?._id}`)}
      style={{ cursor: "pointer" }}
      className="mb-4"
    >
      <div
        className="rounded-4 shadow-lg overflow-hidden"
        style={{
          background: "linear-gradient(145deg,#ffffff,#f3f8ff)",
          border: "1px solid #e6f0ff",
          transition: "all 0.25s ease"
        }}
      >

        {/* 🔵 TOP SECTION */}
        <div className="p-4 pb-3">

          <div className="d-flex justify-content-between align-items-start">

            {/* Professional Info */}
            <div className="d-flex align-items-center gap-3">

              <div className="position-relative">
                <img
                  src={booking?.professionalId?.profilePicture}
                  alt="professional"
                  style={{
                    width: 60,
                    height: 60,
                    objectFit: "cover",
                    borderRadius: "50%",
                    border: "3px solid #0d6efd"
                  }}
                />
              </div>

              <div>
                <h6 className="fw-bold mb-1 text-dark">
                  {booking?.professionalId?.userId?.fullName}
                </h6>

                <small className="text-muted d-flex align-items-center">
                  <MdWork className="me-1 text-primary" />
                  {booking?.professionalId?.profession?.name}
                </small>
              </div>

            </div>

            {/* Status Badge */}
            <div>
              <GetStatusBadge status={booking?.status} />
            </div>

          </div>

        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "#eef3ff" }} />

        {/* 🔵 DETAILS SECTION */}
        <div className="p-4 pt-3">

          <div className="row g-3">

            {/* Visiting Charge */}
            <div className="col-6">
              <div
                className="p-3 rounded-3 h-100"
                style={{
                  background: "#f0fff4",
                  border: "1px solid #d4edda"
                }}
              >
                <small className="text-muted d-block">
                  <MdCurrencyRupee className="me-1 text-success" />
                  Visiting Charge
                </small>
                <span className="fw-bold text-success fs-6">
                  ₹{booking?.visitingCharge}
                </span>
              </div>
            </div>

            {/* Work Date */}
            <div className="col-6">
              <div
                className="p-3 rounded-3 h-100"
                style={{
                  background: "#fff8e1",
                  border: "1px solid #ffeeba"
                }}
              >
                <small className="text-muted d-block">
                  <FaCalendarAlt className="me-1 text-warning" />
                  Work Date
                </small>
                <span className="fw-semibold">
                  {formatDate(booking?.workDate)}
                </span>
              </div>
            </div>

            {/* Work Time */}
            <div className="col-6">
              <div
                className="p-3 rounded-3 h-100"
                style={{
                  background: "#e3f2fd",
                  border: "1px solid #bbdefb"
                }}
              >
                <small className="text-muted d-block">
                  <FaClock className="me-1 text-info" />
                  Work Time
                </small>
                <span className="fw-semibold">
                  {formatTime(booking?.workTime)}
                </span>
              </div>
            </div>

            {/* Address */}
            <div className="col-12">
              <div
                className="p-3 rounded-3"
                style={{
                  background: "#fdecea",
                  border: "1px solid #f5c6cb"
                }}
              >
                <small className="text-muted d-block">
                  <FaMapMarkerAlt className="me-1 text-danger" />
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

export default CusBookingCard;
