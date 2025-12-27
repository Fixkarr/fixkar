import React, { useState } from 'react'
import axios from 'axios'
import { server_url } from '../../App';
import { toast } from 'react-toastify';
import PayButton from '../PayButton';
import { ClipLoader } from 'react-spinners';

const CusHandleCancel = ({booking}) => {
    const [loading,setLoading] = useState(false);
    
  const handleCancel = async (bookingId, visitingCharge) => {
    try {
      setLoading(true);
      const result = await axios.post(
        `${server_url}/api/booking/cancel-booking`,
        { bookingId }
      );

      if (!result.data.success) {
        return toast.info(
          <div className="alert alert-info mt-3" role="alert">
            <h6 className="fw-bold mb-2">Late Cancellation Notice</h6>

            <p className="mb-2">
              You are attempting to cancel this booking after the scheduled
              working date. As per our cancellation policy, late cancellations
              require payment of the professional’s visiting charge along with
              an additional cancellation fee.
            </p>

            <p className="mb-3">
              Please note that the booking will be cancelled{" "}
              <strong>
                only after the applicable charges are paid successfully
              </strong>
              . Until the payment is completed, the booking will remain active
              and cannot be cancelled.
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
           <PayButton bookingId={bookingId} paymentType={"CANCEL"} label={`Pay ₹${50 + visitingCharge}`}/>
          </div>,
          {
            autoClose: false, // ❌ auto close band
            closeOnClick: false,
            draggable: false,
            pauseOnHover: true,
            onClose: () => {
              setLoading(false);
            },
          }
        );
      }

      toast.success(result.data.message);
      setLoading(false);
    } catch (error) {
      console.log(error.message);
      toast.error("Internal server error!");
      setLoading(false);
    }
  };
  return (
                <button
                  className="btn btn-outline-danger"
                  disabled={loading}
                  onClick={() =>
                    handleCancel(booking._id, booking.visitingCharge)
                  }
                >
                  {loading && <ClipLoader size={20} />} Cancel
                </button>
  )
}

export default CusHandleCancel
