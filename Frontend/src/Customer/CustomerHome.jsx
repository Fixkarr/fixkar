import React from 'react'
import { useSelector } from 'react-redux'
import SearchSection from './SearchComponent'
import { useDispatch } from 'react-redux'
import { setSelectedLocation, setSelectedService } from '../redux/location.slice'
import { useNavigate } from 'react-router-dom'

import MobileNotVerified from './MobileNotVerified'
import { FaSearchLocation, FaUserCheck, FaTools, FaBook, FaBell } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { IoSparkles } from "react-icons/io5";
import useGetMyBookings from '../hooks/useGetMyBookings'
import useGetNotifications from '../hooks/useGetNotifications'
import { generateFCMToken } from '../utils/generateFCMToken'
import EnableNotificationModal from '../Components/EnableNotificationModal'
import { useEffect } from 'react'
import { useState } from 'react'
import { FiMessageSquare } from 'react-icons/fi'
import DashboardNavigator from '../utils/DashboardNavigator'

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

<div className="container-fluid p-0 bg-light min-vh-100">

  {/* 🔵 Modern Gradient Hero */}
  <div
    className="text-white p-4 pb-5"
    style={{
      background: "linear-gradient(135deg,#0d6efd,#00c6ff)",
      borderBottomLeftRadius: "30px",
      borderBottomRightRadius: "30px"
    }}
  >
    {/* Top Icons */}
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h5 className="fw-bold mb-0">Fixkar</h5>

      <DashboardNavigator/>
    </div>

    <h4 className="fw-bold">
      Hi, {currentUserData?.user?.userId?.fullName} 👋
    </h4>

    <p className="small opacity-75 mb-3">
      Book trusted professionals in seconds
    </p>

    {/* Feature Badges */}
    <div className="d-flex gap-2 flex-wrap">
      <span className="badge bg-light text-primary rounded-pill px-3 py-2">
        Verified
      </span>
      <span className="badge bg-light text-primary rounded-pill px-3 py-2">
        Fast Booking
      </span>
      <span className="badge bg-light text-primary rounded-pill px-3 py-2">
        Nearby Experts
      </span>
    </div>
  </div>

  {/* 🔵 Floating Search Section */}
  <div className="container" style={{marginTop:"-40px"}}>
    <div className="card border-0 shadow-lg rounded-4 p-3">

      <h6 className="fw-semibold text-primary mb-3">
        Search & Hire Professionals
      </h6>

      <SearchSection
        onLocationSelect={handleLocationSelect}
        onServiceSelect={handleServiceSelect}
      />
    </div>
  </div>

  {/* 🔵 Mobile Verification Alert */}
  {!currentUserData?.user?.userId?.isMobileVerified && (
    <div className="container mt-4">
      <MobileNotVerified />
    </div>
  )}

  {/* 🔵 Floating Hire Button */}
  <button
    className="btn btn-primary rounded-circle shadow-lg"
    style={{
      position: "fixed",
      bottom: "80px",
      right: "20px",
      width: "65px",
      height: "65px"
    }}
    onClick={()=>navigate("/customer/hire-professionals")}
  >
    <FaTools />
  </button>

</div>
</>
)
}

export default CustomerHome
