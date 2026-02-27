import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
 import {
  FaUser,
  FaIdBadge,
  FaMapMarkerAlt,
  FaClock,
  FaCalendarAlt,
  FaRupeeSign,
  FaPhoneAlt,
  FaTools,
  FaDownload,
  FaMicrophone
} from "react-icons/fa";
import { formatDate, formatTime } from '../../utils/formatTime&Date';
import { GetStatusBadge } from '../../utils/GetStatusBadge';
import RejectBookingReason from '../RejectBookingReason';
import ProPendingComponent from './ProPendingComponent';
import ProAcceptBooking from './ProAcceptBooking';
import ProReached from './ProReached';
import ProCancelBooking from './ProCancelBooking';
import ProInprogress from './ProInprogress';
import ProCompleteBooking from './ProCompleteBooking';
import SwipeToConfirm from '../SwipeToConfirm';
import { reachedToLocationAPI } from './reachedToLocationAPI';
import useGetWalletTransaction from '../../hooks/useGetWalletTransaction';
import CashConfirmationBox from '../../Components/CashConfirmationBox';
import CustomAudioPlayer from '../../Components/CustomAudioPlayer';
import useGetMyBookings from '../../hooks/useGetMyBookings';
import FixkarLoader from '../../Components/FixkarLoader';
import DashboardNavigator from '../../utils/DashboardNavigator';

const ProBookingDetails = () => {
  useGetMyBookings()
  const {bookingId} = useParams()
  useGetWalletTransaction(bookingId);
    const [showCashModal, setShowCashModal] = useState(false);
    const {walletTransaction} = useSelector(state => state.wallet);
    const {myBookings} = useSelector(state=> state.bookings)
    const booking = myBookings.find(book => book._id == bookingId)
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

  const fullAmount =
  (booking?.quoteAmount || 0) +
  (booking?.visitingCharge || 0);

const discountAmount =
  booking?.discountAmount || 0;

const cashReceivable =
  booking?.offerLocked
    ? booking?.finalCustomerPayable
    : fullAmount;

    if (!booking) {
  return <FixkarLoader />
}

  return (
     <div
    className="min-vh-100 py-4"
    style={{
      background: "linear-gradient(180deg,#f8fbff,#eef4ff)"
    }}
  >
    <div
        className="text-white p-4"
        style={{
          background: "linear-gradient(135deg,#0d6efd,#00c6ff)",
          borderBottomLeftRadius: "25px",
          borderBottomRightRadius: "25px"
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="fw-bold mb-0">Booking Details</h5>

          <DashboardNavigator/>
        </div>

        <p className="mt-2 small opacity-75">
          Manage and track booking
        </p>
      </div>

      <div className="container">
          <div
        className="rounded-4 shadow-lg overflow-hidden"
        style={{
          background: "#ffffff",
          border: "1px solid #e6f0ff"
        }}
      >

        {/* HEADER */}
         <div
          className="p-4"
          style={{
            background: "linear-gradient(135deg,#0d6efd,#3a86ff)"
          }}
        >
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">

            <div className="text-white">
              <h4 className="fw-bold mb-1 d-flex align-items-center gap-2">
                <FaUser />
                {booking.customerName}
              </h4>
              <small className="opacity-75 d-block">
                <FaIdBadge className="me-1" />
                Booking ID: {booking._id}
              </small>
            </div>

            <GetStatusBadge status={booking.status} />
          </div>
        </div>


      <div className="p-4">
          {/* DATE & TIME (IMPORTANT SECTION) */}
         <div className="row g-3 mb-4">
          <div className="col-md-6">
              <div
                className="p-3 rounded-4 h-100"
                style={{
                  background: "#eef2ff",
                  border: "1px solid #c7d2fe"
                }}
              >
                <small className="text-muted d-block mb-1">
                  <FaCalendarAlt className="me-2 text-primary" />
                  Work Date
                </small>
                <h6 className="fw-bold mb-0">
                  {formatDate(booking.workDate)}
                </h6>
              </div>
            </div>

            <div className="col-md-6">
              <div
                className="p-3 rounded-4 h-100"
                style={{
                  background: "#fef9c3",
                  border: "1px solid #fde68a"
                }}
              >
                <small className="text-muted d-block mb-1">
                  <FaClock className="me-2 text-warning" />
                  Work Time
                </small>
                <h6 className="fw-bold mb-0">
                  {formatTime(booking.workTime)}
                </h6>
              </div>
            </div>
        </div>

        {/* DETAILS GRID */}
         <div className="row g-3 mb-4">

            <div className="col-md-6">
              <div
                className="p-3 rounded-4 h-100"
                style={{
                  background: "#ecfdf5",
                  border: "1px solid #bbf7d0"
                }}
              >
                <p className="mb-2 fw-semibold">
                  <FaRupeeSign className="text-success me-2" />
                  Visiting Charge
                </p>
                <h6 className="fw-bold text-success">
                  ₹{booking.visitingCharge}
                </h6>

                <hr />

                <p className="mb-1 fw-semibold">
                  <FaPhoneAlt className="text-primary me-2" />
                  Customer Mobile
                </p>
                <small className="text-muted">
                  {booking.mobileNumber}
                </small>
              </div>
            </div>


           <div className="col-md-6">
              <div
                className="p-3 rounded-4 h-100"
                style={{
                  background: "#fdf2f8",
                  border: "1px solid #fbcfe8"
                }}
              >
                <p className="fw-semibold mb-1">
                  <FaMapMarkerAlt className="text-danger me-2" />
                  Distance
                </p>
                <small className="text-muted d-block mb-3">
                  {booking.distanceInKm} km
                </small>

                <p className="fw-semibold mb-1">
                  Work Address
                </p>
                <small className="text-muted">
                  {booking.workAddress}
                </small>
              </div>
            </div>

          </div>


        {/* PROBLEM DESCRIPTION */}
         <div
            className="p-3 rounded-4 mb-4"
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0"
            }}
          >
            <h6 className="fw-bold mb-1">
              <FaTools className="me-2 text-primary" />
              Problem Description
            </h6>
            <p className="text-muted small mb-0">
              {booking.problemDescription}
            </p>
          </div>
      </div>
        {booking.audioMessages && booking.audioMessages.length > 0 && (
          <div className="mb-4">
            <div className="bg-white rounded-4 shadow-sm border p-3">
        
              {/* Header */}
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <FaMicrophone/> Voice Descriptions
                </h6>
        
                <span className="badge bg-primary-subtle text-primary">
                  {booking.audioMessages.length}
                </span>
              </div>
        
              {/* Audio List */}
              <div className="d-flex flex-column gap-3">
                {booking.audioMessages?.map((audio, index) => (
                  <div
                    key={index}
                    className="bg-light rounded-3 p-2 d-flex align-items-center gap-3 border"
                  >
                    {/* Icon */}
                    <div
                      className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                      style={{ width: 36, height: 36, fontSize: "14px" }}
                    >
                      <FaMicrophone/>
                    </div>
        
                    {/* Audio Player */}
                    <div className="flex-grow-1">
                      <CustomAudioPlayer src={audio.url} />
                    </div>
        
                    {/* Download */}
                    <a
                      href={audio.url}
                      download
                      className="btn btn-sm btn-outline-secondary"
                    >
                      <FaDownload/>
                    </a>
                  </div>
                ))}
              </div>
        
            </div>
          </div>
        )}


          <div className="actions m-2">
            {booking.status == "pending" && <ProPendingComponent booking={booking} />}
      
        {booking.rejectMessage && <p className="bg-danger-subtle text-danger p-2">Booking has been rejected with the message '{booking.rejectMessage}'</p>}
          {booking.status == "accepted" && <ProAcceptBooking booking={booking}/>}
          {booking.status == "reached" && <ProReached booking={booking}/>}
          {booking.status == "cancelled" && <ProCancelBooking booking={booking} transaction={walletTransaction}/>}
          {booking.status == "in-progress" && <ProInprogress booking={booking}/>}
          {booking.quoteAmount && booking.status !== "completed" && (
       <div className="alert alert-warning rounded-4 shadow-sm mt-4">
    <h6 className="fw-bold mb-2">
      Quote Sent Successfully, Awaiting Payment
    </h6>

    <p className="mb-2">
      You have sent the work charge to the customer.
      Please wait for the customer to complete the payment.
    </p>

    <div className="border rounded p-3 bg-light">
      <div className="d-flex justify-content-between">
        <span>Service Charge</span>
        <span className="fw-semibold">₹{booking.quoteAmount}</span>
      </div>
        <div className="d-flex justify-content-between">
            <span>Visiting Charge</span>
            <span>₹{booking.visitingCharge}</span>
        </div>
         {discountAmount > 0 && (
                  <div className="d-flex justify-content-between text-success">
                    <span>Fixkar Discount</span>
                    <span>- ₹{discountAmount}</span>
                  </div>
         )}

           <hr />

                <div className="d-flex justify-content-between fw-bold">
                  <span>Customer Pays (Cash)</span>
                  <span>₹{cashReceivable}</span>
                </div>
    </div>

       {booking.offerLocked && (
                <div className="alert alert-success mt-3 p-2">
                  Customer applied ₹{discountAmount} discount.
                  Platform will top-up this amount.
                </div>
              )}

     <button
        className="mt-2 btn btn-outline-primary w-100 fw-semibold"
        onClick={() => setShowCashModal(true)}
      >
         ₹{cashReceivable} Cash Received?
      </button>
      
       {showCashModal && (
  <>
    <div className="modal fade show d-block" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 rounded-4">

          <div className="modal-header border-0">
            <button
              className="btn-close"
              onClick={() => setShowCashModal(false)}
            />
          </div>

          <div className="modal-body">
            <CashConfirmationBox
              amount={cashReceivable}
              bookingId={booking._id}
              onSuccess={() => setShowCashModal(false)}
            />
          </div>

        </div>
      </div>
    </div>

    {/* Backdrop */}
    <div className="modal-backdrop fade show"></div>
  </>
)}


  </div>
  )}
          {booking.status == "completed" && <ProCompleteBooking booking={booking} transaction={walletTransaction}/>}

          {isReachedEnabled(booking) && (
              <SwipeToConfirm
                disabled={booking.status === "reached"}
                onConfirm={() => reachedToLocationAPI(booking._id)}
              />
            )}
      </div>
       


       
      </div>
      </div>
     
     
    </div>
  );
}
export default ProBookingDetails
 