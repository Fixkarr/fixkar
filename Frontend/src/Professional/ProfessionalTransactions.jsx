import React from "react";
import { FaRupeeSign, FaWallet } from "react-icons/fa";
import { MdOutlineDateRange } from "react-icons/md";
import { HiOutlineReceiptTax } from "react-icons/hi";
import { BiTransfer } from "react-icons/bi";
import { FaFileInvoice } from "react-icons/fa6";
import useGetTransaction from "../hooks/useGetTransaction";

const ProfessionalTransactions = ({ proId }) => {
  const transactions = useGetTransaction(proId);

  return (
    <div className="container-fluid p-3">

      {/* ===== Header ===== */}
      <div
        className="card border-0 shadow-sm rounded-4 mb-4 text-white"
        style={{
          background: "linear-gradient(135deg,#0d6efd,#4f9cff)",
        }}
      >
        <div className="card-body">
          <h5 className="fw-bold mb-1">Transaction History</h5>
          <small>Wallet credits & withdrawals</small>
        </div>
      </div>

      {/* ===== Transactions ===== */}
      <div className="row g-3">
        {transactions.map((tx) => {
          const isCredit = tx.type === "CREDIT";
          const isDebit = tx.type === "DEBIT";

          return (
            <div className="col-md-6 col-lg-4" key={tx._id}>
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body">

                  {/* Top Row */}
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-semibold text-primary">
                      {isCredit ? "Booking Earning" : "Withdrawal"}
                    </span>

                    <span
                      className={`badge rounded-pill ${
                        isCredit
                          ? "bg-success"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {tx.type}
                    </span>
                  </div>

                  {/* Booking ID */}
                  {isCredit && (
                    <div className="small text-muted mb-2">
                      <FaFileInvoice /> Booking ID:{" "}
                      <span className="fw-semibold">
                        {tx.bookingId}
                      </span>
                    </div>
                  )}

                  {/* Amount Details */}
                  <ul className="list-unstyled small mb-3">

                    {isCredit && (
                      <>
                        <li className="d-flex justify-content-between">
                          <span>Gross Amount</span>
                          <span>
                            <FaRupeeSign /> {tx.grossAmount}
                          </span>
                        </li>

                        <li className="d-flex justify-content-between text-danger">
                          <span>
                            <HiOutlineReceiptTax /> Commission
                          </span>
                          <span>- ₹{tx.commission}</span>
                        </li>

                        <li className="d-flex justify-content-between text-success fw-semibold">
                          <span>
                            <FaWallet /> Wallet Credit
                          </span>
                          <span>₹{tx.professionalAmount}</span>
                        </li>
                      </>
                    )}

                    {isDebit && (
                      <>
                        <li className="d-flex justify-content-between text-warning fw-semibold">
                          <span>
                            <BiTransfer /> Withdrawn
                          </span>
                          <span>- ₹{tx.paymentProof?.amount}</span>
                        </li>

                        <li className="small text-muted mt-2">
                          UTR: <span className="fw-semibold">{tx.paymentProof?.UTR}</span>
                        </li>

                        <li className="small text-muted">
                          Mode: {tx.paymentProof?.mode}
                        </li>
                      </>
                    )}
                  </ul>

                  {/* Date */}
                  <div className="d-flex align-items-center gap-2 small text-muted">
                    <MdOutlineDateRange />
                    {new Date(tx.createdAt).toLocaleString()}
                  </div>
                </div>

                {/* Bottom Gradient */}
                <div
                  style={{
                    height: "5px",
                    borderBottomLeftRadius: "1rem",
                    borderBottomRightRadius: "1rem",
                    background: isCredit
                      ? "linear-gradient(90deg,#28a745,#8fd19e)"
                      : "linear-gradient(90deg,#ff9800,#ffd54f)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfessionalTransactions;
