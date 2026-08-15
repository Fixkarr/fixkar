import {
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaFilePdf,
  FaImage,
  FaStar,
  FaBirthdayCake,
  FaMoneyBillWave,
  FaCheck,
  FaTimes,
  FaPaperPlane,
  FaGavel,
  FaUser,
  FaEnvelope,
  FaInfoCircle,
  FaClock,
  FaCalendarDay,
  FaArrowDown,
  FaArrowUp,
  FaDownload,
  FaEye,
  FaIdCard,
  FaPhone,
  FaSkiing,
  FaTools,
  FaPlay,
  FaImages,
  FaBan,
  FaUniversity,
  FaUserCheck,
  FaRupeeSign,
} from "react-icons/fa";
import { FaLocationPin, FaToolbox, FaUserTie } from "react-icons/fa6";
import DayCard from "../../../Professional/DayCard";
import axios from "axios";
import { server_url } from "../../../App";
import { useState } from "react";
import { toast } from "react-toastify";
import Section from "./Section";
import Info from "./Info";
import BankVerificationActions from "./BankVerificationActions";
import FormResponseSummary from "./FormResponseSummary";

const ProfessionalDetailCard = ({ p }) => {
  const [reason, setReason] = useState("");
  const [accLoad, setAccLoad] = useState(false);
  const [rejLoad, setRejLoad] = useState(false);
  const [showRejectBox, setShowRejectBox] = useState(false);
  const handleAccept = async (proId) => {
    try {
      setAccLoad(true);
      const result = await axios.post(
        `${server_url}/api/admin/accept-professional-application`,
        { proUserId: proId },
        { withCredentials: true },
      );
      toast.success(result.data.message);
      setAccLoad(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setAccLoad(false);
    }
  };
  const handleReject = async (proId, reason) => {
    try {
      setRejLoad(true);
      const result = await axios.post(
        `${server_url}/api/admin/reject-professional-application`,
        { proUserId: proId, reason },
        { withCredentials: true },
      );
      toast.success(result.data.message);
      setRejLoad(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setRejLoad(false);
    }
  };

 return (
  <div className="fixkar-pro-profile">

    {/* =========================================================
        PROFILE HERO
    ========================================================= */}
    <div className="card border-0 shadow-sm overflow-hidden rounded-4 mb-3">

      <div className="fixkar-pro-hero p-3 p-md-4 text-white">

        <div className="row g-3 align-items-center">

          {/* PROFILE */}
          <div className="col-12 col-lg-7">

            <div className="d-flex align-items-center gap-3">

              <div className="fixkar-pro-avatar-wrap">

                {p?.profilePicture ? (
                  <img
                    src={p.profilePicture}
                    alt={p?.userId?.fullName || "Professional"}
                    className="fixkar-pro-avatar"
                  />
                ) : (
                  <div className="fixkar-pro-avatar fixkar-pro-avatar-empty">
                    <FaUserTie />
                  </div>
                )}

                <span
                  className={`fixkar-online-dot ${
                    p?.status === "approved"
                      ? "bg-success"
                      : p?.status === "pending"
                        ? "bg-warning"
                        : "bg-danger"
                  }`}
                />
              </div>

              <div className="min-w-0">

                <div className="d-flex flex-wrap align-items-center gap-2 mb-1">

                  <h4 className="fw-bold mb-0 text-truncate">
                    {p?.userId?.fullName || "Unnamed Professional"}
                  </h4>

                  {p?.status && (
                    <span
                      className={`badge rounded-pill px-2 py-1 ${
                        p.status === "approved"
                          ? "bg-success"
                          : p.status === "pending"
                            ? "bg-warning text-dark"
                            : "bg-danger"
                      }`}
                    >
                      {p.status}
                    </span>
                  )}

                </div>

                <div className="small opacity-75 mb-2">
                  {p?.profession?.name || "Profession not specified"}
                </div>

                <div className="d-flex flex-wrap gap-2">

                  {p?.userId?.isMobileVerified && (
                    <span className="fixkar-hero-chip">
                      <FaCheckCircle />
                      Mobile Verified
                    </span>
                  )}

                  {p?.userId?.isEmailVerified && (
                    <span className="fixkar-hero-chip">
                      <FaCheckCircle />
                      Email Verified
                    </span>
                  )}

                  {p?.onBoarded && (
                    <span className="fixkar-hero-chip">
                      <FaUserCheck />
                      Onboarded
                    </span>
                  )}

                </div>

              </div>
            </div>
          </div>


          {/* RANK */}
          <div className="col-12 col-lg-5">

            <div className="fixkar-rank-panel">

              <div className="d-flex justify-content-between align-items-center">

                <div>
                  <small className="text-white-50 d-block">
                    Professional Rank
                  </small>

                  <div className="fw-bold fs-5">
                    {p?.professionalRank?.tier ||
                      p?.achievements?.rank ||
                      "NEWCOMER"}
                  </div>
                </div>

                <div className="fixkar-rank-icon">
                  <FaUserCheck />
                </div>

              </div>

              <div className="row g-2 mt-2">

                <div className="col-4">
                  <div className="fixkar-rank-stat">
                    <strong>
                      {p?.professionalRank?.level ?? 1}
                    </strong>
                    <small>Level</small>
                  </div>
                </div>

                <div className="col-4">
                  <div className="fixkar-rank-stat">
                    <strong>
                      {p?.professionalRank?.score ?? 0}
                    </strong>
                    <small>Score</small>
                  </div>
                </div>

                <div className="col-4">
                  <div className="fixkar-rank-stat">
                    <strong>
                      {p?.achievements?.completedBookings ??
                        p?.professionalRank?.completedBookings ??
                        0}
                    </strong>
                    <small>Jobs</small>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </div>


    {/* =========================================================
        QUICK OVERVIEW
    ========================================================= */}
    <div className="row g-2 g-md-3 mb-3">

      <div className="col-6 col-lg-3">
        <div className="fixkar-mini-stat">
          <div className="fixkar-mini-icon text-primary">
            <FaTools />
          </div>

          <div>
            <small>Service</small>
            <strong>
              {p?.profession?.name || "Not specified"}
            </strong>
          </div>
        </div>
      </div>


      <div className="col-6 col-lg-3">
        <div className="fixkar-mini-stat">
          <div className="fixkar-mini-icon text-success">
            <FaCheckCircle />
          </div>

          <div>
            <small>Completed</small>
            <strong>
              {p?.achievements?.completedBookings ??
                p?.professionalRank?.completedBookings ??
                0}
            </strong>
          </div>
        </div>
      </div>


      <div className="col-6 col-lg-3">
        <div className="fixkar-mini-stat">
          <div className="fixkar-mini-icon text-warning">
            <FaClock />
          </div>

          <div>
            <small>Next Milestone</small>
            <strong>
              {p?.professionalRank?.nextMilestoneBookings ?? "—"}
            </strong>
          </div>
        </div>
      </div>


      <div className="col-6 col-lg-3">
        <div className="fixkar-mini-stat">
          <div className="fixkar-mini-icon text-danger">
            <FaBan />
          </div>

          <div>
            <small>Rejections</small>
            <strong>
              {p?.rejectionCount ?? 0}
            </strong>
          </div>
        </div>
      </div>

    </div>


    {/* =========================================================
        BASIC INFORMATION
    ========================================================= */}
    <div className="card border-0 shadow-sm rounded-4 mb-3">

      <div className="card-body p-3 p-md-4">

        <div className="d-flex align-items-center justify-content-between mb-3">

          <div>
            <h6 className="fw-bold mb-1">
              <FaUser className="text-primary me-2" />
              Basic Information
            </h6>

            <small className="text-muted">
              Personal, contact and account details
            </small>
          </div>

          <span className="fixkar-section-number">
            01
          </span>

        </div>


        <div className="row g-2 g-md-3">

          <div className="col-12 col-md-6">
            <div className="fixkar-info-box">
              <FaUser />
              <div>
                <small>Full Name</small>
                <strong>
                  {p?.userId?.fullName || "Not available"}
                </strong>
              </div>
            </div>
          </div>


          <div className="col-12 col-md-6">
            <div className="fixkar-info-box">
              <FaEnvelope />
              <div className="min-w-0">
                <small>Email</small>
                <strong className="text-break">
                  {p?.userId?.email || "Not available"}
                </strong>
              </div>
            </div>
          </div>


          <div className="col-12 col-md-6">
            <div className="fixkar-info-box">
              <FaPhone />
              <div>
                <small>Mobile Number</small>
                <strong>
                  {p?.userId?.mobile || "Not available"}
                </strong>
              </div>
            </div>
          </div>


          <div className="col-12 col-md-6">
            <div className="fixkar-info-box">
              <FaBirthdayCake />
              <div>
                <small>Date of Birth</small>
                <strong>
                  {p?.dob
                    ? new Date(p.dob).toLocaleDateString()
                    : "Not available"}
                </strong>
              </div>
            </div>
          </div>


          <div className="col-12">
            <div className="fixkar-info-box">
              <FaLocationPin />
              <div>
                <small>Address</small>
                <strong>
                  {p?.address?.addressLine || "Address not available"}
                </strong>

                {(p?.address?.lat != null ||
                  p?.address?.lng != null) && (
                  <small className="text-muted mt-1">
                    Coordinates:{" "}
                    {p?.address?.lat ?? "—"},{" "}
                    {p?.address?.lng ?? "—"}
                  </small>
                )}
              </div>
            </div>
          </div>


          {p?.description && (
            <div className="col-12">
              <div className="fixkar-description-box">
                <FaInfoCircle />
                <div>
                  <small>Description</small>
                  <p className="mb-0">
                    {p.description}
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>


    {/* =========================================================
        SERVICE & SKILLS
    ========================================================= */}
    <div className="card border-0 shadow-sm rounded-4 mb-3">

      <div className="card-body p-3 p-md-4">

        <div className="d-flex align-items-center gap-3 mb-3">

          {p?.profession?.image ? (
            <img
              src={p.profession.image}
              alt={p?.profession?.name || "Service"}
              className="fixkar-service-image"
            />
          ) : (
            <div className="fixkar-service-image bg-primary-subtle text-primary d-flex align-items-center justify-content-center">
              <FaTools />
            </div>
          )}

          <div>
            <small className="text-muted">
              Primary Service
            </small>

            <h5 className="fw-bold mb-0">
              {p?.profession?.name || "Service not specified"}
            </h5>
          </div>

        </div>


        <div className="border-top pt-3">

          <div className="d-flex justify-content-between align-items-center mb-2">

            <span className="small fw-bold text-dark">
              Selected Skills
            </span>

            <span className="badge bg-primary-subtle text-primary rounded-pill">
              {Array.isArray(p?.selectedSkills)
                ? p.selectedSkills.length
                : 0}
            </span>

          </div>


          {Array.isArray(p?.selectedSkills) &&
          p.selectedSkills.length > 0 ? (

            <div className="d-flex flex-wrap gap-2">

              {p.selectedSkills.map((skill) => (
                <span
                  key={skill?._id || skill?.name}
                  className="fixkar-skill-pill"
                >
                  <FaTools />
                  {skill?.name || "Unnamed skill"}
                </span>
              ))}

            </div>

          ) : (
            <div className="fixkar-empty-box">
              <FaTools />
              <span>
                No personally selected skills.
              </span>
            </div>
          )}


          {/* Profession master skills */}
          {Array.isArray(p?.profession?.skills) &&
          p.profession.skills.length > 0 && (

            <div className="mt-4">

              <div className="small fw-bold mb-2">
                Available Service Skills
              </div>

              <div className="d-flex flex-wrap gap-2">

                {p.profession.skills.map((skill) => (
                  <span
                    key={skill?._id || skill?.name}
                    className="badge bg-light text-dark border rounded-pill px-2 py-1"
                  >
                    {skill?.name || "Unnamed skill"}
                  </span>
                ))}

              </div>

            </div>
          )}

        </div>
      </div>
    </div>


    {/* =========================================================
        ACHIEVEMENTS + RANK
    ========================================================= */}
    <div className="row g-3 mb-3">

      <div className="col-12 col-lg-6">

        <div className="card border-0 shadow-sm rounded-4 h-100">

          <div className="card-body p-3 p-md-4">

            <h6 className="fw-bold mb-3">
              <FaUserCheck className="text-warning me-2" />
              Achievements
            </h6>

            <div className="row g-2">

              <div className="col-6">
                <div className="fixkar-achievement-box">
                  <small>Rank</small>
                  <strong>
                    {p?.achievements?.rank || "—"}
                  </strong>
                </div>
              </div>

              <div className="col-6">
                <div className="fixkar-achievement-box">
                  <small>Completed</small>
                  <strong>
                    {p?.achievements?.completedBookings ?? 0}
                  </strong>
                </div>
              </div>

              <div className="col-6">
                <div className="fixkar-achievement-box">
                  <small>Milestones</small>
                  <strong>
                    {Array.isArray(
                      p?.achievements?.unlockedMilestones
                    )
                      ? p.achievements.unlockedMilestones.length
                      : 0}
                  </strong>
                </div>
              </div>

              <div className="col-6">
                <div className="fixkar-achievement-box">
                  <small>Rewards</small>
                  <strong>
                    {Array.isArray(
                      p?.achievements?.unlockedRewardKeys
                    )
                      ? p.achievements.unlockedRewardKeys.length
                      : 0}
                  </strong>
                </div>
              </div>

            </div>

            {Array.isArray(
              p?.achievements?.unlockedRewardKeys
            ) &&
            p.achievements.unlockedRewardKeys.length > 0 && (

              <div className="mt-3">

                <small className="text-muted d-block mb-2">
                  Unlocked Rewards
                </small>

                <div className="d-flex flex-wrap gap-2">

                  {p.achievements.unlockedRewardKeys.map(
                    (reward) => (
                      <span
                        key={reward}
                        className="badge bg-warning-subtle text-warning-emphasis rounded-pill"
                      >
                        {reward}
                      </span>
                    )
                  )}

                </div>

              </div>
            )}

          </div>
        </div>
      </div>


      <div className="col-12 col-lg-6">

        <div className="card border-0 shadow-sm rounded-4 h-100">

          <div className="card-body p-3 p-md-4">

            <h6 className="fw-bold mb-3">
              <FaCheckCircle className="text-success me-2" />
              Rank Progress
            </h6>

            <div className="row g-2">

              <div className="col-6">
                <div className="fixkar-achievement-box">
                  <small>Tier</small>
                  <strong>
                    {p?.professionalRank?.tier || "—"}
                  </strong>
                </div>
              </div>

              <div className="col-6">
                <div className="fixkar-achievement-box">
                  <small>Level</small>
                  <strong>
                    {p?.professionalRank?.level ?? 0}
                  </strong>
                </div>
              </div>

              <div className="col-6">
                <div className="fixkar-achievement-box">
                  <small>Score</small>
                  <strong>
                    {p?.professionalRank?.score ?? 0}
                  </strong>
                </div>
              </div>

              <div className="col-6">
                <div className="fixkar-achievement-box">
                  <small>Next Level</small>
                  <strong>
                    {p?.professionalRank?.nextLevel ?? "—"}
                  </strong>
                </div>
              </div>

            </div>


            <div className="mt-3 p-3 rounded-3 bg-primary-subtle">

              <div className="d-flex justify-content-between small mb-1">

                <span>
                  Next milestone
                </span>

                <strong>
                  {p?.professionalRank?.completedBookings ?? 0}
                  {" / "}
                  {p?.professionalRank?.nextMilestoneBookings ?? "—"}
                </strong>

              </div>

              <div
                className="progress"
                style={{ height: 7 }}
              >
                <div
                  className="progress-bar bg-primary"
                  style={{
                    width: `${
                      p?.professionalRank?.nextMilestoneBookings
                        ? Math.min(
                            100,
                            ((p?.professionalRank?.completedBookings || 0) /
                              p.professionalRank.nextMilestoneBookings) *
                              100
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>

              <small className="text-muted mt-2 d-block">
                Next tier:{" "}
                {p?.professionalRank?.nextTier || "No next tier"}
              </small>

              <small className="text-muted d-block">
                Reward credits:{" "}
                {p?.professionalRank?.nextRewardCredits ?? 0}
              </small>

            </div>

          </div>
        </div>
      </div>

    </div>


    {/* =========================================================
        CHARGES / PRICING
    ========================================================= */}
    <div className="card border-0 shadow-sm rounded-4 mb-3">

      <div className="card-body p-3 p-md-4">

        <div className="d-flex justify-content-between align-items-center mb-3">

          <div>
            <h6 className="fw-bold mb-1">
              <FaMoneyBillWave className="text-success me-2" />
              Pricing & Charges
            </h6>

            <small className="text-muted">
              Professional's visiting and service pricing
            </small>
          </div>

          <span
            className={`badge rounded-pill ${
              p?.isChargesDefined
                ? "bg-success-subtle text-success"
                : "bg-secondary-subtle text-secondary"
            }`}
          >
            {p?.isChargesDefined
              ? "Pricing Defined"
              : "Pricing Not Defined"}
          </span>

        </div>


        <div className="row g-2 mb-3">

          <div className="col-6 col-md-4">

            <div className="fixkar-price-box">

              <small>
                Visiting Charge
              </small>

              <strong>
                ₹{Number(p?.visitingCharge ?? 0).toLocaleString("en-IN")}
              </strong>

            </div>

          </div>


          <div className="col-6 col-md-4">

            <div className="fixkar-price-box">

              <small>
                Pricing Form
              </small>

              <strong className="text-break">
                {p?.charges?.formKey || "—"}
              </strong>

            </div>

          </div>


          <div className="col-12 col-md-4">

            <div className="fixkar-price-box">

              <small>
                Editable
              </small>

              <strong>
                {p?.charges?.isEditable == null
                  ? "—"
                  : p.charges.isEditable
                    ? "Yes"
                    : "No"}
              </strong>

            </div>

          </div>

        </div>


        {p?.charges?.summary ? (
          <div className="fixkar-pricing-summary">

            <FormResponseSummary
              summary={p.charges.summary}
            />

          </div>
        ) : (
          <div className="fixkar-empty-box">
            <FaMoneyBillWave />
            <span>
              No detailed pricing response available.
            </span>
          </div>
        )}

      </div>
    </div>


    {/* =========================================================
        GALLERY
    ========================================================= */}
    {Array.isArray(p?.gallery) && p.gallery.length > 0 && (

      <div className="card border-0 shadow-sm rounded-4 mb-3">

        <div className="card-body p-3 p-md-4">

          <div className="d-flex justify-content-between align-items-center mb-3">

            <div>
              <h6 className="fw-bold mb-1">
                <FaImages className="text-primary me-2" />
                Work Gallery
              </h6>

              <small className="text-muted">
                Uploaded professional work samples
              </small>
            </div>

            <span className="badge bg-primary-subtle text-primary rounded-pill">
              {p.gallery.length} files
            </span>

          </div>


          <div className="row g-2">

            {p.gallery.map((item, index) => {

              if (!item?.mediaUrl) return null;

              return (
                <div
                  key={item?._id || index}
                  className="col-4 col-sm-3 col-md-2"
                >

                  <a
                    href={item.mediaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-decoration-none"
                  >

                    <div className="fixkar-gallery-item">

                      {item.mediaType === "image" ? (
                        <img
                          src={item.mediaUrl}
                          alt={`Work ${index + 1}`}
                        />
                      ) : (
                        <>
                          <video
                            src={item.mediaUrl}
                            muted
                            preload="metadata"
                          />

                          <span className="fixkar-video-icon">
                            <FaPlay />
                          </span>
                        </>
                      )}

                      <span className="fixkar-media-type">
                        {item.mediaType === "video"
                          ? "VIDEO"
                          : "IMAGE"}
                      </span>

                    </div>

                  </a>
                </div>
              );
            })}

          </div>

        </div>
      </div>
    )}


    {/* =========================================================
        BANK DETAILS
    ========================================================= */}
    {p?.bankDetails && (

      <div className="card border-0 shadow-sm rounded-4 mb-3">

        <div className="card-body p-3 p-md-4">

          <div className="d-flex justify-content-between align-items-center mb-3">

            <div>
              <h6 className="fw-bold mb-1">
                <FaUniversity className="text-primary me-2" />
                Bank Details
              </h6>

              <small className="text-muted">
                Payout and verification information
              </small>
            </div>

            <span
              className={`badge rounded-pill ${
                p?.bankVerificationStatus === "approved"
                  ? "bg-success"
                  : p?.bankVerificationStatus === "pending"
                    ? "bg-warning text-dark"
                    : "bg-secondary"
              }`}
            >
              {p?.bankVerificationStatus || "N/A"}
            </span>

          </div>


          <div className="row g-2">

            <div className="col-12 col-md-6">
              <div className="fixkar-info-box">
                <FaUniversity />
                <div>
                  <small>Bank Name</small>
                  <strong>
                    {p.bankDetails.bankName || "—"}
                  </strong>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="fixkar-info-box">
                <FaUser />
                <div>
                  <small>Account Holder</small>
                  <strong>
                    {p.bankDetails.holderName || "—"}
                  </strong>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="fixkar-info-box">
                <FaIdCard />
                <div>
                  <small>Account Number</small>
                  <strong>
                    {p.bankDetails.accountNumber || "—"}
                  </strong>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="fixkar-info-box">
                <FaTools />
                <div>
                  <small>IFSC</small>
                  <strong>
                    {p.bankDetails.ifsc || "—"}
                  </strong>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="fixkar-info-box">
                <FaPhone />
                <div>
                  <small>UPI ID</small>
                  <strong>
                    {p.bankDetails.upi || "Not Provided"}
                  </strong>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="fixkar-info-box">
                <FaIdCard />
                <div>
                  <small>PAN Number</small>
                  <strong>
                    {p.bankDetails.panNumber || "—"}
                  </strong>
                </div>
              </div>
            </div>

          </div>


          {p?.bankDetails?.docPicUrl && (

            <div className="mt-3 p-3 rounded-3 bg-light">

              <small className="fw-semibold d-block mb-2">
                Bank Proof
              </small>

              <img
                src={p.bankDetails.docPicUrl}
                alt="Bank Proof"
                className="img-fluid rounded-3"
                style={{
                  maxWidth: 260,
                  maxHeight: 180,
                  objectFit: "contain",
                }}
              />

              <div className="mt-2">

                <a
                  href={p.bankDetails.docPicUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm btn-outline-primary rounded-pill"
                >
                  <FaEye className="me-1" />
                  View Full Image
                </a>

              </div>

            </div>
          )}


          {p?.bankVerificationStatus === "pending" && (
            <div className="mt-3">
              <BankVerificationActions
                proId={p?._id}
              />
            </div>
          )}

        </div>
      </div>
    )}


    {/* =========================================================
        WALLET
    ========================================================= */}
    {p?.wallet && (

      <div className="card border-0 shadow-sm rounded-4 mb-3">

        <div className="card-body p-3 p-md-4">

          <div className="d-flex justify-content-between align-items-center mb-3">

            <div>
              <h6 className="fw-bold mb-1">
                <FaRupeeSign className="text-success me-2" />
                Professional Wallet
              </h6>

              <small className="text-muted">
                Earnings, credits and withdrawal information
              </small>
            </div>

          </div>


          <div className="row g-2 g-md-3">

            <div className="col-6 col-md-3">
              <div className="fixkar-wallet-box">
                <small>Credit Balance</small>
                <strong>
                  ₹{Number(
                    p.wallet?.credits?.balance ?? 0
                  ).toLocaleString("en-IN")}
                </strong>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="fixkar-wallet-box">
                <small>Pending</small>
                <strong>
                  ₹{Number(
                    p.wallet?.pendingBalance ?? 0
                  ).toLocaleString("en-IN")}
                </strong>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="fixkar-wallet-box">
                <small>Total Earned</small>
                <strong>
                  ₹{Number(
                    p.wallet?.totalEarned ?? 0
                  ).toLocaleString("en-IN")}
                </strong>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="fixkar-wallet-box">
                <small>Total Withdrawn</small>
                <strong>
                  ₹{Number(
                    p.wallet?.totalWithdrawn ?? 0
                  ).toLocaleString("en-IN")}
                </strong>
              </div>
            </div>

          </div>


          <div className="row g-2 mt-2">

            <div className="col-6 col-md-3">
              <div className="fixkar-wallet-sub">
                Lifetime credit Earned:
                <strong>
                  ₹{Number(
                    p.wallet?.credits?.lifetimeEarned ?? 0
                  ).toLocaleString("en-IN")}
                </strong>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="fixkar-wallet-sub">
                Lifetime Spent:
                <strong>
                  ₹{Number(
                    p.wallet?.credits?.lifetimeSpent ?? 0
                  ).toLocaleString("en-IN")}
                </strong>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="fixkar-wallet-sub">
                Expired:
                <strong>
                  ₹{Number(
                    p.wallet?.credits?.lifetimeExpired ?? 0
                  ).toLocaleString("en-IN")}
                </strong>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="fixkar-wallet-sub">
                Platform Fee Due:
                <strong>
                  ₹{Number(
                    p.wallet?.cashPlatformFeeDue ?? 0
                  ).toLocaleString("en-IN")}
                </strong>
              </div>
            </div>

          </div>


          <div className="mt-3 small text-muted">

            First Booking Rewarded:{" "}
            <strong>
              {p.wallet?.credits?.firstBookingRewarded
                ? "Yes"
                : "No"}
            </strong>

            <span className="mx-2">•</span>

            Withdrawal Pending:{" "}
            <strong>
              {p.wallet?.withdrawnRequest?.pending
                ? "Yes"
                : "No"}
            </strong>

            <span className="mx-2">•</span>

            Withdrawal Amount:{" "}
            <strong>
              ₹{Number(
                p.wallet?.withdrawnRequest?.amount ?? 0
              ).toLocaleString("en-IN")}
            </strong>

          </div>

        </div>
      </div>
    )}


    {/* =========================================================
        ACCEPTANCE
    ========================================================= */}
    {(p?.userId?.termsAcceptance ||
      p?.userId?.professionalAcceptance) && (

      <div className="card border-0 shadow-sm rounded-4 mb-3">

        <div className="card-body p-3 p-md-4">

          <h6 className="fw-bold mb-3">
            <FaCheckCircle className="text-success me-2" />
            Acceptance & Verification
          </h6>

          <div className="row g-2">

            {p?.userId?.termsAcceptance && (

              <div className="col-12 col-lg-6">

                <div className="fixkar-acceptance-card">

                  <div className="d-flex align-items-center gap-2 mb-3">

                    {p.userId.termsAcceptance.accepted ? (
                      <FaCheckCircle className="text-success" />
                    ) : (
                      <FaTimesCircle className="text-danger" />
                    )}

                    <strong>
                      Terms & Conditions
                    </strong>

                  </div>

                  <div className="small text-muted">

                    <div>
                      Accepted:{" "}
                      <strong>
                        {p.userId.termsAcceptance.accepted
                          ? "Yes"
                          : "No"}
                      </strong>
                    </div>

                    <div>
                      Accepted At:{" "}
                      <strong>
                        {p.userId.termsAcceptance.acceptedAt
                          ? new Date(
                              p.userId.termsAcceptance.acceptedAt
                            ).toLocaleString()
                          : "—"}
                      </strong>
                    </div>

                    <div className="text-break">
                      IP:{" "}
                      <strong>
                        {p.userId.termsAcceptance.acceptedIP ||
                          "—"}
                      </strong>
                    </div>

                    <div>
                      Policy:{" "}
                      <strong>
                        {p.userId.termsAcceptance.policyVersion ||
                          "—"}
                      </strong>
                    </div>

                  </div>

                </div>
              </div>
            )}


            {p?.userId?.professionalAcceptance && (

              <div className="col-12 col-lg-6">

                <div className="fixkar-acceptance-card">

                  <div className="d-flex align-items-center gap-2 mb-3">

                    {p.userId.professionalAcceptance.accepted ? (
                      <FaCheckCircle className="text-success" />
                    ) : (
                      <FaTimesCircle className="text-danger" />
                    )}

                    <strong>
                      Professional Agreement
                    </strong>

                  </div>

                  <div className="small text-muted">

                    <div>
                      Accepted:{" "}
                      <strong>
                        {p.userId.professionalAcceptance.accepted
                          ? "Yes"
                          : "No"}
                      </strong>
                    </div>

                    <div>
                      Accepted At:{" "}
                      <strong>
                        {p.userId.professionalAcceptance.acceptedAt
                          ? new Date(
                              p.userId.professionalAcceptance.acceptedAt
                            ).toLocaleString()
                          : "—"}
                      </strong>
                    </div>

                    <div className="text-break">
                      IP:{" "}
                      <strong>
                        {p.userId.professionalAcceptance.acceptedIP ||
                          "—"}
                      </strong>
                    </div>

                    <div>
                      Policy:{" "}
                      <strong>
                        {p.userId.professionalAcceptance.policyVersion ||
                          "—"}
                      </strong>
                    </div>

                  </div>

                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    )}


    {/* =========================================================
        BUSY DAYS
    ========================================================= */}
    <div className="card border-0 shadow-sm rounded-4 mb-3">

      <div className="card-body p-3 p-md-4">

        <div className="d-flex justify-content-between align-items-center mb-3">

          <div>
            <h6 className="fw-bold mb-1">
              <FaCalendarAlt className="text-primary me-2" />
              Busy Days
            </h6>

            <small className="text-muted">
              Dates currently marked unavailable
            </small>
          </div>

          <span className="badge bg-light text-dark rounded-pill">
            {Array.isArray(p?.busyDays)
              ? p.busyDays.length
              : 0}
          </span>

        </div>


        {Array.isArray(p?.busyDays) &&
        p.busyDays.length > 0 ? (

          <div className="d-flex flex-wrap gap-2">

            {p.busyDays.map((day) => (

              <DayCard
                key={day}
                year={new Date(day).getFullYear()}
                day={String(
                  new Date(day).getDate()
                ).padStart(2, "0")}
                month={new Date(day).toLocaleString(
                  "default",
                  { month: "short" }
                )}
              />

            ))}

          </div>

        ) : (

          <div className="fixkar-empty-box">
            <FaCalendarAlt />
            <span>
              No busy days scheduled.
            </span>
          </div>

        )}

      </div>
    </div>


    {/* =========================================================
        POI
    ========================================================= */}
    {p?.poi && (

      <div className="card border-0 shadow-sm rounded-4 mb-3">

        <div className="card-body p-3 p-md-4">

          <h6 className="fw-bold mb-3">
            <FaIdCard className="text-primary me-2" />
            Proof of Identity
          </h6>

          {(() => {

            const ext =
              p.poi
                ?.split("?")[0]
                ?.split(".")
                ?.pop()
                ?.toLowerCase();

            const isImage = [
              "jpg",
              "jpeg",
              "png",
              "webp",
              "gif",
            ].includes(ext);

            return isImage ? (

              <div>

                <img
                  src={p.poi}
                  alt="Proof of Identity"
                  className="img-fluid rounded-3 shadow-sm fixkar-document-preview"
                />

                <div className="mt-2">

                  <a
                    href={p.poi}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-outline-primary rounded-pill"
                  >
                    <FaEye className="me-1" />
                    View Full Document
                  </a>

                </div>

              </div>

            ) : (

              <a
                href={p.poi}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline-primary rounded-pill"
              >
                <FaDownload className="me-1" />
                Open Document
              </a>

            );

          })()}

        </div>
      </div>
    )}


    {/* =========================================================
        ADMIN ACTIONS
    ========================================================= */}
    {p?.onBoarded === true &&
      p?.status === "pending" && (

      <div className="card border-0 shadow-sm rounded-4 mb-3">

        <div className="card-body p-3 p-md-4">

          <div className="d-flex align-items-start gap-2 mb-3">

            <div className="fixkar-action-icon">
              <FaGavel />
            </div>

            <div>
              <h6 className="fw-bold mb-1">
                Review Application
              </h6>

              <small className="text-muted">
                Verify the submitted information before approving
                or rejecting this professional.
              </small>
            </div>

          </div>


          <div className="d-flex flex-column flex-sm-row gap-2">

            <button
              className="btn btn-success rounded-pill px-4 fw-semibold flex-fill"
              onClick={() =>
                handleAccept(p?.userId?._id)
              }
              disabled={accLoad}
            >
              {accLoad ? (
                <ClipLoader size={16} color="#fff" />
              ) : (
                <>
                  <FaCheck className="me-2" />
                  Accept Application
                </>
              )}
            </button>


            <button
              className="btn btn-outline-danger rounded-pill px-4 fw-semibold flex-fill"
              onClick={() => setShowRejectBox(true)}
            >
              <FaTimes className="me-2" />
              Reject Application
            </button>

          </div>


          {showRejectBox && (

            <div className="mt-3 p-3 rounded-4 border border-danger-subtle bg-danger-subtle">

              <div className="d-flex gap-2 mb-2">

                <FaTimesCircle className="text-danger mt-1" />

                <div>
                  <strong className="text-danger">
                    Rejection Reason
                  </strong>

                  <small className="d-block text-muted">
                    Provide a clear reason so the professional
                    understands what needs attention.
                  </small>
                </div>

              </div>


              <textarea
                className="form-control rounded-3 mb-3"
                rows="3"
                placeholder="Enter rejection reason..."
                value={reason}
                onChange={(e) =>
                  setReason(e.target.value)
                }
              />


              <div className="d-flex flex-column flex-sm-row justify-content-end gap-2">

                <button
                  className="btn btn-light rounded-pill"
                  onClick={() =>
                    setShowRejectBox(false)
                  }
                >
                  Cancel
                </button>


                <button
                  className="btn btn-danger rounded-pill d-flex align-items-center justify-content-center gap-2"
                  disabled={rejLoad}
                  onClick={() => {

                    if (!reason.trim()) {
                      toast.error(
                        "Please enter rejection reason"
                      );
                      return;
                    }

                    handleReject(
                      p?.userId?._id,
                      reason
                    );

                    setShowRejectBox(false);
                    setReason("");

                  }}
                >
                  {rejLoad ? (
                    <ClipLoader size={16} color="#fff" />
                  ) : (
                    <>
                      <FaPaperPlane />
                      Send & Reject
                    </>
                  )}
                </button>

              </div>

            </div>
          )}

        </div>
      </div>
    )}


    {/* =========================================================
        REVIEWS
    ========================================================= */}
    <div className="card border-0 shadow-sm rounded-4 mb-3">

      <div className="card-body p-3 p-md-4">

        <div className="d-flex justify-content-between align-items-center mb-3">

          <div>
            <h6 className="fw-bold mb-1">
              <FaStar className="text-warning me-2" />
              Customer Reviews
            </h6>

            <small className="text-muted">
              Feedback received from customers
            </small>
          </div>

          <span className="badge bg-warning-subtle text-warning-emphasis rounded-pill">
            {Array.isArray(p?.reviews)
              ? p.reviews.length
              : 0}
          </span>

        </div>


        {Array.isArray(p?.reviews) &&
        p.reviews.length > 0 ? (

          <div className="row g-2">

            {p.reviews.map((review, index) => (

              <div
                key={review?._id || index}
                className="col-12 col-md-6"
              >

                <div className="fixkar-review-card">

                  <div className="d-flex justify-content-between gap-2">

                    <strong>
                      {review?.customerName ||
                        "Anonymous Customer"}
                    </strong>

                    <span className="text-warning text-nowrap">

                      {Array.from({
                        length: Math.max(
                          0,
                          Math.min(
                            5,
                            Number(review?.rating) || 0
                          )
                        ),
                      }).map((_, i) => (
                        <FaStar key={i} />
                      ))}

                    </span>

                  </div>


                  <p className="small mb-2 mt-2">
                    {review?.review ||
                      "No review text provided."}
                  </p>


                  <small className="text-muted">
                    {review?.createdAt
                      ? new Date(
                          review.createdAt
                        ).toLocaleDateString()
                      : "Date unavailable"}
                  </small>

                </div>

              </div>
            ))}

          </div>

        ) : (

          <div className="fixkar-empty-box">
            <FaStar />
            <span>
              No reviews yet.
            </span>
          </div>

        )}

      </div>
    </div>


    {/* =========================================================
        SYSTEM / META INFORMATION
    ========================================================= */}
    <div className="card border-0 shadow-sm rounded-4">

      <div className="card-body p-3 p-md-4">

        <h6 className="fw-bold mb-3">
          <FaInfoCircle className="text-secondary me-2" />
          System Information
        </h6>


        <div className="row g-2">

          <div className="col-12 col-md-6">
            <div className="fixkar-meta-box">
              <small>Professional ID</small>
              <strong className="text-break">
                {p?._id || "—"}
              </strong>
            </div>
          </div>


          <div className="col-12 col-md-6">
            <div className="fixkar-meta-box">
              <small>User ID</small>
              <strong className="text-break">
                {p?.userId?._id || "—"}
              </strong>
            </div>
          </div>


          <div className="col-12 col-md-6">
            <div className="fixkar-meta-box">
              <small>Short Code</small>
              <strong>
                {p?.shortCode || "—"}
              </strong>
            </div>
          </div>


          <div className="col-12">
            <div className="fixkar-meta-box">
              <small>Slug</small>
              <strong className="text-break">
                {p?.slug || "—"}
              </strong>
            </div>
          </div>


          <div className="col-12 col-md-6">
            <div className="fixkar-meta-box">
              <small>Created At</small>
              <strong>
                {p?.createdAt
                  ? new Date(
                      p.createdAt
                    ).toLocaleString()
                  : "—"}
              </strong>
            </div>
          </div>


          <div className="col-12 col-md-6">
            <div className="fixkar-meta-box">
              <small>Last Updated</small>
              <strong>
                {p?.updatedAt
                  ? new Date(
                      p.updatedAt
                    ).toLocaleString()
                  : "—"}
              </strong>
            </div>
          </div>


          <div className="col-12 col-md-6">
            <div className="fixkar-meta-box">
              <small>Accepted By</small>
              <strong className="text-break">
                {p?.acceptedBy || "—"}
              </strong>
            </div>
          </div>


          <div className="col-12 col-md-6">
            <div className="fixkar-meta-box">
              <small>Location Type</small>
              <strong>
                {p?.location?.type || "—"}
              </strong>
            </div>
          </div>

        </div>

      </div>
    </div>

  </div>
);
};

export default ProfessionalDetailCard;
