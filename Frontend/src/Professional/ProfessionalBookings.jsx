import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import NoBookingsPlaceholder from "../Components/NoBookingsPlaceholder";

export default function ProfessionalBookings() {

  const {myBookings} = useSelector((state=> state.bookings));
  const navigate = useNavigate()
  const getStatusBadge = (status) => {
    if (status === "pending")
      return (
        <span className="badge bg-warning text-dark px-3 py-2">
          Pending
        </span>
      );
    if (status === "accepted")
      return <span className="badge bg-primary px-3 py-2">Accepted</span>;

    if (status === "in-progress")
      return <span className="badge bg-info px-3 py-2">In Progress</span>;

    if (status === "completed")
      return <span className="badge bg-success px-3 py-2">Completed</span>;

    if (status === "cancelled")
      return <span className="badge bg-danger px-3 py-2">Cancelled</span>;
    if (status === "rejected")
      return <span className="badge bg-danger px-3 py-2">Rejected</span>;

    return <span className="badge bg-secondary px-3 py-2">Unknown</span>;
  };

  return myBookings.length !== 0 ?(
   <div className="container py-4">
      <h4 className="fw-bold text-primary mb-4">My Bookings</h4>

      {myBookings?.map((booking) => (
        <div
          key={booking._id}
          className="card border-0 shadow-sm rounded-4 mb-4"
        >
          <div className="card-body p-4">
            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h6 className="fw-semibold mb-1">
                  Customer: {booking.customerName}
                </h6>
                <small className="text-muted">
                  Booking ID: {booking._id}
                </small>
              </div>

              {getStatusBadge(booking.status)}
            </div>

            {/* DETAILS */}
            <div className="row g-3">
              <div className="col-md-6">
                <p className="mb-1">
                  <strong>Date:</strong> {booking.workDate}
                </p>
                <p className="mb-1">
                  <strong>Time:</strong> {booking.workTime}
                </p>
                <p className="mb-1">
                  <strong>Charge Type:</strong>{" "}
                  <span className="text-capitalize">
                    {booking.chargeType}
                  </span>
                </p>
                <p className="mb-1">
                  <strong>Visiting Charge:</strong> ₹
                  {booking.visitingCharge}
                </p>
              </div>

              <div className="col-md-6">
                <p className="mb-1">
                  <strong>Distance:</strong> {booking.distanceInKm} km
                </p>
                <p className="mb-1">
                  <strong>Mobile:</strong> {booking.mobileNumber}
                </p>
                <p className="mb-1">
                  <strong>Address:</strong> {booking.workAddress}
                </p>
              </div>
            </div>

            {/* PROBLEM */}
            <div className="mt-3">
              <p className="fw-semibold mb-1">Problem Description</p>
              <p className="text-muted small mb-0">
                {booking.problemDescription}
              </p>
            </div>

            {/* ACTIONS */}
            <div className="d-flex gap-2 mt-4">
              {booking.status === "pending" && (
                <>
                  <button className="btn btn-success btn-sm rounded-pill px-4">
                    Accept
                  </button>
                  <button className="btn btn-outline-danger btn-sm rounded-pill px-4">
                    Reject
                  </button>
                  <button className="btn btn-outline-primary btn-sm rounded-pill px-4" onClick={()=>{
                    navigate(`/professional/chat/${booking.customerId.userId._id}`)
                  }}>
                    Message
                  </button>
                </>
              )}

              {booking.status === "accepted" && (
                <button className="btn btn-primary btn-sm rounded-pill px-4">
                  Mark as Completed
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : <NoBookingsPlaceholder/>;
}
