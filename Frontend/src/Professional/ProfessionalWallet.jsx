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
    <div className="container py-4">
      <div className="card shadow border-0">
        {/* Card Header */}
        <div className="card-header text-white d-flex align-items-center"
            style={{
                  background: "linear-gradient(135deg, #0d6efd, #4f9cff)",
                  border: "none",
                }}
        >
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
                <h4 className="fw-bold text-primary mb-1">₹{wallet?.pendingBalance || 0}</h4>
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
                <h4 className="fw-bold text-primary mb-1">₹{wallet?.totalWithdrawn || 0}</h4>
                <small className="text-muted">Transferred to bank</small>
              </div>
            </div>

            {/* Total Earned */}
            <div className="col-md-4">
              <div className="border rounded p-3 h-100">
                <div className="d-flex align-items-center mb-2">
                  <FaCoins className="text-primary me-2" size={18} />
                  <span className="fw-semibold">Total Earned</span>
                </div>
                <h4 className="fw-bold text-primary mb-1">₹{wallet?.totalEarned || 0}</h4>
                <small className="text-muted">Lifetime earnings</small>
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr className="my-4" />

          {/* Bank Details Section */}
{(bankDetails &&  currentUserData?.user?.bankVerified) &&(
  <div className="card border-0 shadow-sm rounded-4 mb-4">
    <div className="card-body">
      <h6 className="fw-bold text-primary mb-3">
        <FaUniversity className="me-2" />
        Your Bank Details
      </h6>

      <div className="small text-muted">
        <div className="mb-1">
          <strong>Account Holder:</strong>{" "}
          {bankDetails.holderName}
        </div>

        <div className="mb-1">
          <strong>Account Number:</strong>{" "}
          {bankDetails.accountNumber}
        </div>

        <div>
          <strong>IFSC Code:</strong>{" "}
          {bankDetails.ifsc}
        </div>
      </div>

      <div className="mt-2 text-muted small">
        All withdrawals will be transferred to this bank account.
      </div>
    </div>
  </div>
)}


          {/* Action */}

          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body">
              <h5 className="fw-bold mb-3 text-primary">
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
                Available for withdrawal: ₹ {wallet?.pendingBalance}
              </p>

              {/* Request Button */}
              <button
                className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #0d6efd, #4f9cff)",
                  border: "none",
                }}
                onClick={handleWithdrawRequest}
                disabled={loading}
              >
                <BiMoneyWithdraw size={20} />
                Request Withdrawal
              </button>
            </div>

            {wallet?.withdrawnRequest?.pending && (
             <center style={{width : '100%'}}>
               <div
                className="d-flex align-items-start w-100 gap-2 mt-3 p-2 rounded-3 shadow-sm"
                style={{
                  background: "#f5f9ff",
                  border: "1px solid #d6e4ff",
                  maxWidth: "520px",
                }}
              >
                

                <div className="small">
                  <div className="fw-semibold text-primary">
                    <FaClock className="text-primary mt-1" size={16} /> Payment is processing
                  </div>

                  <div className="text-muted">
                    Your withdrawal request of{" "}
                    <span className="fw-semibold text-dark">₹{wallet?.withdrawnRequest?.amount}</span> has
                    been submitted.
                  </div>

                  <div className="text-muted">
                    It may take a few hours to complete the transaction.
                  </div>
                </div>
              </div>
             </center>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalWallet;
