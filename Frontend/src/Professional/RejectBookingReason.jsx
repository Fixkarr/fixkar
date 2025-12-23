import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { server_url } from "../App";
import { ClipLoader } from "react-spinners";

const RejectBookingReason = ({bookingId}) => {
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [loading, setLoading] = useState(false);
  const isOtherSelected = reason === "other";
  const isRejectDisabled =
    !reason || (isOtherSelected && otherReason.trim().length < 5);

  const handleReject = async() => {
    const finalReason =
      reason === "other" ? otherReason : reason;

      try {
        setLoading(true);
        console.log(finalReason);
        const result = await axios.post(`${server_url}/api/booking/reject-booking`, {finalReason, bookingId});
        toast.info(result.data.message);
        setLoading(false)
      } catch (error) {
        console.log(error.message);
        toast.error(error.response.data.message)
        setLoading(false)
      }

  };

  return (
    <div className="mt-5">
      {/* SELECT REASON */}
      <label className="form-label fw-semibold">
        Reason for rejecting this booking
      </label>

      <select
        className="form-select mb-3"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      >
        <option value="">-- Select a reason --</option>
        <option value="Location is too far">
          Location is too far
        </option>
        <option value="Unavailable at selected date & time">
          Unavailable at selected date & time
        </option>
        <option value="Job requirements are unclear">
          Job requirements are unclear
        </option>
        <option value="Pricing not suitable for this work">
          Pricing not suitable for this work
        </option>
        <option value="Already booked with another customer">
          Already booked with another customer
        </option>
        <option value="Health or personal issue">
          Health / personal issue
        </option>
        <option value="other">Other (please specify)</option>
      </select>

      {/* OTHER REASON INPUT */}
      {isOtherSelected && (
        <div className="mb-3">
          <label className="form-label">
            Please mention your reason
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Type your reason here..."
            value={otherReason}
            onChange={(e) => setOtherReason(e.target.value)}
          />
          <small className="text-muted">
            Minimum 5 characters required
          </small>
        </div>
      )}

      {/* ACTION BUTTON */}
      <button
        className="btn btn-danger btn-sm rounded-pill px-4"
        disabled={isRejectDisabled || loading}
        onClick={handleReject}
      >
        {loading && <ClipLoader size={20}/>} Confirm Reject
      </button>
    </div>
  );
}

export default RejectBookingReason