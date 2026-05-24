import React, { useMemo, useState } from "react";

import { MdPayments, MdOutlineAccountBalanceWallet } from "react-icons/md";
import { BsCashStack } from "react-icons/bs";
import { FaArrowTrendDown, FaArrowTrendUp, FaClockRotateLeft } from "react-icons/fa6";
import { FaFilter, FaMoneyBillWave, FaSearch, FaWallet } from "react-icons/fa";

const ManagePlatformTransactions = ({ platformTransactions = [], revenueHealth}) => {
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState("ALL");

  // =========================
  // FILTERED DATA
  // =========================

  const filteredTransactions = useMemo(() => {
    return platformTransactions.filter((item) => {
      const matchesSearch =
        item.bookingId.toLowerCase().includes(search.toLowerCase()) ||
        item.paymentId.toLowerCase().includes(search.toLowerCase());

      const matchesMode =
        filterMode === "ALL"
          ? true
          : item.paymentMode === filterMode;

      return matchesSearch && matchesMode;
    });
  }, [platformTransactions, search, filterMode]);

  // =========================
  // ANALYTICS
  // =========================

  const analytics = useMemo(() => {
    let totalRevenue = 0;
    let totalPayout = 0;
    let totalDiscount = 0;
    let totalProfit = 0;
    let totalLoss = 0;

    platformTransactions.forEach((item) => {
      totalRevenue += item.commission;
      totalPayout += item.professionalAmount;
      totalDiscount += item.discountAmount;

      if (item.profitOrLoss > 0) {
        totalProfit += item.profitOrLoss;
      } else {
        totalLoss += Math.abs(item.profitOrLoss);
      }
    });

    return {
      totalRevenue,
      totalPayout,
      totalDiscount,
      totalProfit,
      totalLoss,
    };
  }, [platformTransactions]);

  return (
    <div
      className="container-fluid py-4"
      style={{
        background: "#0f172a",
        minHeight: "100vh",
        color: "white",
      }}
    >
      {/* HEADER */}

      <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
        <div>
          <h2 className="fw-bold mb-1">
            Platform Transactions
          </h2>

          <p
            className="mb-0"
            style={{
              color: "#94a3b8",
            }}
          >
            Monitor revenue, profits, losses & payouts
          </p>
        </div>

        <div
          className="d-flex align-items-center gap-2 px-3 py-2 rounded-4"
          style={{
            background: "#1e293b",
            border: "1px solid #334155",
          }}
        >
          <FaClockRotateLeft />
          <span style={{ fontSize: "0.9rem" }}>
            Total Transactions : {platformTransactions.length}
          </span>
        </div>
      </div>

      {/* ANALYTICS CARDS */}

      <div className="row g-4 mb-4">

  {/* TOTAL REVENUE */}

  <div className="col-xl-3 col-md-6">
    <div
      className="p-4 rounded-4 h-100"
      style={{
        background:
          "linear-gradient(135deg,#0ea5e9,#2563eb)",
        boxShadow:
          "0 10px 30px rgba(37,99,235,0.25)",
      }}
    >
      <div className="d-flex justify-content-between align-items-center">

        <div>

          <p className="mb-1 opacity-75">
            Total Revenue
          </p>

          <h3 className="fw-bold">
            ₹{revenueHealth?.totalRevenue || 0}
          </h3>

          <small className="opacity-75">
            Commission earnings
          </small>

        </div>

        <FaMoneyBillWave size={35} />

      </div>
    </div>
  </div>

  {/* ADMIN CURRENT BALANCE */}

  <div className="col-xl-3 col-md-6">
    <div
      className="p-4 rounded-4 h-100"
      style={{
        background:
          "linear-gradient(135deg,#8b5cf6,#6d28d9)",
        boxShadow:
          "0 10px 30px rgba(139,92,246,0.25)",
      }}
    >
      <div className="d-flex justify-content-between align-items-center">

        <div>

          <p className="mb-1 opacity-75">
            Admin Balance
          </p>

          <h3 className="fw-bold">
            ₹{revenueHealth?.adminCurrentBalance || 0}
          </h3>

          <small className="opacity-75">
            Current money with admin
          </small>

        </div>

        <FaWallet size={35} />

      </div>
    </div>
  </div>

  {/* PENDING PAYOUTS */}

  <div className="col-xl-3 col-md-6">
    <div
      className="p-4 rounded-4 h-100"
      style={{
        background:
          "linear-gradient(135deg,#f59e0b,#d97706)",
        boxShadow:
          "0 10px 30px rgba(245,158,11,0.25)",
      }}
    >
      <div className="d-flex justify-content-between align-items-center">

        <div>

          <p className="mb-1 opacity-75">
            Pending Payouts
          </p>

          <h3 className="fw-bold">
            ₹{revenueHealth?.totalPendingPayouts || 0}
          </h3>

          <small className="opacity-75">
            Yet to transfer
          </small>

        </div>

        <MdOutlineAccountBalanceWallet size={38} />

      </div>
    </div>
  </div>

  {/* AVAILABLE PLATFORM BALANCE */}

  <div className="col-xl-3 col-md-6">
    <div
      className="p-4 rounded-4 h-100"
      style={{
        background:
          revenueHealth?.availablePlatformBalance >= 0
            ? "linear-gradient(135deg,#22c55e,#15803d)"
            : "linear-gradient(135deg,#ef4444,#b91c1c)",

        boxShadow:
          revenueHealth?.availablePlatformBalance >= 0
            ? "0 10px 30px rgba(34,197,94,0.25)"
            : "0 10px 30px rgba(239,68,68,0.25)",
      }}
    >
      <div className="d-flex justify-content-between align-items-center">

        <div>

          <p className="mb-1 opacity-75">
            Available Balance
          </p>

          <h3 className="fw-bold">
            ₹{revenueHealth?.availablePlatformBalance || 0}
          </h3>

          <small className="opacity-75">
            After pending payouts
          </small>

        </div>

        {revenueHealth?.availablePlatformBalance >= 0 ? (
          <FaArrowTrendUp size={35} />
        ) : (
          <FaArrowTrendDown size={35} />
        )}

      </div>
    </div>
  </div>

  {/* TOTAL PROFIT */}

  <div className="col-xl-3 col-md-6">
    <div
      className="p-4 rounded-4 h-100"
      style={{
        background:
          "linear-gradient(135deg,#22c55e,#15803d)",
        boxShadow:
          "0 10px 30px rgba(34,197,94,0.25)",
      }}
    >
      <div className="d-flex justify-content-between align-items-center">

        <div>

          <p className="mb-1 opacity-75">
            Total Profit
          </p>

          <h3 className="fw-bold">
            ₹{revenueHealth?.totalProfit || 0}
          </h3>

          <small className="opacity-75">
            Net positive earnings
          </small>

        </div>

        <FaArrowTrendUp size={35} />

      </div>
    </div>
  </div>

  {/* TOTAL LOSS */}

  <div className="col-xl-3 col-md-6">
    <div
      className="p-4 rounded-4 h-100"
      style={{
        background:
          "linear-gradient(135deg,#ef4444,#b91c1c)",
        boxShadow:
          "0 10px 30px rgba(239,68,68,0.25)",
      }}
    >
      <div className="d-flex justify-content-between align-items-center">

        <div>

          <p className="mb-1 opacity-75">
            Total Loss
          </p>

          <h3 className="fw-bold">
            ₹{revenueHealth?.totalLoss || 0}
          </h3>

          <small className="opacity-75">
            Offer & platform losses
          </small>

        </div>

        <FaArrowTrendDown size={35} />

      </div>
    </div>
  </div>

  {/* ONLINE RECEIVED */}

  <div className="col-xl-3 col-md-6">
    <div
      className="p-4 rounded-4 h-100"
      style={{
        background:
          "linear-gradient(135deg,#14b8a6,#0f766e)",
        boxShadow:
          "0 10px 30px rgba(20,184,166,0.25)",
      }}
    >
      <div className="d-flex justify-content-between align-items-center">

        <div>

          <p className="mb-1 opacity-75">
            Online Received
          </p>

          <h3 className="fw-bold">
            ₹{revenueHealth?.totalOnlineReceived || 0}
          </h3>

          <small className="opacity-75">
            Received via online payments
          </small>

        </div>

        <MdOutlineAccountBalanceWallet size={35} />

      </div>
    </div>
  </div>

  {/* CASH HANDLED */}

  <div className="col-xl-3 col-md-6">
    <div
      className="p-4 rounded-4 h-100"
      style={{
        background:
          "linear-gradient(135deg,#ec4899,#be185d)",
        boxShadow:
          "0 10px 30px rgba(236,72,153,0.25)",
      }}
    >
      <div className="d-flex justify-content-between align-items-center">

        <div>

          <p className="mb-1 opacity-75">
            Cash Handled
          </p>

          <h3 className="fw-bold">
            ₹{revenueHealth?.totalCashHandled || 0}
          </h3>

          <small className="opacity-75">
            Direct cash transactions
          </small>

        </div>

        <FaWallet size={35} />

      </div>
    </div>
  </div>

</div>

      {/* FILTERS */}

      <div
        className="p-3 rounded-4 mb-4"
        style={{
          background: "#1e293b",
          border: "1px solid #334155",
        }}
      >
        <div className="row g-3 align-items-center">
          {/* SEARCH */}

          <div className="col-lg-6">
            <div
              className="d-flex align-items-center px-3 py-2 rounded-4"
              style={{
                background: "#0f172a",
                border: "1px solid #334155",
              }}
            >
              <FaSearch className="me-2 text-secondary" />

              <input
                type="text"
                placeholder="Search by booking/payment id..."
                className="form-control border-0 bg-transparent text-white shadow-none"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>
          </div>

          {/* FILTER */}

          <div className="col-lg-3">
            <div
              className="d-flex align-items-center px-3 py-2 rounded-4"
              style={{
                background: "#0f172a",
                border: "1px solid #334155",
              }}
            >
              <FaFilter className="me-2 text-secondary" />

              <select
                className="form-select bg-transparent border-0 text-white shadow-none"
                value={filterMode}
                onChange={(e) =>
                  setFilterMode(e.target.value)
                }
              >
                <option value="ALL" className="bg-dark">
                  All Payments
                </option>

                <option
                  value="ONLINE"
                  className="bg-dark"
                >
                  Online
                </option>

                <option
                  value="CASH"
                  className="bg-dark"
                >
                  Cash
                </option>
              </select>
            </div>
          </div>

          {/* DISCOUNT */}

          <div className="col-lg-3">
            <div
              className="rounded-4 px-3 py-2 d-flex align-items-center justify-content-between"
              style={{
                background: "#0f172a",
                border: "1px solid #334155",
              }}
            >
              <div>
                <small className="text-secondary">
                  Offer Discounts
                </small>

                <h6 className="mb-0 mt-1">
                  ₹{analytics.totalDiscount}
                </h6>
              </div>

              <BsCashStack size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}

      <div
        className="table-responsive rounded-4"
        style={{
          background: "#1e293b",
          border: "1px solid #334155",
        }}
      >
        <table className="table align-middle mb-0 text-white">
          <thead
            style={{
              background: "#0f172a",
            }}
          >
            <tr>
              <th>Booking</th>
              <th>Payment</th>
              <th>Mode</th>
              <th>Gross</th>
              <th>Customer Paid</th>
              <th>Commission</th>
              <th>Professional</th>
              <th>Discount</th>
              <th>Profit/Loss</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((item) => (
                <tr
                  key={item._id}
                  style={{
                    borderColor: "#334155",
                  }}
                >
                  {/* BOOKING */}

                  <td>
                    <div>
                      <p className="fw-semibold mb-1">
                        #{item.bookingId.slice(-6)}
                      </p>

                      <small className="text-secondary">
                        {item.bookingId}
                      </small>
                    </div>
                  </td>

                  {/* PAYMENT */}

                  <td>
                    <div>
                      <p className="fw-semibold mb-1">
                        #{item.paymentId.slice(-6)}
                      </p>

                      <small className="text-secondary">
                        {item.paymentId}
                      </small>
                    </div>
                  </td>

                  {/* MODE */}

                  <td>
                    <span
                      className={`badge px-3 py-2 ${
                        item.paymentMode === "ONLINE"
                          ? "bg-primary"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {item.paymentMode === "ONLINE" ? (
                        <MdPayments className="me-1" />
                      ) : (
                        <FaWallet className="me-1" />
                      )}

                      {item.paymentMode}
                    </span>
                  </td>

                  {/* GROSS */}

                  <td className="fw-semibold">
                    ₹{item.grossAmount}
                  </td>

                  {/* CUSTOMER */}

                  <td>
                    ₹{item.customerPaidAmount}
                  </td>

                  {/* COMMISSION */}

                  <td className="text-info fw-bold">
                    ₹{item.commission}
                  </td>

                  {/* PROFESSIONAL */}

                  <td className="text-warning fw-bold">
                    ₹{item.professionalAmount}
                  </td>

                  {/* DISCOUNT */}

                  <td className="text-danger fw-semibold">
                    ₹{item.discountAmount}
                  </td>

                  {/* PROFIT / LOSS */}

                  <td>
                    <span
                      className={`badge px-3 py-2 ${
                        item.profitOrLoss >= 0
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {item.profitOrLoss >= 0
                        ? `+₹${item.profitOrLoss}`
                        : `-₹${Math.abs(
                            item.profitOrLoss
                          )}`}
                    </span>
                  </td>

                  {/* DATE */}

                  <td>
                    <small className="text-secondary">
                      {new Date(
                        item.createdAt
                      ).toLocaleString()}
                    </small>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={10}
                  className="text-center py-5 text-secondary"
                >
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagePlatformTransactions;