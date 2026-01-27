import React, { useState } from "react";
import {
  FaWallet,
  FaHourglassHalf,
  FaMoneyCheckAlt,
  FaCoins,
} from "react-icons/fa";
import { FaRupeeSign } from "react-icons/fa";
import { BiMoneyWithdraw } from "react-icons/bi";
import useGetProfessionalWallet from "../hooks/useGetProfessionalWallet";
import { useSelector } from "react-redux";

const ProfessionalWallet = () => {
   useGetProfessionalWallet()
const {wallet} = useSelector(state=> state.wallet);
const [withdrawAmount, setWithdrawAmount] = useState('');
  const {
    pendingBalance = 0,
    totalWithdrawn = 0,
    totalEarned = 0,
  } = wallet || {};

  const handleWithdrawRequest = async ()=>{
    try {
      console.log(withdrawAmount);
    } catch (error) {
      
    }
  }

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
               <div className="card border-0 shadow-sm rounded-4">
        

          <h5 className="fw-bold mb-3">
            <FaWallet /> Request Withdrawal
          </h5>

          {/* Amount Input */}
          <div className="input-group mb-3">
            <span className="input-group-text bg-light">
              <FaRupeeSign />
            </span>
            <input
              type="number"
              className="form-control"
              placeholder="Enter amount to withdraw"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
            />
          </div>

          {/* Available Info */}
          <p className="text-muted small mb-3">
            Available for withdrawal: ₹ {pendingBalance}
          </p>

          {/* Request Button */}
          <button
            className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
            style={{
              background: "linear-gradient(135deg, #0d6efd, #4f9cff)",
              border: "none",
            }}
            onClick={handleWithdrawRequest}
          >
            <BiMoneyWithdraw size={20} />
            Request Withdrawal
          </button>

       
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalWallet;
