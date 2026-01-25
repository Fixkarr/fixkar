import { FaUniversity, FaClock } from "react-icons/fa";

const PendingBankReview = () => {
  return (
    <div className="container my-4">
      <div
        className="card border-0 shadow-lg rounded-4 mx-auto"
        style={{ maxWidth: 520 }}
      >
        {/* HEADER */}
        <div
          className="card-header text-center border-0 rounded-top-4"
          style={{
            background: "linear-gradient(135deg,#0d6efd,#0b5ed7)",
            color: "#fff",
            padding: "22px",
          }}
        >
          <FaUniversity size={42} className="mb-2" />
          <h5 className="mb-1 fw-semibold">
            Bank Details Under Review
          </h5>
          <p className="mb-0 small opacity-75">
            Verification in progress
          </p>
        </div>

        {/* BODY */}
        <div className="card-body text-center px-4 py-4">
          <div className="d-flex justify-content-center mb-3">
            <FaClock
              size={48}
              className="text-warning"
              style={{ animation: "pulse 1.5s infinite" }}
            />
          </div>

          <p className="mb-2 fw-semibold">
            Please wait while we verify your bank details
          </p>

          <p className="text-muted small mb-0">
            Our FixKar team is reviewing your submitted bank information.
            This process usually takes up to <strong>24 hours</strong>.
            You’ll be notified once verification is completed.
          </p>
        </div>
      </div>

      {/* animation */}
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); opacity: 0.8; }
          }
        `}
      </style>
    </div>
  );
};

export default PendingBankReview;
