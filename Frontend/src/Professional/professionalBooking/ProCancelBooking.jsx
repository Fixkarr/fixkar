import React from "react";
import { CiWallet } from "react-icons/ci";
import { MdFreeCancellation } from "react-icons/md";

const ProCancelBooking = ({ booking, transaction }) => {
  const isLateCancellation =
    booking.cancellationType === "late" ||
    (booking.currentPaymentId?.paymentType === "CANCEL" &&
      booking.currentPaymentId?.status === "paid");

  return isLateCancellation ? (
    <div className="card border-0 shadow-sm mb-3">
      <div className="card-body">
        <div className="d-flex align-items-center mb-3">
          <div className="bg-warning text-white p-3 rounded-circle d-flex align-items-center justify-content-center">
            <MdFreeCancellation />
          </div>

          <div className="ms-3">
            <h6 className="mb-0 fw-semibold text-warning">
              Booking Cancelled (Late)
            </h6>
            <small className="text-muted">
              Customer cancelled after the scheduled date
            </small>
          </div>
        </div>

        <div className="bg-light rounded p-3 mb-3">
          <div className="d-flex justify-content-between">
            <span className="text-muted">Cancellation Fee</span>
            <span className="fw-semibold">₹50</span>
          </div>

          <div className="d-flex justify-content-between mt-2">
            <span className="text-muted">Visiting Charge</span>
            <span className="fw-semibold">₹{booking.visitingCharge}</span>
          </div>
          <div className="d-flex justify-content-between mt-2">
            <span className="text-muted">Platform Fee</span>
            <span className="fw-semibold text-danger">
              - ₹{transaction?.commission}
            </span>
          </div>

          <hr className="my-2" />

          <div className="d-flex justify-content-between">
            <span className="fw-bold text-success d-flex align-items-center justify-content-between gap-2">
              Added to Wallet{" "}
              <b>
                <CiWallet />
              </b>{" "}
            </span>
            <span className="fw-bold text-success">
              ₹{transaction?.professionalAmount}
            </span>
          </div>
        </div>

        <p className="mb-0 text-muted small">
          The customer cancelled this booking late. The cancellation fee and
          visiting charge have been successfully added to your wallet.
        </p>
      </div>
    </div>
  ) : (
    <div className="card border-0 shadow-sm mb-3">
      <div className="card-body">
        <div className="d-flex align-items-center mb-2">
          <div
            className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: "42px", height: "42px" }}
          >
            <i className="bi bi-x-lg"></i>
          </div>

          <div className="ms-3">
            <h6 className="mb-0 fw-semibold text-secondary">
              Booking Cancelled
            </h6>
            <small className="text-muted">
              Customer cancelled this booking
            </small>
          </div>
        </div>

        <div className="bg-light rounded p-3 mt-3">
          <p className="mb-0 text-muted small">
            This booking was cancelled by the customer before the scheduled
            date. No cancellation or visiting charges were applied.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProCancelBooking;
