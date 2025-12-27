import React from 'react'
 import { FaStar, FaRegStar, FaUserCircle } from "react-icons/fa";
const ProReviews = ({reviews}) => {
    console.log(reviews);
    
  return (
   <>
{/* ===== Reviews & Ratings Section ===== */}
<div className="card shadow border-0 rounded-4 mt-4">
  
  {/* Header */}
  <div className="card-header bg-primary text-white rounded-top-4 d-flex justify-content-between align-items-center">
    <div>
      <h5 className="mb-0 fw-semibold">Customer Reviews</h5>
      <small className="opacity-75">What customers say about you</small>
    </div>

    <div className="text-end">
      <h4 className="mb-0 fw-bold">4.6</h4>
      <div className="text-warning">
        <FaStar /><FaStar /><FaStar /><FaStar /><FaRegStar />
      </div>
      <small className="opacity-75">(128 reviews)</small>
    </div>
  </div>

  {/* Body */}
  <div className="card-body">

    {/* Review Item */}
    <div className="d-flex gap-3 pb-3 mb-3 border-bottom">
      <FaUserCircle size={42} className="text-secondary" />

      <div className="flex-grow-1">
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0 fw-semibold">Amit Sharma</h6>
          <div className="text-warning">
            <FaStar /><FaStar /><FaStar /><FaStar /><FaRegStar />
          </div>
        </div>

        <p className="text-muted small mt-1 mb-1">
          Very professional and punctual. Work quality was excellent.
          Highly recommended 👍
        </p>

        <small className="text-secondary">2 days ago</small>
      </div>
    </div>

    {/* Review Item */}
    <div className="d-flex gap-3 pb-3 mb-3 border-bottom">
      <FaUserCircle size={42} className="text-success" />

      <div className="flex-grow-1">
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0 fw-semibold">Rohit Verma</h6>
          <div className="text-warning">
            <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
          </div>
        </div>

        <p className="text-muted small mt-1 mb-1">
          Clean work, transparent charges and polite behaviour.
          Will hire again.
        </p>

        <small className="text-secondary">1 week ago</small>
      </div>
    </div>

    {/* Review Item */}
    <div className="d-flex gap-3">
      <FaUserCircle size={42} className="text-primary" />

      <div className="flex-grow-1">
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0 fw-semibold">Neha Gupta</h6>
          <div className="text-warning">
            <FaStar /><FaStar /><FaStar /><FaStar /><FaRegStar />
          </div>
        </div>

        <p className="text-muted small mt-1 mb-1">
          Service was good but reached a bit late.
        </p>

        <small className="text-secondary">3 weeks ago</small>
      </div>
    </div>

  </div>

  {/* Footer */}
  <div className="card-footer bg-light text-center">
    <button className="btn btn-outline-primary btn-sm px-4">
      View All Reviews
    </button>
  </div>
</div>
</>
  )
}

export default ProReviews
