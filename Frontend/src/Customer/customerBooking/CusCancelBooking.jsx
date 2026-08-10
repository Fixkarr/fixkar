import React from 'react'

const CusCancelBooking = ({booking}) => {
  const isLateCancellation =
    booking.cancellationType === "late" ||
    (booking.currentPaymentId?.paymentType === "CANCEL" &&
      booking.currentPaymentId?.status === "paid");

  return isLateCancellation ? (
    <div className="card border-danger shadow-sm mt-3">
    <div className="card-body">
      <h5 className="text-danger fw-bold mb-2 text-center">
         Late Cancellation
      </h5>

      <p className="mb-2">
        You cancelled this booking after the professional had started the visit.
      </p>

      <ul className="list-group list-group-flush mb-3">
        <li className="list-group-item d-flex justify-content-between">
          <span>Late Cancellation Fee</span>
          <strong>₹50</strong>
        </li>
        <li className="list-group-item d-flex justify-content-between">
          <span>Professional Visiting Charge</span>
          <strong>₹{booking.visitingCharge}</strong>
        </li>
        <li className="list-group-item d-flex justify-content-between">
          <span>Total paid amount</span>
          <strong>₹{booking.visitingCharge + 50}</strong>
        </li>
      </ul>

      <div className="alert alert-success mb-0">
         Payment completed successfully.  
        The amount has been transferred to the professional.
      </div>
    </div>
  </div>
  ) : (
     <div className="card border-warning shadow-sm mt-3">
            <div className="card-body text-center">
              <h5 className="text-warning fw-bold mb-2">
                Booking Cancelled
              </h5>

              <p className="text-muted mb-1">
                You have cancelled this booking successfully.
              </p>

              <p className="text-muted small">
                No cancellation charges were applied.
              </p>
            </div>
          </div>
  )
}

export default CusCancelBooking
