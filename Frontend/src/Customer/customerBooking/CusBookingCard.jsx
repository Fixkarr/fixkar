import React from "react";
import { useNavigate } from "react-router-dom";
import { GetStatusBadge } from "../../utils/GetStatusBadge";
import { formatDate, formatTime } from "../../utils/formatTime&Date";

import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaArrowRight,
} from "react-icons/fa";

import {
  MdCurrencyRupee,
  MdWork,
} from "react-icons/md";

const CusBookingCard = ({ booking }) => {
  const navigate = useNavigate();

  if (!booking) return null;

  return (
    <>
      <div
        className="cus-booking-card"
        onClick={() =>
          navigate(`/customer/bookings/${booking?._id}`)
        }
      >

        {/* =========================================
            HEADER
        ========================================= */}
        <div className="cus-booking-header">

          {/* Professional */}
          <div className="cus-professional">

            <div className="cus-professional-avatar">

              {booking?.professionalId?.profilePicture ? (
                <img
                  src={booking?.professionalId?.profilePicture}
                  alt="professional"
                />
              ) : (
                <MdWork />
              )}

              <span className="cus-online-dot" />

            </div>


            <div className="cus-professional-info">

              <h6>
                {booking?.professionalId?.userId?.fullName}
              </h6>

              <span>
                <MdWork />
                {booking?.professionalId?.profession?.name}
              </span>

            </div>

          </div>


          {/* Status */}
          <div className="cus-booking-status">

            <GetStatusBadge
              status={booking?.status}
            />

            <div className="cus-booking-arrow">
              <FaArrowRight />
            </div>

          </div>

        </div>


        {/* =========================================
            BOOKING DETAILS
        ========================================= */}
        <div className="cus-booking-details">

          {/* Visiting Charge */}
          <div className="cus-detail cus-price">

            <div className="cus-detail-icon">
              <MdCurrencyRupee />
            </div>

            <div className="cus-detail-content">

              <small>
                Visiting Charge
              </small>

              <strong>
                ₹{booking?.visitingCharge}
              </strong>

            </div>

          </div>


          {/* Work Date */}
          <div className="cus-detail">

            <div className="cus-detail-icon">
              <FaCalendarAlt />
            </div>

            <div className="cus-detail-content">

              <small>
                Work Date
              </small>

              <strong>
                {formatDate(booking?.workDate)}
              </strong>

            </div>

          </div>


          {/* Work Time */}
          <div className="cus-detail">

            <div className="cus-detail-icon">
              <FaClock />
            </div>

            <div className="cus-detail-content">

              <small>
                Work Time
              </small>

              <strong>
                {formatTime(booking?.workTime)}
              </strong>

            </div>

          </div>


          {/* Address */}
          <div className="cus-booking-address">

            <div className="cus-address-icon">
              <FaMapMarkerAlt />
            </div>

            <div className="cus-address-content">

              <small>
                Service Location
              </small>

              <span>
                {booking?.workAddress}
              </span>

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          COMPONENT CSS
      ================================================= */}
      <style>{`

        /* =================================================
           MAIN CARD
        ================================================= */

        .cus-booking-card {
          position: relative;

          width: 100%;

          padding: 15px 17px;

          background:
            linear-gradient(
              135deg,
              #ffffff 0%,
              #f9fcff 100%
            );

          border: 1px solid #e5edf7;

          border-radius: 18px;

          box-shadow:
            0 7px 22px rgba(15, 23, 42, 0.055);

          cursor: pointer;

          overflow: hidden;

          transition:
            transform 0.22s ease,
            box-shadow 0.22s ease,
            border-color 0.22s ease;
        }


        /* Premium left accent */

        .cus-booking-card::before {
          content: "";

          position: absolute;

          top: 0;
          bottom: 0;
          left: 0;

          width: 3px;

          background:
            linear-gradient(
              180deg,
              #0d6efd,
              #00b8e6
            );

          border-radius: 18px 0 0 18px;
        }


        .cus-booking-card:hover {
          transform: translateY(-2px);

          border-color: #cfe1f7;

          box-shadow:
            0 13px 32px rgba(15, 23, 42, 0.095);
        }


        /* =================================================
           HEADER
        ================================================= */

        .cus-booking-header {
          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 15px;

          padding-left: 3px;
        }


        /* =================================================
           PROFESSIONAL
        ================================================= */

        .cus-professional {
          display: flex;

          align-items: center;

          gap: 11px;

          min-width: 0;
        }


        .cus-professional-avatar {
          position: relative;

          width: 46px;
          height: 46px;

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 14px;

          padding: 2px;

          background:
            linear-gradient(
              135deg,
              #0d6efd,
              #00a9df
            );

          box-shadow:
            0 5px 14px rgba(13, 110, 253, 0.2);
        }


        .cus-professional-avatar img {
          width: 100%;
          height: 100%;

          object-fit: cover;

          border-radius: 11px;

          display: block;

          background: #eef5ff;
        }


        .cus-professional-avatar > svg {
          color: #ffffff;

          font-size: 20px;
        }


        /* Online/status dot */

        .cus-online-dot {
          position: absolute;

          right: -2px;
          bottom: -2px;

          width: 10px;
          height: 10px;

          border-radius: 50%;

          background: #20b56b;

          border: 2px solid #ffffff;

          box-shadow:
            0 2px 6px rgba(15, 23, 42, 0.15);
        }


        .cus-professional-info {
          min-width: 0;
        }


        .cus-professional-info h6 {
          margin: 0;

          max-width: 250px;

          overflow: hidden;

          text-overflow: ellipsis;

          white-space: nowrap;

          font-size: 14px;

          font-weight: 800;

          letter-spacing: -0.2px;

          color: #172033;
        }


        .cus-professional-info span {
          display: flex;

          align-items: center;

          gap: 4px;

          margin-top: 3px;

          max-width: 250px;

          overflow: hidden;

          text-overflow: ellipsis;

          white-space: nowrap;

          font-size: 10px;

          font-weight: 600;

          color: #7c8ba1;
        }


        .cus-professional-info span svg {
          flex-shrink: 0;

          color: #0d6efd;

          font-size: 11px;
        }


        /* =================================================
           STATUS
        ================================================= */

        .cus-booking-status {
          display: flex;

          align-items: center;

          gap: 9px;

          flex-shrink: 0;
        }


        .cus-booking-arrow {
          width: 28px;
          height: 28px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 9px;

          color: #0d6efd;

          background: #edf5ff;

          font-size: 10px;

          transition:
            transform 0.2s ease,
            background 0.2s ease;
        }


        .cus-booking-card:hover .cus-booking-arrow {
          transform: translateX(3px);

          background: #dcecff;
        }


        /* =================================================
           DETAILS GRID
        ================================================= */

        .cus-booking-details {
          display: grid;

          grid-template-columns:
            minmax(145px, 0.8fr)
            minmax(145px, 0.9fr)
            minmax(135px, 0.8fr)
            minmax(240px, 1.8fr);

          gap: 9px;

          margin-top: 13px;

          padding-top: 12px;

          border-top: 1px solid #edf2f7;
        }


        /* =================================================
           DETAIL ITEM
        ================================================= */

        .cus-detail {
          min-width: 0;

          display: flex;

          align-items: center;

          gap: 9px;

          padding: 8px 10px;

          border-radius: 12px;

          background: #f8fafc;

          border: 1px solid #eef2f6;
        }


        .cus-detail-icon {
          width: 29px;
          height: 29px;

          flex-shrink: 0;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 9px;

          color: #0d6efd;

          background: #eaf3ff;

          font-size: 12px;
        }


        .cus-detail-content {
          min-width: 0;
        }


        .cus-detail-content small {
          display: block;

          margin-bottom: 2px;

          font-size: 9px;

          font-weight: 600;

          color: #94a3b8;
        }


        .cus-detail-content strong {
          display: block;

          overflow: hidden;

          text-overflow: ellipsis;

          white-space: nowrap;

          font-size: 11px;

          font-weight: 800;

          color: #334155;
        }


        /* =================================================
           PRICE
        ================================================= */

        .cus-price {
          background: #f0fdf7;

          border-color: #d9f3e6;
        }


        .cus-price .cus-detail-icon {
          color: #14965b;

          background: #dcf8e9;
        }


        .cus-price .cus-detail-content strong {
          color: #138653;

          font-size: 13px;
        }


        /* =================================================
           ADDRESS
        ================================================= */

        .cus-booking-address {
          min-width: 0;

          display: flex;

          align-items: center;

          gap: 9px;

          padding: 8px 10px;

          border-radius: 12px;

          background: #fff8f8;

          border: 1px solid #f5e3e3;
        }


        .cus-address-icon {
          width: 29px;
          height: 29px;

          flex-shrink: 0;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 9px;

          color: #e5484d;

          background: #ffebeb;

          font-size: 11px;
        }


        .cus-address-content {
          min-width: 0;
        }


        .cus-address-content small {
          display: block;

          margin-bottom: 2px;

          font-size: 9px;

          font-weight: 600;

          color: #a38b8b;
        }


        .cus-address-content span {
          display: block;

          font-size: 11px;

          line-height: 1.35;

          font-weight: 700;

          color: #334155;

          /*
            Address should remain readable.
            It wraps instead of getting truncated.
          */
          word-break: break-word;

          overflow-wrap: anywhere;
        }


        /* =================================================
           TABLET
        ================================================= */

        @media (max-width: 950px) {

          .cus-booking-details {
            grid-template-columns:
              repeat(3, 1fr);
          }


          .cus-booking-address {
            grid-column: 1 / -1;
          }

        }


        /* =================================================
           MOBILE
        ================================================= */

        @media (max-width: 600px) {

          .cus-booking-card {
            padding: 12px 13px;

            border-radius: 16px;
          }


          .cus-booking-header {
            gap: 8px;
          }


          .cus-professional {
            gap: 9px;
          }


          .cus-professional-avatar {
            width: 39px;
            height: 39px;

            border-radius: 11px;
          }


          .cus-professional-avatar img {
            border-radius: 9px;
          }


          .cus-professional-avatar > svg {
            font-size: 17px;
          }


          .cus-online-dot {
            width: 9px;
            height: 9px;
          }


          .cus-professional-info h6 {
            max-width: 155px;

            font-size: 12px;
          }


          .cus-professional-info span {
            max-width: 160px;

            font-size: 8px;
          }


          .cus-professional-info span svg {
            font-size: 9px;
          }


          .cus-booking-status {
            gap: 5px;
          }


          .cus-booking-arrow {
            width: 25px;
            height: 25px;

            border-radius: 8px;

            font-size: 9px;
          }


          /* Details */

          .cus-booking-details {
            grid-template-columns: 1fr 1fr;

            gap: 7px;

            margin-top: 10px;

            padding-top: 10px;
          }


          .cus-detail {
            gap: 7px;

            padding: 7px 8px;

            border-radius: 10px;
          }


          .cus-detail-icon {
            width: 26px;
            height: 26px;

            border-radius: 8px;

            font-size: 10px;
          }


          .cus-detail-content small {
            font-size: 8px;
          }


          .cus-detail-content strong {
            font-size: 10px;
          }


          .cus-price .cus-detail-content strong {
            font-size: 11px;
          }


          /* Address */

          .cus-booking-address {
            grid-column: 1 / -1;

            align-items: flex-start;

            padding: 8px;
          }


          .cus-address-icon {
            width: 26px;
            height: 26px;

            border-radius: 8px;

            font-size: 10px;
          }


          .cus-address-content span {
            font-size: 10px;

            line-height: 1.4;
          }

        }


        /* =================================================
           VERY SMALL PHONES
        ================================================= */

        @media (max-width: 380px) {

          .cus-professional-info h6 {
            max-width: 125px;
          }


          .cus-professional-info span {
            max-width: 130px;
          }


          .cus-booking-details {
            gap: 6px;
          }


          .cus-detail {
            padding: 6px;
          }


          .cus-detail-icon {
            width: 24px;
            height: 24px;
          }

        }


        /* =================================================
           REDUCED MOTION
        ================================================= */

        @media (prefers-reduced-motion: reduce) {

          .cus-booking-card,
          .cus-booking-arrow {
            transition: none;
          }

        }

      `}</style>
    </>
  );
};

export default CusBookingCard;