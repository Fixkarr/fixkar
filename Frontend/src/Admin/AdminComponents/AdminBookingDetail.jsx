import React, { useEffect, useState } from "react";
import {
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
  FaCalendarAlt,
  FaRoute,
  FaStar,
  FaUser,
  FaTools,
  FaFileInvoice,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import axios from "axios";
import { server_url } from "../../App";
import { toast } from "react-toastify";
import { GetStatusBadge } from "../../utils/GetStatusBadge";
import { formatDate, formatTime } from "../../utils/formatTime&Date";

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

  if (!booking) return <div className="text-center mt-5">Loading...</div>;

  const {
    _id,
    status,
    customerName,
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
    currentPaymentId,
    review,
  } = booking;

  return (
    <div className="container py-4">
      {/* HEADER */}
      <div className="p-4 rounded-4 mb-4 shadow-lg text-white"
        style={{
          background: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)"
        }}>
        <h3 className="fw-bold">Booking Overview</h3>
        <div className="d-flex flex-wrap gap-3 mt-2">
          <span>ID: {_id}</span>
          <GetStatusBadge status={status} />
        </div>
      </div>

      {/* CUSTOMER + WORK */}
      <div className="row g-4">
        <div className="col-md-6">
          <div className="glass-card">
            <h5><FaUser /> Customer</h5>
            <p><strong>Name:</strong> {customerName}</p>
            <p><strong>Problem:</strong> {problemDescription}</p>
          </div>
        </div>

        <div className="col-md-6">
          <div className="glass-card">
            <h5><FaTools /> Work Details</h5>
            <p><FaCalendarAlt /> {formatDate(workDate)}</p>
            <p><FaClock /> {workTime}</p>
            <p><FaMapMarkerAlt /> {workAddress}</p>
            <p><FaRoute /> {distanceInKm} km</p>
          </div>
        </div>
      </div>

      {/* PAYMENT */}
      <div className="glass-card mt-4">
        <h5><FaFileInvoice /> Payment Summary</h5>

        <div className="row">
          <div className="col-md-4">
            <p>Quote: ₹{quoteAmount}</p>
          </div>
          <div className="col-md-4 text-danger">
            <p>Discount: -₹{discountAmount}</p>
          </div>
          <div className="col-md-4 text-success fw-bold">
            <p>Final: ₹{finalCustomerPayable}</p>
          </div>
        </div>

        <hr />

        <p>Paid: ₹{currentPaymentId?.amount}</p>
        <p>Status: {currentPaymentId?.status}</p>
        <p>Mode: {currentPaymentId?.paymentMode}</p>
      </div>

      {/* AUDIO */}
      {audioMessages?.length > 0 && (
        <div className="glass-card mt-4">
          <h5>Audio Messages</h5>
          {audioMessages.map((audio, i) => (
            <audio key={i} controls src={audio.url} className="w-100 mb-2"/>
          ))}
        </div>
      )}

      {/* REVIEW */}
      {review && (
        <div className="glass-card mt-4">
          <h5>Customer Review</h5>
          <div className="d-flex justify-content-between">
            <strong>{review.customerName}</strong>
            <span className="text-warning">
              {Array.from({ length: review.rating }).map((_, i) => (
                <FaStar key={i}/>
              ))}
            </span>
          </div>
          <p>{review.review}</p>
        </div>
      )}

      {/* CSS */}
      <style jsx>{`
        .glass-card {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(12px);
          border-radius: 20px;
          padding: 20px;
          color: white;
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        }
      `}</style>
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
