import { FaExclamationTriangle } from "react-icons/fa";

const CancelBookingModal = ({
  show,
  onClose,
  onConfirm,
  loading = false,
}) => {
  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 rounded-4 shadow-lg">

          {/* Header */}
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold d-flex align-items-center gap-2 text-danger">
              <FaExclamationTriangle />
              Cancel Booking
            </h5>

            <button
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body">

            <div className="alert alert-warning d-flex align-items-start gap-3 mb-3">
              <FaExclamationTriangle
                className="text-warning mt-1"
                size={22}
              />

              <div>
                <h6 className="fw-bold mb-2">
                  Are you sure you want to cancel this booking?
                </h6>

                <p className="text-muted small mb-0">
                  Cancelling this booking cannot be undone. If you proceed,
                  your booking request will be cancelled and you may need to
                  create a new booking if you wish to hire this professional
                  again.
                </p>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="modal-footer border-0">

            <button
              className="btn btn-outline-secondary rounded-pill px-4"
              onClick={onClose}
              disabled={loading}
            >
              Keep Booking
            </button>

            <button
              className="btn btn-danger rounded-pill px-4"
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                  ></span>
                  Cancelling...
                </>
              ) : (
                "Yes, Cancel Booking"
              )}
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default CancelBookingModal;