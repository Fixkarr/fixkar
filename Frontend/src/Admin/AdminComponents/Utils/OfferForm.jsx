import React, { useState } from "react";

const OfferForm = () => {
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
    <div className="container mt-4">
      <div className="card shadow p-4">
        <h3 className="mb-3">Create Offer</h3>

        <form onSubmit={handleSubmit}>
          {/* Offer Title */}
          <div className="mb-3">
            <label className="form-label">Offer Title</label>
            <input
              type="text"
              className="form-control"
              name="offerTitle"
              value={formData.offerTitle}
              onChange={handleChange}
              required
            />
          </div>

          {/* Service Multi Select */}
          <div className="mb-3">
            <label className="form-label">Select Services</label>
            <select
              multiple
              className="form-control"
              onChange={handleServiceChange}
            >
              {/* Replace with dynamic services */}
              <option value="service1">Service 1</option>
              <option value="service2">Service 2</option>
              <option value="service3">Service 3</option>
            </select>
          </div>

          {/* Discount Type */}
          <div className="mb-3">
            <label className="form-label">Discount Type</label>
            <select
              className="form-control"
              name="discountType"
              value={formData.discountType}
              onChange={handleChange}
            >
              <option value="percentage">Percentage</option>
              <option value="flat">Flat</option>
            </select>
          </div>

          {/* Discount Value */}
          <div className="mb-3">
            <label className="form-label">Discount Value</label>
            <input
              type="number"
              className="form-control"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleChange}
              required
            />
          </div>

          {/* Min Booking */}
          <div className="mb-3">
            <label className="form-label">Min Booking Amount</label>
            <input
              type="number"
              className="form-control"
              name="minBookingAmount"
              value={formData.minBookingAmount}
              onChange={handleChange}
            />
          </div>

          {/* Max Discount */}
          <div className="mb-3">
            <label className="form-label">Max Discount</label>
            <input
              type="number"
              className="form-control"
              name="maxDiscount"
              value={formData.maxDiscount}
              onChange={handleChange}
            />
          </div>

          {/* Dates */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-control"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-control"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Usage Limit */}
          <div className="mb-3">
            <label className="form-label">Usage Limit</label>
            <input
              type="number"
              className="form-control"
              name="usageLimit"
              value={formData.usageLimit}
              onChange={handleChange}
            />
          </div>

          {/* Per User Limit */}
          <div className="mb-3">
            <label className="form-label">Per User Limit</label>
            <input
              type="number"
              className="form-control"
              name="perUserLimit"
              value={formData.perUserLimit}
              onChange={handleChange}
            />
          </div>

          {/* Checkboxes */}
          <div className="form-check mb-2">
            <input
              type="checkbox"
              className="form-check-input"
              name="newCustomerOnly"
              checked={formData.newCustomerOnly}
              onChange={handleChange}
            />
            <label className="form-check-label">
              New Customers Only
            </label>
          </div>

          <div className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
            <label className="form-check-label">
              Active Offer
            </label>
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-primary w-100">
            Create Offer
          </button>
        </form>
      </div>
    </div>
  );
};

export default OfferForm;