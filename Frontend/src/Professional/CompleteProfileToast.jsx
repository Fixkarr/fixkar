import React from 'react'
import { useNavigate } from 'react-router-dom'

const CompleteProfileToast = () => {
    const navigate = useNavigate()
  return (
     <div className="alert alert-warning d-flex align-items-center gap-md-3 flex-column flex-md-row p-4 rounded shadow-sm mt-2">
          <div className="flex-grow-1">
            <h5 className="mb-2 fw-bold welcome">Complete Your Profile!</h5>
            <p className="mb-2" style={{ fontSize: "0.8vmax", lineHeight: "1.4" }}>
              Your profile is currently incomplete. Please complete your profile
              so that customers can understand you better, <br /> which will increase
              your chances of getting work.
            </p>

            <ul className="mb-3 ps-3"  style={{ fontSize: "0.8vmax", lineHeight: "1.4" }}>
              {<li>Profile Description missing</li>}
              {<li>Service Charges not set</li>}
              <li>Profile looking incomplete to customers</li>
            </ul>
          </div>

          <button onClick={()=>navigate("/professional/complete-profile")} style={{fontSize : "0.9vmax"}}
            className="btn btn-primary btn-sm px-md-4 py-md-2 m-0 fw-semibold"
          >
            Complete Now
          </button>
        </div>
  )
}

export default CompleteProfileToast
