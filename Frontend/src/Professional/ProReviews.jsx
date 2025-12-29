import React, { useState } from 'react'
 import { FaStar, FaRegStar, FaUserCircle } from "react-icons/fa";
const ProReviews = ({reviews}) => {
  const [showReview, setShowReview] = useState(false)
    const renderStars = (rating) => {
  return Array.from({ length: 5 }, (_, index) =>
    index < rating ? <FaStar key={index} /> : <FaRegStar key={index} />
  );
};

  const averageRating =
  reviews?.length > 0
    ? (
        reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      ).toFixed(1)
    : "0.0";

  const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};


  return (
   <>
{/* ===== Reviews & Ratings Section ===== */}
<div className="card shadow border-0 rounded-4 mt-4">
  
  {/* Header */}
  <div className="card-header bg-primary text-white rounded-top-4 d-flex justify-content-between align-items-center">
    <div>
      <h5 className="mb-0 fw-semibold">Customer Reviews</h5>
      <small className="opacity-75">What customers says!</small>
    </div>

    <div className="text-end d-flex gap-3">
      <div>
      <h4 className="mb-0 fw-bold">{averageRating}</h4>
      <div className="text-warning">
        {renderStars(Math.round(averageRating))}
      </div>
      <small className="opacity-75">({reviews.length} reviews)</small>
      </div>
          <div className="card-footer text-center">
          <button className="btn btn-outline-light btn-sm px-4" onClick={()=>setShowReview(!showReview)}>
           {showReview ? 'Hide Reviews' : 'Show Reviews'}
          </button>
      </div>
    </div>
  </div>

  {/* Body */}
  {showReview && <div className="card-body" style={{minHeight : "50vh", overflowY : "scroll"}}>

    {/* Review Item */}
    {reviews.map((rev) => (
          <div
            key={rev._id}
            className="d-flex gap-3 pb-3 mb-3 border-bottom"
          >
            <FaUserCircle size={42} className="text-warning" />

            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0 fw-semibold">
                  {rev.customerName || `User${String(rev.customerId)}`}
                </h6>

                <div className="text-warning">
                  {renderStars(rev.rating)}
                </div>
              </div>

              <p className="text-muted small mt-1 mb-1">
                {rev.review}
              </p>

              <small className="text-secondary">
                {formatDate(rev.createdAt)}
              </small>
            </div>
          </div>
        ))}

  </div>}

  {/* Footer */}
 
</div>
</>
  )
}

export default ProReviews
