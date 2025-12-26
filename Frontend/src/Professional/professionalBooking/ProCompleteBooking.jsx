import React from 'react'
import { CiWallet } from 'react-icons/ci'
import { TbTransactionRupee } from 'react-icons/tb'
import { FaClipboardList, FaRegCommentDots, FaStar } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
const ProCompleteBooking = ({booking, transaction}) => {
    const navigate = useNavigate();
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
  
   
       {/* Actions */}
       <div className="d-flex flex-items-end gap-2">
         <button className="btn btn-primary btn-sm" onClick={()=>navigate('/professional/home')}>
           View Wallet
         </button>
       </div>

      {booking.review && (
        <div className="card border-0 shadow-sm rounded-4 mb-4">
  <div className="card-body p-4">

    {/* Header */}
    <div className="d-flex align-items-center mb-3">
      <div
        className="bg-primary p-3 text-white rounded-circle d-flex align-items-center justify-content-center"
      >
        <FaStar />
      </div>

      <div className="ms-3">
        <h6 className="mb-0 fw-bold text-primary">
          Congratulations!
        </h6>
        <small className="text-muted">
          You have received feedback from the customer
        </small>
      </div>
    </div>

    {/* Message */}
    <div className="bg-light rounded-3 p-3 mb-3">
      <p className="mb-1 fw-semibold">
        Thank you for your service
      </p>
      <p className="mb-0 text-muted small">
        The customer has shared their experience for this booking.
        Keep delivering quality service to build your profile.
      </p>
    </div>

    {/* Rating */}
    <div className="d-flex align-items-center mb-3">
      <span className="fw-semibold me-2">Rating:</span>

      <div className="mb-1 text-warning">
            {[1, 2, 3, 4, 5].map((star) => (
             <FaStar
               key={star}
               color={star <= booking.review.rating  ? "#ffc107" : "#e4e5e9"}
             />
           ))}
         </div>
      <span className="ms-2 text-muted small">
        ({booking.review.rating} / 5)
      </span>
    </div>

    {/* Review */}
    <div className="border rounded-3 p-3 bg-white">
      <small className="text-muted d-block mb-1">
        <FaRegCommentDots className="me-1" />
        Customer Review
      </small>

      <p className="mb-0">
      {booking.review.review}
      </p>
    </div>

  </div>
</div>

      )}

     </div>
   </div>
  )
}

export default ProCompleteBooking
