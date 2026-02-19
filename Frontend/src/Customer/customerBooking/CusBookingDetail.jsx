import React, { useState } from 'react'
import { useParams } from 'react-router-dom';

import {
  MdHomeRepairService,
  MdLocationOn,
  MdAccessTime,
  MdCalendarToday,
  MdPayment
} from "react-icons/md";

import {
  FaUserCircle,
  FaMoneyBillWave,
  FaExclamationTriangle,
  FaUser,
  FaIdBadge,
  FaCalendarAlt,
  FaClock,
  FaTools,
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

const CusBookingDetail = () => {
    const [loading, setLoading] = useState(false)
    const [offers, setOffers] = useState([]);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [loadingOffers, setLoadingOffers] = useState(false);
     const {myBookings} = useSelector(state=> state.bookings)

    const {bookingId} = useParams();
    const otp = useGetReachedOtp(bookingId)
     const booking = myBookings.find(book => book._id == bookingId)

    useEffect(() => {
  if (booking.quoteAmount && booking.status !== "completed") {
    fetchOffers();
  }
}, [booking.quoteAmount]);

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
  booking?.quoteAmount + booking?.visitingCharge;

const discountAmount = selectedOffer
  ? selectedOffer.discount
  : 0;

const finalPayable = originalTotal - discountAmount;


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
               <div className="bg-success-subtle border border-success rounded-3 p-3 mt-3">
      <p className="mb-1 fw-semibold text-success">
        <MdPayment/> Service Cost Shared
      </p>

      <div className="d-flex justify-content-between">
        <span>Service Charge</span>
        <strong>₹{booking.quoteAmount}</strong>
      </div>

      <div className="d-flex justify-content-between">
        <span>Visiting Charge</span>
        <strong>₹{booking.visitingCharge}</strong>
      </div>

         {selectedOffer && (
      <div className="d-flex justify-content-between text-success">
        <span>Discount</span>
        <strong>-₹{discountAmount}</strong>
      </div>
    )}

      <hr className="my-2" />

      <div className="d-flex justify-content-between fw-bold">
        <span>Total Payable</span>
        <span>₹{finalPayable}</span>
      </div>

     {loadingOffers ? (
      <p className="mt-2 small text-muted">Loading offers...</p>
    ) : offers.length > 0 ? (
      <div className="mt-3">
        <h6 className="fw-bold">Available Offers</h6>

        {offers.map((offer) => (
          <div
            key={offer.offerId}
            className={`border rounded p-2 mb-2 ${
              selectedOffer?.offerId === offer.offerId
                ? "border-success bg-success-subtle"
                : ""
            }`}
            style={{ cursor: "pointer" }}
            onClick={() => setSelectedOffer(offer)}
          >
            <div className="d-flex justify-content-between">
              <span>{offer.title}</span>
              <strong>Save ₹{offer.discount}</strong>
            </div>
          </div>
        ))}

        {selectedOffer && (
          <button
            className="btn btn-sm btn-outline-danger mt-2"
            onClick={() => setSelectedOffer(null)}
          >
            Remove Offer
          </button>
        )}
      </div>
    ) : null}

        <PayButton bookingId={booking._id}  
        selectedOffer={selectedOffer}
        amount={finalPayable} 
        paymentType={"FINAL"} 
        label={`Pay ₹${finalPayable}`}/>
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
