import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

import {
  MdHomeRepairService,
  MdPayment
} from "react-icons/md";

import { FaGift, FaTag, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { MdLocalOffer } from "react-icons/md";

import {

  FaUser,
  FaIdBadge,
  FaCalendarAlt,
  FaClock,

  FaRupeeSign,
  FaMapMarkerAlt,
  FaMicrophone,
  FaDownload
} from "react-icons/fa";
import { useSelector } from 'react-redux';
import { GetStatusBadge } from '../../utils/GetStatusBadge';
import { formatDate, formatTime } from '../../utils/formatTime&Date';
import CusHandleCancel from './CusHandleCancel';
import CusAcceptBooking from './CusAcceptBooking';
import CusInprogress from './CusInprogress';
import PayButton from '../PayButton';
import CusCancelBooking from './CusCancelBooking';
import CusCompleteBooking from './CusCompleteBooking';
import useGetReachedOtp from '../../hooks/useGetReachedOtp'
import CustomAudioPlayer from '../../Components/CustomAudioPlayer';
import { server_url } from '../../App';
import axios from 'axios';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const CusBookingDetail = () => {
    const [loading, setLoading] = useState(false)
    const [offers, setOffers] = useState([]);
    const [applyingOffer, setApplyingOffer] = useState(false);
    const [loadingOffers, setLoadingOffers] = useState(false);
     const {myBookings} = useSelector(state=> state.bookings)
     const navigate = useNavigate()

    const {bookingId} = useParams();
    const otp = useGetReachedOtp(bookingId)
     const booking = myBookings.find(book => book._id == bookingId)

    useEffect(() => {
  if (
  booking?.quoteAmount &&
  booking.status === "in-progress" &&
  !booking.offerLocked
){
    fetchOffers();
  }
}, [booking?.quoteAmount, booking?.offerLocked]);

const fetchOffers = async () => {
  try {
    setLoadingOffers(true);
    const res = await axios.get(
      `${server_url}/api/user/get-elligible-offers/${bookingId}`,
      { withCredentials: true }
    );
    setOffers(res.data.offers || []);
  } catch (err) {
    console.error(err);
  } finally {
    setLoadingOffers(false);
  }
};

const originalTotal =
  (booking?.quoteAmount || 0) +
  (booking?.visitingCharge || 0);

const discountAmount =
  booking?.discountAmount || 0;

const finalPayable =
  booking?.offerLocked
    ? booking?.finalCustomerPayable
    : originalTotal;

const handleApplyOffer = async (offer) => {
  const confirmApply = window.confirm(
    "Are you sure you want to apply this offer? You cannot remove it later."
  );

  if (!confirmApply) return;

  try {
    setApplyingOffer(true);

    await axios.post(
      `${server_url}/api/user/apply-offer`,
      {
        bookingId,
        offerId: offer.offerId,
      },
      { withCredentials: true }
    );
    
      toast.success("Offer applied successfully");

  } catch (error) {
   toast.error(
  error?.response?.data?.message ||
  "Failed to apply offer"
);
  } finally {
    setApplyingOffer(false);
  }
};


  return (
    <div className="card border-0 shadow-sm rounded-4 my-4">

  <div className="card-body p-4">

    {/* Top Section */}
    <div className="d-flex align-items-center justify-content-between mb-4">
      <div className="d-flex align-items-center">
        <img
          src={booking.professionalId.profilePicture}
          alt="professional"
          className="rounded-circle border border-2"
          width="70"
          height="70"
          onClick={()=>navigate(`/professional/profile/visit/${booking.professionalId._id}`)}
        />

        <div className="ms-3">
          <h6 className="fw-bold text-primary mb-0">
            <FaUser className='text-primary'/> {booking.professionalId.userId.fullName}
          </h6>
          <small className="text-muted d-block">
            <MdHomeRepairService className='text-primary'/> {booking.professionalId.profession.name}
          </small>
          <small className="text-muted">
            <FaMapMarkerAlt className='text-danger'/> {booking.professionalId.address.addressLine}
          </small>
        </div>
      </div>
         <GetStatusBadge status={booking.status}/>
    </div>

    {/* Booking Meta */}
    <div className="row g-3 mb-4">
      <div className="col-md-4">
        <div className="p-3 border rounded-3 h-100">
          <small className="text-muted"><FaIdBadge className='text-warning'/> Booking ID</small>
          <p className="fw-semibold mb-0">{booking._id}</p>
        </div>
      </div>

      <div className="col-md-4">
        <div className="p-3 border rounded-3 h-100">
          <small className="text-muted"> <FaRupeeSign className="text-success" /> Visiting Charge</small>
          <p className="fw-semibold mb-0">₹{booking.visitingCharge}</p>
        </div>
      </div>

    </div>

    {/* Important Date & Time */}
    <div className="row g-3 mb-4">
      <div className="col-md-6">
        <div className="bg-primary-subtle rounded-3 p-3 h-100">
          <p className="mb-1 fw-semibold text-primary">
            <FaCalendarAlt className="me-2 text-primary" /> Work Date
          </p>
          <h6 className="mb-0">{formatDate(booking.workDate)}</h6>
        </div>
      </div>

      <div className="col-md-6">
        <div className="bg-primary-subtle rounded-3 p-3 h-100">
          <p className="mb-1 fw-semibold text-primary">
            <FaClock className="me-2 text-primary" /> Work Time
          </p>
          <h6 className="mb-0">{formatTime(booking.workTime)}</h6>
        </div>
      </div>
    </div>

    {/* Address */}
    <div className="mb-4">
      <div className="bg-light rounded-3 p-3">
        <p className="fw-semibold mb-1">
          <FaMapMarkerAlt className="text-danger" /> Work Address
        </p>
        <p className="mb-0 text-muted">
          {booking.workAddress}
        </p>
      </div>
    </div>

    {/* Problem */}
    <div className="mb-4">
     <div className="bg-light rounded-3 p-3">
         <p className="fw-semibold mb-1">
         Problem Description
      </p>
      <p className="text-muted small mb-0">
        {booking.problemDescription}
      </p>
     </div>
    </div>

    {/* Voice Descriptions */}
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
    <div className="g-3 mt-2">
              {(booking.status == "pending" ||
                booking.status == "accepted" ||
                booking.status == "reached") && (
               <CusHandleCancel booking={booking}/>
              )}
            </div>

    {booking.rejectMessage && (
         <p className="bg-danger-subtle text-danger p-2 rounded-2">
                Your booking has been rejected by the professional. <br />{" "}
                <b>Message from {booking.professionalId.userId.fullName} :</b> '
                {booking.rejectMessage}'{" "}
              </p>
    )}

    {/* Accept message */}
    {booking.status == "accepted" && (
        <CusAcceptBooking booking={booking}/>
    )}
    {booking.status == "reached" && otp && (
        <div className="alert alert-warning text-center">
                  <h6>Professional has arrived</h6>
                  <h3 className="fw-bold">{otp}</h3>
                  <p className="small">
                    Share this OTP with the professional to start work
                  </p>
                </div>
    )}

    {booking.status === "in-progress" && (
        <CusInprogress booking={booking}/>
    )}

     {booking.quoteAmount && booking.status !== "completed" && (
            <div
  className="mt-4 p-4 rounded-4 shadow-sm"
  style={{
    background: "linear-gradient(145deg, #ffffff, #f8fafc)",
    border: "1px solid #e5e7eb"
  }}
>

  {/* HEADER */}
  <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
    <div className="d-flex align-items-center gap-2">
      <div
        className="p-2 rounded-circle"
        style={{
          background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
          color: "white"
        }}
      >
        <MdPayment size={18} />
      </div>
      <h5 className="fw-bold mb-0 text-dark">
        Payment Summary
      </h5>
    </div>

    <span className="badge bg-light text-success border border-success-subtle px-3 py-2 rounded-pill">
      🔒 Secure
    </span>
  </div>

  {/* PRICE CARD */}
  <div
    className="rounded-4 p-4 mb-4"
    style={{
      background: "#f9fafb",
      border: "1px solid #eef2f7"
    }}
  >
    <div className="d-flex justify-content-between mb-2 text-muted">
      <span>Service Charge</span>
      <span className="fw-semibold text-dark">
        ₹{booking.quoteAmount}
      </span>
    </div>

    <div className="d-flex justify-content-between mb-2 text-muted">
      <span>Visiting Charge</span>
      <span className="fw-semibold text-dark">
        ₹{booking.visitingCharge}
      </span>
    </div>

    {booking.discountAmount > 0 && (
      <div className="d-flex justify-content-between mb-2 text-success fw-semibold">
        <span>Discount</span>
        <span>- ₹{discountAmount}</span>
      </div>
    )}

    <hr />

    <div className="d-flex justify-content-between align-items-center">
      <span className="fw-bold fs-5 text-dark">
        Total Payable
      </span>
      <span
        className="fw-bold fs-4"
        style={{
          color: "#16a34a"
        }}
      >
        ₹{finalPayable}
      </span>
    </div>
        
     {booking.offerLocked && (
              <div className="alert alert-success mt-3">
                Offer applied successfully.
              </div>
            )}

  </div>

  {/* OFFERS */}
  {loadingOffers ? (
    <div className="text-center py-3">
      <div className="spinner-border spinner-border-sm text-primary"></div>
      <small className="text-muted ms-2">
        Checking best offers...
      </small>
    </div>
  ) : !booking.offerLocked && offers.length > 0? (
    <div className="mb-4">

      <div className="d-flex align-items-center mb-3">
        <FaGift className="text-danger me-2" />
        <h6 className="fw-bold mb-0 text-dark">
          Available Offers
        </h6>
      </div>

      {offers.map((offer) => {
        const isSelected =
          booking.offerId === offer.offerId;

        return (
          <div
            key={offer.offerId}
            className="rounded-4 p-3 mb-3 position-relative"
            style={{
              background: isSelected
                ? "linear-gradient(135deg,#ecfdf5,#d1fae5)"
                : "#ffffff",
              border: isSelected
                ? "1px solid #16a34a"
                : "1px solid #e5e7eb",
              boxShadow: isSelected
                ? "0 8px 20px rgba(22,163,74,0.08)"
                : "0 4px 12px rgba(0,0,0,0.03)",
              transition: "all 0.25s ease",
              cursor: "pointer"
            }}
          >

            {/* LEFT SIDE */}
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">

              <div>
                <div className="fw-semibold text-dark d-flex align-items-center gap-2">
                  <MdLocalOffer className="text-danger" />
                  {offer.title}
                </div>

                <small className="text-muted">
                  You save ₹{offer.discount}
                </small>
              </div>

             {!booking.offerLocked && (
              <button
                disabled={applyingOffer}
                className="btn btn-sm rounded-pill fw-semibold px-4"
                style={{
                  background:
                    "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  color: "#fff",
                  border: "none"
                }}
                onClick={() => handleApplyOffer(offer)}
              >
                {applyingOffer ? "Applying..." : "Apply"}
              </button>
            )}
            </div>

          </div>
        );
      })}
    </div>
  ) : null}

  {/* PAY BUTTON */}
  <div>
   <PayButton 
  bookingId={bookingId} 
  paymentType="FINAL" 
  label={`Pay ₹${finalPayable}`} 
/>

  </div>

</div>

             )}

    {booking.status == 'cancelled' && (
            <CusCancelBooking booking={booking}/>
    )}
    {booking.status === "completed" && (
        <CusCompleteBooking booking={booking}/>
    )}
  </div>
</div>

  )
}

export default CusBookingDetail
