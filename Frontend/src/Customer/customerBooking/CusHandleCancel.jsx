import React, { useState } from "react";
import axios from "axios";
import { server_url } from "../../App";
import { toast } from "react-toastify";
import PayButton from "../PayButton";
import { ClipLoader } from "react-spinners";
import { FaExclamationTriangle, FaMoneyBillWave } from "react-icons/fa";
import CancelBookingModal from "../../Components/CancelBookingModal";

const CusHandleCancel = ({ booking }) => {
  const [loading, setLoading] = useState(false);
  const [paymentLocked, setPaymentLocked] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const handleCancel = async (bookingId, visitingCharge) => {
    try {
      setLoading(true);

      const result = await axios.post(
        `${server_url}/api/booking/cancel-booking`,
        { bookingId }
      );

      // 🔴 Late cancellation case
      if (!result.data.success) {
        setLoading(false);

        const toastId = toast.info(
          <div className="p-2">

            {/* Header */}
            <div className="d-flex align-items-center gap-2 mb-2">
              <FaExclamationTriangle className="text-warning fs-4" />
              <h6 className="fw-bold mb-0">Late Cancellation</h6>
            </div>

            <p className="small text-muted">
              This booking is being cancelled after the scheduled date.
              As per policy, visiting charge + cancellation fee must be paid.
            </p>

            {/* Charges */}
            <div className="border rounded-3 p-3 bg-light mb-3">
              <div className="d-flex justify-content-between small">
                <span>Visiting Charge</span>
                <span>₹{visitingCharge}</span>
              </div>

              <div className="d-flex justify-content-between small">
                <span>Cancellation Fee</span>
                <span>₹50</span>
              </div>

              <hr className="my-2" />

              <div className="d-flex justify-content-between fw-bold">
                <span>Total</span>
                <span>₹{visitingCharge + 50}</span>
              </div>
            </div>

            {/* Pay Button */}
            <div className="text-center">
              <PayButton
                bookingId={bookingId}
                paymentType="CANCEL"
                label={`Pay ₹${visitingCharge + 50}`}
                disabled={paymentLocked}
                onSuccess={() => {
                  // ✅ auto close toast
                  toast.dismiss(toastId);
                  setPaymentLocked(true);
                }}
              />
            </div>

          </div>,
          {
            autoClose: false,
            closeOnClick: false,
            draggable: false,
            pauseOnHover: true,
          }
        );

        return;
      }

      toast.success(result.data.message);
      setLoading(false);

    } catch (error) {
      console.error(error.message);
      toast.error("Internal server error!");
      setLoading(false);
    }
  };

  return (
   <>
     <button
      className="btn btn-outline-danger rounded-pill px-3 d-flex align-items-center gap-2"
      disabled={loading || paymentLocked}
      onClick={() =>
        handleCancel(booking._id, booking.visitingCharge)
      }
    >
      {loading ? <ClipLoader size={16} /> : "Cancel Booking"}
    </button>
      <CancelBookingModal
    show={showCancelModal}
    onClose={() => setShowCancelModal(false)}
    onConfirm={handleCancel}
/>
   </>
  );
};

export default CusHandleCancel;
