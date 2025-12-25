import React from 'react'
import { MdHomeRepairService } from 'react-icons/md'
import { formatTime } from '../../utils/formatTime&Date'

const CusInprogress = ({booking}) => {
  return (
    <div className="alert alert-primary rounded-4 shadow-sm mt-3">
        <div className="d-flex align-items-center mb-2">
          <span className="fs-4 me-2"><MdHomeRepairService /></span>
          <h6 className="fw-bold mb-0">Service In Progress</h6>
        </div>
    
        <p className="mb-2">
          <strong>{booking.professionalId.userId.fullName}</strong> has successfully
          arrived at your location and started working on your service request.
        </p>
    
        <div className="border rounded-3 p-3 bg-light mb-2">
          <p className="mb-1">
            <strong>Status:</strong>{" "}
            <span className="text-success fw-semibold">
              Work is currently ongoing
            </span>
          </p>
    
          <p className="mb-1">
            <strong>Started At:</strong>{" "}
            {booking.startedAt
              ? formatTime(booking.startedAt)
              : "Just now"}
          </p>
    
          <p className="mb-0">
            <strong>Service Address:</strong> {booking.workAddress}
          </p>
        </div>
      </div>
  )
}

export default CusInprogress
