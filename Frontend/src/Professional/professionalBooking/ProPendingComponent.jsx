import React, { useState } from "react";
import { handleAcceptBooking } from "./handleAcceptBooking";
import { useNavigate } from "react-router-dom";
import RejectBookingReason from "../RejectBookingReason";

const ProPendingComponent = ({ booking }) => {
  const [showRejectDiv, setShowRejectDiv] = useState(false);
    const navigate = useNavigate()
  return (
    <>
      <div>
        <button
          className="btn btn-success btn-sm rounded-pill px-4"
          onClick={() => handleAcceptBooking(booking._id)}
        >
          Accept
        </button>
        <button
          className="btn btn-outline-danger btn-sm rounded-pill px-4"
          onClick={() => setShowRejectDiv(!showRejectDiv)}
        >
          Reject
        </button>

        <button
          className="btn btn-outline-primary btn-sm rounded-pill px-4"
          onClick={() => {
            navigate(`/professional/chat/${booking.customerId.userId._id}`);
          }}
        >
          Message
        </button>
      </div>
      {showRejectDiv && <RejectBookingReason bookingId={booking._id} />}
    </>
  );
};

export default ProPendingComponent;
