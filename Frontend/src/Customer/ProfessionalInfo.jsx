import React, { useState, useEffect } from "react";
import { useParams, useNavigate, href } from "react-router-dom";
import axios from "axios";
import { server_url } from "../App";
import { ClipLoader } from "react-spinners";
import { CiLocationOn } from "react-icons/ci";
import { IoChatbubbleEllipsesOutline} from "react-icons/io5";
import { FaUserTie, FaMoneyBillWave, FaInfoCircle, FaTools } from "react-icons/fa";
import RequestHireForm from "./RequestHireForm";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedProfessional } from "../redux/professionalInfo.slice";
import { toast } from "react-toastify";
import ProReviews from "../Professional/ProReviews";
import ProfessionalGallerySection from "./ProfessionalGallerySection";
import SearchSection from "./SearchComponent";
import { setDistance } from "../redux/distance.slice";
import { getDistanceMatrixData } from "../utils/getDistanceMatrixData";
import useLoadGoogleMaps from "../hooks/useLoadGoogleMap";
import CallButton from "../Components/CallButton";
import FormResponseSummary from "../Admin/AdminComponents/Utils/FormResponseSummary";

const ProfessionalInfo = () => {
  const mapsLoaded = useLoadGoogleMaps();
  const [loading, setLoading] = useState(false);
  const [professionalInfo, setProfessionalInfo] = useState(null);
  const isProfessionalInfo = Boolean(professionalInfo);
  const { selectedLocation } = useSelector(state => state.location);
  const { currentUserData } = useSelector(state => state.user);

  
    const [showHireModal, setShowHireModal] = useState(false);
    const [showLocationGate, setShowLocationGate] = useState(false);


  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

useEffect(() => {
   if (!professionalInfo?.address) return;
  const calculateDistance = async () => {
    if (
      !mapsLoaded ||
      !selectedLocation?.lat ||
      !selectedLocation?.lng ||
      !professionalInfo?.address?.lat ||
      !professionalInfo?.address?.lng
    ) {
      return;
    }

    try {
      const result = await getDistanceMatrixData({
        customerLat: selectedLocation.lat,
        customerLng: selectedLocation.lng,
        professionalLat: professionalInfo.address.lat,
        professionalLng: professionalInfo.address.lng,
      });

      dispatch(setDistance(result));
    } catch (err) {
      toast.error("Failed to calculate distance");
    }
  };

  calculateDistance();
}, [  mapsLoaded,
  selectedLocation?.lat,
  selectedLocation?.lng,
  professionalInfo?.address?.lat,
  professionalInfo?.address?.lng]);

  useEffect(() => {
    const fetchProfessionalInfo = async () => {
      try {
        setLoading(true);
        const result = await axios.get(
          `${server_url}/api/customer/get-professional-info/${id}`,
          { withCredentials: true }
        );
        setProfessionalInfo(result?.data?.professionalInfo);
        dispatch(setSelectedProfessional(result?.data?.professionalInfo));
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfessionalInfo();
  }, []);

  useEffect(() => {
  if (!showHireModal && !showLocationGate) {
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "auto";
  }
}, [showHireModal, showLocationGate]);

  const handleHireClick = () => {
  // 1️⃣ Not authenticated
  if (!currentUserData?.user?.userId) {
    toast.info("Please login to continue");
    navigate("/login");
    return;
  }

  // 2️⃣ Auth but location missing
  if (!selectedLocation?.lat || !selectedLocation?.lng) {
    toast.warn("Please select your location to calculate visiting charges");
    setShowLocationGate(true);
    return;
  }

  // 3️⃣ All good
  setShowHireModal(true);
};


  /* ================= LOADER ================= */
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <ClipLoader size={50} color="#0d6efd" />
      </div>
    );
  }

  /* ================= ERROR STATE ================= */
  if (!isProfessionalInfo) {
    return (
      <div className="d-flex justify-content-center bg-light">
        <div className="card shadow border-0 rounded-4 p-4 text-center" style={{ maxWidth: 420 }}>
          <h5 className="fw-bold text-danger mb-2">Oops! Something went wrong</h5>
          <p className="text-muted small">
            Please refresh the page or try again later.
          </p>
          <div className="d-flex gap-2 justify-content-center">
            <button className="btn btn-primary btn-sm" onClick={() => window.location.reload()}>
              Refresh
            </button>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(-1)}>
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 pt-5">
      {showLocationGate && (
  <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content rounded-4">

        <div className="modal-header">
          <h5 className="modal-title fw-semibold">
            📍 Select Your Location
          </h5>
          <button
            className="btn-close"
            onClick={() => setShowLocationGate(false)}
          />
        </div>

        <div className="modal-body">
          <p className="text-muted small mb-3">
            We need your exact location to calculate visiting charges
          </p>

          {/* 🔥 ONLY LOCATION PICKER */}
          <SearchSection
            onlyLocation
            onLocationSelect={() => {
              setShowLocationGate(false);
              toast.success("Location confirmed. You can now hire.");
            }}
          />
        </div>
      </div>
    </div>
  </div>
)}

      {/* ================= HEADER CARD ================= */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div
          className="p-4 text-white rounded-top-4"
          style={{ background: "linear-gradient(135deg, #0d6efd, #4f9cff)" }}
        >
          <div className="row align-items-center">
            <div className="col-7 d-flex align-items-center gap-3">
              <img
                src={professionalInfo?.profilePicture}
                alt="Profile"
                className="rounded-circle border border-3 border-white"
                style={{ width: 90, height: 90, objectFit: "cover" }}
              />
              <div>
                <h4 className="fw-bold mb-1">
                  {professionalInfo?.userId?.fullName}
                </h4>
                <div className="d-flex align-items-center gap-2">
                  <FaUserTie />
                  <span>{professionalInfo?.profession.name}</span>
                </div>
                <span className="badge bg-success mt-2">
                  {professionalInfo?.status?.[0]?.toUpperCase() +
                    professionalInfo?.status?.slice(1)}
                </span>
              </div>
            </div>

            <div className="col-5 mt-3 mt-md-0 d-flex gap-2 justify-content-md-end">
              <button
                className="btn btn-outline-light btn-sm"
                onClick={() => {
                if (!currentUserData?.user?.userId) {
                  toast.info("Please login to chat");
                  navigate("/login");
                } else {
                  navigate(`/customer/chat/${id}`);
                }
              }}
              >
                <IoChatbubbleEllipsesOutline /> Chat
              </button>

              <CallButton currentUserData={currentUserData} professionalInfo={professionalInfo}/>

              <button
                className="btn btn-light btn-sm fw-semibold"
                onClick={handleHireClick}
              >
                Hire
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= ABOUT & ADDRESS ================= */}
  <div className="card border-0 shadow rounded-4 mb-4 overflow-hidden">

  {/* Header */}
  <div
    className="px-4 py-3 text-white"
    style={{
      background: "linear-gradient(135deg, #0d6efd, #4f9cff)",
    }}
  >
    <div className="d-flex align-items-center gap-2">
      <FaInfoCircle size={18} />
      <h6 className="mb-0 fw-semibold">Professional Details</h6>
    </div>
    <small className="opacity-75">
      About the professional & service location
    </small>
  </div>

  {/* Body */}
  <div className="card-body bg-light">

    {/* About */}
    {professionalInfo?.description && (
      <div className="mb-4">
        <div className="d-flex align-items-start gap-2 mb-1">
          <FaInfoCircle className="text-primary mt-1" />
          <h6 className="fw-semibold mb-0">About</h6>
        </div>

        <p className="text-muted small mb-0 ps-4">
          {professionalInfo.description}
        </p>
      </div>
    )}

    {/* Address */}
    {professionalInfo?.address?.addressLine && (
      <div>
        <div className="d-flex align-items-start gap-2 mb-1">
          <CiLocationOn className="text-danger mt-1" />
          <h6 className="fw-semibold mb-0">Service Address</h6>
        </div>

        <p className="text-muted small mb-0 ps-4">
          {professionalInfo.address.addressLine}
        </p>
      </div>
    )}

  </div>
</div>

{/* ================= SKILLS & EXPERTISE ================= */}
<div className="card border-0 shadow rounded-4 mb-4 overflow-hidden">

  {/* Header */}
  <div
    className="px-4 py-3 text-white"
    style={{
     background: "linear-gradient(135deg, #0d6efd, #6ea8fe)",
    }}
  >
    <div className="d-flex align-items-center gap-2">
      <FaTools size={18} />
      <h6 className="mb-0 fw-semibold">Skills & Expertise</h6>
    </div>
    <small className="opacity-75">
      Services this professional is experienced in
    </small>
  </div>

  {/* Body */}
  <div className="card-body bg-light">
    {professionalInfo?.selectedSkills &&
    professionalInfo.selectedSkills.length > 0 ? (
      <div className="d-flex flex-wrap gap-2">
        {professionalInfo.selectedSkills.map((skill) => (
          <span
            key={skill._id}
            className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-semibold"
            style={{ fontSize: "0.85rem" }}
          >
            {skill.name}
          </span>
        ))}
      </div>
    ) : (
      <div className="alert alert-warning border-0 rounded-4 mb-0">
        <strong>No skills listed.</strong><br />
        This professional has not added specific skills yet.
      </div>
    )}
  </div>
</div>



      {/* ================= CHARGES ================= */}
   <FormResponseSummary summary={professionalInfo?.charges?.summary}/>

      {/* {=======================Reviews=============} */}

      {professionalInfo?.reviews.length !==0 && <div className="review">
            <ProReviews reviews={professionalInfo?.reviews}/>
          </div>}
          
          {/* ================gallery============== */}
      {professionalInfo?.gallery.length !==0 && <ProfessionalGallerySection professionalInfo={professionalInfo}/>}

      {/* ================= MODAL ================= */}
     {showHireModal && (
  <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content rounded-4">

        <div className="modal-header">
          <h5 className="modal-title fw-semibold">
            Request Hiring
          </h5>
          <button
            className="btn-close"
            onClick={() => setShowHireModal(false)}
          />
        </div>

        <div className="modal-body">
          <RequestHireForm proInfo={professionalInfo} />
        </div>

      </div>
    </div>
  </div>
)}


    </div>
  );
};

export default ProfessionalInfo;
