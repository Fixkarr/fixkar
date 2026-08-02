import React, { useState, useEffect } from "react";
import { useParams, useNavigate, href, useLocation } from "react-router-dom";
import axios from "axios";
import { server_url } from "../App";
import { ClipLoader } from "react-spinners";
import { CiLocationOn } from "react-icons/ci";
import { IoChatbubbleEllipsesOutline} from "react-icons/io5";
import { FaUserTie, FaMoneyBillWave, FaInfoCircle, FaTools, FaCalendar, FaShareAlt, FaStar } from "react-icons/fa";
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
import DayCard from "../Professional/DayCard";
import Navbar from "../Components/Navbar";
import DashboardNavigator from "../utils/DashboardNavigator";
import { Helmet } from "react-helmet-async";
import { generateAbout, generateFaqs } from "../utils/generateFaqs";
import FAQSection from "../Components/FAQSection";
import FixkarLoader from "../Components/FixkarLoader";
import "./professional-public-profile.css";

const ProfessionalInfo = () => {
  const mapsLoaded = useLoadGoogleMaps();
  const [loading, setLoading] = useState(false);
  const [professionalInfo, setProfessionalInfo] = useState(null);
  const isProfessionalInfo = Boolean(professionalInfo);
  const { selectedLocation } = useSelector(state => state.location);
  const { currentUserData } = useSelector(state => state.user);
  const location = useLocation();
  const faqs = generateFaqs(professionalInfo);

  const faqSchema =
  faqs.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      }
    : null;
  
    const [showHireModal, setShowHireModal] = useState(false);
    const [showLocationGate, setShowLocationGate] = useState(false);


  const { id, slug } = useParams();
    const about = generateAbout(professionalInfo, id);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const averageRating =
  professionalInfo?.reviews?.length
    ? (
        professionalInfo.reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        ) / professionalInfo.reviews.length
      ).toFixed(1)
    : 0;

const reviewCount = professionalInfo?.reviews?.length || 0;

const personSchema = professionalInfo && {
  "@context": "https://schema.org",
  "@type": "Person",
  name: professionalInfo.userId.fullName,
  image: professionalInfo.profilePicture,
  jobTitle: professionalInfo.profession.name,
  url: `https://www.fixkarr.com/professional/profile/visit/${id}/${professionalInfo.slug}`,
  description: about,
  address: {
    "@type": "PostalAddress",
    streetAddress: professionalInfo.address.addressLine,
  }
};

const serviceSchema = professionalInfo && {
   "@context": "https://schema.org",
  "@type": "ProfessionalService",

  name: `${professionalInfo.userId.fullName} - ${professionalInfo.profession.name}`,

  image: professionalInfo.profilePicture,

  url: `https://www.fixkarr.com/professional/profile/visit/${id}/${professionalInfo.slug}`,

  areaServed: professionalInfo.address.addressLine,

  provider: {
    "@type": "Person",
    name: professionalInfo.userId.fullName,
  },

  aggregateRating:
    reviewCount > 0
      ? {
          "@type": "AggregateRating",
          ratingValue: parseFloat(averageRating),
          reviewCount,
        }
      : undefined,
}


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
   navigate("/login", {
  state: { from: location }
    });
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

  const handleShareProfile = async () => {
    const url = professionalInfo?.shortCode
      ? `${window.location.origin}/s/${professionalInfo.shortCode}`
      : window.location.href;
    const shareData = {
      title: `${professionalInfo?.userId?.fullName} | FixKar`,
      text: `View ${professionalInfo?.userId?.fullName}'s professional profile on FixKar.`,
      url,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(url);
      toast.success("Profile link copied");
    } catch (error) {
      if (error?.name !== "AbortError") {
        toast.error("Unable to share this profile");
      }
    }
  };


  /* ================= LOADER ================= */
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <FixkarLoader/>
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
    <>
    <Helmet>
        <title>
  {professionalInfo
    ? `${professionalInfo.userId.fullName} - Verified ${professionalInfo.profession.name} in ${professionalInfo.address.addressLine} | FixKar`
    : "FixKar"}
  </title>

  <meta
  name="description"
  content={
    about
  }
/>

  <link
  rel="canonical"
  href={`https://www.fixkarr.com/professional/profile/visit/${id}/${professionalInfo?.slug}`}
/>
<script type="application/ld+json">
{JSON.stringify(personSchema)}
</script>

<script type="application/ld+json">
{JSON.stringify(serviceSchema)}
</script>

{faqSchema && (
  <script type="application/ld+json">
    {JSON.stringify(faqSchema)}
  </script>
)}
    </Helmet>
    {!currentUserData?.user ? <Navbar/> :  <div
        className="text-white p-4"
        style={{
          background: "linear-gradient(135deg,#0d6efd,#00c6ff)",
          borderBottomLeftRadius: "25px",
          borderBottomRightRadius: "25px"
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="fw-bold mb-0">Professional Information</h5>

          <DashboardNavigator/>
        </div>

        <p className="mt-2 small opacity-75">
         Here is the professional Details!
        </p>
      </div>
}
    <div className="public-profile">
    <div className="container public-profile__container py-4">
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
      <div className="card public-profile__hero border-0 rounded-4 mb-4">
        <div
          className="public-profile__hero-bg p-3 p-md-4 text-white rounded-4"
        >
          <div className="row align-items-center g-4">
            <div className="col-12 col-lg-7 d-flex align-items-center gap-3">
              <img
                src={professionalInfo?.profilePicture || "/Images/placeholderProfile.avif"}
                alt="Profile"
                className="public-profile__avatar rounded-circle"
              />
              <div>
                <h4 className="fw-bold mb-1">
                  {professionalInfo?.userId?.fullName}
                </h4>
                <div className="d-flex align-items-center gap-2 small">
                  <FaUserTie />
                  <span>{professionalInfo?.profession.name}</span>
                </div>
                <div className="d-flex align-items-center gap-2 flex-wrap mt-2">
                  <span className="badge public-profile__verified-badge">Verified professional</span>
                  <span className="public-profile__rating"><FaStar /> {averageRating} <small>({reviewCount})</small></span>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-5 d-flex gap-2 justify-content-lg-end flex-wrap">
              <button className="btn public-profile__action-btn" onClick={handleShareProfile}>
                <FaShareAlt /> <span>Share</span>
              </button>
              <button
                className="btn public-profile__action-btn"
                onClick={() => {
                if (!currentUserData?.user?.userId) {
                  toast.info("Please login to chat");
                  navigate("/login", {
                    state: { from: location }
                  });
                } else {
                  navigate(`/customer/chat/${id}`);
                }
              }}
              >
                <IoChatbubbleEllipsesOutline /> Chat
              </button>

              <CallButton currentUserData={currentUserData} professionalInfo={professionalInfo}/>

              <button
                className="btn public-profile__hire-btn fw-semibold"
                onClick={handleHireClick}
              >
                Hire
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= ABOUT & ADDRESS ================= */}
  <div className="card public-profile__section border-0 rounded-4 mb-4 overflow-hidden">

  {/* Header */}
  <div
    className="public-profile__section-header px-4 py-3 text-white"
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
  <div className="card-body public-profile__section-body">

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

{ professionalInfo.busyDays?.length !== 0 &&
<div className="card public-profile__section border-0 rounded-4 mb-4 overflow-hidden">
 <div
    className="public-profile__section-header px-4 py-3 text-white"
  >
    <div className="d-flex align-items-center gap-2">
      <FaCalendar size={18} />
      <h6 className="mb-0 fw-semibold">Not Available on these dates</h6>
    </div>
     <small className="opacity-75">
      Dates this professional is not Available
    </small>
  </div>

    <div className="public-profile__busy-days d-flex p-3 gap-3">
   {professionalInfo.busyDays?.map((date, idx) => {
  return (
      <DayCard  
        key={idx}
        year={new Date(date).getFullYear()}
        day={String(new Date(date).getDate()).padStart(2, "0")}
        month={new Date(date).toLocaleString("default", {
          month: "short",
        })}
      />
    
  );
})}
</div>

  </div>
  }



{/* ================= SKILLS & EXPERTISE ================= */}
<div className="card public-profile__section border-0 rounded-4 mb-4 overflow-hidden">

  {/* Header */}
  <div
    className="public-profile__section-header px-4 py-3 text-white"
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
  <div className="card-body public-profile__section-body">
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
      
      {faqs && <FAQSection faqs={faqs}/>}
          
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
    </div>
    </>
  );
};

export default ProfessionalInfo;
