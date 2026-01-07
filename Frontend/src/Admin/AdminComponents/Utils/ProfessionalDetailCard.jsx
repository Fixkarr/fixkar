import {
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaFilePdf,
  FaImage,
  FaStar,
  FaBirthdayCake,
  FaMoneyBillWave,
} from "react-icons/fa";
import { FaUserTie } from "react-icons/fa6";

const ProfessionalDetailCard = ({ p }) => {
  return (
    <div
  className="card border-0 shadow-lg rounded-4 mt-3 overflow-hidden"
  style={{
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
  }}
>
  {/* ================= HEADER STRIP ================= */}
  <div
    className="px-4 py-3 text-white"
    style={{
      background: "linear-gradient(90deg, #141e30, #243b55)",
    }}
  >
    <h5 className="mb-0 fw-bold d-flex align-items-center">
      <FaUserTie className="me-2 text-warning" />
      Professional Details
    </h5>
  </div>

  <div className="card-body bg-light">

    {/* ================= TOP SECTION ================= */}
    <div className="row align-items-center mb-4">

      {/* PROFILE IMAGE */}
      <div className="col-md-3 text-center">
        {p.profilePicture ? (
          <div
            className="rounded-circle mx-auto shadow"
            style={{
              width: "130px",
              height: "130px",
              padding: "5px",
              background:
                "linear-gradient(135deg, #00c6ff, #0072ff)",
            }}
          >
            <img
              src={p.profilePicture}
              alt="Profile"
              className="rounded-circle w-100 h-100"
              style={{ objectFit: "cover" }}
            />
          </div>
        ) : (
          <div className="text-muted">No Profile Image</div>
        )}
      </div>

      {/* BASIC INFO */}
      <div className="col-md-6">
        <h5 className="fw-bold mb-1">{p.userId?.fullName}</h5>
        <div className="text-muted small mb-2">
          {p.userId?.email}
        </div>

        {p.onBoarded !== undefined && (
          <span
            className={`badge px-3 py-2 ${
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
          <div className="small text-muted">
            <FaBirthdayCake className="me-1 text-warning" />
            {new Date(p.dob).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>

    <hr />

    {/* ================= DESCRIPTION ================= */}
    {p.description && (
      <div className="mb-4">
        <h6 className="fw-semibold text-primary">Description</h6>
        <p className="text-muted small mb-0">
          {p.description}
        </p>
      </div>
    )}

    {/* ================= CHARGES ================= */}
    {p.charges && (
      <div className="mb-4">
        <h6 className="fw-semibold text-success mb-2">
          <FaMoneyBillWave className="me-1" />
          Charges
        </h6>

        <div className="d-flex flex-wrap gap-2">
          {p.charges.hourly && (
            <span className="badge bg-white text-dark shadow-sm">
              Hourly: ₹{p.charges.hourly.amount}
            </span>
          )}

          {p.charges.daily && (
            <span className="badge bg-white text-dark shadow-sm">
              Daily: ₹{p.charges.daily.amount}
            </span>
          )}

          {p.charges.contract?.minAmount && (
            <span className="badge bg-white text-dark shadow-sm">
              Contract Min: ₹{p.charges.contract.minAmount}
            </span>
          )}

          {p.charges.contract?.maxAmount && (
            <span className="badge bg-white text-dark shadow-sm">
              Contract Max: ₹{p.charges.contract.maxAmount}
            </span>
          )}
        </div>

        {p.charges.amountDesc && (
          <div className="text-muted small mt-2">
            {p.charges.amountDesc}
          </div>
        )}
      </div>
    )}

    {/* ================= BUSY DAYS ================= */}
    {Array.isArray(p.busyDays) && (
      <div className="mb-4">
        <h6 className="fw-semibold text-danger mb-2">
          <FaCalendarAlt className="me-1" />
          Busy Days
        </h6>

        {p.busyDays.length === 0 ? (
          <div className="text-muted small">
            No busy days
          </div>
        ) : (
          <div className="d-flex flex-wrap gap-2">
            {p.busyDays.map((day, idx) => (
              <span
                key={idx}
                className="badge bg-warning text-dark shadow-sm"
              >
                {new Date(day).toLocaleDateString()}
              </span>
            ))}
          </div>
        )}
      </div>
    )}

    {/* ================= POI ================= */}
    {p.poi && (
      <div className="mb-4">
        <h6 className="fw-semibold text-primary mb-2">
          Proof of Identity
        </h6>

        {(() => {
          const imageExtensions = ["jpg", "jpeg", "png", "webp", "gif"];
          const extension = p.poi.split(".").pop()?.toLowerCase();
          const isImage = imageExtensions.includes(extension);

          return isImage ? (
            <img
              src={p.poi}
              alt="POI"
              className="img-fluid rounded shadow-sm"
              style={{ maxWidth: "220px" }}
            />
          ) : (
            <a
              href={p.poi}
              target="_blank"
              rel="noreferrer"
              className="btn btn-sm btn-outline-primary"
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
        <h6 className="fw-semibold mb-3 text-dark">
          Reviews
        </h6>

        {p.reviews.length === 0 ? (
          <div className="text-muted small">
            No reviews yet
          </div>
        ) : (
          p.reviews.map((r, idx) => (
            <div
              key={idx}
              className="p-3 mb-3 rounded-3 text-light"
              style={{
                background:
                  "linear-gradient(135deg, #141e30, #243b55)",
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

              <div className="small text-secondary">
                CustomerId: {r.customerId}
              </div>
              <div className="small text-secondary mb-2">
                BookingId: {r.bookingId}
              </div>

              <p className="small mb-1">{r.review}</p>
              <div className="small text-secondary">
                {new Date(r.createdAt).toLocaleDateString()}
              </div>
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
