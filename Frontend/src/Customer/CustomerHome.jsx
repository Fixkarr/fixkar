import React from 'react'
import { useSelector } from 'react-redux'
import SearchSection from './SearchComponent'
import { useDispatch } from 'react-redux'
import { setSelectedLocation, setSelectedService } from '../redux/location.slice'
import { useNavigate } from 'react-router-dom'

import MobileNotVerified from './MobileNotVerified'
import { FaEnvelope, FaIdBadge, FaPhone, FaSearch, FaTools } from "react-icons/fa";
import useGetMyBookings from '../hooks/useGetMyBookings'
import useGetNotifications from '../hooks/useGetNotifications'
import { generateFCMToken } from '../utils/generateFCMToken'
import EnableNotificationModal from '../Components/EnableNotificationModal'
import { useEffect } from 'react'
import { useState } from 'react'
import useGetAnnouncements from '../hooks/useGetAnnouncements'
import AnnouncementBanner from '../Components/AnnouncementBanner'
import { ClipLoader } from 'react-spinners'
import Working from './Working'
import NeedHelp from '../utils/NeedHelp'
import ReferEarnBanner from '../Components/ReferEarnBanner'
import '../css/customerHome.css'
import useGetMyConversations from '../hooks/useGetMyConversations'

const CustomerHome = () => {
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const { announcements, loading, error, refetch } = useGetAnnouncements();
  useGetMyBookings();
  useGetNotifications();
  useGetMyConversations()
  const {currentUserData} = useSelector((state)=>state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()


  const handleLocationSelect = (location)=>{
    dispatch(setSelectedLocation(location));
    navigate("/customer/hire-professionals");
  }

  const handleServiceSelect = (service) => {
    dispatch(setSelectedService(service));
  };


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

    <div className="customer-home-page">

      {/* =========================================
          COMPACT HERO
      ========================================= */}
      <section className="customer-home-hero">

        <div className="customer-home-glow customer-home-glow-one" />
        <div className="customer-home-glow customer-home-glow-two" />

        <div className="customer-home-hero-content">

          <div className="customer-home-brand">
            <h5>Fixkar</h5>
          </div>

          <div className="customer-home-profile-row">

            <div className="customer-home-intro">

              <span className="customer-home-eyebrow">
                <span className="customer-home-live-dot" />
                CUSTOMER DASHBOARD
              </span>

              <h2>
                Hi, {currentUserData?.user?.userId?.fullName} 👋
              </h2>

              <p>
                Book trusted professionals in seconds
              </p>

              <div className="customer-home-feature-badges">
                <span>Verified</span>
                <span>Fast Booking</span>
                <span>Nearby Experts</span>
              </div>

            </div>

          <div className="customer-home-contact">

  <div className="customer-home-contact-item">
    <span className="customer-home-contact-icon">
      <FaIdBadge />
    </span>

    <span className="customer-home-contact-text">
      {currentUserData?.user?.userId?._id}
    </span>
  </div>

  <div className="customer-home-contact-item">
    <span className="customer-home-contact-icon">
      <FaPhone />
    </span>

    <span className="customer-home-contact-text">
      {currentUserData?.user?.userId?.mobile}
    </span>
  </div>

  <div className="customer-home-contact-item">
    <span className="customer-home-contact-icon">
      <FaEnvelope />
    </span>

    <span className="customer-home-contact-text">
      {currentUserData?.user?.userId?.email}
    </span>
  </div>

  <div className="customer-home-contact-item customer-home-reward">
    <span className="customer-home-contact-icon">
      🪙
    </span>

    <span className="customer-home-contact-text">
      {currentUserData?.user?.rewardCredits ?? 0} Reward Credits
    </span>
  </div>

</div>

          </div>

          <div className="customer-home-help">
            <NeedHelp user={"customer"} />
          </div>

        </div>
      </section>


      {/* =========================================
          SEARCH SECTION
      ========================================= */}
      <section className="customer-home-search-section">

        <div className="customer-home-container">

          <div className="customer-home-search-card">

            <div className="customer-home-search-heading">
              <div className="customer-home-search-icon">
                <span>
                <FaSearch size={14}/>

                </span>
              </div>

              <div>
                <span>FIND A PROFESSIONAL</span>
                <h6>Search & Hire Professionals</h6>
              </div>
            </div>

            <SearchSection
              onLocationSelect={handleLocationSelect}
              onServiceSelect={handleServiceSelect}
              onTaskSelect={() => navigate("/customer/hire-professionals")}
            />

          </div>

        </div>
      </section>


      {/* =========================================
          MOBILE VERIFICATION
      ========================================= */}
      {!currentUserData?.user?.userId?.isMobileVerified && (
        <section className="customer-home-alert-section">

          <div className="customer-home-container">
            <MobileNotVerified />
          </div>

        </section>
      )}


      {/* =========================================
          ANNOUNCEMENTS
      ========================================= */}
      {loading ? (
        <div className="customer-home-loader">
          <ClipLoader size={30} color="blue" />
        </div>
      ) : (
        announcements?.length > 0 &&
        announcements.map((a) => (
          <AnnouncementBanner
            key={a._id}
            announcement={a}
          />
        ))
      )}


      {/* =========================================
          REFERRAL
      ========================================= */}
      <section className="customer-home-content-section">
        <div className="customer-home-container">
          <ReferEarnBanner />
        </div>
      </section>


      {/* =========================================
          SERVICES
      ========================================= */}
      <section className="customer-home-services-section">

        <div className="customer-home-container">

          <div className="customer-home-section-heading">
            <div>
              <span>SERVICES</span>
              <h3>What do you need?</h3>
            </div>
          </div>

          <Working />

        </div>

      </section>

    </div>
  </>
);
}

export default CustomerHome
