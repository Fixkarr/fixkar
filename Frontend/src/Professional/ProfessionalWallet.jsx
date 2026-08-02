import React, { useState } from "react";
import {
  FaWallet,
  FaHourglassHalf,
  FaMoneyCheckAlt,
  FaCoins,
  FaUniversity,
} from "react-icons/fa";
import { FaClock} from "react-icons/fa";
import { FaRupeeSign } from "react-icons/fa";
import { BiMoneyWithdraw } from "react-icons/bi";
import useGetProfessionalWallet from "../hooks/useGetProfessionalWallet";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { server_url } from "../App";
import { toast } from "react-toastify";
import { refreshWallet } from "../redux/wallet.slice";

const ProfessionalWallet = () => {
  useGetProfessionalWallet();
  const dispatch = useDispatch()
  const wallets = useSelector((state) => state.wallet.wallet);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const {currentUserData} = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);

  const {
    wallet,
    bankDetails = {}
  } = wallets || {};


  const handleWithdrawRequest = async () => {
    try {
      setLoading(true);
      const result = await axios.post(
        `${server_url}/api/user/professional/send-withdrawn-request`,
        { amount : withdrawAmount },
        { withCredentials: true },
      );
     
      toast.success(result.data.message);
      setLoading(false);
      dispatch(refreshWallet());
      setWithdrawAmount("");
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong!");
      setLoading(false);
    }
  };

 return (
  <div className="professional-wallet h-100">
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
        
        {/* Header */}
        <div
          className="text-white d-flex align-items-center px-3 py-2"
          style={{
            background: "linear-gradient(135deg, #0d6efd, #4f9cff)",
          }}
        >
          <FaWallet size={18} className="me-2" />
          <h6 className="mb-0 fw-semibold">My Wallet</h6>
        </div>

        <div className="card-body p-3">

          {/* Wallet Stats */}
          <div className="row g-2">
            
            {/* Pending */}
            <div className="col-12 col-md-4">
              <div className="p-2 rounded-3 border h-100">
                <div className="d-flex align-items-center mb-1 small">
                  <FaHourglassHalf className="text-primary me-1" size={14} />
                  <span>Pending</span>
                </div>
                <h6 className="fw-bold text-primary mb-0">
                  ₹{wallet?.pendingBalance || 0}
                </h6>
              </div>
            </div>

            {/* Withdrawn */}
            <div className="col-12 col-md-4">
              <div className="p-2 rounded-3 border h-100">
                <div className="d-flex align-items-center mb-1 small">
                  <FaMoneyCheckAlt className="text-primary me-1" size={14} />
                  <span>Withdrawn</span>
                </div>
                <h6 className="fw-bold text-primary mb-0">
                  ₹{wallet?.totalWithdrawn || 0}
                </h6>
              </div>
            </div>

            {/* Earned */}
            <div className="col-12 col-md-4">
              <div className="p-2 rounded-3 border h-100">
                <div className="d-flex align-items-center mb-1 small">
                  <FaCoins className="text-primary me-1" size={14} />
                  <span>Earned</span>
                </div>
                <h6 className="fw-bold text-primary mb-0">
                  ₹{wallet?.totalEarned || 0}
                </h6>
              </div>
            </div>
          </div>

          {/* Bank Details */}
          {(bankDetails && currentUserData?.user?.bankVerified) && (
            <div className="mt-3 p-2 rounded-3 border bg-light">
              <h6 className="fw-semibold text-primary mb-2 small">
                <FaUniversity className="me-1" /> Bank Details
              </h6>

              <div className="small text-muted">
                <div>
                  <strong>Name:</strong> {bankDetails.holderName}
                </div>
                <div>
                  <strong>A/C:</strong> {bankDetails.accountNumber}
                </div>
                <div>
                  <strong>IFSC:</strong> {bankDetails.ifsc}
                </div>
              </div>
            </div>
          )}

          {/* Withdraw Section */}
          <div className="mt-3 p-2 rounded-3 border">
            <h6 className="fw-semibold text-primary mb-2 small">
              <FaWallet className="me-1" /> Withdraw
            </h6>

            <div className="input-group input-group-sm mb-2">
              <span className="input-group-text bg-light">
                <FaRupeeSign size={12} />
              </span>
              <input
                type="number"
                className="form-control"
                placeholder="Enter amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />
            </div>

            <p className="text-muted small mb-2">
              Available: ₹ {wallet?.pendingBalance}
            </p>

            <button
              className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-1"
              style={{
                background: "linear-gradient(135deg, #0d6efd, #4f9cff)",
                border: "none",
                fontSize: "14px",
                padding: "6px",
              }}
              onClick={handleWithdrawRequest}
              disabled={loading}
            >
              <BiMoneyWithdraw size={16} />
              Request
            </button>

            {/* Pending Message */}
            {wallet?.withdrawnRequest?.pending && (
              <div
                className="mt-2 p-2 rounded-3 small"
                style={{
                  background: "#f5f9ff",
                  border: "1px solid #d6e4ff",
                }}
              >
                <div className="fw-semibold text-primary">
                  <FaClock size={14} /> Processing
                </div>
                <div className="text-muted">
                  ₹{wallet?.withdrawnRequest?.amount} request submitted
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
  </div>
);
};

export default ProfessionalWallet;
