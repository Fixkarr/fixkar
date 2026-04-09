import React, { useState } from "react";

 import { FaTag, FaPercentage, FaCalendarAlt, FaToggleOn } from "react-icons/fa";
import { MdOutlineLocalOffer } from "react-icons/md";
import { useSelector } from "react-redux";
// import useGetServices from "../../../hooks/useGetServices";

const OfferForm = () => {
    const {services} = useSelector(state => state.services)
    console.log(services)
  const [formData, setFormData] = useState({
    serviceId: [],
    offerTitle: "",
    discountType: "percentage",
    discountValue: "",
    minBookingAmount: "",
    maxDiscount: "",
    startDate: "",
    endDate: "",
    usageLimit: "",
    perUserLimit: 1,
    newCustomerOnly: false,
    isActive: true,
  });

  // handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // handle service selection (multi)
  const handleServiceChange = (e) => {
    const options = Array.from(e.target.selectedOptions);
    const values = options.map((opt) => opt.value);

    setFormData({ ...formData, serviceId: values });
  };

  // submit
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Offer Data:", formData);

  
  };

return (
  <div className="container py-5">
    <div className="card bg-dark text-light shadow-lg border-0 rounded-4 p-4">
      
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <MdOutlineLocalOffer size={28} className="me-2 text-warning" />
        <h3 className="mb-0 fw-bold">Create Offer</h3>
      </div>

      <form onSubmit={handleSubmit}>
        
        {/* Offer Title */}
        <div className="mb-4">
          <label className="form-label fw-semibold">
            <FaTag className="me-2 text-info" />
            Offer Title
          </label>
          <input
            type="text"
            className="form-control bg-secondary text-light border-0 rounded-3"
            name="offerTitle"
            value={formData.offerTitle}
            onChange={handleChange}
            placeholder="Enter offer title..."
            required
          />
        </div>

        {/* Services */}
        <div className="mb-4">
          <label className="form-label fw-semibold">
            <MdOutlineLocalOffer className="me-2 text-success" />
            Select Services
          </label>
          <select
            multiple
            className="form-select bg-secondary text-light border-0 rounded-3"
            onChange={handleServiceChange}
          >
            <option value="service1">Service 1</option>
            <option value="service2">Service 2</option>
            <option value="service3">Service 3</option>
          </select>
        </div>

        {/* Discount */}
        <div className="row">
          <div className="col-md-6 mb-4">
            <label className="form-label fw-semibold">
              <FaPercentage className="me-2 text-warning" />
              Discount Type
            </label>
            <select
              className="form-select bg-secondary text-light border-0 rounded-3"
              name="discountType"
              value={formData.discountType}
              onChange={handleChange}
            >
              <option value="percentage">Percentage</option>
              <option value="flat">Flat</option>
            </select>
          </div>

          <div className="col-md-6 mb-4">
            <label className="form-label fw-semibold">
              <FaPercentage className="me-2 text-danger" />
              Discount Value
            </label>
            <input
              type="number"
              className="form-control bg-secondary text-light border-0 rounded-3"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleChange}
              placeholder="Enter value..."
              required
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="row">
          <div className="col-md-6 mb-4">
            <label className="form-label fw-semibold">
              Min Booking Amount
            </label>
            <input
              type="number"
              className="form-control bg-secondary text-light border-0 rounded-3"
              name="minBookingAmount"
              value={formData.minBookingAmount}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-4">
            <label className="form-label fw-semibold">
              Max Discount
            </label>
            <input
              type="number"
              className="form-control bg-secondary text-light border-0 rounded-3"
              name="maxDiscount"
              value={formData.maxDiscount}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Dates */}
        <div className="row">
          <div className="col-md-6 mb-4">
            <label className="form-label fw-semibold">
              <FaCalendarAlt className="me-2 text-info" />
              Start Date
            </label>
            <input
              type="date"
              className="form-control bg-secondary text-light border-0 rounded-3"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-4">
            <label className="form-label fw-semibold">
              <FaCalendarAlt className="me-2 text-info" />
              End Date
            </label>
            <input
              type="date"
              className="form-control bg-secondary text-light border-0 rounded-3"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Limits */}
        <div className="row">
          <div className="col-md-6 mb-4">
            <label className="form-label fw-semibold">
              Usage Limit
            </label>
            <input
              type="number"
              className="form-control bg-secondary text-light border-0 rounded-3"
              name="usageLimit"
              value={formData.usageLimit}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-4">
            <label className="form-label fw-semibold">
              Per User Limit
            </label>
            <input
              type="number"
              className="form-control bg-secondary text-light border-0 rounded-3"
              name="perUserLimit"
              value={formData.perUserLimit}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="form-check form-switch mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            name="newCustomerOnly"
            checked={formData.newCustomerOnly}
            onChange={handleChange}
          />
          <label className="form-check-label">
            <FaToggleOn className="me-2 text-success" />
            New Customers Only
          </label>
        </div>

        <div className="form-check form-switch mb-4">
          <input
            type="checkbox"
            className="form-check-input"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />
          <label className="form-check-label">
            <FaToggleOn className="me-2 text-warning" />
            Active Offer
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn btn-warning w-100 fw-bold py-2 rounded-3"
        >
          Create Offer
        </button>
      </form>
    </div>
  </div>
);
};

export default OfferForm;