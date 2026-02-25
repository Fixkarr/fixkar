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

  <div className="container-fluid p-md-5 p-3 bg-light">

  {/* ===== TOP BAR ===== */}
  <div className="card border-0 shadow-lg rounded-4 mb-4 overflow-hidden">
    <div
      className="p-4 d-flex justify-content-between align-items-center flex-wrap gap-3 text-white"
      style={{
        background: "linear-gradient(135deg, #0d6efd, #6ea8fe)",
      }}
    >
      <div>
        <h2 className="fw-bold mb-0">
          Welcome,{" "}
          <span className="text-warning fs-1">
            {userId?.fullName}!
          </span>
        </h2>
        <small className="opacity-75">
          Manage your availability & earnings
        </small>
      </div>

      <button
        type="button"
        className="btn btn-light rounded-pill px-4 fw-semibold d-flex align-items-center gap-2"
        role="button"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        <SlCalender />
        <span className="hide">Mark Busy Days</span>
      </button>
    </div>
  </div>

  {/* ===== MODAL ===== */}
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

  {/* ===== COMPLETE PROFILE WARNING ===== */}
  {!isProfileComplete && (
    <div className="alert alert-warning d-flex gap-3 flex-column flex-md-row align-items-center p-4 rounded-4 shadow-sm mb-4">
      <div className="flex-grow-1">
        <h5 className="fw-bold mb-2">
          <FaExclamationTriangle className="me-2" />
          Complete Your Profile!
        </h5>
        <p className="small mb-2">
          Your profile is currently incomplete. Completing it will help
          customers understand you better and increase your chances of
          getting work.
        </p>

        <ul className="small ps-3 mb-0">
          <li>Profile description missing</li>
          <li>Service charges not set</li>
          <li>Profile looks incomplete to customers</li>
        </ul>
      </div>

      <button
        onClick={() => navigate("/professional/complete-profile")}
        className="btn btn-primary rounded-pill px-4 fw-semibold"
      >
        Complete Now
      </button>
    </div>
  )}

  {/* ===== BUSY DAYS ===== */}
  {!showSelectedDays.length <= 0 && (
    <>
      <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">
        <MdOutlineEventBusy className="text-danger" />
        You are busy on these dates
      </h4>

      <div className="d-flex flex-wrap gap-3 mb-4">
        {showSelectedDays.map((d) => (
          <DayCard
            key={d}
            year={new Date(d).getFullYear()}
            day={String(new Date(d).getDate()).padStart(2, "0")}
            month={new Date(d).toLocaleString("default", {
              month: "short",
            })}
          />
        ))}
      </div>
    </>
  )}

  {/* Bank not verified component  */}
  {bankVerificationStatus === "N/A" && <ProfessionalBankDetails/>}
  {bankVerificationStatus === "pending" && <PendingBankReview/>}

  {/* ===== WALLET ===== */}
  <ProfessionalWallet />

</div>
 </>

  );
};

export default ProfessionalHome;
