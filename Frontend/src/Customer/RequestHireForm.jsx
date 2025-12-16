import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";


const RequestHireForm = ({ proInfo}) => {

  const busyDays = proInfo?.busyDays;
  console.log(busyDays);

    const today = new Date().toISOString().split("T")[0];
    const [minTime, setMinTime] = useState("");
  const [formData, setFormData] = useState({
    customerName: "",
    workDate: "",
    workTime: "",
    problemDesc: "",
    chargeType: "",
    workAddress: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

   useEffect(() => {
    if (formData.workDate === today) {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      setMinTime(`${hours}:${minutes}`);
    } else {
      setMinTime("");
    }
  }, [formData.workDate, today]);

  const handleSubmit = (e) => {
    e.preventDefault();

      if (busyDays.includes(formData.workDate)) {
      toast.info("This date is not available. Please select another date.");
      return;
    }

    console.log("Hire Request Data:", formData);

    alert("Hire request sent successfully!");
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h5 className="fw-bold mb-3">
          Hire Professional
        </h5>

        <p className="text-muted small mb-4">
          No payment required now. Charges will be finalized after work confirmation.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Customer Name */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Your Name</label>
            <input
              type="text"
              className="form-control"
              name="customerName"
              placeholder="Enter your full name"
              value={formData.customerName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Date & Time */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Preferred Date</label>
              <input
                type="date"
                className="form-control"
                name="workDate"
                value={formData.workDate}
                min={today}
                onChange={handleChange}
                required
              />
               {busyDays?.includes(formData.workDate) && (
              <small className="text-danger">
                This date is not available
              </small>
            )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Preferred Time</label>
              <input
                type="time"
                className="form-control"
                name="workTime"
                min={minTime}
                value={formData.workTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Problem Description */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Describe Your Problem
            </label>
            <textarea
              className="form-control"
              name="problemDesc"
              rows="3"
              placeholder="Explain the work you want to get done"
              value={formData.problemDesc}
              onChange={handleChange}
              required
            />
          </div>

          {/* Charge Type */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Preferred Charge Type
            </label>
            <select
              className="form-select"
              name="chargeType"
              value={formData.chargeType}
              onChange={handleChange}
              required
            >
              <option value="">Select charge type</option>
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="contract">Contract</option>
            </select>
          </div>

          {/* Address */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Work Address
            </label>
            <textarea
              className="form-control"
              name="workAddress"
              rows="2"
              placeholder="Enter full address where work is required"
              value={formData.workAddress}
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-100">
            Send Hire Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestHireForm;
