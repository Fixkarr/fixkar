import React, { useEffect, useState } from "react";
import {
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
  FaCalendarAlt,
  FaRoute,
  FaIdCard,
  FaBriefcase,

  FaToolbox,
  FaFileContract,
  FaClipboardCheck,
  FaRegStickyNote,
} from "react-icons/fa";
import {useParams} from "react-router-dom"
import axios from 'axios'
import {server_url} from '../../App'
import { toast } from "react-toastify";
import { GetStatusBadge } from "../../utils/GetStatusBadge";
import { formatDate, formatTime } from "../../utils/formatTime&Date";
import { FaIdCardClip, FaPerson } from "react-icons/fa6";
import { FcAlarmClock } from "react-icons/fc";

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
    chargeType,
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
    review
  } = booking;


  const profession = professionalId?.profession;
  const paymentReason = currentPaymentId?.reason;
  const paidAmount =    currentPaymentId?.amount;
  const paidAt =    currentPaymentId?.paidAt;
  const razorpayOrderId =    currentPaymentId?.razorpayOrderId;
  const razorpayPaymentId =    currentPaymentId?.razorpayPaymentId;
  const reviewDesc = review?.review
  const reviewRating = review?.rating

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

      {/* ================= PROFESSION ================= */}
      <Section title="Profession & Skills" icon={<FaBriefcase />}>
        <Info label="Profession" value={profession?.name} icon={<FaToolbox className="me-2 text-primary"/>}/>
        <Info label="Description" value={profession?.description} icon={<FaRegStickyNote className="me-2 text-primary"/>}/>
      </Section>

      {/* ================= WORK DETAILS ================= */}
      <Section title="Work Details" icon={<FaClock />}>
        <Info label="Problem" value={problemDescription} icon={<FaRegStickyNote className="me-2 text-primary"/>}/>
        <Info label="Customer Id" value={customerId} icon={<FaIdCardClip className="me-2 text-primary"/>}/>
        <Info label="Customer Name" value={customerName} icon={<FaPerson className="me-2 text-primary"/>}/>
        <Info label="Work Date" value={formatDate(workDate)} icon={<FaCalendarAlt className="me-2 text-primary"/>}/>
        <Info label="Work Time" value={workTime} icon={<FcAlarmClock className="me-2 text-primary"/>}/>
        <Info label="Address" value={workAddress} icon={<FaMapMarkerAlt className="me-2 text-primary"/>}/>
        <Info label="Distance (km)" value={distanceInKm} icon={<FaRoute className="me-2 text-primary"/>}/>
        <Info label="Charge Type" value={chargeType} icon={<FaFileContract className="me-2 text-primary"/>}/>
         <Info label="Visiting Charge" value={`₹ ${visitingCharge || 0}`} icon={<FaMoneyBillWave className="me-2 text-primary"/>}/>
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
      </Section>
        
        <div
                         className="p-3 mb-3 rounded-3 text-white shadow"
                          style={{
                            background: "linear-gradient(135deg, #1e293b, #334155)",
                          }}
                        >
                          <div className="d-flex justify-content-between">
                            <strong>{customerName}</strong>
                            <span className="text-warning">
                              {Array.from({ length: reviewRating }).map((_, i) => (
                                <FaStar key={i} />
                              ))}
                            </span>
                          </div>
                          <p className="small">{reviewDesc}</p>
                        </div>

    </div>
  );
};

/* ================= REUSABLE UI ================= */

const Section = ({ title, icon, children }) => (
  <div
    className="card border-0 shadow-lg rounded-4 mb-4"
    style={{
      background:
        "linear-gradient(135deg, #ffffff, #f1f1f1)",
    }}
  >
    <div className="card-header fw-bold d-flex align-items-center gap-2">
      <span className="text-primary fs-5">{icon}</span>
      {title}
    </div>
    <div className="card-body row g-3">{children}</div>
  </div>
);

const Info = ({ label, value, icon }) => (
  <div className="col-md-6">
    <div className="small text-muted">{icon} {label}</div>
    <div className="fw-semibold">
      {value ?? "N/A"}
    </div>
  </div>
);

export default AdminBookingDetail;
