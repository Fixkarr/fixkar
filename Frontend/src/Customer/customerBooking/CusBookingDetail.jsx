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
  <div className="booking-details-page">
    <header className="booking-details-topbar">
      <div className="booking-details-topbar-inner">
        <div>
          <h5 className="booking-details-topbar-title">Booking Details</h5>
          <p className="booking-details-topbar-description">Manage and track booking</p>
        </div>
      </div>
    </header>

    <main className="booking-details-container">
      <div className="booking-details-shell">

        {/* ================= TOP PROFILE SECTION ================= */}
        <section className="booking-details-profile">
          <div className="booking-details-profile-row">
            <div className="booking-details-profile-info">
              <img
                src={booking.professionalId.profilePicture}
                alt="professional"
                width="80"
                height="80"
                className="booking-details-avatar"
                onClick={() =>
                  navigate(`/s/${booking.professionalId.shortCode}`)
                }
              />

              <div className="booking-details-profile-copy">
                <h5 className="booking-details-professional-name">
                  {booking.professionalId.userId.fullName}
                </h5>

                <small>
                  <MdHomeRepairService />
                  {booking.professionalId.profession.name}
                </small>

                <small>
                  <FaMapMarkerAlt />
                  {booking.professionalId.address.addressLine}
                </small>
              </div>
            </div>

            <div className="booking-details-status">
              <GetStatusBadge status={booking.status} />
            </div>
          </div>
        </section>

        {/* ================= BODY CONTENT ================= */}
        <div className="booking-details-body">

          {/* ---------- META GRID ---------- */}
          <div className="booking-details-grid booking-details-grid-meta">
            <div className="booking-details-info-tile booking-details-id-tile">
              <small>
                <FaIdBadge />
                Booking ID
              </small>
              <span>{booking._id}</span>
            </div>

            <div className="booking-details-info-tile booking-details-charge-tile">
              <small>
                <FaRupeeSign />
                Visiting Charge
              </small>
              <span>₹{booking.visitingCharge}</span>
            </div>
          </div>

          {/* ---------- DATE & TIME ---------- */}
          <div className="booking-details-grid booking-details-grid-date">
            <div className="booking-details-info-tile booking-details-date-tile">
              <p>
                <FaCalendarAlt />
                Work Date
              </p>
              <h6>{formatDate(booking.workDate)}</h6>
            </div>

            <div className="booking-details-info-tile booking-details-time-tile">
              <p>
                <FaClock />
                Work Time
              </p>
              <h6>{formatTime(booking.workTime)}</h6>
            </div>
          </div>

          {/* ---------- ADDRESS ---------- */}
          <div className="booking-details-info-tile booking-details-address-tile">
            <p>
              <FaMapMarkerAlt />
              Work Address
            </p>
            <p>{booking.workAddress}</p>
          </div>

          {/* ---------- PROBLEM ---------- */}
          <div className="booking-details-info-tile booking-details-problem-tile">
            <p>Problem Description</p>
            <p>{booking.problemDescription}</p>
          </div>

          {/* ---------- VOICE DESCRIPTIONS ---------- */}
          {booking.audioMessages && booking.audioMessages.length > 0 && (
            <section className="booking-details-audio-card">
              <div className="booking-details-section-heading">
                <h6>
                  <FaMicrophone />
                  Voice Descriptions
                </h6>
                <span className="booking-details-count">
                  {booking.audioMessages.length}
                </span>
              </div>

              <div className="booking-details-audio-list">
                {booking.audioMessages?.map((audio, index) => (
                  <div key={index} className="booking-details-audio-item">
                    <div className="booking-details-audio-icon">
                      <FaMicrophone />
                    </div>

                    <div className="booking-details-audio-player">
                      <CustomAudioPlayer src={audio.url} />
                    </div>

                    <a
                      href={audio.url}
                      download
                      className="booking-details-download"
                      aria-label="Download audio"
                    >
                      <FaDownload />
                    </a>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ---------- ACTIONS ---------- */}
          {(booking.status == "pending" ||
            booking.status == "accepted" ||
            booking.status == "reached") && (
            <div className="booking-details-action">
              <CusHandleCancel booking={booking} />
            </div>
          )}

          {booking.rejectMessage && (
            <div className="booking-details-reject">
              <strong>Booking rejected</strong>
              <p>
                Your booking has been rejected by the professional.
              </p>
              <span>
                Message from {booking.professionalId.userId.fullName}: '
                {booking.rejectMessage}'
              </span>
            </div>
          )}

          {booking.status == "accepted" && (
            <div className="booking-details-action">
              <CusAcceptBooking booking={booking} />
            </div>
          )}

          {booking.status == "reached" && booking.reachedOTP && (
            <div className="booking-details-otp">
              <div className="booking-details-otp-icon">
                <FaIdBadge />
              </div>
              <div>
                <h6>Professional has arrived</h6>
                <h3>{booking.reachedOTP}</h3>
                <p>Share this OTP with the professional to start work</p>
              </div>
            </div>
          )}

          {booking.status === "in-progress" && (
            <div className="booking-details-action">
              <CusInprogress booking={booking} />
            </div>
          )}

          {/* ---------- PAYMENT ---------- */}
          {(booking.quoteAmount || booking.isPriceLocked) &&
            !["cancelled", "rejected", "completed"].includes(booking.status) && (
              <section className="booking-details-payment">
                <div className="booking-details-payment-header">
                  <div className="booking-details-payment-title">
                    <div className="booking-details-payment-icon">
                      <MdPayment size={18} />
                    </div>
                    <h5>Payment Summary</h5>
                  </div>

                  <span className="booking-details-secure">🔒 Secure</span>
                </div>

                <div className="booking-details-price-card">
                  <div className="booking-details-price-row">
                    <span>Service Charge</span>
                    <strong>
                      ₹{booking.isPriceLocked ? booking.serviceCharge : booking.quoteAmount}
                    </strong>
                  </div>

                  <div className="booking-details-price-row">
                    <span>Visiting Charge</span>
                    <strong>₹{booking.visitingCharge}</strong>
                  </div>

                  {booking.discountAmount > 0 && (
                    <div className="booking-details-price-row booking-details-discount">
                      <span>Discount</span>
                      <strong>- ₹{discountAmount}</strong>
                    </div>
                  )}

                  <div className="booking-details-price-divider" />

                  <div className="booking-details-total-row">
                    <span>Total Payable</span>
                    <strong>₹{finalPayable}</strong>
                  </div>

                  {booking.offerLocked && (
                    <div className="booking-details-offer-success">
                      Offer applied successfully.
                    </div>
                  )}
                </div>

                {/* ---------- OFFERS ---------- */}
                {loadingOffers ? (
                  <div className="booking-details-offer-loading">
                    <div className="booking-details-spinner" />
                    <span>Checking best offers...</span>
                  </div>
                ) : !booking.offerLocked && offers.length > 0 ? (
                  <div className="booking-details-offers">
                    <div className="booking-details-offers-heading">
                      <h6>
                        <FaGift />
                        Available Offers
                      </h6>
                    </div>

                    {offers.map((offer) => {
                      const isSelected = booking.offerId === offer.offerId;

                      return (
                        <div
                          key={offer.offerId}
                          className={`booking-details-offer ${
                            isSelected ? "is-selected" : ""
                          }`}
                        >
                          <div className="booking-details-offer-content">
                            <div>
                              <div className="booking-details-offer-title">
                                <MdLocalOffer />
                                {offer.title}
                              </div>
                              <small>You save ₹{offer.discount}</small>
                            </div>

                            {!booking.offerLocked && (
                              <button
                                disabled={applyingOffer}
                                className="booking-details-offer-btn"
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

                {/* ---------- PAY BUTTON ---------- */}
                {booking.status === "in-progress" && (
                  <div className="booking-details-pay-action">
                    <PayButton
                      booking={booking}
                      paymentType="FINAL"
                      label={`Pay ₹${finalPayable}`}
                    />
                  </div>
                )}
              </section>
            )}

          {booking.status == "cancelled" && (
            <div className="booking-details-action">
              <CusCancelBooking booking={booking} />
            </div>
          )}

          {booking.status === "completed" && (
            <div className="booking-details-action">
              <CusCompleteBooking booking={booking} />
            </div>
          )}
        </div>
      </div>
    </main>
  </div>
);

}

export default CusBookingDetail


   
