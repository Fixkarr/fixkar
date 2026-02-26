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

<div className="container-fluid p-0 bg-light min-vh-100">

  {/* 🔵 Premium Gradient Header */}
  <div
    className="text-white p-4 pb-5"
    style={{
      background: "linear-gradient(135deg,#0d6efd,#00c6ff)",
      borderBottomLeftRadius: "30px",
      borderBottomRightRadius: "30px"
    }}
  >
    <div className="d-flex justify-content-between align-items-center mb-3">

      <div>
        <h4 className="fw-bold mb-1">
          Welcome, {userId?.fullName} 👋
        </h4>
        <small className="opacity-75">
          Manage availability & track earnings
        </small>
      </div>

      <div className="d-flex gap-3 fs-5">
        <FaCalendarCheck role="button" onClick={()=>navigate("/professional/bookings")} />
        <FaUserTie role="button" onClick={()=>navigate("/professional/profile")} />
      </div>
    </div>

    {/* Glass Button */}
    <button
      className="btn btn-light bg-white bg-opacity-25 border-0 text-white rounded-pill px-4 fw-semibold d-flex align-items-center gap-2"
      data-bs-toggle="modal"
      data-bs-target="#exampleModal"
    >
      <SlCalender />
      Mark Busy Days
    </button>
  </div>
      <div
    className="modal fade"
    id="exampleModal"
    tabIndex="-1"
    aria-hidden="true"
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content border-0 rounded-4 shadow">
        <div className="modal-body position-relative">
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

  {/* 🔵 Floating Content Container */}
  <div className="container" style={{marginTop:"-40px"}}>

    {/* Profile Completion Card */}
    {!isProfileComplete && (
      <div className="card border-0 shadow-lg rounded-4 mb-4">
        <div className="card-body d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">

          <div>
            <h6 className="fw-bold text-warning">
              <FaExclamationTriangle className="me-2"/>
              Complete Your Profile
            </h6>
            <small className="text-muted">
              Add charges & details to increase booking chances.
            </small>
          </div>

          <button
            onClick={() => navigate("/professional/complete-profile")}
            className="btn btn-warning rounded-pill px-4 fw-semibold"
          >
            Complete Now
          </button>

        </div>
      </div>
    )}


    {/* Busy Days Section */}
    {showSelectedDays.length > 0 && (
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body">
          <h6 className="fw-bold mb-3 text-danger d-flex align-items-center gap-2">
            <MdOutlineEventBusy />
            Busy Dates
          </h6>

          <div className="d-flex flex-wrap gap-2">
            {showSelectedDays.map((d) => (
              <span
                key={d}
                className="badge bg-danger-subtle text-danger px-3 py-2 rounded-pill shadow-sm"
              >
                {new Date(d).getDate()}{" "}
                {new Date(d).toLocaleString("default",{month:"short"})}
              </span>
            ))}
          </div>
        </div>
      </div>
    )}


    {/* Bank Verification Cards */}
    {bankVerificationStatus === "N/A" && (
      <div className="card border-0 shadow-sm rounded-4 mb-4 p-3">
        <ProfessionalBankDetails />
      </div>
    )}

    {bankVerificationStatus === "pending" && (
      <div className="card border-0 shadow-sm rounded-4 mb-4 p-3">
        <PendingBankReview />
      </div>
    )}


    {/* Wallet Section */}
    <div className="card border-0 shadow-lg rounded-4 mb-5 p-3">
      <ProfessionalWallet />
    </div>

  </div>

</div>
</>
);
};

export default ProfessionalHome;
