import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import NoBookingsPlaceholder from "../Components/NoBookingsPlaceholder";
import RejectBookingReason from "./RejectBookingReason";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios'
import { server_url } from "../App";
import SwipeToConfirm from "./SwipeToConfirm";
import { ClipLoader } from "react-spinners";
import { formatDate, formatTime } from "../utils/formatTime&Date";
export default function ProfessionalBookings() {
  const [loading, setLoading] = useState(false);
  const [rejectBookingId, setRejectBookingId] = useState(null);
  const [quoteAmount, setQuoteAmount] = useState("");
  const { myBookings } = useSelector((state) => state.bookings);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleAcceptBooking = async (bookingId)=>{
    try {
      setLoading(true)
      const result = await axios.post(`${server_url}/api/booking/accept-booking`, {bookingId})
      toast.success(result.data.message);
      setLoading(false)
    } catch (error) {
      console.log(error.message);
      toast.error(error.response.data.message)
      setLoading(false)
    }
  }
  const getStatusBadge = (status) => {
    if (status === "pending")
      return (
        <span className="badge bg-warning text-dark px-3 py-2">Pending</span>
      );
    if (status === "accepted")
      return <span className="badge bg-primary px-3 py-2">Accepted</span>;

    if (status === "in-progress")
      return <span className="badge bg-warning px-3 py-2">In Progress</span>;

    if (status === "completed")
      return <span className="badge bg-success px-3 py-2">Completed</span>;

    if (status === "cancelled")
      return <span className="badge bg-danger px-3 py-2">Cancelled</span>;
    if (status === "rejected")
      return <span className="badge bg-danger px-3 py-2">Rejected</span>;
    if (status === "reached")
      return <span className="badge bg-info px-3 py-2">Reached</span>;

    return <span className="badge bg-secondary px-3 py-2">Unknown</span>;
  };
  const isReachedEnabled = (booking)=>{
    if (booking.status !== "accepted") return false;

     const now = new Date();

  const workDateTime = new Date(
    `${booking.workDate} ${booking.workTime}`
  );

  const BUFFER_MINUTES = 240;
  const enableTime = new Date(
    workDateTime.getTime() - BUFFER_MINUTES * 60 * 1000
  );

  return now >= enableTime;
  }
  const reachedToLocationAPI = async (bookingId) => {
    try {
      const result = await axios.post(`${server_url}/api/booking/mark-reached`, {bookingId}, {withCredentials : true})
      toast.success(result.data.message);
    } catch (error) {
      console.log(error.message);
      toast.error(error.response.data.message)
    }
  }
  const handleVerifyReachedOtp = async (bookingId)=>{
    try {
      setLoading(true)
      const result = await axios.post(`${server_url}/api/booking/verify-reached-otp`, {otp, bookingId}, {withCredentials : true})
      toast.success(result.data.message)
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  }
  const sendQuoteAPI = async (bookingId)=>{

  }

  return myBookings.length !== 0 ? (
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
                <small className="text-muted">Booking ID: {booking._id}</small>
              </div>

              {getStatusBadge(booking.status)}
            </div>

            {/* DETAILS */}
            <div className="row g-3">
              <div className="col-md-6">
                <p className="mb-1">
                  <strong>Date:</strong> {formatDate(booking.workDate)}
                </p>
                <p className="mb-1">
                  <strong>Time:</strong> {formatTime(booking.workTime)}
                </p>
                <p className="mb-1">
                  <strong>Charge Type:</strong>{" "}
                  <span className="text-capitalize">{booking.chargeType}</span>
                </p>
                <p className="mb-1">
                  <strong>Visiting Charge:</strong> ₹{booking.visitingCharge}
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
                  <button className="btn btn-success btn-sm rounded-pill px-4"
                    onClick={()=>handleAcceptBooking(booking._id)}
                    disabled={loading}
                  >
                    {loading && <ClipLoader size={20}/>} Accept
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm rounded-pill px-4"
                    onClick={() =>
                      setRejectBookingId(
                        rejectBookingId === booking._id ? null : booking._id
                      )
                    }
                  >
                    Reject
                  </button>

                  <button
                    className="btn btn-outline-primary btn-sm rounded-pill px-4"
                    onClick={() => {
                      navigate(
                        `/professional/chat/${booking.customerId.userId._id}`
                      );
                    }}
                  >
                    Message
                  </button>
                </>
              )}
            </div>
            {rejectBookingId === booking._id && booking.status !== "rejected" && (
              <RejectBookingReason bookingId={booking._id} />
            )}
            {booking.rejectMessage && <p className="bg-danger-subtle text-danger p-2">Booking has been rejected with the message '{booking.rejectMessage}'</p>}
            {isReachedEnabled(booking) && (
              <SwipeToConfirm
                disabled={booking.status === "reached"}
                onConfirm={() => reachedToLocationAPI(booking._id)}
              />
            )}
            {booking.status == "accepted" && <div className="alert alert-success rounded-4 shadow-sm mt-3">
  <h6 className="fw-bold mb-2">
     Booking Assigned!
  </h6>

  <p className="mb-2">
    You have been successfully booked for a service on
    <strong> {formatDate(booking.workDate)}</strong>.
  </p>

  <p className="mb-2">
    Please ensure that you reach the service location
    <strong> before {formatTime(booking.workTime)}</strong> to provide a smooth experience
    to the customer.
  </p>

  <p className="mb-0">
    <strong>Service Address:</strong> {booking.workAddress}
  </p>

  <small className="text-muted d-block mt-2">
    Best of luck! We wish you a successful service visit.
  </small>
</div>
}

            {booking.status == "reached" && <div className="container my-4">
  <div className="row justify-content-center">
    <div className="col-md-6 col-lg-5">
      
      <div className="card shadow border-0 rounded-4">
        <div className="card-body p-4 text-center">

          {/* Title */}
          <h5 className="fw-bold text-success mb-2">
             You have reached the client
          </h5>

          {/* Subtitle */}
          <p className="text-muted mb-4">
            Enter OTP sent to your client to verify your arrival
          </p>

          {/* OTP Input */}
         <form  onSubmit={(e) => {
    e.preventDefault();
    handleVerifyReachedOtp(booking._id);
  }}>
           <div className="mb-3">
            <input
              type="number"
              name="otp"
              className="form-control text-center fw-semibold"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e)=>setOtp(e.target.value)}
              maxLength={6}
            />
          </div>

          {/* Verify Button */}
          <button className="btn btn-success w-100 fw-semibold">
            Verify OTP
          </button>
         </form>

          {/* Optional Info */}
          <small className="d-block mt-3 text-muted">
            Didn’t receive OTP? Ask client to check booking information page.
          </small>

        </div>
      </div>

    </div>
  </div>
</div>
}

  {booking.status === "in-progress" && (
  <div className="card border-0 shadow-sm rounded-4 mt-4">
    <div className="card-body">

      <h6 className="fw-bold mb-2">Send Work Charge</h6>

      <div className="mb-3">
        <label className="form-label">Work Amount (₹)</label>
        <input
          type="number"
          className="form-control"
          placeholder="Enter work charge"
          value={quoteAmount}
          onChange={(e) => setQuoteAmount(e.target.value)}
          min={0}
          max={6}
        />
      </div>

      <button
        className="btn btn-primary w-100 fw-semibold"
        onClick={() => sendQuoteAPI(booking._id)}
      >
        Send Quote to Customer
      </button>

      <small className="text-muted d-block mt-2">
        Final amount will be shown to customer for approval & payment.
      </small>
    </div>
  </div>
)}


          </div>
        </div>
      ))}
    </div>
  ) : (
    <NoBookingsPlaceholder />
  );
}
