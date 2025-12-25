import React from 'react'
import { formatDate } from '../../utils/formatTime&Date'

const CusAcceptBooking = ({booking}) => {
  return (
     <div className="alert alert-success rounded-4 shadow-sm mt-3">
                    <h6 className="fw-bold mb-2">Booking Confirmed Successfully</h6>
    
                    <p className="mb-2">
                      Your booking has been{" "}
                      <strong>accepted by the professional</strong>. The service is
                      scheduled on <strong>{formatDate(booking.workDate)}</strong>.
                    </p>
    
                    <p className="mb-2">
                      Please ensure that you are available at the service location
                      on the scheduled date so the professional can begin the work
                      without delay.
                    </p>
    
                    <p className="mb-0">
                      <strong>Service Address:</strong> {booking.workAddress}
                    </p>
                  </div>
  )
}

export default CusAcceptBooking
