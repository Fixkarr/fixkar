import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaSearch,
  FaTag,
  FaCalendarAlt,
  FaBolt,
} from "react-icons/fa";

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
        background: "linear-gradient(135deg, #0f172a, #020617)",
        color: "#fff",
      }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">
          <span style={{ color: "#38bdf8" }}>Offers</span> Dashboard
        </h2>
        <div className="text-secondary small">
          Manage all your offers efficiently 🚀
        </div>
      </div>

      {/* Filters Card */}
      <div
        className="p-3 mb-4"
        style={{
          background: "rgba(255,255,255,0.05)",
          borderRadius: "12px",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="row g-3">
          <div className="col-md-4">
            <div className="input-group">
              <span className="input-group-text bg-dark text-white border-0">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control bg-dark text-white border-0"
                placeholder="Search offers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-3">
            <select
              className="form-select bg-dark text-white border-0"
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
              className="form-select bg-dark text-white border-0"
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
                className="p-4 h-100"
                style={{
                  borderRadius: "16px",
                  background:
                    "linear-gradient(145deg, rgba(30,41,59,0.8), rgba(2,6,23,0.9))",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(15px)",
                  transition: "0.3s",
                }}
              >
                {/* Title */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0 text-info">
                    <FaTag /> {offer.offerTitle}
                  </h5>
                  <span
                    className={`badge ${
                      offer.isActive ? "bg-success" : "bg-danger"
                    }`}
                  >
                    {offer.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Service */}
                <div className="mb-2 text-secondary small">
                  Service:{" "}
                  <span className="text-warning">
                    {offer.service}
                  </span>
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
                <div className="small text-secondary mb-3">
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
                      className="progress-bar bg-info"
                      style={{ width: `${usagePercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Dates */}
                <div className="small text-secondary mb-3">
                  <FaCalendarAlt /> {offer.startDate} →{" "}
                  {offer.endDate}
                </div>

                {/* Action */}
                <button className="btn btn-sm w-100 btn-outline-info">
                  <FaBolt /> Manage Offer
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredOffers.length === 0 && (
        <div className="text-center mt-5 text-secondary">
          No offers found 😔
        </div>
      )}
    </div>
  );
};

export default AllOffers;