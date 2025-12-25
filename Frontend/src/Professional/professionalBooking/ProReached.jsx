import React, { useState } from 'react'
import { handleVerifyReachedOtp } from './handleVerifyReachedOtp';

const ProReached = ({booking}) => {
    const [otp, setOtp] = useState("")
  return (
    <div className="container my-4">
  <div className="row justify-content-center">
    <div className="col-md-6 col-lg-5">
      
      <div className="card shadow border-0 rounded-4">
        <div className="card-body p-4 text-center">

          {/* Title */}
          <h5 className="fw-bold text-success mb-2">
             You have reached the client
          </h5>

          {/* Subtitle */}
          <p className="text-muted mb-4">
            Enter OTP sent to your client to verify your arrival
          </p>

          {/* OTP Input */}
         <form  onSubmit={(e) => {
    e.preventDefault();
    handleVerifyReachedOtp(booking._id, otp);
  }}>
           <div className="mb-3">
            <input
              type="number"
              name="otp"
              className="form-control text-center fw-semibold"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e)=>setOtp(e.target.value)}
              maxLength={6}
            />
          </div>

          {/* Verify Button */}
          <button className="btn btn-success w-100 fw-semibold">
            Verify OTP
          </button>
         </form>

          {/* Optional Info */}
          <small className="d-block mt-3 text-muted">
            Didn’t receive OTP? Ask client to check booking information page.
          </small>

        </div>
      </div>

    </div>
  </div>
</div>
  )
}

export default ProReached
