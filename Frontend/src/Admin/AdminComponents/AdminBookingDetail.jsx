import React, { useEffect, useState } from "react";
import {
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
  FaCalendarAlt,
  FaRoute,
  FaStar,
  FaUser,
  FaPhone,
  FaGift,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import axios from "axios";
import { server_url } from "../../App";
import { toast } from "react-toastify";
import { GetStatusBadge } from "../../utils/GetStatusBadge";
import { formatDate } from "../../utils/formatTime&Date";

const AdminBookingDetail = () => {
  const [booking, setBooking] = useState(null);
  const { bookingId } = useParams();

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(
          `${server_url}/api/admin/get-admin-booking/${bookingId}`,
          { withCredentials: true }
        );
        setBooking(res.data.booking);
      } catch (err) {
        toast.error("Error fetching booking");
      }
    };
    fetchBooking();
  }, [bookingId]);

  if (!booking) return <div className="text-center mt-5 text-dark">Loading...</div>;

  const {
    _id,
    status,
    customerName,
    customerId,
    professionalId,
    mobileNumber,
    problemDescription,
    workDate,
    workTime,
    workAddress,
    visitingCharge,
    distanceInKm,
    discountAmount,
    finalCustomerPayable,
    audioMessages,
    quoteAmount,
    offerId,
    currentPaymentId,
    review,
    createdAt,
    startedAt,
    quoteSentAt,
  } = booking;

  return (
    <div style={{ background: "#0f172a", minHeight: "100vh" }} className="p-4">

      {/* HEADER */}
      <div className="p-4 rounded-4 mb-4 shadow text-white"
        style={{ background: "linear-gradient(135deg,#1e293b,#334155)" }}>
        <h3>Booking Details</h3>
        <p>ID: {_id}</p>
        <GetStatusBadge status={status} />
        <p>Created: {formatDate(createdAt)}</p>
      </div>

      {/* CUSTOMER */}
      <div className="card mb-3 p-3 bg-dark text-white">
        <h5><FaUser /> Customer Info</h5>
        <p>Name: {customerName}</p>
        <p>ID: {customerId}</p>
        <p><FaPhone /> {mobileNumber}</p>
      </div>

      {/* WORK */}
      <div className="card mb-3 p-3 bg-dark text-white">
        <h5>Work Details</h5>
        <p>{problemDescription}</p>
        <p><FaCalendarAlt /> {formatDate(workDate)}</p>
        <p><FaClock /> {workTime}</p>
        <p><FaMapMarkerAlt /> {workAddress}</p>
        <p><FaRoute /> {distanceInKm} km</p>
        <p><FaMoneyBillWave /> Visiting: ₹{visitingCharge}</p>
      </div>

      {/* TIMELINE */}
      <div className="card mb-3 p-3 bg-dark text-white">
        <h5>Progress</h5>
        <p>Started: {startedAt}</p>
        <p>Quote Sent: {quoteSentAt}</p>
      </div>

      {/* OFFER */}
      {offerId && (
        <div className="card mb-3 p-3 bg-dark text-white">
          <h5><FaGift /> Offer</h5>
          <p>{offerId.offerTitle}</p>
          <p>
            {offerId.discountType === "percentage"
              ? `${offerId.discountValue}% OFF`
              : `₹${offerId.discountValue} OFF`}
          </p>
        </div>
      )}

      {/* PAYMENT */}
      <div className="card mb-3 p-3 bg-dark text-white">
        <h5>Payment</h5>
        <p>Quote: ₹{quoteAmount}</p>
        <p className="text-danger">Discount: -₹{discountAmount}</p>
        <p className="text-success">Final: ₹{finalCustomerPayable}</p>

        <hr />

        <p>Paid: ₹{currentPaymentId?.amount}</p>
        <p>Status: {currentPaymentId?.status}</p>
        <p>Mode: {currentPaymentId?.paymentMode}</p>
        <p>OrderId: {currentPaymentId?.razorpayOrderId}</p>
        <p>PaymentId: {currentPaymentId?.razorpayPaymentId}</p>
      </div>

      {/* AUDIO */}
      {audioMessages?.length > 0 && (
        <div className="card mb-3 p-3 bg-dark text-white">
          <h5>Audio Messages</h5>
          {audioMessages.map((a, i) => (
            <audio key={i} controls src={a.url} className="w-100 mb-2"/>
          ))}
        </div>
      )}

      {/* REVIEW */}
      {review && (
        <div className="card mb-3 p-3 bg-dark text-white">
          <h5>Review</h5>
          <strong>{review.customerName}</strong>
          <div className="text-warning">
            {Array.from({ length: review.rating }).map((_, i) => (
              <FaStar key={i} />
            ))}
          </div>
          <p>{review.review}</p>
        </div>
      )}
    </div>
  );
};

export default AdminBookingDetail;

// import React, { useEffect, useState } from "react";
// import {
//   FaMapMarkerAlt,
//   FaMoneyBillWave,
//   FaClock,
//   FaCalendarAlt,
//   FaRoute,
//   FaIdCard,
//   FaBriefcase,

//   FaToolbox,
//   FaFileContract,
//   FaClipboardCheck,
//   FaRegStickyNote,
//   FaStar,
// } from "react-icons/fa";
// import {useParams} from "react-router-dom"
// import axios from 'axios'
// import {server_url} from '../../App'
// import { toast } from "react-toastify";
// import { GetStatusBadge } from "../../utils/GetStatusBadge";
// import { formatDate, formatTime } from "../../utils/formatTime&Date";
// import { FaIdCardClip, FaPerson } from "react-icons/fa6";
// import { FcAlarmClock } from "react-icons/fc";
// import Section from "./Utils/Section";
// import Info from "./Utils/Info";

// const AdminBookingDetail = () => {

// const [booking, setBooking] = useState({});
// const {bookingId} = useParams();

// useEffect(()=>{
//     const fetchBooking = async ()=>{
//         try {
//             const result = await axios.get(`${server_url}/api/admin/get-admin-booking/${bookingId}`, {withCredentials : true});
//             setBooking(result.data.booking)
//             toast.success(result.data.message);
//         } catch (error) {
            
//         }
//     }

//     fetchBooking();
// },[bookingId])

//   if (!booking) {
//     return (
//       <div className="text-center py-5 text-muted">
//         Booking data not available
//       </div>
//     );
//   }

//   const {
//     _id,
//     status,
//     problemDescription,
//     workDate,
//     workTime,
//     workAddress,
//     visitingCharge,
//     distanceInKm,
//     createdAt,
//     customerName,
//     startedAt,
//     customerId,
//     professionalId,
//     quoteAmount,
//     quoteSentAt,
//     currentPaymentId,
//     review
//   } = booking;


//   const paymentReason = currentPaymentId?.reason;
//   const paidAmount =    currentPaymentId?.amount;
//   const paidAt =    currentPaymentId?.paidAt;
//   const razorpayOrderId =    currentPaymentId?.razorpayOrderId;
//   const razorpayPaymentId =    currentPaymentId?.razorpayPaymentId;
//   const reviewDesc = review?.review
//   const reviewRating = review?.rating

//   return (
//     <div
//       className="container-fluid p-4 rounded-4 shadow-lg"
//       style={{
//         background:
//           "linear-gradient(135deg, #1f4037, #99f2c8)",
//       }}
//     >
//       {/* ================= HEADER ================= */}
//       <div
//         className="card border-0 shadow-lg rounded-4 mb-4 text-white"
//         style={{
//           background:
//             "linear-gradient(135deg, #141e30, #243b55)",
//         }}
//       >
//         <div className="card-body">
//           <h4 className="fw-bold mb-2">
//             <FaIdCard className="me-2 text-warning" />
//             Booking Detail
//           </h4>
//           <div className="d-flex flex-wrap gap-3 small">
//             <span>
//               <strong>ID:</strong> {_id || "N/A"}
//             </span>
//             {<GetStatusBadge status={status}/>}
//             <span>
//               <FaCalendarAlt className="me-1" />
//               {formatDate(createdAt)}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* ================= WORK DETAILS ================= */}
//       <Section title="Work Details" icon={<FaClock />}>
//         <Info label="Problem" value={problemDescription} icon={<FaRegStickyNote className="me-2 text-primary"/>}/>
//         <Info label="Customer Id" value={customerId} icon={<FaIdCardClip className="me-2 text-primary"/>}/>
//         <Info label="Professional Id" value={professionalId} icon={<FaIdCardClip className="me-2 text-primary"/>}/>
//         <Info label="Customer Name" value={customerName} icon={<FaPerson className="me-2 text-primary"/>}/>
//         <Info label="Work Date" value={formatDate(workDate)} icon={<FaCalendarAlt className="me-2 text-primary"/>}/>
//         <Info label="Work Time" value={workTime} icon={<FcAlarmClock className="me-2 text-primary"/>}/>
//         <Info label="Address" value={workAddress} icon={<FaMapMarkerAlt className="me-2 text-primary"/>}/>
//         <Info label="Distance (km)" value={distanceInKm} icon={<FaRoute className="me-2 text-primary"/>}/>
//          <Info label="Visiting Charge" value={`₹ ${visitingCharge || 0}`} icon={<FaMoneyBillWave className="me-2 text-primary"/>}/>
//       </Section>

//       <Section title="Booking Progess & Payment Details" icon={<FaClipboardCheck/> }>
//            <Info label="Work Started At" value={startedAt} />
//            <Info label="Quote Amount" value={quoteAmount} />
//            <Info label="Quote Sent At" value={quoteSentAt} />
//            <Info label="Payment Type" value={paymentReason} />
//            <Info label="Paid Amount" value={paidAmount} />
//            <Info label="Amount Paid At" value={paidAt} />
//            <Info label="Razorpay OrderId" value={razorpayOrderId} />
//            <Info label="Razorpay PaymentId" value={razorpayPaymentId} />
//       </Section>
        
//         <div
//                          className="p-3 mb-3 rounded-3 text-white shadow"
//                           style={{
//                             background: "linear-gradient(135deg, #1e293b, #334155)",
//                           }}
//                         >
//                           <div className="d-flex justify-content-between">
//                             <strong>{customerName}</strong>
//                             <span className="text-warning">
//                               {Array.from({ length: reviewRating }).map((_, i) => (
//                                 <FaStar key={i} />
//                               ))}
//                             </span>
//                           </div>
//                           <p className="small">{reviewDesc}</p>
//                         </div>

//     </div>
//   );
// };

// /* ================= REUSABLE UI ================= */



// export default AdminBookingDetail;
