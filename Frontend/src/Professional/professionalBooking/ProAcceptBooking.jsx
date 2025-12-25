import React from 'react'
import { formatDate, formatTime } from '../../utils/formatTime&Date'

const ProAcceptBooking = ({booking}) => {
  return (
     <div className="alert alert-success rounded-4 shadow-sm mt-3">
          <h6 className="fw-bold mb-2">
             Booking Assigned!
          </h6>
        
          <p className="mb-2">
            You have been successfully booked for a service on
            <strong> {formatDate(booking.workDate)}</strong>.
          </p>
        
          <p className="mb-2">
            Please ensure that you reach the service location
            <strong> before {formatTime(booking.workTime)}</strong> to provide a smooth experience
            to the customer.
          </p>
        
          <p className="mb-0">
            <strong>Service Address:</strong> {booking.workAddress}
          </p>
        
          <small className="text-muted d-block mt-2">
            Best of luck! We wish you a successful service visit.
          </small>
        </div>
  )
}

export default ProAcceptBooking
