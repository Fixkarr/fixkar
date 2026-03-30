

import React, { useEffect, useState } from "react";
import {
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
  FaCalendarAlt,
  FaRoute,
  FaIdCard,
 FaPhone, FaGift, FaVolumeUp,
  FaClipboardCheck,
  FaRegStickyNote,
  FaStar,
} from "react-icons/fa";
import {useParams} from "react-router-dom"
import axios from 'axios'
import {server_url} from '../../App'
import { toast } from "react-toastify";
import { GetStatusBadge } from "../../utils/GetStatusBadge";
import { formatDate, formatTime } from "../../utils/formatTime&Date";
import { FaIdCardClip, FaPerson } from "react-icons/fa6";
import { FcAlarmClock } from "react-icons/fc";
import Section from "./Utils/Section";
import Info from "./Utils/Info";

const AdminBookingDetail = () => {

const [booking, setBooking] = useState({});
const {bookingId} = useParams();

useEffect(()=>{
    const fetchBooking = async ()=>{
        try {
            const result = await axios.get(`${server_url}/api/admin/get-admin-booking/${bookingId}`, {withCredentials : true});
            setBooking(result.data.booking)
            toast.success(result.data.message);
        } catch (error) {
            
        }
    }

    fetchBooking();
},[bookingId])

  if (!booking) {
    return (
      <div className="text-center py-5 text-muted">
        Booking data not available
      </div>
    );
  }

const {
  _id,
  status,
  problemDescription,
  workDate,
  workTime,
  workAddress,
  visitingCharge,
  distanceInKm,
  createdAt,
  customerName,
  startedAt,
  customerId,
  professionalId,
  quoteAmount,
  quoteSentAt,
  currentPaymentId,
  review,

  // 🔥 NEW ADD
  mobileNumber,
  reachedAt,
  discountAmount,
  finalCustomerPayable,
  offerId,
  offerLocked,
  audioMessages,
  walletTransaction,
  updatedAt

} = booking;


const paymentReason = currentPaymentId?.reason;
const paidAmount = currentPaymentId?.amount;
const paidAt = currentPaymentId?.paidAt;
const razorpayOrderId = currentPaymentId?.razorpayOrderId;
const razorpayPaymentId = currentPaymentId?.razorpayPaymentId;
const paymentMode = currentPaymentId?.paymentMode;
const paymentStatus = currentPaymentId?.status;

  return (
    <div
      className="container-fluid p-4 rounded-4 shadow-lg"
      style={{
        background:
          "linear-gradient(135deg, #1f4037, #99f2c8)",
      }}
    >
      {/* ================= HEADER ================= */}
      <div
        className="card border-0 shadow-lg rounded-4 mb-4 text-white"
        style={{
          background:
            "linear-gradient(135deg, #141e30, #243b55)",
        }}
      >
        <div className="card-body">
          <h4 className="fw-bold mb-2">
            <FaIdCard className="me-2 text-warning" />
            Booking Detail
          </h4>
          <div className="d-flex flex-wrap gap-3 small">
            <span>
              <strong>ID:</strong> {_id || "N/A"}
            </span>
            {<GetStatusBadge status={status}/>}
            <span>
              <FaCalendarAlt className="me-1" />
              {formatDate(createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* ================= WORK DETAILS ================= */}
      <Section title="Work Details" icon={<FaClock />}>
        <Info label="Problem" value={problemDescription} icon={<FaRegStickyNote className="me-2 text-primary"/>}/>
        <Info label="Customer Id" value={customerId} icon={<FaIdCardClip className="me-2 text-primary"/>}/>
        <Info label="Professional Id" value={professionalId} icon={<FaIdCardClip className="me-2 text-primary"/>}/>
        <Info label="Customer Name" value={customerName} icon={<FaPerson className="me-2 text-primary"/>}/>
        <Info label="Work Date" value={formatDate(workDate)} icon={<FaCalendarAlt className="me-2 text-primary"/>}/>
        <Info label="Work Time" value={workTime} icon={<FcAlarmClock className="me-2 text-primary"/>}/>
        <Info label="Address" value={workAddress} icon={<FaMapMarkerAlt className="me-2 text-primary"/>}/>
        <Info label="Distance (km)" value={distanceInKm} icon={<FaRoute className="me-2 text-primary"/>}/>
         <Info label="Visiting Charge" value={`₹ ${visitingCharge || 0}`} icon={<FaMoneyBillWave className="me-2 text-primary"/>}/>
         <Info label="Mobile Number" value={mobileNumber} icon={<FaPhone className="me-2 text-primary"/>}/>
        <Info label="Reached At" value={reachedAt || "Not reached"} />
        <Info label="Updated At" value={formatDate(updatedAt)} />
      </Section>
      <Section title="Audio Messages" icon={<FaVolumeUp />}>
  {audioMessages?.length > 0 ? (
    audioMessages.map((audio, i) => (
      <audio key={i} controls src={audio.url} className="w-100 mb-2" />
    ))
  ) : (
    <p>No audio messages</p>
  )}
</Section>

      <Section title="Booking Progess & Payment Details" icon={<FaClipboardCheck/> }>
           <Info label="Work Started At" value={startedAt} />
           <Info label="Quote Amount" value={quoteAmount} />
           <Info label="Quote Sent At" value={quoteSentAt} />
           <Info label="Payment Type" value={paymentReason} />
           <Info label="Paid Amount" value={paidAmount} />
           <Info label="Amount Paid At" value={paidAt} />
           <Info label="Razorpay OrderId" value={razorpayOrderId} />
           <Info label="Razorpay PaymentId" value={razorpayPaymentId} />
           <Info label="Discount Amount" value={`₹ ${discountAmount}`} />
            <Info label="Final Payable" value={`₹ ${finalCustomerPayable}`} />
            <Info label="Payment Status" value={paymentStatus} />
            <Info label="Payment Mode" value={paymentMode} />
            <Info label="Wallet Transaction" value={walletTransaction} />
      </Section>
        
        <Section title="Offer Details" icon={<FaGift />}>
  <Info label="Offer Title" value={offerId?.offerTitle} />
  <Info
    label="Discount"
    value={
      offerId?.discountType === "percentage"
        ? `${offerId?.discountValue}%`
        : `₹ ${offerId?.discountValue}`
    }
  />
  <Info label="Min Booking" value={offerId?.minBookingAmount} />
  <Info label="Max Discount" value={offerId?.maxDiscount} />
  <Info label="Usage Limit" value={offerId?.usageLimit} />
  <Info label="Used Count" value={offerId?.usedCount} />
  <Info label="Per User Limit" value={offerId?.perUserLimit} />
  <Info label="New Customer Only" value={offerId?.newCustomerOnly ? "Yes" : "No"} />
  <Info label="Offer Active" value={offerId?.isActive ? "Yes" : "No"} />
  <Info label="Offer Locked" value={offerLocked ? "Yes" : "No"} />
</Section>
        <div
                         className="p-3 mb-3 rounded-3 text-white shadow"
                          style={{
                            background: "linear-gradient(135deg, #1e293b, #334155)",
                          }}
                        >
                          <Info label="Review Created At" value={formatDate(review?.createdAt)} />
                          <div className="d-flex justify-content-between">
                            <strong>{review.customerName}</strong>
                            <span className="text-warning">
                              {Array.from({ length: review?.rating }).map((_, i) => (
                                <FaStar key={i} />
                              ))}
                            </span>
                          </div>
                          <p className="small">{review?.review}</p>
                        </div>

    </div>
  );
};

export default AdminBookingDetail;
