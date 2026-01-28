import React, { useState } from "react";
import { BiCheckCircle } from "react-icons/bi";
import axios from "axios";
import { toast } from "react-toastify";
import { server_url } from "../../../App";
import { createPortal } from "react-dom";


const PayWithdrawButton = ({ request, onSuccess }) => {
  const [showModal, setShowModal] = useState(false);
  const [utr, setUtr] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirmPay = async () => {
    if (!utr || !paymentMode) {
      toast.error("UTR and Payment Mode are required");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${server_url}/api/admin/manual-pay`,
        {
          proId: request.professionalId,
          utr,
          paymentMode
        },
        { withCredentials: true }
      );

      toast.success("Payment marked as successful");
      setShowModal(false);
      onSuccess(request.professionalId); // notify parent

    } catch (error) {
      toast.error(error.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* PAY BUTTON */}
      <button
        className="btn btn-success btn-sm"
        disabled={showModal}
        onClick={() => setShowModal(true)}
      >
        <BiCheckCircle /> Pay
      </button>

      {/* MODAL */}
      {showModal && createPortal(
        <div
           className="modal show"
      style={{
        display: "block",
        background: "rgba(0,0,0,0.5)",
        zIndex: 1055
      }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4">

              <div className="modal-header">
                <h5 className="modal-title">
                  Pay ₹{request.requestedAmount}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                />
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Payment Mode</label>
                  <select
                    className="form-select"
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                  >
                    <option value="">Select Mode</option>
                    <option value="UPI">UPI</option>
                    <option value="IMPS">IMPS</option>
                    <option value="NEFT">NEFT</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Transaction ID (UTR)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter UTR"
                    value={utr}
                    onChange={(e) => setUtr(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-success"
                  onClick={handleConfirmPay}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Confirm Pay"}
                </button>
              </div>

            </div>
          </div>
        </div>, document.body
      )}
    </>
  );
};

export default PayWithdrawButton;
