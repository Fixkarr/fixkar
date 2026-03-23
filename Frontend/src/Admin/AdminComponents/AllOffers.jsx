import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSearch, FaFilter, FaTag, FaCalendarAlt } from "react-icons/fa";

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
  const [offers, setOffers] = useState(dummyOffers);
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
    <div className="container-fluid p-4" style={{ background: "#0f172a", minHeight: "100vh", color: "#fff" }}>
      <h2 className="mb-4 fw-bold text-info">🎁 All Offers</h2>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="input-group">
            <span className="input-group-text bg-dark text-white">
              <FaSearch />
            </span>
            <input
              type="text"
              className="form-control bg-dark text-white border-0"
              placeholder="Search by title..."
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

      {/* Offers Cards */}
      <div className="row">
        {filteredOffers.map((offer) => (
          <div className="col-md-4 mb-4" key={offer._id}>
            <div
              className="card shadow-lg border-0"
              style={{
                background: "linear-gradient(135deg, #1e293b, #0f172a)",
                borderRadius: "15px",
              }}
            >
              <div className="card-body">
                <h5 className="card-title text-info fw-bold">
                  <FaTag /> {offer.offerTitle}
                </h5>

                <p className="text-light mb-1">
                  Service: <span className="text-warning">{offer.service}</span>
                </p>

                <p className="text-light mb-1">
                  Discount:{" "}
                  <span className="text-success">
                    {offer.discountType === "percentage"
                      ? `${offer.discountValue}%`
                      : `₹${offer.discountValue}`}
                  </span>
                </p>

                <p className="text-light mb-1">
                  Min Booking: ₹{offer.minBookingAmount}
                </p>

                <p className="text-light mb-1">
                  Max Discount: ₹{offer.maxDiscount}
                </p>

                <p className="text-light mb-1">
                  Usage: {offer.usedCount}/{offer.usageLimit}
                </p>

                <p className="text-light">
                  <FaCalendarAlt /> {offer.startDate} → {offer.endDate}
                </p>

                <span
                  className={`badge ${
                    offer.isActive ? "bg-success" : "bg-danger"
                  }`}
                >
                  {offer.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        ))}
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