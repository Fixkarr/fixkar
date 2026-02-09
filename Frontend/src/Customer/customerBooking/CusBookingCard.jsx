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
  className="booking-card"
  style={{ cursor: "pointer" }}
  onClick={() => navigate(`/customer/bookings/${booking?._id}`)}
>
  <div className="card border-0 shadow-lg rounded-4 mb-3 overflow-hidden">

    {/* ===== Header ===== */}
    <div
      className="p-3 d-flex justify-content-between align-items-center"
      style={{
        background: "linear-gradient(135deg, #0d6efd, #6ea8fe)",
      }}
    >
      <div className="d-flex align-items-center gap-2 text-white">
        <img
          src={booking?.professionalId?.profilePicture}
          alt="professional"
          width="46"
          height="46"
          className="rounded-circle border border-2 border-white"
        />
        <div>
          <h6 className="fw-semibold mb-0">
            <FaUserTie className="me-1" />
            {booking?.professionalId?.userId?.fullName}
          </h6>
          <small className="opacity-75">
            <MdWork className="me-1" />
            {booking?.professionalId.profession.name}
          </small>
        </div>
      </div>

      <GetStatusBadge status={booking?.status} />
    </div>

    {/* ===== Body ===== */}
    <div className="card-body p-3 bg-light rounded-bottom-4">

      <small className="text-muted d-block mb-2">
        Booking ID: <span className="fw-semibold">{booking?._id}</span>
      </small>

      <hr className="my-2" />

      <div className="row g-3">

        <div className="col-6">
          <small className="text-muted d-block">
            <MdCurrencyRupee className="me-1 text-success" />
            Visiting Charge
          </small>
          <span className="fw-bold text-dark">
            ₹{booking?.visitingCharge}
          </span>
        </div>


        <div className="col-6">
          <small className="text-muted d-block">
            <FaCalendarAlt className="me-1 text-warning" />
            Work Date
          </small>
          <span className="fw-semibold">
            {formatDate(booking?.workDate)}
          </span>
        </div>

        <div className="col-6">
          <small className="text-muted d-block">
            <FaClock className="me-1 text-info" />
            Work Time
          </small>
          <span className="fw-semibold">
            {formatTime(booking?.workTime)}
          </span>
        </div>

        <div className="col-12 mt-2">
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

    )
  );
};

export default CusBookingCard;
