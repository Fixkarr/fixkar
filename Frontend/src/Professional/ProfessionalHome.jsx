import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SlCalender } from "react-icons/sl";
import Availability from "./Availability";
import DayCard from "./DayCard";
import ProfessionalWallet from "./ProfessionalWallet";
import { FaUserTie, FaExclamationTriangle, FaCalendarCheck } from "react-icons/fa";
import { MdOutlineEventBusy } from "react-icons/md";
import useGetMyBookings from "../hooks/useGetMyBookings";
import useGetNotifications from "../hooks/useGetNotifications";
import { generateFCMToken } from "../utils/generateFCMToken";
import EnableNotificationModal from "../Components/EnableNotificationModal";
import ProfessionalBankDetails from "./ProfessionalBankDetails";
import PendingBankReview from "../Components/PendingBankReview";

const ProfessionalHome = () => {
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);

  useGetMyBookings()
  useGetNotifications()
  const navigate = useNavigate()
  const { currentUserData } = useSelector((state) => state.user);
  const user = currentUserData?.user;
  const userId = currentUserData?.user?.userId;
  const bankVerificationStatus = user?.bankVerificationStatus;
  const isProfileComplete = (user?.isChargesDefined);
   const [showSelectedDays, setShowSelectedDays] = useState([]);

   useEffect(() => {
    if (currentUserData?.user?.busyDays) {
      const converted = currentUserData.user.busyDays.map(date => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0); // normalize
        return d;
      });
     setShowSelectedDays(converted)
    }
    
  }, [currentUserData]);

  useEffect(() => {
   if(window.Notification){
      if (Notification.permission !== "granted") {
    setShowNotificationModal(true);
  } else {
    setShowNotificationModal(false);
  }
   }
  }, []);

   const handleEnableNotifications = async () => {
    try {
       setNotifLoading(true);
        if (Notification.permission === "denied") {
      alert(
        "Notifications are blocked. Please enable them manually from your browser settings."
      );
      return;
    }

    // CASE 2: Ask for permission (first time)
    const permission = await Notification.requestPermission();

      if (permission === "granted") {
      await generateFCMToken();
      setShowNotificationModal(false);
    }
    } catch (err) {
    } finally {
      setNotifLoading(false);
    }
  };

    const handleCloseModal = () => {
    setShowNotificationModal(false);
  };

return (
<>
<EnableNotificationModal
  show={showNotificationModal}
  onClose={handleCloseModal}
  onEnable={handleEnableNotifications}
  loading={notifLoading}
/>

<div
  className="container-fluid p-0 min-vh-100"
  style={{
    background: "linear-gradient(180deg,#f8fbff 0%,#eef5ff 100%)"
  }}
>

  {/* 🔵 HEADER */}
  <div
    className="px-4 pt-4 pb-4"
    style={{
      background: "linear-gradient(135deg,#0d6efd,#3a86ff)",
      borderBottomLeftRadius: "40px",
      borderBottomRightRadius: "40px"
    }}
  >
    <div className="d-flex justify-content-between align-items-start">

      <div>
        <h5 className="fw-semibold text-white mb-1">
          Welcome back,
        </h5>
        <h3 className="fw-bold text-warning mb-1">
          {userId?.fullName} 👋
        </h3>
        <small className="text-white opacity-75">
          Manage availability & earnings
        </small>
      </div>

      <div className="d-flex gap-3 fs-5 text-white mt-2">
        <FaCalendarCheck
          role="button"
          onClick={()=>navigate("/professional/bookings")}
        />
        <FaUserTie
          role="button"
          onClick={()=>navigate("/professional/profile")}
        />
      </div>
    </div>

    {/* ✅ BUTTON CLEARLY VISIBLE */}
    <div className="mt-4">
      <button
        className="btn fw-semibold rounded-pill px-4 py-2 shadow"
        style={{
          background: "rgba(255,255,255,0.2)",
          backdropFilter: "blur(6px)",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.4)"
        }}
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        <SlCalender className="me-2"/>
        Mark Busy Days
      </button>
    </div>
  </div>


  {/* 🔵 CONTENT AREA (NO NEGATIVE MARGIN NOW) */}
  <div className="container py-4">

    {/* PROFILE WARNING */}
    {!isProfileComplete && (
      <div
        className="card border-0 shadow-lg rounded-4 mb-4"
        style={{
          background: "linear-gradient(135deg,#fff8e1,#fff3cd)"
        }}
      >
        <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">

          <div>
            <h6 className="fw-bold text-dark mb-1">
              <FaExclamationTriangle className="me-2 text-warning"/>
              Profile Incomplete
            </h6>
            <small className="text-muted">
              Add service charges and description to improve booking rate.
            </small>
          </div>

          <button
            onClick={() => navigate("/professional/complete-profile")}
            className="btn btn-warning rounded-pill px-4 fw-semibold shadow-sm"
          >
            Complete Now
          </button>

        </div>
      </div>
    )}


    {/* BUSY DAYS */}
    {showSelectedDays.length > 0 && (
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body">

          <h6 className="fw-bold mb-3 text-danger d-flex align-items-center gap-2">
            <MdOutlineEventBusy />
            Busy Schedule
          </h6>

          <div className="d-flex flex-wrap gap-2">
            {showSelectedDays.map((d) => {
              const dateObj = new Date(d);
              return (
                <span
                  key={d}
                  className="px-3 py-2 rounded-pill text-white fw-semibold small shadow-sm"
                  style={{
                    background: "linear-gradient(90deg,#ff416c,#ff4b2b)"
                  }}
                >
                  {dateObj.getDate()}{" "}
                  {dateObj.toLocaleString("default",{month:"short"})}{" "}
                  {dateObj.getFullYear()}
                </span>
              );
            })}
          </div>

        </div>
      </div>
    )}


    {/* BANK CARDS */}
    {bankVerificationStatus === "N/A" && (
      <div className="card border-0 shadow-sm rounded-4 mb-4 p-3 bg-white">
        <ProfessionalBankDetails />
      </div>
    )}

    {bankVerificationStatus === "pending" && (
      <div className="card border-0 shadow-sm rounded-4 mb-4 p-3 bg-white">
        <PendingBankReview />
      </div>
    )}


    {/* WALLET SECTION */}
    <div
      className="card border-0 shadow-lg rounded-4 mb-5 p-4"
      style={{
        background: "linear-gradient(135deg,#e0f7fa,#ffffff)"
      }}
    >
      <ProfessionalWallet />
    </div>

  </div>


  {/* 🔵 MODAL (UNCHANGED LOGIC) */}
  <div
    className="modal fade"
    id="exampleModal"
    tabIndex="-1"
    aria-hidden="true"
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content border-0 rounded-4 shadow-lg">
        <div className="modal-body position-relative p-4">
          <button
            type="button"
            className="btn-close position-absolute top-0 end-0 m-3"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
          <Availability />
        </div>
      </div>
    </div>
  </div>

</div>
</>
);
};

export default ProfessionalHome;
