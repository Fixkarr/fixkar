import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SlCalender } from "react-icons/sl";
import Availability from "./Availability";
import ProfessionalWallet from "./ProfessionalWallet";
import { FaExclamationTriangle, FaBell } from "react-icons/fa";
import { MdOutlineEventBusy } from "react-icons/md";
import useGetMyBookings from "../hooks/useGetMyBookings";
import useGetNotifications from "../hooks/useGetNotifications";
import { generateFCMToken } from "../utils/generateFCMToken";
import EnableNotificationModal from "../Components/EnableNotificationModal";
import ProfessionalBankDetails from "./ProfessionalBankDetails";
import PendingBankReview from "../Components/PendingBankReview";
import DashboardNavigator from "../utils/DashboardNavigator";
import useGetAnnouncements from "../hooks/useGetAnnouncements";
import { ClipLoader } from "react-spinners";
import AnnouncementBanner from "../Components/AnnouncementBanner";
import RecentBookings from "./professionalBooking/RecentBookings";
import RecentTransactions from "./RecentTransactions";
import NeedHelp from "../utils/NeedHelp";
import { useProfileCompletion } from "../hooks/useProfileCompletion";
import ProfileHealthCard from "./ProfileHealthCard/ProfileHealthCard";
import ProfessionalAchievementCard from "./ProfessionalAchievementCard";
import "./professional-dashboard.css";
import ReferEarnBanner from "../Components/ReferEarnBanner";

const ProfessionalHome = () => {
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const { announcements, loading } = useGetAnnouncements();
  useGetMyBookings();
  useGetNotifications();
  const navigate = useNavigate();
  const { currentUserData } = useSelector((state) => state.user);
  const user = currentUserData?.user;
  const profileCompletion = useProfileCompletion(user);
  const userId = currentUserData?.user?.userId;
  const bankVerificationStatus = user?.bankVerificationStatus;
  const isProfileComplete = user?.isChargesDefined;
  const hasOverviewSidePanel =
    !isProfileComplete || ["N/A", "pending"].includes(bankVerificationStatus);
  const [showSelectedDays, setShowSelectedDays] = useState([]);

  useEffect(() => {
    if (currentUserData?.user?.busyDays) {
      setShowSelectedDays(
        currentUserData.user.busyDays.map((date) => {
          const d = new Date(date);
          d.setHours(0, 0, 0, 0);
          return d;
        }),
      );
    }
  }, [currentUserData]);

  useEffect(() => {
    if (window.Notification)
      setShowNotificationModal(Notification.permission !== "granted");
  }, []);

  const handleEnableNotifications = async () => {
    try {
      setNotifLoading(true);
      if (Notification.permission === "denied") {
        alert(
          "Notifications are blocked. Please enable them manually from your browser settings.",
        );
        return;
      }
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        await generateFCMToken();
        setShowNotificationModal(false);
      }
    } finally {
      setNotifLoading(false);
    }
  };

  return (
    <>
      <EnableNotificationModal
        show={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        onEnable={handleEnableNotifications}
        loading={notifLoading}
      />
      <div className="professional-dashboard min-vh-100">
        <div className="professional-dashboard__hero">
          <div className="professional-dashboard__hero-inner">
            <div className="d-flex justify-content-between align-items-start gap-3">
              <div>
                <h5 className="fw-semibold text-white mb-1">Welcome back,</h5>
                <h3 className="fw-bold text-warning mb-1">
                  {userId?.fullName} 👋
                </h3>
                <small className="text-white opacity-75">
                  Manage availability & earnings
                </small>
              </div>
              <DashboardNavigator />
            </div>
            <NeedHelp user="professional" />
            <div className="d-flex flex-wrap gap-2 mt-3">
              <button
                className="btn professional-dashboard__busy-btn fw-semibold rounded-pill px-4 py-2"
                style={{
                  background: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(6px)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.4)",
                }}
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                <SlCalender className="me-2" />
                Mark Busy Days
              </button>
              <button
                onClick={() => navigate("/professional/pickup")}
                className="btn fw-semibold rounded-pill px-4 py-2"
                style={{ background: "#fff", color: "#0d6efd" }}
              >
                <FaBell className="me-2" />
                Pickup Requests
              </button>
            </div>
          </div>
        </div>

        <div className="professional-dashboard__content">
          {showSelectedDays.length > 0 && (
            <div className="card professional-dashboard__card border-0 rounded-4 mb-3">
              <div className="card-body">
                <h6 className="fw-bold mb-3 text-danger d-flex align-items-center gap-2">
                  <MdOutlineEventBusy />
                  Busy Schedule
                </h6>
                <div className="d-flex flex-wrap gap-2">
                  {showSelectedDays.map((d) => (
                    <span
                      key={d.toISOString()}
                      className="px-3 py-2 rounded-pill text-white fw-semibold small shadow-sm"
                      style={{
                        background: "linear-gradient(90deg,#ff416c,#ff4b2b)",
                      }}
                    >
                      {d.getDate()}{" "}
                      {d.toLocaleString("default", { month: "short" })}{" "}
                      {d.getFullYear()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
          {profileCompletion && (
            <ProfileHealthCard
              profileCompletion={profileCompletion}
              navigate={navigate}
            />
          )}
          <ProfessionalAchievementCard professional={user} />

          <div
            className={`professional-dashboard__overview-grid ${!hasOverviewSidePanel ? "professional-dashboard__overview-grid--single" : ""}`}
          >
            <ProfessionalWallet />
            <div className="professional-dashboard__side-stack">
             {!isProfileComplete && (
  <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-3">
    <div className="card-body p-3 p-md-4">
      <div className="d-flex align-items-center gap-3">
        
        {/* Icon */}
        <div
          className="bg-warning bg-opacity-10 text-warning rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
          style={{ width: "46px", height: "46px" }}
        >
          <FaExclamationTriangle size={18} />
        </div>

        {/* Content */}
        <div className="flex-grow-1">
          <h6 className="fw-bold text-dark mb-1">
            Complete your profile
          </h6>

          <p className="text-muted small mb-0">
            Add your description and service charges to start receiving bookings.
          </p>
        </div>

        {/* Action */}
        <button
          onClick={() => navigate("/professional/complete-profile")}
          className="btn btn-primary rounded-pill px-3 px-md-4 fw-semibold flex-shrink-0"
        >
          Complete
        </button>

      </div>
    </div>
  </div>
)}
              {bankVerificationStatus === "N/A" && (
                <div className="card professional-dashboard__card border-0 rounded-4 p-3 bg-white">
                  <ProfessionalBankDetails />
                </div>
              )}
              {bankVerificationStatus === "pending" && (
                <div className="card professional-dashboard__card border-0 rounded-4 p-3 bg-white">
                  <PendingBankReview />
                </div>
              )}
            </div>
          </div>

          <div className="professional-dashboard__activity-grid">
            <RecentBookings />
            <RecentTransactions professionalId={user?._id} />
          </div>
        </div>

        {loading ? (
          <div className="professional-dashboard__announcements">
            <ClipLoader size={30} color="blue" />
          </div>
        ) : (
          announcements?.length > 0 &&
          announcements.map((a) => (
            <AnnouncementBanner key={a._id} announcement={a} />
          ))
        )}

        <ReferEarnBanner/>

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
