import React, { useState, useEffect } from "react";
import { useParams, useNavigate, href, useLocation } from "react-router-dom";
import axios from "axios";
import { server_url } from "../App";
import { ClipLoader } from "react-spinners";
import { CiLocationOn } from "react-icons/ci";
import { IoChatbubbleEllipsesOutline} from "react-icons/io5";
import {
  FaUserTie,
  FaStar,
  FaShareAlt,
  FaCheck,
  FaShieldAlt,
  FaArrowRight,
  FaCommentDots,
  FaTools,
  FaUserCircle,
  FaChevronRight,
  FaQuoteLeft,
  FaInfoCircle,
  FaCheckCircle,
  FaCalendar,
  FaImages,
} from "react-icons/fa";
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
import { Helmet } from "react-helmet-async";
import { generateAbout, generateFaqs } from "../utils/generateFaqs";
import FAQSection from "../Components/FAQSection";
import FixkarLoader from "../Components/FixkarLoader";
import "./professional-public-profile.css";
import { FaMapLocationDot, FaRupeeSign } from "react-icons/fa6";
import ProfessionalAchievementBadge from '../Components/ProfessionalAchievementBadge'


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

  const handleChatClick = () => {
    if (!currentUserData?.user?.userId) {
      toast.info("Please login to chat");
      navigate("/login", { state: { from: location } });
      return;
    }

    navigate(`/customer/chat/${id}`);
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
        content={about}
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


    {/* =====================================================
        LOGGED OUT HEADER
    ====================================================== */}

    {!currentUserData?.user ? (
      <>
        <Navbar />
        <div className="mt-5" />
      </>
    ) : (
      <div className="public-profile__logged-header">
        <div className="public-profile__logged-header-inner">
          <div className="public-profile__logged-icon">
            <FaUserTie />
          </div>

          <div>
            <h5>Professional Profile</h5>
            <p>
              Explore professional details, expertise & availability
            </p>
          </div>
        </div>
      </div>
    )}


    {/* =====================================================
        PAGE
    ====================================================== */}

    <div className="public-profile">

      <div className="container public-profile__container py-4">


        {/* =================================================
            LOCATION GATE
        ================================================== */}

        {showLocationGate && (
          <div
            className="modal fade show d-block"
            style={{ background: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">

              <div className="modal-content rounded-4">

                <div className="modal-header">

                  <h5 className="modal-title fw-semibold">
                    <FaMapLocationDot className="me-2 text-primary" />
                    Select Your Location
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

                  <SearchSection
                    onlyLocation
                    onLocationSelect={() => {
                      setShowLocationGate(false);
                      toast.success(
                        "Location confirmed. You can now hire."
                      );
                    }}
                  />

                </div>

              </div>

            </div>
          </div>
        )}


        {/* =================================================
            PREMIUM PROFILE HERO
        ================================================== */}

        <section className="public-profile__hero">

          <div className="public-profile__hero-background">

            <span className="public-profile__hero-orb orb-one" />
            <span className="public-profile__hero-orb orb-two" />
            <span className="public-profile__hero-shine" />


            <div className="public-profile__hero-inner">


              {/* ================= PROFILE IDENTITY ================= */}

              <div className="public-profile__identity">

                <div className="public-profile__avatar-container">

                  <img
                    src={
                      professionalInfo?.profilePicture ||
                      "/Images/placeholderProfile.avif"
                    }
                    alt={
                      professionalInfo?.userId?.fullName ||
                      "Professional"
                    }
                    className="public-profile__avatar"
                  />

                  <span className="public-profile__avatar-status">
                    <span />
                  </span>

                </div>


                <div className="public-profile__identity-content">

                  <div className="public-profile__name-line">

                    <h1>
                      {professionalInfo?.userId?.fullName}
                    </h1>

                    <span className="public-profile__verified-check">
                      <FaCheck />
                    </span>

                  </div>


                  <div className="public-profile__profession-line">

                    <span className="public-profile__profession-icon">
                      <FaUserTie />
                    </span>

                    <span>
                      {professionalInfo?.profession?.name}
                    </span>

                  </div>


                  <div className="public-profile__profile-meta">

                    <span className="public-profile__verified-pill">
                      <FaShieldAlt />
                      <span>Verified Professional</span>
                    </span>

                    <span className="public-profile__rating-pill">
                      <FaStar />
                      <strong>{averageRating}</strong>
                      <span>•</span>
                      <small>
                        {reviewCount} reviews
                      </small>
                    </span>

                    <span className="public-profile__verified-pill">
                       <ProfessionalAchievementBadge
                          professional={professionalInfo}
                          variant="dark"
                        />
                    </span>

                  </div>

                </div>

              </div>


              {/* ================= ACTIONS ================= */}

              <div className="public-profile__desktop-actions">

                <button
                  type="button"
                  className="public-profile__hero-action"
                  onClick={handleShareProfile}
                >
                  <span className="public-profile__hero-action-icon">
                    <FaShareAlt />
                  </span>

                  <span>Share</span>
                </button>


                <button
                  type="button"
                  className="public-profile__hero-action"
                  onClick={handleChatClick}
                >
                  <span className="public-profile__hero-action-icon">
                    <IoChatbubbleEllipsesOutline />
                  </span>

                  <span>Chat</span>
                </button>


                <div className="public-profile__call-action">
                  <CallButton
                    currentUserData={currentUserData}
                    professionalInfo={professionalInfo}
                  />
                </div>


                <button
                  type="button"
                  className="public-profile__hire-action"
                  onClick={handleHireClick}
                >
                  <FaUserTie />
                  <span>Hire Now</span>
                  <FaArrowRight />
                </button>

              </div>

            </div>


            {/* ================= MOBILE ACTIONS ================= */}

            <div className="public-profile__mobile-actions">

              <button
                type="button"
                onClick={handleShareProfile}
              >
                <FaShareAlt />
                <span>Share</span>
              </button>

              <button
                type="button"
                onClick={handleChatClick}
              >
                <IoChatbubbleEllipsesOutline />
                <span>Chat</span>
              </button>

              <div className="public-profile__mobile-call">
                <CallButton
                  currentUserData={currentUserData}
                  professionalInfo={professionalInfo}
                />
              </div>

              <button
                type="button"
                className="is-hire"
                onClick={handleHireClick}
              >
                <FaUserTie />
                <span>Hire</span>
              </button>

            </div>

          </div>

        </section>


        {/* =================================================
            QUICK TRUST STRIP
        ================================================== */}

        <section className="public-profile__trust-strip">

          <div className="public-profile__trust-item">

            <span className="public-profile__trust-icon">
              <FaShieldAlt />
            </span>

            <div>
              <strong>Verified</strong>
              <small>Professional</small>
            </div>

          </div>


          <div className="public-profile__trust-divider" />


          <div className="public-profile__trust-item">

            <span className="public-profile__trust-icon">
              <FaStar />
            </span>

            <div>
              <strong>{averageRating}</strong>
              <small>Rating</small>
            </div>

          </div>


          <div className="public-profile__trust-divider" />


          <div className="public-profile__trust-item">

            <span className="public-profile__trust-icon">
              <FaCommentDots />
            </span>

            <div>
              <strong>{reviewCount}</strong>
              <small>Reviews</small>
            </div>

          </div>


          <div className="public-profile__trust-divider" />


          <div className="public-profile__trust-item">

            <span className="public-profile__trust-icon">
              <FaTools />
            </span>

            <div>
              <strong>
                {professionalInfo?.selectedSkills?.length || 0}
              </strong>
              <small>Skills</small>
            </div>

          </div>

        </section>


        {/* =================================================
            MAIN INFORMATION GRID
        ================================================== */}

        <div className="public-profile__information-grid">


          {/* ================= ABOUT ================= */}

          <section className="public-profile__info-card">

            <div className="public-profile__card-header">

              <div className="public-profile__card-heading">

                <span className="public-profile__card-icon">
                  <FaUserCircle />
                </span>

                <div>
                  <h2>About Professional</h2>
                  <p>Know more about this professional</p>
                </div>

              </div>

              <FaChevronRight className="public-profile__header-arrow" />

            </div>


            <div className="public-profile__card-body">

              {professionalInfo?.description ? (

                <div className="public-profile__about-content">

                  <div className="public-profile__about-icon">
                    <FaQuoteLeft />
                  </div>

                  <p>
                    {professionalInfo.description}
                  </p>

                </div>

              ) : (

                <div className="public-profile__empty-state">

                  <FaInfoCircle />

                  <span>
                    No professional description available.
                  </span>

                </div>

              )}

            </div>

          </section>


          {/* ================= SERVICE LOCATION ================= */}

          <section className="public-profile__info-card">

            <div className="public-profile__card-header">

              <div className="public-profile__card-heading">

                <span className="public-profile__card-icon location">
                  <CiLocationOn />
                </span>

                <div>
                  <h2>Service Location</h2>
                  <p>Professional service area</p>
                </div>

              </div>

              <FaChevronRight className="public-profile__header-arrow" />

            </div>


            <div className="public-profile__card-body">

              {professionalInfo?.address?.addressLine ? (

                <div className="public-profile__location-box">

                  <div className="public-profile__location-icon">
                    <CiLocationOn />
                  </div>

                  <div>

                    <span>Service Address</span>

                    <p>
                      {professionalInfo.address.addressLine}
                    </p>

                  </div>

                </div>

              ) : (

                <div className="public-profile__empty-state">

                  <CiLocationOn />

                  <span>
                    Service location not available.
                  </span>

                </div>

              )}

            </div>

          </section>


          {/* =================================================
              SKILLS
          ================================================== */}

          <section className="public-profile__info-card public-profile__skills-card">

            <div className="public-profile__card-header">

              <div className="public-profile__card-heading">

                <span className="public-profile__card-icon skills">
                  <FaTools />
                </span>

                <div>
                  <h2>Skills & Expertise</h2>
                  <p>Professional expertise & capabilities</p>
                </div>

              </div>

            </div>


            <div className="public-profile__card-body">

              {professionalInfo?.selectedSkills &&
              professionalInfo.selectedSkills.length > 0 ? (

                <div className="public-profile__skills-list">

                  {professionalInfo.selectedSkills.map((skill) => (

                    <span
                      key={skill._id}
                      className="public-profile__skill-chip"
                    >
                      <FaCheckCircle />
                      {skill.name}
                    </span>

                  ))}

                </div>

              ) : (

                <div className="public-profile__empty-state">

                  <FaTools />

                  <span>
                    No specific skills have been listed yet.
                  </span>

                </div>

              )}

            </div>

          </section>


          {/* =================================================
              AVAILABILITY
          ================================================== */}

          {professionalInfo?.busyDays?.length !== 0 && (

            <section className="public-profile__info-card public-profile__availability-card">

              <div className="public-profile__card-header">

                <div className="public-profile__card-heading">

                  <span className="public-profile__card-icon calendar">
                    <FaCalendar />
                  </span>

                  <div>
                    <h2>Unavailable Dates</h2>
                    <p>
                      This professional is not available on
                      these dates
                    </p>
                  </div>

                </div>

              </div>


              <div className="public-profile__card-body">

                <div className="public-profile__busy-days">

                  {professionalInfo.busyDays?.map(
                    (date, idx) => {

                      return (
                        <DayCard
                          key={idx}
                          year={new Date(date).getFullYear()}
                          day={String(
                            new Date(date).getDate()
                          ).padStart(2, "0")}
                          month={new Date(
                            date
                          ).toLocaleString(
                            "default",
                            {
                              month: "short",
                            }
                          )}
                        />
                      );

                    }
                  )}

                </div>

              </div>

            </section>

          )}

        </div>


        {/* =================================================
            CHARGES
        ================================================== */}

        <section className="public-profile__charges">

          <div className="public-profile__section-title">

            <div className="public-profile__section-title-icon">
              <FaRupeeSign />
            </div>

            <div>
              <h2>Service Info</h2>
              <p>
                Transparent pricing for professional services
              </p>
            </div>

          </div>

          <FormResponseSummary
            summary={professionalInfo?.charges?.summary}
          />

        </section>


        {/* =================================================
            REVIEWS
        ================================================== */}

        {professionalInfo?.reviews.length !== 0 && (

          <section className="public-profile__reviews">

            <div className="public-profile__section-title">

              <div className="public-profile__section-title-icon review">
                <FaStar />
              </div>

              <div>
                <h2>Customer Reviews</h2>
                <p>
                  What customers say about this professional
                </p>
              </div>

            </div>

            <ProReviews
              reviews={professionalInfo?.reviews}
            />

          </section>

        )}


        {/* =================================================
            FAQ
        ================================================== */}

        {faqs && (
          <section className="public-profile__faq">
            <FAQSection faqs={faqs} />
          </section>
        )}


        {/* =================================================
            GALLERY
        ================================================== */}

        {professionalInfo?.gallery.length !== 0 && (

          <section className="public-profile__gallery">

            <div className="public-profile__section-title">

              <div className="public-profile__section-title-icon gallery">
                <FaImages />
              </div>

              <div>
                <h2>Professional Work</h2>
                <p>
                  Previous work & service gallery
                </p>
              </div>

            </div>

            <ProfessionalGallerySection
              professionalInfo={professionalInfo}
            />

          </section>

        )}


        {/* =================================================
            MOBILE STICKY CTA
        ================================================== */}

        <div className="public-profile__mobile-cta">

          <button
            type="button"
            className="public-profile__mobile-chat"
            onClick={handleChatClick}
          >
            <IoChatbubbleEllipsesOutline />
            <span>Chat</span>
          </button>

          <button
            type="button"
            className="public-profile__mobile-hire"
            onClick={handleHireClick}
          >
            <FaUserTie />
            <span>Hire Now</span>
            <FaArrowRight />
          </button>

        </div>


        {/* =================================================
            HIRE MODAL
        ================================================== */}

        {showHireModal && (

          <div
            className="modal fade show d-block"
            style={{
              background: "rgba(0,0,0,0.5)",
            }}
          >

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

                  <RequestHireForm
                    proInfo={professionalInfo}
                  />

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
