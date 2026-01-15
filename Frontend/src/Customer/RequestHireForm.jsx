import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { calculateVisitingCharge } from "../utils/calculateVsitingCharge";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { server_url } from "../App";

import {
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaTools,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaInfoCircle,
} from "react-icons/fa";

const RequestHireForm = ({ proInfo }) => {
  const { selectedLocation } = useSelector((state) => state.location);
  const { currentUserData } = useSelector((state) => state.user);
  const { distance } = useSelector((state) => state.distance);
  const isMobileVerified = currentUserData?.user?.userId?.isMobileVerified;
  const mobileNumber = currentUserData?.user?.userId?.mobile;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const visitingCharge = calculateVisitingCharge(
    parseFloat(distance?.distance.text)
  );
  const busyDays = proInfo?.busyDays;

  const today = new Date().toISOString().split("T")[0];
  const [minTime, setMinTime] = useState("");
  const [formData, setFormData] = useState({
    customerName: "",
    workDate: "",
    workTime: "",
    problemDesc: "",
    chargeType: "",
    workAddress: `${selectedLocation?.address}`,
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.workTime) {
      const [hour, minute] = formData.workTime.split(":").map(Number);
      const selectedMinutes = hour * 60 + minute;

      const startTime = 8 * 60;
      const endTime = 17 * 60;

      if (selectedMinutes < startTime || selectedMinutes > endTime) {
        toast.warning(
          "Booking requests are allowed only between 8:00 AM and 5:00 PM."
        );
        return;
      }
    }

    const payload = {
      customerName: formData.customerName,
      professionalId: proInfo._id,
      visitingCharge,
      profession: proInfo.profession,
      workDate: formData.workDate,
      workTime: formData.workTime,
      workAddress: formData.workAddress,
      problemDescription: formData.problemDesc,
      distanceInKm: parseFloat(distance?.distance.text),
      chargeType: formData.chargeType,
      mobileNumber,
    };

    if (busyDays.includes(formData.workDate)) {
      toast.info("This date is not available. Please select another date.");
      return;
    }

    if (!isMobileVerified) {
      return toast.warning(
        <div>
          <h6 className="fw-bold mb-1">Mobile Not Verified</h6>
          <p className="small mb-2">
            Please verify your mobile number to hire a professional.
          </p>
          <button
            className="btn btn-sm btn-primary rounded-pill"
            onClick={() => {
              toast.dismiss();
              navigate("/customer/verify-mobile");
            }}
          >
            Verify Mobile Number
          </button>
        </div>,
        {
          autoClose: false,
          position: "top-center",
        }
      );
    }

    try {
      setLoading(true);
      const result = await axios.post(
        `${server_url}/api/booking/create-booking`,
        payload,
        { withCredentials: true }
      );
      toast.success(result.data.message);
      navigate("/customer/bookings");
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  return (
    <div className="card border-0 shadow rounded-4 overflow-hidden">

      {/* Header */}
      <div
        className="px-4 py-3 text-white"
        style={{ background: "linear-gradient(135deg,#0d6efd,#4f9cff)" }}
      >
        <h5 className="fw-bold mb-0">
          <FaTools className="me-2" />
          Hire Professional
        </h5>
        <small className="opacity-75">
          Fill the details carefully to request service
        </small>
      </div>

      <div className="card-body bg-light">

        {/* Notice */}
        <div className="alert alert-info border-0 rounded-4 small">
          <FaInfoCircle className="me-1" />
          Visiting charge is <b>₹{visitingCharge}</b>.  
          It will be added to the final bill.  
          Cancellation after arrival may cost extra <b>₹50</b>.
        </div>

        <form onSubmit={handleSubmit}>

          {/* Name */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              <FaUser className="me-1 text-primary" /> Your Name
            </label>
            <input
              type="text"
              className="form-control"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Date & Time */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">
                <FaCalendarAlt className="me-1 text-primary" /> Preferred Date
              </label>
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
              <label className="form-label fw-semibold">
                <FaClock className="me-1 text-primary" /> Preferred Time
              </label>
              <input
                type="time"
                className="form-control"
                name="workTime"
                min={formData.workDate === today ? minTime : "08:00"}
                max="17:00"
                value={formData.workTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Problem */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              <FaTools className="me-1 text-primary" /> Describe Your Problem
            </label>
            <textarea
              className="form-control"
              name="problemDesc"
              rows="3"
              value={formData.problemDesc}
              onChange={handleChange}
              placeholder="Explain the work you want to get done"
              required
            />
          </div>

          {/* Charge Type */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              <FaMoneyBillWave className="me-1 text-primary" /> Preferred Charge Type
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

          {/* Mobile */}
          {isMobileVerified && (
            <div className="mb-3">
              <label className="form-label fw-semibold">
                <FaPhoneAlt className="me-1 text-primary" /> Mobile Number
              </label>
              <div className="form-control bg-white">{mobileNumber}</div>
            </div>
          )}

          {/* Address */}
          <div className="mb-4">
            <label className="form-label fw-semibold">
              <FaMapMarkerAlt className="me-1 text-primary" /> Work Address
            </label>
            <textarea
              className="form-control"
              name="workAddress"
              rows="2"
              value={formData.workAddress}
              onChange={handleChange}
              required
              disabled
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-100 rounded-pill fw-semibold"
          >
            {loading ? <ClipLoader size={20} color="#fff" /> : "Send Hire Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestHireForm;
