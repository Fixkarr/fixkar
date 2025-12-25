import React from 'react'
import { CiWallet } from 'react-icons/ci'
import { TbTransactionRupee } from 'react-icons/tb'

const ProCompleteBooking = ({booking, transaction}) => {
  
  return (
    <div className="card border-0 shadow-sm mb-3">
     <div className="card-body">
   
       {/* Header */}
       <div className="d-flex align-items-center mb-3">
         <div
           className="bg-success text-white p-3 rounded-circle d-flex align-items-center justify-content-center"
         >
           <TbTransactionRupee />
         </div>
   
         <div className="ms-3">
           <h6 className="mb-0 fw-semibold text-success">
             Payment Received
           </h6>
           <small className="text-muted">
             Customer has completed the payment
           </small>
         </div>
       </div>
   
       {/* Amount Section */}
       <div className="bg-light rounded p-3 mb-3">
         <div className="d-flex justify-content-between">
           <span className="text-muted">Service Amount</span>
           <span className="fw-semibold">₹{transaction?.grossAmount}</span>
         </div>
   
         <div className="d-flex justify-content-between mt-2">
           <span className="text-muted">Platform Fee</span>
           <span className="text-danger">- ₹{transaction?.commission}</span>
         </div>
   
         <hr className="my-2" />
   
         <div className="d-flex justify-content-between">
           <span className="fw-bold text-success d-flex align-items-center justify-content-between gap-2">Added to Wallet <b><CiWallet/></b> </span>
           <span className="fw-bold text-success">₹{transaction?.professionalAmount}</span>
         </div>
       </div>
   
       {/* Booking Info */}
       <div className="mb-3">
         <small className="text-muted d-block">Booking ID</small>
         <span className="fw-semibold">{booking._id}</span>
       </div>
   
       {/* Actions */}
       <div className="d-flex gap-2">
         <button className="btn btn-success btn-sm w-100">
           View Wallet
         </button>
         <button className="btn btn-outline-secondary btn-sm w-100">
           Booking Details
         </button>
       </div>
   
     </div>
   </div>
  )
}

export default ProCompleteBooking
