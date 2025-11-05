import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Pending = () => {
  return (
    <div className="d-flex justify-content-center mt-5 bg-light">
      <div className="card shadow-lg p-4 text-center border-0" style={{ maxWidth: "420px" }}>
        <div className="card-body">
          <img
            src="https://cdn-icons-png.flaticon.com/512/709/709510.png"
            alt="Pending"
            width="90"
            className="mb-3"
          />
          <h3 className="text-primary fw-bold mb-2">Application Under Review</h3>
          <p className="text-secondary mb-4">
            Your application is currently <span className="fw-semibold text-warning">pending</span>.  
            Our team will review your details and contact you soon!
          </p>
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <p className="small text-muted">
            Thank you for your patience and for choosing <strong>FixKar</strong>!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pending;
