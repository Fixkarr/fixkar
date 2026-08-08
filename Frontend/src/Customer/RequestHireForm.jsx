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
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaInfoCircle,
  FaMicrophone,
} from "react-icons/fa";
import VoiceRecorder from "../Components/VoiceRecorder";
import CustomAudioPlayer from "../Components/CustomAudioPlayer";
import PickupWaiting from "./PickupWaiting";

const RequestHireForm = ({ proInfo, task, onClose }) => {
  const {
    selectedLocation,
    selectedTask: preselectedTask,
    selectedService,
  } = useSelector((state) => state.location);
  const { currentUserData } = useSelector((state) => state.user);
  const { distance } = useSelector((state) => state.distance);
  const [audioMessages, setAudioMessages] = useState([]);
  const [pickupSearching, setPickupSearching] = useState(false);
  const [pickupExpiresAt, setPickupExpiresAt] = useState(null);
  const isMobileVerified = currentUserData?.user?.userId?.isMobileVerified;
  const mobileNumber = currentUserData?.user?.userId?.mobile;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [taskId, setTaskId] = useState(
    !proInfo ? preselectedTask?._id || "" : ""
);
  const isDirectHire = Boolean(proInfo);
  const [pickupSessionId, setPickupSessionId] = useState(null);

  const service = isDirectHire ? proInfo?.profession : selectedService;

  const isSkillBased = service?.serviceType === "skill_based";

  const isSpecialized = service?.serviceType === "specialized";

  const distanceCharge = calculateVisitingCharge(
    parseFloat(distance?.distance.text),
  );

  let visitingCharge = null;

  if (isDirectHire) {
    visitingCharge = isSpecialized
      ? Number(proInfo?.visitingCharge)
      : distanceCharge;
  } else {
    visitingCharge = isSkillBased ? distanceCharge : null;
  }

 const availableTasks = isDirectHire
    ? []
    : selectedService?.skills || [];

  const selectedTask = availableTasks.find(
    (task) => task._id?.toString() === taskId?.toString(),
  );
  const specializedRate = (proInfo?.taskPricing || []).find((rate) => {
    const skillId = rate?.skill?._id?.toString() || rate?.skill?.toString();
    return skillId === taskId?.toString();
  });

  let serviceCharge = null;

  if (selectedTask) {
    if (selectedTask.pricingSource === "admin") {
      serviceCharge = Number(selectedTask.fixedPrice);
    } else if (isDirectHire) {
      serviceCharge = Number(specializedRate?.price);
    }
  }
  const isFixedTask = selectedTask?.bookingType === "fixed";

  const totalAmount = isFixedTask ? visitingCharge + serviceCharge : null;
  const handleAudioReady = (blob) => {
    const audioUrl = URL.createObjectURL(blob);

    setAudioMessages((prev) => [...prev, { blob, preview: audioUrl }]);
  };

  const busyDays = proInfo?.busyDays;

  const getLocalDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const today = getLocalDate();
  const [minTime, setMinTime] = useState("");
  const [formData, setFormData] = useState({
    customerName: "",
    workDate: "",
    workTime: "",
    problemDesc: "",
    workAddress: `${selectedLocation?.address}`,
  });

  useEffect(() => {
    if (!isDirectHire && task) {
        setTaskId(task._id);
        setFormData((prev) => ({
            ...prev,
            problemDesc: task.name,
        }));
    }
}, [task, isDirectHire]);

  useEffect(() => {
    if (selectedLocation?.address) {
      setFormData((prev) => ({
        ...prev,
        workAddress: selectedLocation.address,
      }));
    }
  }, [selectedLocation]);

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

    if (formData.workDate && formData.workTime) {
      const selectedDateTime = new Date(
        `${formData.workDate}T${formData.workTime}:00`,
      );
      if (selectedDateTime <= new Date()) {
        toast.warning("Please select a future time for your service request.");
        return;
      }
    }

    const formDataToSend = new FormData();

    formDataToSend.append("customerName", formData.customerName);
  if (isDirectHire) {
    formDataToSend.append("professionalId", proInfo._id);
    formDataToSend.append("profession", proInfo.profession);
}
    if (!isDirectHire && taskId) {
          formDataToSend.append("taskId", taskId);
      }
    formDataToSend.append("workDate", formData.workDate);
    formDataToSend.append("workTime", formData.workTime);
    formDataToSend.append("workAddress", formData.workAddress);
    formDataToSend.append("customerLat", selectedLocation?.lat);

    formDataToSend.append("customerLng", selectedLocation?.lng);
    formDataToSend.append("problemDescription", formData.problemDesc);
   if (isDirectHire) {
    formDataToSend.append(
        "distanceInKm",
        parseFloat(distance?.distance.text)
    );
}
    formDataToSend.append("mobileNumber", mobileNumber);

    // 🔥 AUDIO FILES
    audioMessages.forEach((audio, index) => {
      formDataToSend.append("audioMessages", audio.blob, `voice_${index}.webm`);
    });

    if (busyDays?.includes(formData.workDate)) {
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
        },
      );
    }

    try {
      setLoading(true);
      const result = await axios.post(
        `${server_url}/api/booking/create-booking`,
        formDataToSend,
        { withCredentials: true },
      );

      
      console.log("🔥 BOOKING RESPONSE:", result.data);
console.log("🔥 isDirectHire:", isDirectHire);
console.log("🔥 searching:", result.data.searching);
console.log("🔥 expiresAt:", result.data.expiresAt);

        if (!isDirectHire && result.data.searching) {
          console.log("openning pickup waiting!")
          setPickupSessionId(result.data.pickupSessionId);
        setPickupExpiresAt(result.data.expiresAt);
        setPickupSearching(true);
        setLoading(false);
        return;
      }

  toast.success(result.data.message);
        navigate("/customer/bookings");
     
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

 
  return (
   <>
  {pickupSearching ? 
     <PickupWaiting
     pickupSessionId={pickupSessionId}
      expiresAt={pickupExpiresAt}
    /> : <div className="card border-0 shadow rounded-4 overflow-hidden">
      {/* Header */}
      <div
        className="d-flex justify-content-between px-4 py-3 text-white"
        style={{ background: "linear-gradient(135deg,#0d6efd,#4f9cff)" }}
      >
        <h5 className="fw-bold mb-0">
          <FaTools className="me-2" />
          Hire Professional
        </h5>
        <button
          type="button"
          className="btn btn-sm btn-light rounded-circle"
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      <div className="card-body bg-light">
        {/* Notice */}
        {proInfo && (
          <div className="alert alert-info border-0 rounded-4 small">
            <FaInfoCircle className="me-1" />
            Visiting charge is <b>₹{visitingCharge}</b>. It will be added to the
            final bill. Cancellation after arrival may cost extra <b>₹50</b>.
          </div>
        )}

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

          {availableTasks.length > 0 && (
            <div className="mb-3">
              <label className="form-label fw-semibold">
                <FaTools className="me-1 text-primary" /> Select task
              </label>
              <select
                className="form-select"
                value={taskId}
                onChange={(event) => setTaskId(event.target.value)}
                required
              >
                <option value="">Select the work you need</option>
                {availableTasks.map((task) => (
                  <option key={task._id} value={task._id}>
                    {task.name}
                    {task.bookingType === "inspection" ? " (inspection)" : ""}
                  </option>
                ))}
              </select>
              {taskId && selectedTask?.bookingType === "inspection" && (
                <small className="text-muted">
                  This task needs inspection. The professional will quote after
                  the visit.
                </small>
              )}
            </div>
          )}

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
                min={formData.workDate === today ? minTime : undefined}
                value={formData.workTime}
                onChange={handleChange}
                required
              />
              <small className="text-muted">
                You can choose any future time, including night hours.
              </small>
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
             readOnly={!isDirectHire && selectedTask?.bookingType === "fixed"}
            placeholder={
                !isDirectHire && selectedTask?.bookingType === "fixed"
                    ? ""
                    : "Explain the work you want to get done"
            }
              required
            />
            {/* Audio Preview */}
            {audioMessages.length > 0 && (
              <div className="mb-3">
                <label className="fw-semibold small">Voice Preview</label>

                {audioMessages?.map((audio, index) => (
                  <div
                    key={index}
                    className="d-flex align-items-center gap-2 mb-2"
                  >
                    <CustomAudioPlayer src={audio.preview} />

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => {
                        URL.revokeObjectURL(audio.preview);
                        setAudioMessages((prev) =>
                          prev.filter((_, i) => i !== index),
                        );
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Voice Message Section */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              <FaMicrophone /> Add Voice Description (Optional)
            </label>

            <div className="d-flex align-items-center gap-2 flex-wrap">
              <VoiceRecorder onAudioReady={handleAudioReady} />
              <small className="text-muted">Press & hold to record</small>
            </div>
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
           {loading ? (
    <ClipLoader size={20} color="#fff" />
) : isDirectHire ? (
    "Book Now"
) : selectedTask?.bookingType === "fixed" ? (
    "Book Now"
) : (
    "Send Hire Request"
)}
          </button>
        </form>
      </div>
    </div>
  }
   </>
  );
};

export default RequestHireForm;
