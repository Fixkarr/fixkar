import React from "react";
import { FaRupeeSign, FaWallet } from "react-icons/fa";
import { MdOutlineDateRange } from "react-icons/md";
import { HiOutlineReceiptTax } from "react-icons/hi";
import { BiTransfer } from "react-icons/bi";
import { FaFileInvoice } from "react-icons/fa6";
import { ClipLoader } from "react-spinners";
import useGetTransaction from "../hooks/useGetTransaction";

const ProfessionalTransactions = ({ proId }) => {
  const { transactions, loading } = useGetTransaction(proId);

  /* ===== Loading State ===== */
  if (loading) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <ClipLoader size={45} color="#0d6efd" />
        <p className="mt-3 text-muted fw-semibold">
          Fetching your transactions...
        </p>
      </div>
    );
  }

  /* ===== Empty State ===== */
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <FaWallet size={40} className="mb-3 text-primary" />
        <h6 className="fw-semibold">No transactions found</h6>
        <small>Your wallet activity will appear here</small>
      </div>
    );
  }

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
            <div className="col-12" key={tx._id}>
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body">

                  {/* ===== Top Row ===== */}
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-bold text-primary">
                      {isCredit ? "Booking Earning" : "Withdrawal"}
                    </span>

                    <span
                      className={`badge rounded-pill px-3 ${
                        isCredit
                          ? "bg-success"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {tx.type}
                    </span>
                  </div>

                  {/* ===== Booking ID ===== */}
                  {isCredit && (
                    <div className="small text-muted mb-2">
                      <FaFileInvoice /> Booking ID:{" "}
                      <span className="fw-semibold text-dark">
                        {tx.bookingId}
                      </span>
                    </div>
                  )}

                  {/* ===== Amount Details ===== */}
                  <ul className="list-unstyled small mb-3">

                    {isCredit && (
                      <>
                        <li className="d-flex justify-content-between">
                          <span className="text-muted">Gross Amount</span>
                          <span className="fw-semibold">
                            <FaRupeeSign /> {tx.grossAmount}
                          </span>
                        </li>

                        <li className="d-flex justify-content-between text-danger">
                          <span>
                            <HiOutlineReceiptTax /> Commission
                          </span>
                          <span className="fw-semibold">
                            - ₹{tx.commission}
                          </span>
                        </li>

                        <li className="d-flex justify-content-between text-success fw-bold">
                          <span>
                            <FaWallet /> Wallet Credit
                          </span>
                          <span>₹{tx.professionalAmount}</span>
                        </li>
                      </>
                    )}

                    {isDebit && (
                      <>
                        <li className="d-flex justify-content-between text-warning fw-bold">
                          <span>
                            <BiTransfer /> Withdrawn
                          </span>
                          <span>- ₹{tx.paymentProof?.amount}</span>
                        </li>

                        <li className="mt-2">
                          <span className="badge bg-light text-dark">
                            Transaction ID:{" "}
                            <span className="fw-semibold">
                              {tx.paymentProof?.UTR}
                            </span>
                          </span>
                        </li>

                        <li className="small text-muted mt-1">
                          Mode:{" "}
                          <span className="fw-semibold">
                            {tx.paymentProof?.mode}
                          </span>
                        </li>
                      </>
                    )}
                  </ul>

                  {/* ===== Date ===== */}
                  <div className="d-flex align-items-center gap-2 small text-muted">
                    <MdOutlineDateRange />
                    {new Date(tx.createdAt).toLocaleString()}
                  </div>
                </div>

                {/* ===== Bottom Gradient ===== */}
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
