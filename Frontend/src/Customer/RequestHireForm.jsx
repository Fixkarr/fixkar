import React, { useEffect, useState } from "react";
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
  FaCheck,
  FaChevronRight,
  FaTimes,
  FaRupeeSign,
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

  const isMobileVerified =
    currentUserData?.user?.userId?.isMobileVerified;

  const mobileNumber = currentUserData?.user?.userId?.mobile;

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [taskId, setTaskId] = useState(
    !proInfo ? preselectedTask?._id || "" : ""
  );

  const isDirectHire = Boolean(proInfo);

  const [pickupSessionId, setPickupSessionId] = useState(null);

  // =========================================================
  // EXISTING LOGIC
  // =========================================================

  const clearExpiredPickup = () => {
    setPickupSearching(false);
    setPickupSessionId(null);
    setPickupExpiresAt(null);
  };

  const confirmPickupHire = async (pickupRequest) => {
    try {
      setLoading(true);

      const result = await axios.post(
        `${server_url}/api/booking/confirm-pickup-hire`,
        {
          pickupRequestId:
            pickupRequest.pickupRequestId || pickupRequest._id,
        },
        {
          withCredentials: true,
        }
      );

      toast.success(result.data.message);

      clearExpiredPickup();

      navigate(`/customer/bookings/${result.data.booking._id}`);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to confirm booking."
      );
    } finally {
      setLoading(false);
    }
  };

  const service = isDirectHire
    ? proInfo?.profession
    : selectedService;

  const isSkillBased =
    service?.serviceType === "skill_based";

  const isSpecialized =
    service?.serviceType === "specialized";

  const distanceCharge = calculateVisitingCharge(
    parseFloat(distance?.distance.text)
  );

  let visitingCharge = null;

  if (isDirectHire) {
    visitingCharge = isSpecialized
      ? Number(proInfo?.visitingCharge)
      : distanceCharge;
  } else {
    visitingCharge = isSkillBased
      ? distanceCharge
      : null;
  }

  const availableTasks = isDirectHire
    ? []
    : selectedService?.skills || [];

  const selectedTask = availableTasks.find(
    (task) =>
      task._id?.toString() === taskId?.toString()
  );

  const specializedRate = (
    proInfo?.taskPricing || []
  ).find((rate) => {
    const skillId =
      rate?.skill?._id?.toString() ||
      rate?.skill?.toString();

    return skillId === taskId?.toString();
  });

  let serviceCharge = null;

  if (selectedTask) {
    if (selectedTask.pricingSource === "admin") {
      serviceCharge = Number(
        selectedTask.fixedPrice
      );
    } else if (isDirectHire) {
      serviceCharge = Number(
        specializedRate?.price
      );
    }
  }

  const isFixedTask =
    selectedTask?.bookingType === "fixed";

  const totalAmount = isFixedTask
    ? visitingCharge + serviceCharge
    : null;

  const handleAudioReady = (blob) => {
    const audioUrl = URL.createObjectURL(blob);

    setAudioMessages((prev) => [
      ...prev,
      {
        blob,
        preview: audioUrl,
      },
    ]);
  };

  const busyDays = proInfo?.busyDays;

  const getLocalDate = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(
      now.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      now.getDate()
    ).padStart(2, "0");

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

      const hours = String(
        now.getHours()
      ).padStart(2, "0");

      const minutes = String(
        now.getMinutes()
      ).padStart(2, "0");

      setMinTime(`${hours}:${minutes}`);
    } else {
      setMinTime("");
    }
  }, [formData.workDate, today]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.workDate && formData.workTime) {
      const selectedDateTime = new Date(
        `${formData.workDate}T${formData.workTime}:00`
      );

      if (selectedDateTime <= new Date()) {
        toast.warning(
          "Please select a future time for your service request."
        );

        return;
      }
    }

    const formDataToSend = new FormData();

    formDataToSend.append(
      "customerName",
      formData.customerName
    );

    if (isDirectHire) {
      formDataToSend.append(
        "professionalId",
        proInfo._id
      );

      formDataToSend.append(
        "profession",
        proInfo.profession
      );
    }

    if (!isDirectHire && taskId) {
      formDataToSend.append(
        "taskId",
        taskId
      );
    }

    formDataToSend.append(
      "workDate",
      formData.workDate
    );

    formDataToSend.append(
      "workTime",
      formData.workTime
    );

    formDataToSend.append(
      "workAddress",
      formData.workAddress
    );

    formDataToSend.append(
      "customerLat",
      selectedLocation?.lat
    );

    formDataToSend.append(
      "customerLng",
      selectedLocation?.lng
    );

    formDataToSend.append(
      "problemDescription",
      formData.problemDesc
    );

    if (isDirectHire) {
      formDataToSend.append(
        "distanceInKm",
        parseFloat(distance?.distance.text)
      );
    }

    formDataToSend.append(
      "mobileNumber",
      mobileNumber
    );

    audioMessages.forEach((audio, index) => {
      formDataToSend.append(
        "audioMessages",
        audio.blob,
        `voice_${index}.webm`
      );
    });

    if (busyDays?.includes(formData.workDate)) {
      toast.info(
        "This date is not available. Please select another date."
      );

      return;
    }

    if (!isMobileVerified) {
      return toast.warning(
        <div>
          <h6 className="fw-bold mb-1">
            Mobile Not Verified
          </h6>

          <p className="small mb-2">
            Please verify your mobile number to
            hire a professional.
          </p>

          <button
            className="btn btn-sm btn-primary rounded-pill"
            onClick={() => {
              toast.dismiss();
              navigate(
                "/customer/verify-mobile"
              );
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
        formDataToSend,
        {
          withCredentials: true,
        }
      );

      if (
        !isDirectHire &&
        result.data.searching
      ) {
        setPickupSessionId(
          result.data.pickupSessionId
        );

        setPickupExpiresAt(
          result.data.expiresAt
        );

        setPickupSearching(true);
        setLoading(false);

        return;
      }

      toast.success(result.data.message);

      navigate("/customer/bookings");

      setLoading(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong."
      );

      setLoading(false);
    }
  };

  // =========================================================
  // UI HELPERS
  // =========================================================

  const formatPhone = (phone) => {
    if (!phone) return "";

    if (phone.length <= 4) {
      return phone;
    }

    return `${phone.slice(
      0,
      2
    )}******${phone.slice(-2)}`;
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================================
  // PICKUP WAITING
  // =========================================================

  if (pickupSearching) {
    return (
      <PickupWaiting
        pickupSessionId={pickupSessionId}
        expiresAt={pickupExpiresAt}
        onConfirmHire={confirmPickupHire}
        onExpired={clearExpiredPickup}
      />
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="booking-experience">

      {/* =====================================================
          TOP HEADER
      ===================================================== */}

      <div className="booking-header">

        <div className="booking-header-content">

          <div className="booking-service-icon">
            <FaTools />
          </div>

          <div className="flex-grow-1">
            <div className="booking-eyebrow">
              SERVICE REQUEST
            </div>

            <h4 className="booking-title">
              Let's get your work sorted
            </h4>

            <p className="booking-subtitle mb-0">
              Just a few details and we'll take it from here.
            </p>
          </div>

          {onClose && (
            <button
              type="button"
              className="booking-close"
              onClick={onClose}
            >
              <FaTimes size={14} />
            </button>
          )}

        </div>

        {/* Progress */}
        <div className="booking-progress">

          <div className="progress-step active">
            <span>1</span>
            <small>Details</small>
          </div>

          <div className="progress-line" />

          <div className="progress-step">
            <span>2</span>
            <small>Schedule</small>
          </div>

          <div className="progress-line" />

          <div className="progress-step">
            <span>3</span>
            <small>Confirm</small>
          </div>

        </div>

      </div>

      <form
        onSubmit={handleSubmit}
        className="booking-body"
      >

        {/* ===================================================
            SELECTED SERVICE / TASK
        =================================================== */}

        <section className="booking-section">

          <div className="section-heading">
            <div className="section-icon">
              <FaTools size={14} />
            </div>

            <div>
              <h6>What do you need help with?</h6>
              <small>
                We've selected the service you requested.
              </small>
            </div>
          </div>

          <div className="selected-service-card">

            <div className="selected-service-left">

              <div className="selected-service-symbol">
                <FaTools />
              </div>

              <div>
                <small className="text-muted d-block">
                  Service
                </small>

                <strong>
                  {typeof service === "string"
                    ? service
                    : service?.name ||
                      proInfo?.profession ||
                      "Professional service"}
                </strong>
              </div>

            </div>

            {selectedTask && (
              <div className="selected-task-info">

                <FaCheck
                  className="text-success"
                  size={12}
                />

                <div>
                  <small className="text-muted d-block">
                    Selected task
                  </small>

                  <strong>
                    {selectedTask.name}
                  </strong>
                </div>

              </div>
            )}

          </div>

          {/* Existing task selector kept for architecture */}
          {availableTasks.length > 0 && (
            <div className="mt-3">

              <label className="booking-mini-label">
                Need to change the task?
              </label>

              <select
                className="booking-select"
                value={taskId}
                onChange={(event) =>
                  setTaskId(event.target.value)
                }
                required
              >
                <option value="">
                  Select the work you need
                </option>

                {availableTasks.map((availableTask) => (
                  <option
                    key={availableTask._id}
                    value={availableTask._id}
                  >
                    {availableTask.name}
                    {availableTask.bookingType ===
                    "inspection"
                      ? " (inspection)"
                      : ""}
                  </option>
                ))}
              </select>

              {taskId &&
                selectedTask?.bookingType ===
                  "inspection" && (
                  <div className="info-hint">
                    <FaInfoCircle />

                    <span>
                      This task needs inspection. The
                      professional will quote after the visit.
                    </span>
                  </div>
                )}

            </div>
          )}

        </section>

        {/* ===================================================
            CUSTOMER
        =================================================== */}

        <section className="booking-section">

          <div className="section-heading">
            <div className="section-icon">
              <FaUser size={13} />
            </div>

            <div>
              <h6>Who should we contact?</h6>
              <small>
                Tell us the name we should use when we arrive.
              </small>
            </div>
          </div>

          <div className="friendly-input">

            <div className="friendly-input-icon">
              <FaUser />
            </div>

            <div className="flex-grow-1">

              <label>
                Your name
              </label>

              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />

            </div>

          </div>

        </section>

        {/* ===================================================
            SCHEDULE
        =================================================== */}

        <section className="booking-section">

          <div className="section-heading">
            <div className="section-icon">
              <FaCalendarAlt size={13} />
            </div>

            <div>
              <h6>When should we come?</h6>
              <small>
                Pick a convenient date and time.
              </small>
            </div>
          </div>

          <div className="row g-3">

            <div className="col-md-6">

              <div className="schedule-card">

                <div className="schedule-card-top">
                  <FaCalendarAlt />

                  <span>
                    Preferred date
                  </span>
                </div>

                <input
                  type="date"
                  name="workDate"
                  value={formData.workDate}
                  min={today}
                  onChange={handleChange}
                  required
                />

                {formData.workDate && (
                  <small className="schedule-preview">
                    {formatDate(
                      formData.workDate
                    )}
                  </small>
                )}

                {busyDays?.includes(
                  formData.workDate
                ) && (
                  <small className="text-danger d-block mt-2">
                    This date is not available.
                  </small>
                )}

              </div>

            </div>

            <div className="col-md-6">

              <div className="schedule-card">

                <div className="schedule-card-top">
                  <FaClock />

                  <span>
                    Preferred time
                  </span>
                </div>

                <input
                  type="time"
                  name="workTime"
                  min={
                    formData.workDate === today
                      ? minTime
                      : undefined
                  }
                  value={formData.workTime}
                  onChange={handleChange}
                  required
                />

                <small className="schedule-help">
                  Choose any future time.
                </small>

              </div>

            </div>

          </div>

        </section>

        {/* ===================================================
            PROBLEM DESCRIPTION
        =================================================== */}

        <section className="booking-section">

          <div className="section-heading">
            <div className="section-icon">
              <FaInfoCircle size={13} />
            </div>

            <div>
              <h6>Tell us what you need</h6>
              <small>
                A few words are enough. This helps the professional
                understand the work.
              </small>
            </div>
          </div>

          <div className="description-box">

            <textarea
              name="problemDesc"
              rows="4"
              value={formData.problemDesc}
              onChange={handleChange}
              readOnly={
                !isDirectHire &&
                selectedTask?.bookingType ===
                  "fixed"
              }
              placeholder={
                !isDirectHire &&
                selectedTask?.bookingType ===
                  "fixed"
                  ? "Your selected task will be used here."
                  : "For example: The ceiling fan is making noise..."
              }
              required
            />

            {!(
              !isDirectHire &&
              selectedTask?.bookingType === "fixed"
            ) && (
              <div className="description-tip">
                <FaInfoCircle size={10} />
                You can describe the problem in your own words.
              </div>
            )}

          </div>

        </section>

        {/* ===================================================
            VOICE
        =================================================== */}

        <section className="voice-card">

          <div className="voice-icon">
            <FaMicrophone />
          </div>

          <div className="voice-content">

            <h6>
              Don't want to type?
            </h6>

            <p>
              Record a quick voice message instead.
              It's completely optional.
            </p>

            <div className="voice-action">
              <VoiceRecorder
                onAudioReady={handleAudioReady}
              />

              <small>
                Press & hold to record
              </small>
            </div>

          </div>

        </section>

        {/* ===================================================
            AUDIO PREVIEWS
        =================================================== */}

        {audioMessages.length > 0 && (
          <section className="audio-preview-card">

            <div className="audio-preview-header">
              <span>
                Voice notes
              </span>

              <small>
                {audioMessages.length} recorded
              </small>
            </div>

            {audioMessages.map(
              (audio, index) => (
                <div
                  key={index}
                  className="audio-preview-row"
                >

                  <CustomAudioPlayer
                    src={audio.preview}
                  />

                  <button
                    type="button"
                    className="audio-delete"
                    onClick={() => {
                      URL.revokeObjectURL(
                        audio.preview
                      );

                      setAudioMessages(
                        (prev) =>
                          prev.filter(
                            (_, i) =>
                              i !== index
                          )
                      );
                    }}
                  >
                    <FaTimes size={11} />
                  </button>

                </div>
              )
            )}

          </section>
        )}

        {/* ===================================================
            CONTACT
        =================================================== */}

        {isMobileVerified && (
          <section className="booking-section">

            <div className="section-heading">
              <div className="section-icon success">
                <FaPhoneAlt size={12} />
              </div>

              <div>
                <h6>We'll contact you here</h6>
                <small>
                  Your verified mobile number
                </small>
              </div>
            </div>

            <div className="verified-contact">

              <div className="verified-contact-icon">
                <FaCheck />
              </div>

              <div className="flex-grow-1">
                <strong>
                  {formatPhone(mobileNumber)}
                </strong>

                <small>
                  Mobile number verified
                </small>
              </div>

              <span className="verified-badge">
                Verified
              </span>

            </div>

          </section>
        )}

        {/* ===================================================
            LOCATION
        =================================================== */}

        <section className="booking-section">

          <div className="section-heading">
            <div className="section-icon">
              <FaMapMarkerAlt size={13} />
            </div>

            <div>
              <h6>Where should we come?</h6>
              <small>
                Your confirmed service location
              </small>
            </div>
          </div>

          <div className="location-card">

            <div className="location-icon">
              <FaMapMarkerAlt />
            </div>

            <div className="flex-grow-1">

              <div className="location-status">
                <FaCheck size={9} />
                Location confirmed
              </div>

              <div className="location-address">
                {formData.workAddress ||
                  "Service location"}
              </div>

            </div>

          </div>

          {/* Hidden/disabled input is intentionally retained */}
          <textarea
            className="d-none"
            name="workAddress"
            value={formData.workAddress}
            onChange={handleChange}
            required
            disabled
          />

        </section>

        {/* ===================================================
            PRICE SUMMARY
        =================================================== */}

        {isFixedTask && !isDirectHire && (
          <section className="price-summary">

            <div className="price-summary-heading">
              <div>
                <small>
                  YOUR BOOKING
                </small>

                <h6>
                  Estimated cost
                </h6>
              </div>

              <div className="price-summary-icon">
                <FaRupeeSign />
              </div>
            </div>

            <div className="price-row">
              <span>
                Visiting charge
              </span>

              <strong>
                ₹{visitingCharge || 0}
              </strong>
            </div>

            <div className="price-row">
              <span>
                Service charge
              </span>

              <strong>
                ₹{serviceCharge || 0}
              </strong>
            </div>

            <div className="price-divider" />

            <div className="price-total">
              <span>
                Estimated total
              </span>

              <strong>
                ₹{totalAmount || 0}
              </strong>
            </div>

            {proInfo && (
              <div className="price-note">
                <FaInfoCircle />

                <span>
                  Visiting charge is added to the final bill.
                  Cancellation after professional arrival may
                  cost an additional ₹50.
                </span>
              </div>
            )}

          </section>
        )}

        {/* ===================================================
            INSPECTION INFO
        =================================================== */}

        {!isFixedTask && selectedTask && (
          <div className="inspection-card">

            <div className="inspection-icon">
              <FaTools />
            </div>

            <div>
              <strong>
                Inspection required
              </strong>

              <p>
                The professional will inspect the work
                and provide the final quote after the visit.
              </p>
            </div>

          </div>
        )}

        {/* ===================================================
            FINAL CTA
        =================================================== */}

        <div className="booking-submit-area">

          <div className="booking-security">
            <FaCheck />

            <span>
              Your request is secure
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="booking-submit"
          >
            {loading ? (
              <ClipLoader
                size={20}
                color="#fff"
              />
            ) : (
              <>
                <span>
                  {isDirectHire
                    ? "Book Professional"
                    : selectedTask?.bookingType ===
                      "fixed"
                    ? "Confirm & Book Service"
                    : "Find a Professional"}
                </span>

                <FaChevronRight size={13} />
              </>
            )}
          </button>

        </div>

      </form>
    </div>
  );
};

export default RequestHireForm