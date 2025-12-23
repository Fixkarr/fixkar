export const CheckCancelationDate = ({cancelationData, visitingCharge}) => {
  console.log(cancelationData)
  if (cancelationData) {
    return <div className="alert alert-success d-flex align-items-start gap-2 mt-3" role="alert">
  <i className="bi bi-check-circle-fill fs-5"></i>
  <div>
    <strong>Booking Cancelled</strong>
    <p className="mb-0">
      This booking has been successfully cancelled by you.
      No cancellation charges have been applied.
    </p>
  </div>
</div>
}else{
   (
  <div className="alert alert-warning mt-3" role="alert">
  <h6 className="fw-bold mb-2">Late Cancellation Notice</h6>

  <p className="mb-2">
    You are attempting to cancel this booking after the scheduled working date.
    As per our cancellation policy, late cancellations require payment of the
    professional’s visiting charge along with an additional cancellation fee.
  </p>

  <p className="mb-3">
    Please note that the booking will be cancelled <strong>only after the
    applicable charges are paid successfully</strong>. Until the payment is
    completed, the booking will remain active and cannot be cancelled.
  </p>

  <div className="border rounded p-2 mb-3 bg-light">
    <div className="d-flex justify-content-between">
      <span>Professional Visiting Charge</span>
      <span>₹{visitingCharge}</span>
    </div>

    <div className="d-flex justify-content-between">
      <span>Late Cancellation Fee</span>
      <span>₹50</span>
    </div>

    <hr className="my-2" />

    <div className="d-flex justify-content-between fw-bold">
      <span>Total Payable Amount</span>
      <span>₹{visitingCharge + 50}</span>
    </div>
  </div>

  <button className="btn btn-warning w-100 fw-semibold">
    Pay Now
  </button>
</div>

);
}
 
}
