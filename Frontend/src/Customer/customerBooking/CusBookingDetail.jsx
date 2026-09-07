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
import CustomAudioPlayer from '../../Components/CustomAudioPlayer';
import { server_url } from '../../App';
import axios from 'axios';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import useGetMyBookings from '../../hooks/useGetMyBookings';
import FixkarLoader from '../../Components/FixkarLoader';

import './cusBookingDetails.css'

const CusBookingDetail = () => {
    useGetMyBookings()
    const [offers, setOffers] = useState([]);
    const [applyingOffer, setApplyingOffer] = useState(false);
    const [loadingOffers, setLoadingOffers] = useState(false);
     const {myBookings} = useSelector(state=> state.bookings)
     const navigate = useNavigate()

    const {bookingId} = useParams();
     const booking = myBookings.find(book => book._id == bookingId)

    useEffect(() => {
      if (!booking?.quoteAmount || booking.status !== "in-progress" || booking.offerLocked) {
        return;
      }

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

      fetchOffers();
    }, [booking?.quoteAmount, booking?.status, booking?.offerLocked, bookingId]);

const originalTotal =
  booking?.isPriceLocked
    ? (booking?.totalAmount || 0)
    : (booking?.quoteAmount || 0) + (booking?.visitingCharge || 0);

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

if (!booking) {
  return <FixkarLoader />
}

return (
  <div
    className="booking-details-page"
  >
    <div
        className="booking-details-topbar"

      >
        <div className="booking-details-topbar-inner">
          <h5 className="booking-details-topbar-title">Booking Details</h5>

    
        </div>

        <p className="booking-details-topbar-description">
          Manage and track booking
        </p>
      </div>
    <div className="booking-details-container">

      {/* 🔵 FLOATING MAIN CARD */}
      <div
        className="booking-details-shell"
      >

        {/* ================= TOP PROFILE SECTION ================= */}
        <div
          className="booking-details-profile"
        >
          <div className="booking-details-profile-row">

            <div className="booking-details-profile-info">

              <img
                src={booking.professionalId.profilePicture}
                alt="professional"
                width="80"
                height="80"
                className="booking-details-avatar"
                style={{ objectFit: "cover", cursor: "pointer" }}
                onClick={() =>
                  navigate(
                    `/s/${booking.professionalId.shortCode }`
                  )
                }
              />

              <div className="">
                <h5 className="booking-details-professional-name">
                  {booking.professionalId.userId.fullName}
                </h5>

                <small className="">
                  <MdHomeRepairService className="" />
                  {booking.professionalId.profession.name}
                </small>

                <small className="">
                  <FaMapMarkerAlt className="" />
                  {booking.professionalId.address.addressLine}
                </small>
              </div>
            </div>

            <div>
              <div className="booking-details-status"><GetStatusBadge status={booking.status} /></div>
            </div>
          </div>
        </div>

        {/* ================= BODY CONTENT ================= */}
        <div className="booking-details-body">

          {/* ---------- META GRID ---------- */}
          <div className="">

            <div className="">
              <div
                className="booking-details-info-tile"
              >
                <small className="">
                  <FaIdBadge className="" />
                  Booking ID
                </small>
                <span className="">{booking._id}</span>
              </div>
            </div>

            <div className="">
              <div
                className="booking-details-info-tile"
              >
                <small className="">
                  <FaRupeeSign className="" />
                  Visiting Charge
                </small>
                <span className="">
                  ₹{booking.visitingCharge}
                </span>
              </div>
            </div>
          </div>

          {/* ---------- DATE & TIME ---------- */}
          <div className="">

            <div className="">
              <div
                className="booking-details-info-tile"
              >
                <p className="">
                  <FaCalendarAlt className="" />
                  Work Date
                </p>
                <h6 className="">
                  {formatDate(booking.workDate)}
                </h6>
              </div>
            </div>

            <div className="">
              <div
                className="booking-details-info-tile"
              >
                <p className="">
                  <FaClock className="" />
                  Work Time
                </p>
                <h6 className="">
                  {formatTime(booking.workTime)}
                </h6>
              </div>
            </div>
          </div>

          {/* ---------- ADDRESS ---------- */}
          <div className="">
            <div
              className="booking-details-info-tile"
            >
              <p className="">
                <FaMapMarkerAlt className="" />
                Work Address
              </p>
              <p className="">
                {booking.workAddress}
              </p>
            </div>
          </div>

          {/* ---------- PROBLEM ---------- */}
          <div className="">
            <div
              className="booking-details-info-tile"
            >
              <p className="">
                Problem Description
              </p>
              <p className="">
                {booking.problemDescription}
              </p>
            </div>
          </div>

         {/* Voice Descriptions */}
{booking.audioMessages && booking.audioMessages.length > 0 && (
  <div className="">
    <div className="booking-details-audio-card">

      {/* Header */}
      <div className="">
        <h6 className="">
          <FaMicrophone/> Voice Descriptions
        </h6>

        <span className="badge">
          {booking.audioMessages.length}
        </span>
      </div>

      {/* Audio List */}
      <div className="">
        {booking.audioMessages?.map((audio, index) => (
          <div
            key={index}
            className="booking-details-audio-item rounded-3 p-2"
          >
            {/* Icon */}
            <div
              className="booking-details-audio-icon justify-content-center"
            >
              <FaMicrophone/>
            </div>

            {/* Audio Player */}
            <div className="">
              <CustomAudioPlayer src={audio.url} />
            </div>

            {/* Download */}
            <a
              href={audio.url}
              download
              className=""
            >
              <FaDownload/>
            </a>
          </div>
        ))}
      </div>

    </div>
  </div>
)}
    <div className="">
              {(booking.status == "pending" ||
                booking.status == "accepted" ||
                booking.status == "reached") && (
               <div className="booking-details-action"><CusHandleCancel booking={booking}/></div>
              )}
            </div>

    {booking.rejectMessage && (
         <p className="p-2 rounded-2">
                Your booking has been rejected by the professional. <br />{" "}
                <b>Message from {booking.professionalId.userId.fullName} :</b> '
                {booking.rejectMessage}'{" "}
              </p>
    )}

    {/* Accept message */}
    {booking.status == "accepted" && (
        <div className="booking-details-action"><CusAcceptBooking booking={booking}/></div>
    )}
    {booking.status == "reached" && booking.reachedOTP && (
        <div className="">
                  <h6>Professional has arrived</h6>
                  <h3 className="">{booking.reachedOTP}</h3>
                  <p className="">
                    Share this OTP with the professional to start work
                  </p>
                </div>
    )}

    {booking.status === "in-progress" && (
        <div className="booking-details-action"><CusInprogress booking={booking}/></div>
    )}

     {(booking.quoteAmount || booking.isPriceLocked) && !["cancelled", "rejected", "completed"].includes(booking.status) && (
            <div
  className="booking-details-payment"
  style={{
    background: "linear-gradient(145deg, #ffffff, #f8fafc)",
    border: "1px solid #e5e7eb"
  }}
>

  {/* HEADER */}
  <div className="">
    <div className="">
      <div
        className="p-2"
        style={{
          background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
          color: "white"
        }}
      >
        <MdPayment size={18} />
      </div>
      <h5 className="">
        Payment Summary
      </h5>
    </div>

    <span className="badge">
      🔒 Secure
    </span>
  </div>

  {/* PRICE CARD */}
  <div
    className="booking-details-price-card"
  >
    <div className="mb-2">
      <span>Service Charge</span>
      <span className="">
        ₹{booking.isPriceLocked ? booking.serviceCharge : booking.quoteAmount}
      </span>
    </div>

    <div className="mb-2">
      <span>Visiting Charge</span>
      <span className="">
        ₹{booking.visitingCharge}
      </span>
    </div>

    {booking.discountAmount > 0 && (
      <div className="mb-2">
        <span>Discount</span>
        <span>- ₹{discountAmount}</span>
      </div>
    )}

    <hr />

    <div className="booking-details-topbar-inner">
      <span className="">
        Total Payable
      </span>
      <span
        className=""
        style={{
          color: "#16a34a"
        }}
      >
        ₹{finalPayable}
      </span>
    </div>
        
     {booking.offerLocked && (
              <div className="alert-success">
                Offer applied successfully.
              </div>
            )}

  </div>

  {/* OFFERS */}
  {loadingOffers ? (
    <div className="">
      <div className="spinner-border spinner-border-sm"></div>
      <small className="">
        Checking best offers...
      </small>
    </div>
  ) : !booking.offerLocked && offers.length > 0? (
    <div className="">

      <div className="">
        <FaGift className="" />
        <h6 className="">
          Available Offers
        </h6>
      </div>

      {offers.map((offer) => {
        const isSelected =
          booking.offerId === offer.offerId;

        return (
          <div
            key={offer.offerId}
            className="booking-details-offer"
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
            <div className="">

              <div>
                <div className="">
                  <MdLocalOffer className="" />
                  {offer.title}
                </div>

                <small className="">
                  You save ₹{offer.discount}
                </small>
              </div>

             {!booking.offerLocked && (
              <button
                disabled={applyingOffer}
                className="booking-details-offer-btn"
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
  {booking.status === "in-progress" && (
    <div>
      <PayButton
        booking={booking}
        paymentType="FINAL"
        label={`Pay ₹${finalPayable}`}
      />
    </div>
  )}

</div>

             )}

    {booking.status == 'cancelled' && (
            <div className="booking-details-action"><CusCancelBooking booking={booking}/></div>
    )}
    {booking.status === "completed" && (
        <div className="booking-details-action"><CusCompleteBooking booking={booking}/></div>
    )}

        </div>
      </div>
    </div>
  </div>
);
}

export default CusBookingDetail


   
