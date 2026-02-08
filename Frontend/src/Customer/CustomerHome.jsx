import React from 'react'
import { useSelector } from 'react-redux'
import SearchSection from './SearchComponent'
import { useDispatch } from 'react-redux'
import { setSelectedLocation, setSelectedService } from '../redux/location.slice'
import { useNavigate } from 'react-router-dom'

import MobileNotVerified from './MobileNotVerified'
import { FaSearchLocation, FaUserCheck, FaTools } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { IoSparkles } from "react-icons/io5";
import useGetMyBookings from '../hooks/useGetMyBookings'
import useGetNotifications from '../hooks/useGetNotifications'
import { generateFCMToken } from '../utils/generateFCMToken'
import EnableNotificationModal from '../Components/EnableNotificationModal'
import { useEffect } from 'react'
import { useState } from 'react'

const isApp = () => {
  return !!(window.ReactNativeWebView || window.Android);
};

const CustomerHome = () => {
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);

  useGetMyBookings();
  useGetNotifications()
  const {currentUserData} = useSelector((state)=>state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const userId = currentUserData?.user?.userId?._id;

  const handleLocationSelect = (location)=>{
    dispatch(setSelectedLocation(location));
    navigate("/customer/hire-professionals");
  }

  const handleServiceSelect = (service) => {
    dispatch(setSelectedService(service));
    navigate("/customer/hire-professionals");
  };

 useEffect(() => {
   if (isApp()) return;

  const alreadyAsked = localStorage.getItem(`notif${userId}`);

  if (!alreadyAsked  && window.Notification) {
     if (Notification.permission !== "granted") {
        setShowNotificationModal(true);
      }
  }
}, [userId]);


  const handleEnableNotifications = async () => {
  try {
    setNotifLoading(true);
    // 👉 Browser case
    await generateFCMToken();
    localStorage.setItem(`notif${currentUserData?.user?.userId?._id}`, "true");
    setShowNotificationModal(false);
  }
   catch (err) {
    console.log(err);
  } finally {
    setNotifLoading(false);
  }
};

  const handleCloseModal = () => {
    localStorage.setItem(`notif${currentUserData?.user?.userId?._id}`, "true");
    setShowNotificationModal(false);
  };

  
  return (
    <>
     {!isApp() && (
        <EnableNotificationModal
          show={showNotificationModal}
          onClose={handleCloseModal}
          onEnable={handleEnableNotifications}
          loading={notifLoading}
        />
      )}
      
    <div className="container-fluid p-3 bg-light">

  {/* ===== HERO SECTION ===== */}
  <div className="card border-0 shadow-lg rounded-4 overflow-hidden mb-4">

    <div
      className="p-4 p-md-5 text-white"
      style={{
        background: "linear-gradient(135deg, #0d6efd, #6ea8fe)",
      }}
    >
      <div className="row align-items-center">

        {/* LEFT CONTENT */}
        <div className="col-md-7">
          <h2 className="fw-bold mb-2">
            Welcome,{" "}
            <span className="fs-1 text-warning">
              {currentUserData?.user?.userId?.fullName}!
            </span>
          </h2>

          <p className="fs-5 opacity-75 mb-3">
            Find trusted professionals near you in just a few clicks
          </p>

          <div className="d-flex flex-wrap gap-3 mb-3">
            <span className="badge bg-light text-primary px-3 py-2 rounded-pill">
              <FaUserCheck className="me-1" /> Verified Professionals
            </span>
            <span className="badge bg-light text-primary px-3 py-2 rounded-pill">
              <FaTools className="me-1" /> Skilled Services
            </span>
            <span className="badge bg-light text-primary px-3 py-2 rounded-pill">
              <MdLocationOn className="me-1" /> Nearby Experts
            </span>
          </div>
        </div>

        {/* RIGHT ILLUSTRATION */}
        <div className="col-md-5 d-none d-md-block text-end">
          <IoSparkles size={120} className="opacity-50" />
        </div>

      </div>
    </div>

    {/* ===== SEARCH AREA ===== */}
    <div className="card-body bg-white p-4 rounded-bottom-4">
      <h5 className="fw-semibold text-primary mb-2">
        <FaSearchLocation className="me-2" />
        Search Professionals Near You
      </h5>
      <p className="text-muted small mb-3">
        Select your location and service to get the best professionals around you
      </p>

      <SearchSection
        onLocationSelect={handleLocationSelect}
        onServiceSelect={handleServiceSelect}
      />
    </div>
  </div>

  {/* ===== MOBILE VERIFICATION ALERT ===== */}
  {!currentUserData?.user?.userId?.isMobileVerified && (
    <div className="mb-4">
      <MobileNotVerified />
    </div>
  )}

  
</div>
    </>

  )
}

export default CustomerHome
