// pages/MyBookings.jsx
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const CustomerBookings = () => {
  const {myBookings} = useSelector(state => state.bookings);
  console.log(myBookings);


  const getStatusVariant = (status) => {
    switch (status) {
      case "Completed":
        return "success";
      case "Cancelled":
        return "danger";
      default:
        return "warning";
    }
  };

  return (
    <div className="container my-4">
      <h4 className="mb-4 fw-bold">My Bookings</h4>

      {myBookings?.map((booking) => (
        <div className="card shadow-sm mb-4" key={booking._id} >
          <div className="card-body">
            {/* Top Section */}
            <div className="d-flex align-items-center mb-3">
              <img
                src={booking.professionalId.profilePicture}
                alt="profile"
                className="rounded-circle border"
                width="70"
                height="70"
              />

              <div className="ms-3 flex-grow-1">
                <h6 className="mb-1 fw-bold">
                  {booking.professionalId.userId.fullName}
                </h6>
                <p className="mb-0 text-muted">
                  {booking.profession}
                </p>
                <small className="text-muted">
                  {booking.professionalId.address.addressLine}
                </small>
              </div>

              <div className={`badge bg-${getStatusVariant(booking.status)}`}>
                {booking.status}
              </div>
            </div>

            <hr />

            {/* Booking Details */}
            <div className="row g-3">
              <div className="col-md-4">
                <small className="text-muted">Booking ID</small>
                <p className="fw-semibold mb-0">{booking._id}</p>
              </div>

              <div className="col-md-4">
                <small className="text-muted">Visiting Charge</small>
                <p className="fw-semibold mb-0">
                  ₹{booking.visitingCharge} ({booking.chargeType})
                </p>
              </div>

              <div className="col-md-4">
                <small className="text-muted">Distance</small>
                <p className="fw-semibold mb-0">{booking.distanceInKm} km</p>
              </div>

              <div className="col-md-4">
                <small className="text-muted">Work Date</small>
                <p className="fw-semibold mb-0">{booking.workDate}</p>
              </div>

              <div className="col-md-4">
                <small className="text-muted">Work Time</small>
                <p className="fw-semibold mb-0">{booking.workTime}</p>
              </div>

              <div className="col-md-12">
                <small className="text-muted">Problem Description</small>
                <p className="mb-0">{booking.problemDescription}</p>
              </div>

              <div className="col-md-12">
                <small className="text-muted">Work Address</small>
                <p className="mb-0">{booking.workAddress}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomerBookings;
