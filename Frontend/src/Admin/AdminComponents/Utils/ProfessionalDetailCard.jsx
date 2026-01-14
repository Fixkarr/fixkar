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
} from "react-icons/fa";
import { FaUserTie } from "react-icons/fa6";
import DayCard from "../../../Professional/DayCard";
import axios from "axios";
import { server_url } from "../../../App";
import { useState } from "react";
import { toast } from "react-toastify";

const ProfessionalDetailCard = ({ p }) => {
  const [reason, setReason] = useState('');
  const [accLoad, setAccLoad] = useState(false);
  const [rejLoad, setRejLoad] = useState(false);
  const [showRejectBox, setShowRejectBox]  = useState(false);
  const handleAccept = async (proId) => {
    try {
      setAccLoad(true);
      const result = await axios.post(
        `${server_url}/api/admin/accept-professional-application`,
        {proUserId : proId },
        { withCredentials: true }
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
        { proUserId : proId, reason },
        { withCredentials: true }
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
        className="px-4 py-4 text-white d-flex justify-content-between align-items-center"
        style={{
          background: "linear-gradient(90deg, #4f46e5, #06b6d4)",
        }}
      >
        <h4 className="mb-0 fw-bold d-flex align-items-center gap-2">
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

      <div className="card-body bg-light rounded-bottom-4">
        {/* ================= PROFILE ROW ================= */}
        <div className="row align-items-center g-4 mb-4">
          {/* IMAGE */}
          <div className="col-md-3 text-center">
            {p.profilePicture ? (
              <div
                className="mx-auto rounded-circle shadow-lg"
                style={{
                  width: 140,
                  height: 140,
                  padding: 5,
                  background: "linear-gradient(135deg, #6366f1, #22d3ee)",
                }}
              >
                <img
                  src={p.profilePicture}
                  alt="profile"
                  className="w-100 h-100 rounded-circle"
                  style={{ objectFit: "cover" }}
                />
              </div>
            ) : (
              <div className="text-muted small">No Profile Image</div>
            )}
          </div>

          {/* INFO */}
          <div className="col-md-6">
            <h5 className="fw-bold mb-1">{p.userId?.fullName}</h5>
            <p className="text-muted small mb-2">{p.userId?.email}</p>

            {p.onBoarded !== undefined && (
              <span
                className={`badge px-3 py-2 rounded-pill ${
                  p.onBoarded ? "bg-success" : "bg-danger"
                }`}
              >
                {p.onBoarded ? (
                  <>
                    <FaCheckCircle className="me-1" />
                    Onboarded
                  </>
                ) : (
                  <>
                    <FaTimesCircle className="me-1" />
                    Not Onboarded
                  </>
                )}
              </span>
            )}
          </div>

          {/* DOB */}
          <div className="col-md-3 text-end">
            {p.dob && (
              <div className="text-muted small">
                <FaBirthdayCake className="me-1 text-warning" />
                {new Date(p.dob).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>

        {/* ================= ACTION BUTTONS ================= */}
        {p.onBoarded === true && p.status === "pending" && (
          <div
            className="d-flex justify-content-end gap-3 mb-4 p-3 rounded-3"
            style={{
              background: "linear-gradient(135deg, #eef2ff, #ecfeff)",
            }}
          >
            <button
              className="btn btn-success px-4 fw-semibold shadow d-flex align-items-center gap-2"
              onClick={() => handleAccept(p.userId._id)}
              disabled={accLoad}
            >
              <FaCheck />
              Accept Application
            </button>

            <button
              className="btn btn-outline-danger px-4 fw-semibold shadow d-flex align-items-center gap-2"
              onClick={()=> setShowRejectBox(true)}
            >
              <FaTimes />
              Reject Application
            </button>

            {showRejectBox && (
  <div className="card mt-3 border-danger">
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
)}

          </div>
        )}

        {/* ================= DESCRIPTION ================= */}
        {p.description && (
          <div className="mb-4">
            <h6 className="fw-bold text-primary">Description</h6>
            <p className="text-muted small">{p.description}</p>
          </div>
        )}

        {/* ================= CHARGES ================= */}
        {p.charges && (
          <div className="mb-4">
            <h6 className="fw-bold text-success mb-2">
              <FaMoneyBillWave className="me-1" />
              Charges
            </h6>

            <div className="d-flex flex-wrap gap-2">
              {p.charges.hourly && (
                <span className="badge bg-white text-dark shadow-sm">
                  Hourly ₹{p.charges.hourly.amount}
                </span>
              )}
              {p.charges.daily && (
                <span className="badge bg-white text-dark shadow-sm">
                  Daily ₹{p.charges.daily.amount}
                </span>
              )}
              {p.charges.contract?.minAmount && (
                <span className="badge bg-white text-dark shadow-sm">
                  Min ₹{p.charges.contract.minAmount}
                </span>
              )}
              {p.charges.contract?.maxAmount && (
                <span className="badge bg-white text-dark shadow-sm">
                  Max ₹{p.charges.contract.maxAmount}
                </span>
              )}
            </div>

            {p.charges.amountDesc && (
              <p className="text-muted small mt-2">{p.charges.amountDesc}</p>
            )}
          </div>
        )}

        {/* ================= BUSY DAYS ================= */}
        {Array.isArray(p.busyDays) && (
          <div className="mb-4">
            <h6 className="fw-bold text-danger mb-2">
              <FaCalendarAlt className="me-1" />
              Busy Days
            </h6>

            {p.busyDays.length === 0 ? (
              <p className="text-muted small">No busy days</p>
            ) : (
              <div className="d-flex flex-wrap gap-2">
                {p.busyDays.map((day) => (
                  <DayCard
                    key={day}
                    year={new Date(day).getFullYear()}
                    day={String(new Date(day).getDate()).padStart(2, "0")}
                    month={new Date(day).toLocaleString("default", {
                      month: "short",
                    })}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= POI ================= */}
        {p.poi && (
          <div className="mb-4">
            <h6 className="fw-bold text-primary mb-2">Proof of Identity</h6>

            {(() => {
              const ext = p.poi.split(".").pop()?.toLowerCase();
              const img = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext);

              return img ? (
                <img
                  src={p.poi}
                  alt="poi"
                  className="img-fluid rounded shadow"
                  style={{ maxWidth: 240 }}
                />
              ) : (
                <a
                  href={p.poi}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline-primary btn-sm"
                >
                  Download Document
                </a>
              );
            })()}
          </div>
        )}

        {/* ================= REVIEWS ================= */}
        {Array.isArray(p.reviews) && (
          <div>
            <h6 className="fw-bold mb-3">Reviews</h6>

            {p.reviews.length === 0 ? (
              <p className="text-muted small">No reviews yet</p>
            ) : (
              p.reviews.map((r, i) => (
                <div
                  key={i}
                  className="p-3 mb-3 rounded-3 text-white shadow"
                  style={{
                    background: "linear-gradient(135deg, #1e293b, #334155)",
                  }}
                >
                  <div className="d-flex justify-content-between">
                    <strong>{r.customerName}</strong>
                    <span className="text-warning">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </span>
                  </div>

                  <p className="small text-secondary mb-1">
                    BookingId: {r.bookingId}
                  </p>

                  <p className="small">{r.review}</p>

                  <p className="small text-secondary mb-0">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalDetailCard;
