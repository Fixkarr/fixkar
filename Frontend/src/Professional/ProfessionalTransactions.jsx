import React, { useTransition } from "react";
import { FaRupeeSign, FaWallet } from "react-icons/fa";
import { MdOutlineDateRange } from "react-icons/md";
import { HiOutlineReceiptTax } from "react-icons/hi";
import { BiTransfer } from "react-icons/bi";
import useGetTransaction from "../hooks/useGetTransaction";


const ProfessionalTransactionHistory = ({proId}) => {
  const transaction = useGetTransaction(proId);
  console.log(transaction);
  return (
    // <div className="container-fluid p-3">

    //   {/* ===== Header ===== */}
    //   <div
    //     className="card border-0 shadow-sm rounded-4 mb-4"
    //     style={{
    //       background: "linear-gradient(135deg, #0d6efd, #4f9cff)",
    //       color: "#fff",
    //     }}
    //   >
    //     <div className="card-body">
    //       <h5 className="fw-bold mb-1">💼 Transaction Details</h5>
    //       <small>Booking wise earning & withdraw history</small>
    //     </div>
    //   </div>

    //   {/* ===== Transaction Cards ===== */}
    //   <div className="row g-3">
    //     {transactions.map((item) => (
    //       <div className="col-md-6 col-lg-4" key={item.id}>
    //         <div className="card border-0 shadow-sm rounded-4 h-100">
    //           <div className="card-body">

    //             {/* Booking Info */}
    //             <div className="d-flex justify-content-between mb-2">
    //               <span className="fw-semibold text-primary">
    //                 Booking ID: {item.bookingId}
    //               </span>
    //               <span
    //                 className={`badge rounded-pill ${
    //                   item.transactionType === "WITHDRAW"
    //                     ? "bg-warning text-dark"
    //                     : "bg-success"
    //                 }`}
    //               >
    //                 {item.transactionType}
    //               </span>
    //             </div>

    //             <p className="text-muted small mb-3">
    //               {item.service}
    //             </p>

    //             {/* Amount Details */}
    //             <ul className="list-unstyled small mb-3">
    //               <li className="d-flex justify-content-between">
    //                 <span>Booking Amount</span>
    //                 <span>
    //                   <FaRupeeSign /> {item.bookingAmount}
    //                 </span>
    //               </li>

    //               <li className="d-flex justify-content-between text-danger">
    //                 <span>
    //                   <HiOutlineReceiptTax /> Commission
    //                 </span>
    //                 <span>- ₹{item.commission}</span>
    //               </li>

    //               <li className="d-flex justify-content-between text-success fw-semibold">
    //                 <span>
    //                   <FaWallet /> Wallet Credit
    //                 </span>
    //                 <span>₹{item.creditedToWallet}</span>
    //               </li>

    //               {item.withdrawnAmount > 0 && (
    //                 <li className="d-flex justify-content-between text-warning fw-semibold">
    //                   <span>
    //                     <BiTransfer /> Withdrawn
    //                   </span>
    //                   <span>- ₹{item.withdrawnAmount}</span>
    //                 </li>
    //               )}
    //             </ul>

    //             {/* Date */}
    //             <div className="d-flex align-items-center gap-2 small text-muted">
    //               <MdOutlineDateRange />
    //               {item.date}
    //             </div>
    //           </div>

    //           {/* Bottom Indicator */}
    //           <div
    //             style={{
    //               height: "5px",
    //               borderBottomLeftRadius: "1rem",
    //               borderBottomRightRadius: "1rem",
    //               background:
    //                 item.transactionType === "WITHDRAW"
    //                   ? "linear-gradient(90deg, #ff9800, #ffd54f)"
    //                   : "linear-gradient(90deg, #28a745, #8fd19e)",
    //             }}
    //           />
    //         </div>
    //       </div>
    //     ))}
    //   </div>
    // </div>
    <h1>Transaction</h1>
  );
};

export default ProfessionalTransactionHistory;
