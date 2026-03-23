import React, { useEffect, useState } from "react";

import {
  FaSearch,
  FaTag,
  FaCalendarAlt,
  FaBolt,
} from "react-icons/fa";
import axios from 'axios'
import {server_url} from '../../App'

const dummyOffers = [
  {
    _id: "1",
    offerTitle: "Festive Offer",
    service: "Electrician",
    discountType: "percentage",
    discountValue: 20,
    minBookingAmount: 200,
    maxDiscount: 100,
    startDate: "2026-03-01",
    endDate: "2026-03-30",
    usageLimit: 100,
    usedCount: 20,
    isActive: true,
  },
  {
    _id: "2",
    offerTitle: "Summer Sale",
    service: "Plumber",
    discountType: "flat",
    discountValue: 50,
    minBookingAmount: 300,
    maxDiscount: 50,
    startDate: "2026-04-01",
    endDate: "2026-04-20",
    usageLimit: 50,
    usedCount: 10,
    isActive: false,
  },
  {
    _id: "3",
    offerTitle: "New User Offer",
    service: "AC Repair",
    discountType: "percentage",
    discountValue: 15,
    minBookingAmount: 500,
    maxDiscount: 150,
    startDate: "2026-03-10",
    endDate: "2026-04-10",
    usageLimit: 200,
    usedCount: 60,
    isActive: true,
  },
];

const AllOffers = () => {
  const [offers] = useState(dummyOffers);
  const [search, setSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(()=>{
    const getAllOffers = async ()=>{
        try {
            const res = await axios.get(`${server_url}/api/admin/get-all-offers`, {withCredentials : true})
            console.log(res);
        } catch (error) {
            console.log(error)
        }
    }

    getAllOffers();
  },[])

  const filteredOffers = offers.filter((offer) => {
    return (
      offer.offerTitle.toLowerCase().includes(search.toLowerCase()) &&
      (serviceFilter ? offer.service === serviceFilter : true) &&
      (statusFilter
        ? statusFilter === "active"
          ? offer.isActive
          : !offer.isActive
        : true)
    );
  });

  return (
    <div
      className="container-fluid p-4"
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark">
          Offers Dashboard
        </h2>
        <div className="text-muted small">
          Manage all your offers efficiently
        </div>
      </div>

      {/* Filters */}
      <div
        className="p-3 mb-4 shadow-sm"
        style={{
          background: "#ffffff",
          borderRadius: "12px",
        }}
      >
        <div className="row g-3">
          <div className="col-md-4">
            <div className="input-group">
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

          <div className="col-md-3">
            <select
              className="form-select border"
              onChange={(e) => setServiceFilter(e.target.value)}
            >
              <option value="">All Services</option>
              <option>Electrician</option>
              <option>Plumber</option>
              <option>AC Repair</option>
            </select>
          </div>

          <div className="col-md-3">
            <select
              className="form-select border"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
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
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  transition: "0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 25px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                {/* Title */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0 text-primary">
                    <FaTag className="me-2" /> {offer.offerTitle}
                  </h5>
                  <span
                    className={`badge ${
                      offer.isActive ? "bg-success" : "bg-secondary"
                    }`}
                  >
                    {offer.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Service */}
                <div className="mb-2 text-muted small">
                  Service: <strong>{offer.service}</strong>
                </div>

                {/* Discount */}
                <div className="mb-2">
                  <span className="text-success fw-semibold">
                    {offer.discountType === "percentage"
                      ? `${offer.discountValue}% OFF`
                      : `₹${offer.discountValue} OFF`}
                  </span>
                </div>

                {/* Details */}
                <div className="small text-muted mb-3">
                  Min: ₹{offer.minBookingAmount} | Max: ₹
                  {offer.maxDiscount}
                </div>

                {/* Progress */}
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
                  {offer.startDate} → {offer.endDate}
                </div>

                {/* Action */}
                <button className="btn btn-outline-primary w-100">
                  <FaBolt className="me-1" /> Manage Offer
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