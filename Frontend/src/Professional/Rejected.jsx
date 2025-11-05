import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Rejected = () => {
  return (
    <div className="d-flex justify-content-center mt-5 bg-light">
      <div className="card shadow-lg p-4 text-center border-0" style={{ maxWidth: "420px" }}>
        <div className="card-body">
          <img
            src="https://cdn-icons-png.flaticon.com/512/463/463612.png"
            alt="Rejected"
            width="90"
            className="mb-3"
          />
          <h3 className="text-danger fw-bold mb-2">Application Rejected</h3>
          <p className="text-secondary mb-4">
            Unfortunately, your application has been <span className="fw-semibold text-danger">rejected</span>.  
            Please review the issues and reattempt the process carefully.
          </p>

          <div className="alert alert-warning text-start small">
            <strong>Reattempt Steps:</strong>
            <ul className="mt-2 mb-0">
              <li>Ensure all details are correct and updated.</li>
              <li>Upload clear and valid identity documents.</li>
              <li>Provide a recent and proper profile photo.</li>
            </ul>
          </div>

          <button className="btn btn-primary mt-3">
            Reattempt Onboarding
          </button>

          <p className="small text-muted mt-3">
            Need help? Contact <strong>FixKar Support</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Rejected;
