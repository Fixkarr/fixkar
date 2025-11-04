import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center vh-100 text-center bg-light"
    >
      <h1 className="display-1 fw-bold text-primary">404</h1>
      <h4 className="text-dark mb-3">Oops! Page Not Found 😕</h4>
      <p className="text-muted mb-4 px-3" style={{ maxWidth: "400px" }}>
        The page you’re looking for doesn’t exist or may have been moved.
      </p>
      <button
        className="btn btn-primary px-4 py-2 rounded-3 shadow-sm"
        onClick={() => navigate("/")}
      >
        Back to Home
      </button>
    </div>
  );
};

export default PageNotFound;
