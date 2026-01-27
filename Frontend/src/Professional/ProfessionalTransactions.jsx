import React from "react";
import { FaRupeeSign, FaArrowDown, FaArrowUp } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import { HiStatusOnline } from "react-icons/hi";

const transactions = [
  {
    id: 1,
    type: "credit",
    amount: 850,
    date: "22 Jan 2026",
    status: "Success",
    note: "Service Payment",
  },
  {
    id: 2,
    type: "debit",
    amount: 120,
    date: "20 Jan 2026",
    status: "Pending",
    note: "Platform Charge",
  },
  {
    id: 3,
    type: "credit",
    amount: 1500,
    date: "18 Jan 2026",
    status: "Success",
    note: "AC Repair Service",
  },
];

const ProfessionalTransactions = () => {
  return (
    <div className="container-fluid p-3">

      {/* ===== Header ===== */}
      <div
        className="card border-0 shadow rounded-4 mb-4 text-white"
        style={{
          background:
            "linear-gradient(135deg, #0f2027, #2c5364)",
        }}
      >
        <div className="card-body d-flex justify-content-between align-items-center flex-wrap">
          <h5 className="mb-0 fw-bold">💰 Transaction History</h5>
          <span className="badge bg-warning text-dark px-3 py-2 rounded-pill">
            Total Records: {transactions.length}
          </span>
        </div>
      </div>

      {/* ===== Transactions List ===== */}
      <div className="row g-3">
        {transactions.map((item) => (
          <div className="col-md-6 col-lg-4" key={item.id}>
            <div
              className="card border-0 shadow rounded-4 h-100"
              style={{
                background:
                  item.type === "credit"
                    ? "linear-gradient(135deg, #11998e, #38ef7d)"
                    : "linear-gradient(135deg, #ff512f, #dd2476)",
                color: "#fff",
              }}
            >
              <div className="card-body">

                {/* Top */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="fw-semibold">
                    {item.type === "credit" ? (
                      <FaArrowDown />
                    ) : (
                      <FaArrowUp />
                    )}{" "}
                    {item.note}
                  </span>

                  <span
                    className={`badge rounded-pill ${
                      item.status === "Success"
                        ? "bg-success"
                        : item.status === "Pending"
                        ? "bg-warning text-dark"
                        : "bg-danger"
                    }`}
                  >
                    <HiStatusOnline /> {item.status}
                  </span>
                </div>

                {/* Amount */}
                <h3 className="fw-bold mb-2">
                  <FaRupeeSign size={18} /> {item.amount}
                </h3>

                {/* Date */}
                <p className="mb-0 small d-flex align-items-center gap-2">
                  <MdDateRange />
                  {item.date}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfessionalTransactions;
