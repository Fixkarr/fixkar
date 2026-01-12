import React from "react";
import { FaBell, FaTimes } from "react-icons/fa";
import { ClipLoader } from "react-spinners";

const EnableNotificationModal = ({
  show,
  onClose,
  onEnable,
  loading = false,
}) => {
  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 rounded-4 shadow-lg">

          {/* Header */}
          <div className="modal-header border-0">
            <h5 className="modal-title fw-bold text-primary">
              <FaBell className="me-2" />
              Enable Notifications
            </h5>
            <button className="btn" onClick={onClose}>
              <FaTimes />
            </button>
          </div>

          {/* Body */}
          <div className="modal-body text-center px-4">
            <p className="text-muted mb-3">
              Enable notifications to get real-time updates about:
            </p>

            <ul className="list-unstyled small text-start">
              <li>🔔 New bookings</li>
              <li>📩 Messages</li>
              <li>📢 Important alerts</li>
            </ul>
          </div>

          {/* Footer */}
          <div className="modal-footer border-0 d-flex justify-content-center gap-2">
            <button
              className="btn btn-outline-secondary rounded-pill px-4"
              onClick={onClose}
              disabled={loading}
            >
              Maybe Later
            </button>

            <button
              className="btn btn-primary rounded-pill px-4"
              onClick={onEnable}
              disabled={loading}
            >
              {loading ? <ClipLoader size={16} color="#fff" /> : "Enable"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EnableNotificationModal;
