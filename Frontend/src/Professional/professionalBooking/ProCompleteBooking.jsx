// import React from 'react'
// import { CiWallet } from 'react-icons/ci'
// import { TbTransactionRupee } from 'react-icons/tb'
// import { FaClipboardList, FaRegCommentDots, FaStar } from 'react-icons/fa'
// import { useNavigate } from 'react-router-dom'
// const ProCompleteBooking = ({booking, transaction}) => {
//     const navigate = useNavigate();
//   return (
//     <div className="card border-0 shadow-sm mb-3">
//      <div className="card-body">
   
//        {/* Header */}
//        <div className="d-flex align-items-center mb-3">
//          <div
//            className="bg-success text-white p-3 rounded-circle d-flex align-items-center justify-content-center"
//          >
//            <TbTransactionRupee />
//          </div>
   
//          <div className="ms-3">
//            <h6 className="mb-0 fw-semibold text-success">
//              Payment Received
//            </h6>
//            <small className="text-muted">
//              Customer has completed the payment
//            </small>
//          </div>
//        </div>
   
//        {/* Amount Section */}
//        <div className="bg-light rounded p-3 mb-3">
//          <div className="d-flex justify-content-between">
//            <span className="text-muted">Service Amount</span>
//            <span className="fw-semibold">₹{transaction?.grossAmount}</span>
//          </div>
   
//          <div className="d-flex justify-content-between mt-2">
//            <span className="text-muted">Platform Fee</span>
//            <span className="text-danger">- ₹{transaction?.commission}</span>
//          </div>
   
//          <hr className="my-2" />
   
//          <div className="d-flex justify-content-between">
//            <span className="fw-bold text-success d-flex align-items-center justify-content-between gap-2">Added to Wallet <b><CiWallet/></b> </span>
//            <span className="fw-bold text-success">₹{transaction?.professionalAmount}</span>
//          </div>
//        </div>
  
   
//        {/* Actions */}
//        <div className="d-flex flex-items-end gap-2">
//          <button className="btn btn-primary btn-sm" onClick={()=>navigate('/professional/home')}>
//            View Wallet
//          </button>
//        </div>

//       {booking.review && (
//         <div className="card border-0 shadow-sm rounded-4 mb-4">
//   <div className="card-body p-4">

//     {/* Header */}
//     <div className="d-flex align-items-center mb-3">
//       <div
//         className="bg-primary p-3 text-white rounded-circle d-flex align-items-center justify-content-center"
//       >
//         <FaStar />
//       </div>

//       <div className="ms-3">
//         <h6 className="mb-0 fw-bold text-primary">
//           Congratulations!
//         </h6>
//         <small className="text-muted">
//           You have received feedback from the customer
//         </small>
//       </div>
//     </div>

//     {/* Message */}
//     <div className="bg-light rounded-3 p-3 mb-3">
//       <p className="mb-1 fw-semibold">
//         Thank you for your service
//       </p>
//       <p className="mb-0 text-muted small">
//         The customer has shared their experience for this booking.
//         Keep delivering quality service to build your profile.
//       </p>
//     </div>

//     {/* Rating */}
//     <div className="d-flex align-items-center mb-3">
//       <span className="fw-semibold me-2">Rating:</span>

//       <div className="mb-1 text-warning">
//             {[1, 2, 3, 4, 5].map((star) => (
//              <FaStar
//                key={star}
//                color={star <= booking.review.rating  ? "#ffc107" : "#e4e5e9"}
//              />
//            ))}
//          </div>
//       <span className="ms-2 text-muted small">
//         ({booking.review.rating} / 5)
//       </span>
//     </div>

//     {/* Review */}
//     <div className="border rounded-3 p-3 bg-white">
//       <small className="text-muted d-block mb-1">
//         <FaRegCommentDots className="me-1" />
//         Customer Review
//       </small>

//       <p className="mb-0">
//       {booking.review.review}
//       </p>
//     </div>

//   </div>
// </div>

//       )}

//      </div>
//    </div>
//   )
// }

// export default ProCompleteBooking


import React from "react";
import {
  CiWallet
} from "react-icons/ci";
import {
  TbTransactionRupee
} from "react-icons/tb";
import {
  FaStar,
  FaRegCommentDots,
  FaMoneyBillWave,
  FaGift
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ProCompleteBooking = ({ booking, transaction }) => {
  const navigate = useNavigate();

  const isCash = transaction?.paymentMode === "CASH";

  const fullAmount =
    (booking.quoteAmount || 0) +
    (booking.visitingCharge || 0);

  const discount =
    booking.discountAmount || 0;

  const customerCash =
    booking.offerLocked && booking.finalCustomerPayable
      ? booking.finalCustomerPayable
      : fullAmount;

  const walletImpact =
    discount - transaction?.commission;

  return (
    <div className="container my-4">
      <div className="card border-0 shadow-lg rounded-4 overflow-hidden">

        {/* Header */}
        <div
          className="p-4 text-white"
          style={{
            background:
              "linear-gradient(135deg,#0ea5e9,#22c55e)"
          }}
        >
          <h5 className="fw-bold mb-0">
            Payment Summary
          </h5>
          <small className="opacity-75">
            Booking completed successfully
          </small>
        </div>

        <div className="card-body p-4">

          {/* CASH BREAKDOWN */}
          {isCash && (
            <div className="bg-light rounded-4 p-4 shadow-sm mb-4">

              <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <FaMoneyBillWave />
                Cash Transaction Details
              </h6>

              <div className="d-flex justify-content-between mb-2">
                <span>Cash Received from Customer</span>
                <span className="fw-semibold">
                  ₹{customerCash}
                </span>
              </div>

              {discount > 0 && (
                <div className="d-flex justify-content-between mb-2 text-success">
                  <span className="d-flex align-items-center gap-2">
                    <FaGift />
                    Platform Discount
                  </span>
                  <span>+ ₹{discount}</span>
                </div>
              )}

              <div className="d-flex justify-content-between mb-2 text-danger">
                <span>Platform Commission</span>
                <span>
                  - ₹{transaction?.commission}
                </span>
              </div>

              <hr />

              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold">
                  Final Earnings
                </span>
                <span className="fw-bold text-success">
                  ₹{transaction?.professionalAmount}
                </span>
              </div>

              <div className="mt-2 small text-muted">
                Wallet Adjustment:{" "}
                <strong>
                  {walletImpact >= 0 ? "+" : ""}
                  ₹{walletImpact}
                </strong>
              </div>
            </div>
          )}

          {/* NORMAL TRANSACTION SUMMARY */}
          {!isCash && (
            <div className="bg-light rounded-4 p-4 shadow-sm mb-4">

              <h6 className="fw-bold mb-3">
                Online Payment Details
              </h6>

              <div className="d-flex justify-content-between">
                <span>Service Amount</span>
                <span>₹{transaction?.grossAmount}</span>
              </div>

              <div className="d-flex justify-content-between text-danger">
                <span>Commission</span>
                <span>- ₹{transaction?.commission}</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between fw-bold text-success">
                <span>Added to Wallet</span>
                <span>
                  ₹{transaction?.professionalAmount}
                </span>
              </div>
            </div>
          )}

          <button
            className="btn w-100 fw-semibold rounded-pill"
            style={{
              background:
                "linear-gradient(135deg,#6366f1,#8b5cf6)",
              color: "white"
            }}
            onClick={() => navigate("/professional/home")}
          >
            View Wallet
          </button>

          {/* Review Section */}
          {booking.review && (
            <div className="card border-0 shadow-sm rounded-4 mt-4">
              <div className="card-body p-4">

                <h6 className="fw-bold mb-2">
                  Customer Feedback
                </h6>

                <div className="mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      color={
                        star <= booking.review.rating
                          ? "#ffc107"
                          : "#e4e5e9"
                      }
                    />
                  ))}
                </div>

                <p className="text-muted">
                  {booking.review.review}
                </p>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProCompleteBooking;