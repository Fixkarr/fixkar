import React from "react";
import { FaUserTie, FaRupeeSign } from "react-icons/fa";
import { MdOutlinePayments, MdWorkHistory } from "react-icons/md";
import { BiCheckCircle, BiXCircle } from "react-icons/bi";

const withdrawRequests = [
  {
    id: 1,
    professionalId: "PRO-10231",
    name: "Rahul Sharma",
    requestedAmount: 5000,
    totalWithdrawn: 22000,
    date: "27 Jan 2026",
    status: "pending",
  },
  {
    id: 2,
    professionalId: "PRO-10218",
    name: "Amit Verma",
    requestedAmount: 3000,
    totalWithdrawn: 18000,
    date: "26 Jan 2026",
    status: "pending",
  },
];

const AdminWithdrawRequests = () => {
  return (
    <div className="container-fluid p-3">

      {/* ===== Header ===== */}
      <div
        className="card border-0 rounded-4 shadow mb-4 text-white"
        style={{
          background: "linear-gradient(135deg, #0f2027, #2c5364)",
        }}
      >
        <div className="card-body d-flex align-items-center justify-content-between">
          <h5 className="fw-bold mb-0">
            <MdOutlinePayments /> Withdraw Requests
          </h5>
          <span className="badge bg-warning text-dark px-3 py-2 rounded-pill">
            Pending: {withdrawRequests.length}
          </span>
        </div>
      </div>

      {/* ===== Table ===== */}
      <div className="card bg-dark text-white border-0 shadow rounded-4">
        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle mb-0">
            <thead>
              <tr className="text-secondary">
                <th>#</th>
                <th>Professional</th>
                <th>Requested</th>
                <th>Total Withdrawn</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {withdrawRequests.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>

                  <td>
                    <div className="d-flex flex-column">
                      <span className="fw-semibold">
                        <FaUserTie /> {item.name}
                      </span>
                      <small className="text-muted">
                        ID: {item.professionalId}
                      </small>
                    </div>
                  </td>

                  <td className="fw-bold text-warning">
                    <FaRupeeSign /> {item.requestedAmount}
                  </td>

                  <td className="text-info">
                    <MdWorkHistory /> ₹{item.totalWithdrawn}
                  </td>

                  <td className="text-muted">
                    {item.date}
                  </td>

                  <td>
                    <span className="badge bg-warning text-dark">
                      Pending
                    </span>
                  </td>

                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-success btn-sm">
                        <BiCheckCircle /> Approve
                      </button>
                      <button className="btn btn-danger btn-sm">
                        <BiXCircle /> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminWithdrawRequests;
