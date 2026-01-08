import React from 'react'
import { useSelector } from 'react-redux'
import '../css/customerhome.css'
import SearchSection from './SearchComponent'
import { useDispatch } from 'react-redux'
import { setSelectedLocation, setSelectedService } from '../redux/location.slice'
import { useNavigate } from 'react-router-dom'

import MobileNotVerified from './MobileNotVerified'
import Messages from '../Professional/Messages'
import { FaSearchLocation, FaUserCheck, FaTools } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { IoSparkles } from "react-icons/io5";

const CustomerHome = () => {

  const {currentUserData} = useSelector((state)=>state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLocationSelect = (location)=>{
    dispatch(setSelectedLocation(location));
    navigate("/customer/hire-professionals");
  }

  const handleServiceSelect = (service) => {
    dispatch(setSelectedService(service));
    navigate("/customer/hire-professionals");
  };


  
  return (
    
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

  {/* ===== MESSAGES SECTION ===== */}
  <div className="card border-0 shadow-sm rounded-4">
    <div className="card-header bg-white border-0 d-flex align-items-center gap-2">
      <FaUserCheck className="text-primary" />
      <h6 className="mb-0 fw-semibold">Recent Messages</h6>
    </div>
    <div className="card-body p-0">
      <Messages />
    </div>
  </div>

</div>

  )
}

export default CustomerHome
