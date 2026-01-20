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
} from "react-icons/fa";
import { FaLocationPin, FaToolbox, FaUserTie } from "react-icons/fa6";
import DayCard from "../../../Professional/DayCard";
import axios from "axios";
import { server_url } from "../../../App";
import { useState } from "react";
import { toast } from "react-toastify";
import Section from "./Section";
import Info from "./Info";

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
    <div
      className="card border-0 shadow-lg-4 mt-4 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, rgba(17,24,39,0.95), rgba(31,41,55,0.95))",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* ================= HEADER ================= */}
      <div
        className="d-flex justify-content-between align-items-center px-4 py-4 text-white"
        style={{
          background: "linear-gradient(135deg, #6366f1, #06b6d4)",
        }}
      >
        <h4 className="fw-bold mb-0 d-flex align-items-center gap-2">
          <FaUserTie />
          Professional Profile
        </h4>

        {p.status && (
          <span
            className={`badge px-3 py-2 rounded-pill text-uppercase fw-semibold ${
              p.status === "pending"
                ? "bg-warning text-dark"
                : p.status === "approved"
                  ? "bg-success"
                  : "bg-danger"
            }`}
          >
            {p.status}
          </span>
        )}
      </div>




      <div className="card-body bg-light p-4">
        {/* ================= PROFILE ROW ================= */}
         <Section title="Basic Information" icon={<FaUser />}>
      <div className="col-md-3 text-center">
        {p.profilePicture ? (
          <img
            src={p.profilePicture}
            alt="profile"
            className="rounded-circle shadow"
            style={{ width: 120, height: 120, objectFit: "cover" }}
          />
        ) : (
          <div className="text-muted small">No Profile Image</div>
        )}
      </div>

      <Info label="Full Name" value={p.userId?.fullName} icon={<FaUser />} />
      <Info label="Rejection Count" value={p.rejectionCount} icon={<FaPhone />} />
      <Info label="Email" value={p.userId?.email} icon={<FaEnvelope />} />
      <Info label="Address" value={p.address.addressLine} icon={<FaLocationPin />} />
      <Info label="Mobile Number" value={p.userId?.mobile} icon={<FaPhone />} />

      <Info
        label="Date of Birth"
        value={p.dob && new Date(p.dob).toLocaleDateString()}
        icon={<FaBirthdayCake />}
      />
         {p.description && (
          <Info label="Description" value={p.description} icon={<FaInfoCircle/>}/>
          )}


      <Info
        label="Onboarding Status"
        value={p.onBoarded ? "Onboarded" : "Not Onboarded"}
        icon={p.onBoarded ? <FaCheckCircle /> : <FaTimesCircle />}
      />
    </Section>

  {Array.isArray(p.selectedSkills) && p.selectedSkills.length > 0 && (
  <Section title="Skills" icon={<FaTools />}>
    {p.selectedSkills.map((s) => (
      <Info
        key={s._id}
        label="Skill"
        value={s.name}
        icon={<FaToolbox />}
      />
    ))}
  </Section>
)}


          {/* =====================Gallery======================== */}
          {Array.isArray(p.gallery) && p.gallery.length > 0 && (
  <Section title="Gallery" icon={<FaImages />}>
    <div className="col-12 d-flex flex-wrap gap-3">
      {p.gallery.map((item, index) => {
        const { mediaUrl, mediaType } = item;

        if (!mediaUrl) return null;

        return (
          <div
            key={index}
            className="position-relative rounded-3 overflow-hidden shadow-sm"
            style={{
              width: 120,
              height: 120,
              cursor: "pointer",
              background: "#f1f5f9",
            }}
          >
            {/* IMAGE */}
            {mediaType === "image" && (
              <a href={mediaUrl} target="_blank" rel="noreferrer">
                <img
                  src={mediaUrl}
                  alt="gallery"
                  className="w-100 h-100"
                  style={{ objectFit: "cover" }}
                />
              </a>
            )}

            {/* VIDEO */}
            {mediaType === "video" && (
              <a href={mediaUrl} target="_blank" rel="noreferrer">
                <video
                  className="w-100 h-100"
                  style={{ objectFit: "cover" }}
                  muted
                />
                <div
                  className="position-absolute top-50 start-50 translate-middle text-white"
                  style={{
                    fontSize: 28,
                    background: "rgba(0,0,0,0.5)",
                    borderRadius: "50%",
                    padding: "6px 10px",
                  }}
                >
                  <FaPlay />
                </div>
              </a>
            )}
          </div>
        );
      })}
    </div>
  </Section>
)}


        {/* ================= ACTION BUTTONS ================= */}
            {p.onBoarded === true && p.status === "pending" && (
      <Section title="Admin Actions" icon={<FaGavel />}>
        <div className="col-12 d-flex justify-content-end gap-3">
          <button
            className="btn btn-success px-4 fw-semibold d-flex align-items-center gap-2"
            onClick={() => handleAccept(p.userId._id)}
            disabled={accLoad}
          >
            <FaCheck />
            Accept
          </button>

          <button
            className="btn btn-outline-danger px-4 fw-semibold d-flex align-items-center gap-2"
            onClick={() => setShowRejectBox(true)}
          >
            <FaTimes />
            Reject
          </button>
        </div>

        {showRejectBox && (
          <div className="col-12">
            <div className="card border-danger mt-3">
              <div className="card-body bg-light rounded-3">
                <h6 className="fw-semibold text-danger d-flex align-items-center gap-2">
                  <FaTimesCircle />
                  Rejection Reason
                </h6>

                <textarea
                  className="form-control mb-3"
                  rows="4"
                  placeholder="Enter rejection reason..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />

                <div className="d-flex justify-content-end gap-2">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowRejectBox(false)}
                  >
                    Cancel
                  </button>

                  <button
                    className="btn btn-danger d-flex align-items-center gap-2"
                    disabled={rejLoad}
                    onClick={() => {
                      if (!reason.trim()) {
                        toast.error("Please enter rejection reason");
                        return;
                      }
                      handleReject(p.userId._id, reason);
                      setShowRejectBox(false);
                      setReason("");
                    }}
                  >
                    <FaPaperPlane />
                    Send & Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Section>
    )}

      
      

        {/* ================= CHARGES ================= */}
        {p.charges && (
      <Section title="Charges" icon={<FaMoneyBillWave />}>
        {p.charges.hourly && (
          <Info
            label="Hourly Charge"
            value={`₹${p.charges.hourly.amount}`}
            icon={<FaClock />}
          />
        )}

        {p.charges.daily && (
          <Info
            label="Daily Charge"
            value={`₹${p.charges.daily.amount}`}
            icon={<FaCalendarDay />}
          />
        )}

        {p.charges.contract?.minAmount && (
          <Info
            label="Min Contract"
            value={`₹${p.charges.contract.minAmount}`}
            icon={<FaArrowDown />}
          />
        )}

        {p.charges.contract?.maxAmount && (
          <Info
            label="Max Contract"
            value={`₹${p.charges.contract.maxAmount}`}
            icon={<FaArrowUp />}
          />
        )}

        {p.charges.amountDesc && (
          <div className="col-12 text-muted small">
            {p.charges.amountDesc}
          </div>
        )}
      </Section>
    )}

        {/* ================= BUSY DAYS ================= */}
       <Section title="Busy Days" icon={<FaCalendarAlt />}>
      {p.busyDays?.length === 0 ? (
        <div className="col-12 text-muted small">No busy days</div>
      ) : (
        p.busyDays?.map((day) => (
          <DayCard
            key={day}
            year={new Date(day).getFullYear()}
            day={String(new Date(day).getDate()).padStart(2, "0")}
            month={new Date(day).toLocaleString("default", { month: "short" })}
          />
        ))
      )}
    </Section>

        {/* ================= POI ================= */}
        {p.poi && (
  <Section title="Proof of Identity" icon={<FaIdCard />}>
    {(() => {
      const ext = p.poi.split(".").pop()?.toLowerCase();
      const isImage = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext);

      return (
        <div className="col-12">
          {isImage ? (
            <div className="d-flex flex-column align-items-start gap-2">
              <img
                src={p.poi}
                alt="Proof of Identity"
                className="img-fluid rounded-3 shadow"
                style={{ maxWidth: 260 }}
              />

              <a
                href={p.poi}
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-2"
              >
                <FaEye />
                View Full Image
              </a>
            </div>
          ) : (
            <a
              href={p.poi}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline-primary d-inline-flex align-items-center gap-2"
            >
              <FaDownload />
              Download Document
            </a>
          )}
        </div>
      );
    })()}
  </Section>
)}


        {/* ================= REVIEWS ================= */}
        <Section title="Reviews" icon={<FaStar />}>
      {p.reviews?.length === 0 ? (
        <div className="col-12 text-muted small">No reviews yet</div>
      ) : (
        p.reviews?.map((r, i) => (
          <div key={i} className="col-12">
            <div className="p-3 rounded-3 bg-dark text-white shadow">
              <div className="d-flex justify-content-between">
                <strong>{r.customerName}</strong>
                <span className="text-warning">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </span>
              </div>

              <p className="small mb-1">{r.review}</p>
              <p className="small text-secondary mb-0">
                {new Date(r.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))
      )}
    </Section>
      </div>
    </div>
  );
};

export default ProfessionalDetailCard;
