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
import { TbTransactionRupee } from "react-icons/tb";
import { CiWallet } from "react-icons/ci";
import { MdFreeCancellation } from "react-icons/md";
import { calculatePlatformFee } from "../utils/calculatePlatformFee";
import useGetWalletTransaction from "../hooks/useGetWalletTransaction";

export default function ProfessionalBookings() {
  useGetWalletTransaction()
  const {walletTransaction} = useSelector(state => state.wallet);
  // console.log(walletTransaction)
  const [loading, setLoading] = useState(false);
  const [rejectBookingId, setRejectBookingId] = useState(null);
  const [quoteAmount, setQuoteAmount] = useState("");
  const { myBookings } = useSelector((state) => state.bookings);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const findTransaction = (bookingId) =>{
    const transaction =  walletTransaction.find(tx => tx.bookingId._id == bookingId)
    return transaction
  }

 

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
      const result = await axios.post(`${server_url}/api/booking/verify-reached-otp`, {otp, bookingId}, {withCredentials : true})
      toast.success(result.data.message)
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  }
  const sendQuoteAPI = async (bookingId)=>{
    try {
      const result = await axios.post(`${server_url}/api/booking/send-quote-amount`, {bookingId, quoteAmount}, {withCredentials : true});
      toast.success(result.data.message);
      setQuoteAmount("")
    } catch (error) {
      console.log(error.message);
      toast.error(error.response.data.message)
    }
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
              {/* Cancel  */}
            {booking.status == "cancelled" && !booking.currentPaymentId && (
              <div className="card border-0 shadow-sm mb-3">
  <div className="card-body">

    <div className="d-flex align-items-center mb-2">
      <div
        className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center"
        style={{ width: "42px", height: "42px" }}
      >
        <i className="bi bi-x-lg"></i>
      </div>

      <div className="ms-3">
        <h6 className="mb-0 fw-semibold text-secondary">
          Booking Cancelled
        </h6>
        <small className="text-muted">
          Customer cancelled this booking
        </small>
      </div>
    </div>

    <div className="bg-light rounded p-3 mt-3">
      <p className="mb-0 text-muted small">
        This booking was cancelled by the customer before the scheduled date.
        No cancellation or visiting charges were applied.
      </p>
    </div>

  </div>
</div>

            )}
            {booking.status == "cancelled" && booking.currentPaymentId && (
              <div className="card border-0 shadow-sm mb-3">
  <div className="card-body">

    <div className="d-flex align-items-center mb-3">
      <div
        className="bg-warning text-white p-3 rounded-circle d-flex align-items-center justify-content-center"
    
      >
        <MdFreeCancellation />
      </div>

      <div className="ms-3">
        <h6 className="mb-0 fw-semibold text-warning">
          Booking Cancelled (Late)
        </h6>
        <small className="text-muted">
          Customer cancelled after the scheduled date
        </small>
      </div>
    </div>

    <div className="bg-light rounded p-3 mb-3">
      <div className="d-flex justify-content-between">
        <span className="text-muted">Cancellation Fee</span>
        <span className="fw-semibold">₹50</span>
      </div>

      <div className="d-flex justify-content-between mt-2">
        <span className="text-muted">Visiting Charge</span>
        <span className="fw-semibold">₹{booking.visitingCharge}</span>
      </div>
      <div className="d-flex justify-content-between mt-2">
        <span className="text-muted">Platform Fee</span>
        <span className="fw-semibold text-danger">- ₹{findTransaction(booking._id)?.commission}</span>
      </div>

      <hr className="my-2" />

      <div className="d-flex justify-content-between">
       <span className="fw-bold text-success d-flex align-items-center justify-content-between gap-2">Added to Wallet <b><CiWallet/></b> </span>
        <span className="fw-bold text-success">
          ₹{findTransaction(booking._id)?.professionalAmount}
        </span>
      </div>
    </div>

    <p className="mb-0 text-muted small">
      The customer cancelled this booking late.  
      The cancellation fee and visiting charge have been successfully added to your wallet.
    </p>

  </div>
</div>

            )}

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
          required
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

  {booking.quoteAmount && booking.status !== "completed" && (
       <div className="alert alert-info rounded-4 shadow-sm mt-4">
    <h6 className="fw-bold mb-2">
      Quote Sent Successfully
    </h6>

    <p className="mb-2">
      You have sent the work charge to the customer.
      Please wait for the customer to complete the payment.
    </p>

    <div className="border rounded p-3 bg-light">
      <div className="d-flex justify-content-between">
        <span>Work Charge</span>
        <span className="fw-semibold">₹{booking.quoteAmount}</span>
      </div>
    </div>

    <small className="text-muted d-block mt-2">
      You will be notified once the payment is completed.
    </small>
  </div>
  )}

  {booking.status == "completed" && (
    <div className="card border-0 shadow-sm mb-3">
  <div className="card-body">

    {/* Header */}
    <div className="d-flex align-items-center mb-3">
      <div
        className="bg-success text-white p-3 rounded-circle d-flex align-items-center justify-content-center"
      >
        <TbTransactionRupee />
      </div>

      <div className="ms-3">
        <h6 className="mb-0 fw-semibold text-success">
          Payment Received
        </h6>
        <small className="text-muted">
          Customer has completed the payment
        </small>
      </div>
    </div>

    {/* Amount Section */}
    <div className="bg-light rounded p-3 mb-3">
      <div className="d-flex justify-content-between">
        <span className="text-muted">Service Amount</span>
        <span className="fw-semibold">₹{findTransaction(booking._id)?.grossAmount}</span>
      </div>

      <div className="d-flex justify-content-between mt-2">
        <span className="text-muted">Platform Fee</span>
        <span className="text-danger">- ₹{findTransaction(booking._id)?.commission}</span>
      </div>

      <hr className="my-2" />

      <div className="d-flex justify-content-between">
        <span className="fw-bold text-success d-flex align-items-center justify-content-between gap-2">Added to Wallet <b><CiWallet/></b> </span>
        <span className="fw-bold text-success">₹{findTransaction(booking._id)?.professionalAmount}</span>
      </div>
    </div>

    {/* Booking Info */}
    <div className="mb-3">
      <small className="text-muted d-block">Booking ID</small>
      <span className="fw-semibold">{booking._id}</span>
    </div>

    {/* Actions */}
    <div className="d-flex gap-2">
      <button className="btn btn-success btn-sm w-100">
        View Wallet
      </button>
      <button className="btn btn-outline-secondary btn-sm w-100">
        Booking Details
      </button>
    </div>

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
