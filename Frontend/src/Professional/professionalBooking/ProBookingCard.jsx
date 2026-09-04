import React from "react";
import { GetStatusBadge } from "../../utils/GetStatusBadge";
import { formatDate, formatTime } from "../../utils/formatTime&Date";
import { useNavigate } from "react-router-dom";

import {
  FaUserCircle,
  FaRupeeSign,
  FaClock,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaArrowRight,
} from "react-icons/fa";

const ProBookingCard = ({ booking }) => {
  const navigate = useNavigate();

  if (!booking) return null;

  return (
    <>
      <div
        className="pro-booking-card"
        onClick={() =>
          navigate(`/professional/bookings/${booking?._id}`)
        }
      >
        {/* =========================================
            HEADER
        ========================================= */}
        <div className="pro-booking-header">

          {/* Customer */}
          <div className="pro-booking-customer">

            <div className="pro-booking-avatar">
              <FaUserCircle />
            </div>

            <div className="pro-booking-customer-info">
              <h6>
                {booking?.customerName}
              </h6>

              <span>
                ID: {booking?._id}
              </span>
            </div>

          </div>

          {/* Status */}
          <div className="pro-booking-status">
            <GetStatusBadge status={booking?.status} />

            <div className="pro-booking-arrow">
              <FaArrowRight />
            </div>
          </div>

        </div>


        {/* =========================================
            DETAILS
        ========================================= */}
        <div className="pro-booking-details">

          {/* Visiting Charge */}
          <div className="pro-booking-detail pro-booking-price">

            <div className="pro-detail-icon">
              <FaRupeeSign />
            </div>

            <div className="pro-detail-content">
              <small>Visiting Charge</small>
              <strong>
                ₹{booking?.visitingCharge}
              </strong>
            </div>

          </div>


          {/* Work Date */}
          <div className="pro-booking-detail">

            <div className="pro-detail-icon">
              <FaCalendarAlt />
            </div>

            <div className="pro-detail-content">
              <small>Work Date</small>
              <strong>
                {formatDate(booking?.workDate)}
              </strong>
            </div>

          </div>


          {/* Work Time */}
          <div className="pro-booking-detail">

            <div className="pro-detail-icon">
              <FaClock />
            </div>

            <div className="pro-detail-content">
              <small>Work Time</small>
              <strong>
                {formatTime(booking?.workTime)}
              </strong>
            </div>

          </div>


          {/* Address */}
          <div className="pro-booking-address">

            <div className="pro-address-icon">
              <FaMapMarkerAlt />
            </div>

            <div className="pro-address-content">
              <small>Work Location</small>

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

        /* =========================================
           MAIN CARD
        ========================================= */

        .pro-booking-card {
          position: relative;
          width: 100%;

          padding: 15px 17px;

          background:
            linear-gradient(
              135deg,
              #ffffff 0%,
              #fbfdff 100%
            );

          border: 1px solid #e7eef7;
          border-radius: 18px;

          box-shadow:
            0 6px 20px rgba(15, 23, 42, 0.055);

          cursor: pointer;

          overflow: hidden;

          transition:
            transform 0.22s ease,
            box-shadow 0.22s ease,
            border-color 0.22s ease;
        }


        .pro-booking-card::before {
          content: "";

          position: absolute;

          left: 0;
          top: 0;
          bottom: 0;

          width: 3px;

          background:
            linear-gradient(
              180deg,
              #0d6efd,
              #00b8e6
            );

          border-radius: 18px 0 0 18px;
        }


        .pro-booking-card:hover {
          transform: translateY(-2px);

          border-color: #cfe1f7;

          box-shadow:
            0 12px 30px rgba(15, 23, 42, 0.09);
        }


        /* =========================================
           HEADER
        ========================================= */

        .pro-booking-header {
          display: flex;

          align-items: center;
          justify-content: space-between;

          gap: 15px;

          padding-left: 3px;
        }


        /* =========================================
           CUSTOMER
        ========================================= */

        .pro-booking-customer {
          display: flex;

          align-items: center;

          min-width: 0;

          gap: 11px;
        }


        .pro-booking-avatar {
          width: 42px;
          height: 42px;

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 13px;

          color: #ffffff;

          background:
            linear-gradient(
              135deg,
              #0d6efd,
              #00a9df
            );

          box-shadow:
            0 5px 12px rgba(13, 110, 253, 0.2);

          font-size: 22px;
        }


        .pro-booking-customer-info {
          min-width: 0;
        }


        .pro-booking-customer-info h6 {
          margin: 0;

          max-width: 240px;

          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          font-size: 14px;
          font-weight: 800;

          color: #172033;
        }


        .pro-booking-customer-info span {
          display: block;

          margin-top: 3px;

          max-width: 260px;

          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          font-size: 10px;
          font-weight: 500;

          color: #94a3b8;
        }


        /* =========================================
           STATUS
        ========================================= */

        .pro-booking-status {
          display: flex;

          align-items: center;

          gap: 9px;

          flex-shrink: 0;
        }


        .pro-booking-arrow {
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


        .pro-booking-card:hover .pro-booking-arrow {
          transform: translateX(3px);

          background: #dcecff;
        }


        /* =========================================
           DETAILS
        ========================================= */

        .pro-booking-details {
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


        /* =========================================
           DETAIL ITEM
        ========================================= */

        .pro-booking-detail {
          min-width: 0;

          display: flex;
          align-items: center;

          gap: 9px;

          padding: 8px 10px;

          border-radius: 12px;

          background: #f8fafc;

          border: 1px solid #eef2f6;
        }


        .pro-detail-icon {
          width: 29px;
          height: 29px;

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 9px;

          color: #0d6efd;

          background: #eaf3ff;

          font-size: 11px;
        }


        .pro-detail-content {
          min-width: 0;
        }


        .pro-detail-content small {
          display: block;

          margin-bottom: 2px;

          font-size: 9px;
          font-weight: 600;

          color: #94a3b8;
        }


        .pro-detail-content strong {
          display: block;

          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          font-size: 11px;
          font-weight: 800;

          color: #334155;
        }


        /* =========================================
           PRICE
        ========================================= */

        .pro-booking-price {
          background: #f0fdf7;

          border-color: #d9f3e6;
        }


        .pro-booking-price .pro-detail-icon {
          color: #14965b;

          background: #dcf8e9;
        }


        .pro-booking-price .pro-detail-content strong {
          color: #138653;

          font-size: 13px;
        }


        /* =========================================
           ADDRESS
        ========================================= */

        .pro-booking-address {
          min-width: 0;

          display: flex;
          align-items: center;

          gap: 9px;

          padding: 8px 10px;

          border-radius: 12px;

          background: #fff8f8;

          border: 1px solid #f5e3e3;
        }


        .pro-address-icon {
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


        .pro-address-content {
          min-width: 0;
        }


        .pro-address-content small {
          display: block;

          margin-bottom: 2px;

          font-size: 9px;
          font-weight: 600;

          color: #a38b8b;
        }


        .pro-address-content span {
          display: block;

          font-size: 11px;
          line-height: 1.35;

          font-weight: 700;

          color: #334155;

          /*
             Address remains readable.
             It can wrap instead of destroying
             the card layout.
          */
          word-break: break-word;
          overflow-wrap: anywhere;
        }


        /* =========================================
           TABLET
        ========================================= */

        @media (max-width: 950px) {

          .pro-booking-details {
            grid-template-columns:
              repeat(3, 1fr);
          }


          .pro-booking-address {
            grid-column: 1 / -1;
          }

        }


        /* =========================================
           MOBILE
        ========================================= */

        @media (max-width: 600px) {

          .pro-booking-card {
            padding: 12px 13px;

            border-radius: 16px;
          }


          .pro-booking-header {
            gap: 8px;
          }


          .pro-booking-avatar {
            width: 38px;
            height: 38px;

            border-radius: 11px;

            font-size: 19px;
          }


          .pro-booking-customer {
            gap: 9px;
          }


          .pro-booking-customer-info h6 {
            max-width: 155px;

            font-size: 12px;
          }


          .pro-booking-customer-info span {
            max-width: 160px;

            font-size: 8px;
          }


          .pro-booking-status {
            gap: 5px;
          }


          .pro-booking-arrow {
            width: 25px;
            height: 25px;

            border-radius: 8px;

            font-size: 9px;
          }


          .pro-booking-details {
            grid-template-columns: 1fr 1fr;

            gap: 7px;

            margin-top: 10px;
            padding-top: 10px;
          }


          .pro-booking-detail {
            gap: 7px;

            padding: 7px 8px;

            border-radius: 10px;
          }


          .pro-detail-icon {
            width: 26px;
            height: 26px;

            border-radius: 8px;

            font-size: 10px;
          }


          .pro-detail-content small {
            font-size: 8px;
          }


          .pro-detail-content strong {
            font-size: 10px;
          }


          .pro-booking-price .pro-detail-content strong {
            font-size: 11px;
          }


          .pro-booking-address {
            grid-column: 1 / -1;

            align-items: flex-start;

            padding: 8px;
          }


          .pro-address-icon {
            width: 26px;
            height: 26px;

            border-radius: 8px;

            font-size: 10px;
          }


          .pro-address-content span {
            font-size: 10px;
            line-height: 1.4;
          }

        }


        /* =========================================
           VERY SMALL MOBILE
        ========================================= */

        @media (max-width: 380px) {

          .pro-booking-customer-info h6 {
            max-width: 125px;
          }


          .pro-booking-customer-info span {
            max-width: 130px;
          }


          .pro-booking-details {
            gap: 6px;
          }


          .pro-booking-detail {
            padding: 6px;
          }


          .pro-detail-icon {
            width: 24px;
            height: 24px;
          }

        }


        /* =========================================
           REDUCED MOTION
        ========================================= */

        @media (prefers-reduced-motion: reduce) {

          .pro-booking-card,
          .pro-booking-arrow {
            transition: none;
          }

        }

      `}</style>
    </>
  );
};

export default ProBookingCard;