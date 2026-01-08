import React from "react";
import {
  FaUndoAlt,
  FaCalendarTimes,
  FaClock,
  FaUserTimes,
  FaUserCheck,
  FaExclamationTriangle,
  FaMoneyBillWave,
  FaGavel,
  FaHeadset,
  FaEnvelope,
  FaGlobe,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Footer from "../Footer";
import Navbar from "../Navbar";
import { useLocation } from "react-router-dom";

const CancellationRefundPolicy = () => {
   const location = useLocation();
const { pathname } = location;
  return (
    <>
    {pathname !== '/' && <Navbar/>}
    <div className="container my-5">
      <div className="card shadow border-0">
        <div className="card-body p-4 p-md-5">
          {/* Title */}
          <h2 className="text-center fw-bold text-primary mb-3">
            Cancellation & Refund Policy
          </h2>

          <p className="text-center text-muted mb-5">
            FixKar aims to provide a fair and transparent cancellation and refund
            process for both customers and service professionals.
          </p>

          {/* Customer Cancellation */}
          <section className="mb-4">
            <h5 className="fw-bold">
              <FaUndoAlt className="me-2 text-primary" />
              Customer Cancellation Policy
            </h5>

            <div className="ms-3">
              <p className="fw-semibold mb-1">
                <FaCalendarTimes className="me-2 text-success" />
                Cancellation Before Working Date
              </p>
              <ul className="text-muted">
                <li>
                  If the customer cancels the booking before the scheduled
                  working date, no cancellation charges will be applied.
                </li>
                <li>
                  Any amount paid will be eligible for a full refund as per
                  FixKar’s payment policy.
                </li>
              </ul>

              <p className="fw-semibold mb-1">
                <FaClock className="me-2 text-warning" />
                Cancellation on Working Date
              </p>
              <ul className="text-muted">
                <li>
                  If the customer cancels the booking on the scheduled working
                  date, a visiting charge may be deducted.
                </li>
                <li>
                  The visiting charge, once deducted, will not be refundable.
                </li>
              </ul>
            </div>
          </section>

          {/* Professional Delay / No Show */}
          <section className="mb-4">
            <h5 className="fw-bold">
              <FaUserTimes className="me-2 text-danger" />
              Professional Delay or No-Show Policy
            </h5>

            <ul className="text-muted">
              <li>
                If a professional accepts a job and later refuses to visit
                without a valid reason, FixKar may assign another professional.
              </li>
              <li>
                The concerned professional will receive a warning, and repeated
                incidents may lead to suspension or termination.
              </li>
            </ul>

            <p className="fw-semibold mb-1">
              <FaClock className="me-2 text-warning" />
              Professional Late Arrival
            </p>
            <ul className="text-muted">
              <li>
                If a professional arrives more than 2 hours late without prior
                intimation or valid reason, another professional may be assigned
                (subject to availability).
              </li>
              <li>
                Such incidents will be recorded in the professional’s account.
              </li>
            </ul>
          </section>

          {/* Emergency */}
          <section className="mb-4">
            <h5 className="fw-bold">
              <FaExclamationTriangle className="me-2 text-info" />
              Emergency Situations (Professional)
            </h5>
            <p className="text-muted mb-2">
              In case of genuine emergencies such as:
            </p>
            <ul className="text-muted">
              <li>Death in the family</li>
              <li>Accident</li>
              <li>Medical emergency</li>
            </ul>
            <p className="text-muted">
              FixKar will assign another available professional to the customer
              wherever possible. No penalty will be imposed on the professional
              in such genuine cases.
            </p>
          </section>

          {/* Refund Process */}
          <section className="mb-4">
            <h5 className="fw-bold">
              <FaMoneyBillWave className="me-2 text-success" />
              Refund Process
            </h5>
            <ul className="text-muted">
              <li>
                Refunds (if applicable) will be processed to the original
                payment method.
              </li>
              <li>
                Refunds are usually completed within 5–7 business days,
                depending on the payment gateway.
              </li>
              <li>
                Refund amount depends on cancellation timing and applicable
                charges.
              </li>
            </ul>
          </section>

          {/* Fixkar Rights */}
          <section className="mb-4">
            <h5 className="fw-bold">
              <FaGavel className="me-2 text-dark" />
              FixKar’s Right
            </h5>
            <p className="text-muted">
              FixKar reserves the right to review all cancellations, delays, and
              disputes. FixKar’s decision regarding refunds, visiting charges,
              reassignment, and account actions will be final and binding.
            </p>
          </section>

          {/* Help */}
          <section className="mt-5 p-4 bg-light rounded">
            <h5 className="fw-bold mb-3">
              <FaHeadset className="me-2 text-primary" />
              Need Help?
            </h5>

            <p className="mb-1">
              <FaEnvelope className="me-2 text-muted" />
              <strong>Email:</strong> support@fixkar.co.in
            </p>

            <p className="mb-1">
              <FaGlobe className="me-2 text-muted" />
              <strong>Website:</strong> www.fixkar.co.in
            </p>

            <p className="mb-0">
              <FaMapMarkerAlt className="me-2 text-muted" />
              <strong>Location:</strong> Lucknow, Uttar Pradesh, India
            </p>
          </section>

          {/* Acceptance */}
          <div className="alert alert-primary mt-5 text-center">
            📌 By booking a service on FixKar, you agree to this Cancellation &
            Refund Policy.
          </div>
        </div>
      </div>
    </div>
    {pathname !== '/' && <Footer/>}
    </>
  );
};

export default CancellationRefundPolicy;
