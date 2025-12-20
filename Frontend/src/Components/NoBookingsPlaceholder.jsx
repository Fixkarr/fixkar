import React from "react";
import { FaClipboardList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const NoBookingsPlaceholder = () => {
    const navigate = useNavigate();
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body text-center p-5">
              <div className="mb-3">
                <FaClipboardList size={50} className="text-primary" />
              </div>

              <h5 className="fw-semibold mb-2">No Bookings found</h5>

              <p className="text-muted mb-4">There is no any bookings yet.</p>

              {/* Optional CTA */}
              <button className="btn btn-outline-primary rounded-pill px-4" onClick={()=>{
                navigate(-1)
              }}>
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
}

export default NoBookingsPlaceholder

