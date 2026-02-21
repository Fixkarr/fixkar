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
  FaTools
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

const ProBookingDetails = () => {
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

  return (
    <div className="card border-0 shadow rounded-4 mb-4">
      <div className="card-body p-4">

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h5 className="fw-bold text-primary mb-1 d-flex align-items-center gap-2">
              <FaUser /> {booking.customerName}
            </h5>
            <small className="text-muted d-flex align-items-center gap-2">
              <FaIdBadge /> Booking ID: {booking._id}
            </small>
          </div>

           <GetStatusBadge status={booking.status}/>
        </div>

        {/* DATE & TIME (IMPORTANT SECTION) */}
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <div className="bg-primary bg-opacity-10 p-3 rounded-4 h-100">
              <small className="text-muted d-block mb-1">
                <FaCalendarAlt className="me-2 text-primary" />
                Work Date
              </small>
              <h6 className="fw-bold mb-0">{formatDate(booking.workDate)}</h6>
            </div>
          </div>

          <div className="col-md-6">
            <div className="bg-primary bg-opacity-10 p-3 rounded-4 h-100">
              <small className="text-muted d-block mb-1">
                <FaClock className="me-2 text-primary" />
                Work Time
              </small>
              <h6 className="fw-bold mb-0">{formatTime(booking.workTime)}</h6>
            </div>
          </div>
        </div>

        {/* DETAILS GRID */}
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <div className="border rounded-4 p-3 h-100">

              <p className="mb-2 d-flex align-items-center gap-2">
                <FaRupeeSign className="text-success" />
                <strong>Visiting Charge:</strong> ₹{booking.visitingCharge}
              </p>

              <p className="mb-0 d-flex align-items-center gap-2">
                <FaPhoneAlt className="text-primary" />
                <strong>Mobile:</strong> {booking.mobileNumber}
              </p>
            </div>
          </div>

          <div className="col-md-6">
            <div className="border rounded-4 p-3 h-100">
              <p className="mb-2 d-flex align-items-center gap-2">
                <FaMapMarkerAlt className="text-danger" />
                <strong>Distance:</strong>
              </p>
              <p className="text-muted mb-0 small">
                {booking.distanceInKm} km
              </p>
               <p className="mb-2 d-flex align-items-center gap-2">
                <FaMapMarkerAlt className="text-danger" />
                <strong>Work Address:</strong>
              </p>
              <p className="text-muted mb-0 small">
                {booking.workAddress}
              </p>
            </div>
          </div>
        </div>

        {/* PROBLEM DESCRIPTION */}
        <div className="bg-light rounded-4 p-3">
          <h6 className="fw-semibold mb-1">Problem Description</h6>
          <p className="text-muted small mb-0">
           {booking.problemDescription}
          </p>
        </div>
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
  );
}
export default ProBookingDetails
