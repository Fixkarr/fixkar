import React from "react";
import {
  FaWallet,
  FaHourglassHalf,
  FaMoneyCheckAlt,
  FaCoins,
} from "react-icons/fa";
import useGetProfessionalWallet from "../hooks/useGetProfessionalWallet";
import { useSelector } from "react-redux";

const ProfessionalWallet = () => {
   useGetProfessionalWallet()
const {wallet} = useSelector(state=> state.wallet);
  const {
    pendingBalance = 0,
    totalWithdrawn = 0,
    totalEarned = 0,
  } = wallet || {};

  return (
    <div className="container py-4">
      <div className="card shadow border-0">
        {/* Card Header */}
        <div className="card-header bg-primary text-white d-flex align-items-center">
          <FaWallet size={22} className="me-2" />
          <h5 className="mb-0 fw-semibold">My Wallet</h5>
        </div>

        {/* Card Body */}
        <div className="card-body">
          <div className="row g-4">
            {/* Pending */}
            <div className="col-md-4">
              <div className="border rounded p-3 h-100">
                <div className="d-flex align-items-center mb-2">
                  <FaHourglassHalf className="text-primary me-2" size={18} />
                  <span className="fw-semibold">Pending Amount</span>
                </div>
                <h4 className="fw-bold text-primary mb-1">
                  ₹{pendingBalance}
                </h4>
                <small className="text-muted">
                  Available after job completion
                </small>
              </div>
            </div>

            {/* Withdrawn */}
            <div className="col-md-4">
              <div className="border rounded p-3 h-100">
                <div className="d-flex align-items-center mb-2">
                  <FaMoneyCheckAlt className="text-primary me-2" size={18} />
                  <span className="fw-semibold">Withdrawn</span>
                </div>
                <h4 className="fw-bold text-primary mb-1">
                  ₹{totalWithdrawn}
                </h4>
                <small className="text-muted">
                  Transferred to bank
                </small>
              </div>
            </div>

            {/* Total Earned */}
            <div className="col-md-4">
              <div className="border rounded p-3 h-100">
                <div className="d-flex align-items-center mb-2">
                  <FaCoins className="text-primary me-2" size={18} />
                  <span className="fw-semibold">Total Earned</span>
                </div>
                <h4 className="fw-bold text-primary mb-1">
                  ₹{totalEarned}
                </h4>
                <small className="text-muted">
                  Lifetime earnings
                </small>
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr className="my-4" />

          {/* Action */}
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              Minimum withdrawal amount ₹500
            </small>
            <button className="btn btn-primary px-4">
              Request Withdrawal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalWallet;
