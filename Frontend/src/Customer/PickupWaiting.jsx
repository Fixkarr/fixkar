import React, { useEffect, useState } from "react";
import {
  FaSearch,
  FaUserClock,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaClock,
  FaShieldAlt,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetPickupState, setSearchStatus } from "../redux/pickup.slice";

const PickupWaiting = ({ expiresAt }) => {
  const dispatch = useDispatch();
const navigate = useNavigate();

const {
    currentPickupRequest,
    isSearching,
    searchStatus,
    acceptedProfessionals,
} = useSelector((state) => state.pickup);

console.log(
    "Accepted Professionals:",
    acceptedProfessionals
);

const handleCancel = () => {
    dispatch(resetPickupState());
    navigate("/customer/home");
};

const handleTryAgain = () => {
    dispatch(resetPickupState());
    navigate("/customer/home");
};

useEffect(() => {
    dispatch(setSearchStatus("searching"));
}, [dispatch]);


  const calculateRemaining = () => {
    if (!expiresAt) return 60;

    const remaining = Math.ceil(
      (new Date(expiresAt).getTime() - Date.now()) / 1000
    );

    return Math.max(0, remaining);
  };

  const [remaining, setRemaining] = useState(calculateRemaining);

  useEffect(() => {
    if (remaining <= 0 && searchStatus === "searching") {
        dispatch(setSearchStatus("expired"));
    }
}, [remaining, searchStatus, dispatch]);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining(calculateRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  const progress = Math.min(100, Math.max(0, (remaining / 60) * 100));

  return <>
    {searchStatus === "expired" && (
    <div className="text-center py-4">
        <div
            className="rounded-circle bg-warning bg-opacity-10 text-warning d-flex align-items-center justify-content-center mx-auto mb-3"
            style={{
                width: "70px",
                height: "70px",
            }}
        >
            <span className="fs-3">!</span>
        </div>

        <h5 className="fw-bold">
            No Professional Found
        </h5>

        <p className="text-muted small">
            No professional accepted your request
            within 1 minute.
        </p>

        <div className="d-grid gap-2 mt-4">
            <button
                className="btn btn-primary rounded-pill fw-semibold"
                onClick={handleTryAgain}
            >
                Try Again
            </button>

            <button
                className="btn btn-light rounded-pill"
                onClick={handleCancel}
            >
                Cancel
            </button>
        </div>
    </div>
)}

 { searchStatus === "searching" && (
    <div className="container-fluid px-3 py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div
              className="p-4 text-white text-center"
              style={{
                background:
                  "linear-gradient(135deg,#0d6efd,#4f46e5)",
              }}
            >
              <div
                className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle bg-white bg-opacity-25"
                style={{
                  width: "72px",
                  height: "72px",
                }}
              >
                <FaSearch size={28} />
              </div>

              <h4 className="fw-bold mb-2">
                Finding a Professional
              </h4>

              <p className="mb-0 small opacity-75">
                We're contacting nearby professionals for your work.
              </p>
            </div>

            <div className="card-body p-4">
              <div className="text-center mb-4">
                <small className="text-muted d-block mb-2">
                  Waiting for professional acceptance
                </small>

                <div className="fw-bold text-primary display-6">
                  {formattedTime}
                </div>

                <div className="progress mt-3" style={{ height: "7px" }}>
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="position-relative">
                <div className="d-flex gap-3 mb-4">
                  <div
                    className="rounded-circle bg-success bg-opacity-10 text-success d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: "42px",
                      height: "42px",
                    }}
                  >
                    <FaCheckCircle />
                  </div>

                  <div>
                    <h6 className="fw-bold mb-1">
                      Request sent
                    </h6>
                    <small className="text-muted">
                      Your request has been sent to nearby professionals.
                    </small>
                  </div>
                </div>

                <div className="d-flex gap-3 mb-4">
                  <div
                    className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: "42px",
                      height: "42px",
                    }}
                  >
                    <FaUserClock />
                  </div>

                  <div>
                    <h6 className="fw-bold mb-1">
                      Waiting for acceptance
                    </h6>
                    <small className="text-muted">
                      A nearby professional can accept your request.
                    </small>
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <div
                    className="rounded-circle bg-light text-secondary d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: "42px",
                      height: "42px",
                    }}
                  >
                    <FaMapMarkerAlt />
                  </div>

                  <div>
                    <h6 className="fw-bold mb-1">
                      Professional assigned
                    </h6>
                    <small className="text-muted">
                      You'll be notified as soon as someone accepts.
                    </small>
                  </div>
                </div>
              </div>

              <div className="alert alert-light border rounded-4 mt-4 mb-0">
                <div className="d-flex gap-3">
                  <div className="text-primary pt-1">
                    <FaShieldAlt />
                  </div>

                  <div>
                    <div className="fw-semibold small">
                      You don't need to do anything
                    </div>
                    <small className="text-muted">
                      Please stay on this page. We'll automatically update
                      you when a professional accepts your request.
                    </small>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-center align-items-center gap-2 text-muted small mt-4">
                <FaClock />
                <span>
                  Searching nearby professionals...
                </span>
                <span className="spinner-grow spinner-grow-sm text-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  )};
   </>
};

export default PickupWaiting;