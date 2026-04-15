import React, { useState, useEffect } from "react";

import {
  FaSearch,
  FaTag,
  FaCalendarAlt,
  FaBolt,
  FaPercent,
  FaRupeeSign,
} from "react-icons/fa";
import axios from 'axios'
import {server_url} from '../../App'
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const adminpath = import.meta.env.VITE_ADMIN_PATH
const AllOffers = () => {
  const [offers, setOffers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(()=>{
    const getAllOffers = async ()=>{
        try {
            const res = await axios.get(`${server_url}/api/admin/get-all-offers`, {withCredentials : true})
            setOffers(res?.data?.offers);
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message);
        }
    }

    getAllOffers();
  },[])

  const filteredOffers = offers?.filter((offer) =>
    offer.offerTitle.toLowerCase().includes(search.toLowerCase())
  );

  const handleRemoveOffer = async(offerId)=>{
    try {
      setLoading(true)
      const res = await axios.delete(`${server_url}/api/admin/delete-offer/${offerId}`, {withCredentials : true})
      toast.success(res.data.message || "Offer Removed!")
    } catch (error) {
      toast.error(error.response.data.message || "Internal server error!")
    }finally{
      setLoading(false)
    }
  }

  return (
    <div
      className="container-fluid p-4"
      style={{ background: "#f8fafc", minHeight: "100vh" }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark">Offers Dashboard</h2>
        <div className="text-muted small">Manage offers</div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="input-group" style={{ maxWidth: "350px" }}>
          <span className="input-group-text bg-white border">
            <FaSearch />
          </span>
          <input
            type="text"
            className="form-control border"
            placeholder="Search offers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Cards */}
      <div className="row">
        {filteredOffers.map((offer) => {
          const usagePercent =
            (offer.usedCount / offer.usageLimit) * 100;

          return (
            <div className="col-md-4 mb-4" key={offer._id}>
              <div
                className="p-4 h-100 shadow-sm"
                style={{
                  borderRadius: "16px",
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  transition: "0.3s",
                }}
              >
                {/* Title */}
                <div className="d-flex justify-content-between mb-3">
                  <h5 className="fw-bold text-primary">
                    <FaTag className="me-2" />
                    {offer.offerTitle}
                  </h5>
                  <span
                    className={`badge ${
                      offer.isActive ? "bg-success" : "bg-secondary"
                    }`}
                  >
                    {offer.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* 🔥 Conditional Discount UI */}
                <div className="mb-3">
                  {offer.discountType === "percentage" ? (
                    <div className="d-flex align-items-center gap-2 text-success fw-bold fs-5">
                      <FaPercent /> {offer.discountValue}% OFF
                      <span className="text-muted small">
                        (Max ₹{offer.maxDiscount})
                      </span>
                    </div>
                  ) : (
                    <div className="d-flex align-items-center gap-2 text-success fw-bold fs-5">
                      <FaRupeeSign /> ₹{offer.discountValue} OFF
                    </div>
                  )}
                </div>

                {/* Services */}
                <div className="mb-3 small text-muted">
                  Services:
                  <div className="mt-1">
                    {offer.serviceId.map((s) => (
                      <span
                        key={s._id}
                        className="badge bg-light text-dark me-2 mb-1"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Details */}
                <div className="small text-muted mb-3">
                  Min Booking: ₹{offer.minBookingAmount}
                  <br />
                  Per User Limit: {offer.perUserLimit || 1}
                  <br />
                  {offer.newCustomerOnly && (
                    <span className="text-warning fw-semibold">
                      New Customers Only
                    </span>
                  )}
                </div>

                {/* Usage */}
                <div className="mb-3">
                  <div className="d-flex justify-content-between small mb-1">
                    <span>Usage</span>
                    <span>
                      {offer.usedCount}/{offer.usageLimit}
                    </span>
                  </div>
                  <div className="progress" style={{ height: "6px" }}>
                    <div
                      className="progress-bar bg-primary"
                      style={{ width: `${usagePercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Dates */}
                <div className="small text-muted mb-3">
                  <FaCalendarAlt className="me-1" />
                  {new Date(offer.startDate).toLocaleDateString()} →{" "}
                  {new Date(offer.endDate).toLocaleDateString()}
                </div>

                {/* Action */}
                <button className="btn btn-outline-primary w-100"
                  onClick={()=>navigate(`${adminpath}/offer/update-offer/${offer._id}`)}
                >
                 Update Offer
                </button>
                <button className="btn btn-danger w-100 m-2" disabled={loading} onClick={()=>{
                  handleRemoveOffer(offer._id)
                }}>
                { loading ? "Removing" : "Remove"} Offer
                </button>
              </div>
            </div>
          );
        })}
      </div>

  

      {filteredOffers.length === 0 && (
        <div className="text-center mt-5 text-muted">
          No offers found
        </div>
      )}
    </div>
  );
};

export default AllOffers;