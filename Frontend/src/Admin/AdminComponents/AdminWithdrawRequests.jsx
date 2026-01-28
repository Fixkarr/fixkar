import React from "react";
import { FaUserTie, FaRupeeSign } from "react-icons/fa";
import { MdOutlinePayments, MdWorkHistory } from "react-icons/md";
import { BiCheckCircle, BiXCircle } from "react-icons/bi";
import { useState } from "react";
import { useEffect } from "react";
import axios from 'axios';
import { server_url } from "../../App";
import { toast } from "react-toastify";
import PayWithdrawButton from "./Utils/PayWithdrawButton";


const AdminWithdrawRequests = () => {
    const [withdrawRequests, setWithdrawRequests] = useState([]);

    const handlePaymentSuccess = (professionalId) => {
  setWithdrawRequests(prev =>
    prev.filter(req => req.professionalId !== professionalId)
  );
};

    useEffect(()=>{
        const getRequests = async ()=>{
            try {
                const result = await axios.get(`${server_url}/api/admin/get-withdrawn-requests`, {
                    withCredentials : true
                });

                setWithdrawRequests(result.data.requests)

            } catch (error) {
                toast.error(error.response.data.message || "Something went wrong!")
            }
        }
        getRequests()
    },[])

    console.log(withdrawRequests);

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
      <div className="card bg-light text-dark border-0 shadow rounded-4">
        <div className="table-responsive">
          <table className="table table-light table-hover align-middle mb-0">
            <thead>
              <tr className="text-muted">
                <th>#</th>
                <th>Professional</th>
                <th>Requested</th>
                <th>Total Withdrawn</th>
                <th>Pending Balance</th>
                <th>Requested At</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {withdrawRequests.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>

                  <td>
                    <div className="d-flex flex-column">
                      <span className="fw-semibold">
                        <FaUserTie /> {item.professonalName}
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
                  <td className="text-info">
                    <MdWorkHistory /> ₹{item.pendingBalance}
                  </td>

                  <td className="text-muted">
                    {item.requestedAt}
                  </td>

                  <td>
                    <span className="badge bg-warning text-dark">
                      Pending
                    </span>
                  </td>

                  <td>
                    <PayWithdrawButton
                      request={item}
                      onSuccess={handlePaymentSuccess}
                    />
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
