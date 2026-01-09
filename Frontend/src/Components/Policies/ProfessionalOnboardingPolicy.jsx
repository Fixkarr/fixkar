import React from "react";
import {
  FaUserTie,
  FaTools,
  FaMoneyCheckAlt,
  FaExclamationTriangle,
  FaBan,
  FaBalanceScale,
  FaUserShield,
  FaGavel,
} from "react-icons/fa";
import { useLocation } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { Helmet } from "react-helmet-async";

const ProfessionalOnboardingPolicy = () => {
  const { pathname } = useLocation();

  return (
    <>
      <Helmet>
        <title>Professional Onboarding Policy – FixKar</title>
        <meta
          name="description"
          content="Professional onboarding agreement for service providers on FixKar including responsibilities, penalties, equipment usage, and conduct rules."
        />
      </Helmet>

      {pathname !== "/" && <Navbar />}

      <div className="container" style={{paddingTop : "5vh"}}>
        <div className="card shadow border-0">
          <div className="card-body p-4 p-md-5">
            <h2 className="text-center fw-bold text-primary mb-3">
              Professional Onboarding Policy
            </h2>

            <p className="text-center text-muted mb-5">
              This agreement applies to all service professionals registered on
              the FixKar platform.
            </p>

            {/* Independent Contractor */}
            <section className="mb-4">
              <h5 className="fw-bold">
                <FaUserTie className="me-2 text-success" />
                Independent Professional Status
              </h5>
              <p className="text-muted">
                Professionals registered on FixKar act as independent service
                providers. They are not employees, agents, or representatives of
                FixKar. FixKar only provides a technology platform for service
                discovery and booking.
              </p>
            </section>

            {/* Responsibilities */}
            <section className="mb-4">
              <h5 className="fw-bold">
                <FaUserShield className="me-2 text-info" />
                Professional Responsibilities
              </h5>
              <ul className="text-muted">
                <li>Provide services professionally and honestly</li>
                <li>Arrive on time for accepted bookings</li>
                <li>Use safe and appropriate tools</li>
                <li>No abusive, illegal, or unethical behavior</li>
                <li>No direct/off-platform dealing with customers</li>
              </ul>
            </section>

            {/* Equipment */}
            <section className="mb-4">
              <h5 className="fw-bold">
                <FaTools className="me-2 text-warning" />
                Equipment Usage & Security Policy
              </h5>
              <p className="text-muted">
                Any tools, equipment, or devices provided by FixKar remain the
                sole property of FixKar. Professionals may use such equipment
                only for FixKar-booked services.
              </p>
              <p className="text-muted">
                Loss, theft, damage, misuse, or unauthorized usage due to
                negligence may result in recovery of costs, penalty charges,
                payment holds, suspension, or legal action.
              </p>
            </section>

            {/* Payments */}
            <section className="mb-4">
              <h5 className="fw-bold">
                <FaMoneyCheckAlt className="me-2 text-success" />
                Payments & Commission
              </h5>
              <p className="text-muted">
                Professionals will receive payments after deducting FixKar’s
                platform commission. Payments may be held in case of disputes,
                complaints, penalties, or policy violations.
              </p>
            </section>

            {/* Penalties */}
            <section className="mb-4">
              <h5 className="fw-bold text-danger">
                <FaExclamationTriangle className="me-2" />
                Penalties & Charges
              </h5>
              <ul className="text-muted">
                <li>Late arrival or no-show</li>
                <li>Customer complaints</li>
                <li>Poor service quality</li>
                <li>Equipment damage or misuse</li>
                <li>Policy violations</li>
              </ul>
              <p className="text-muted">
                Penalties may include warning, penalty deduction, payment hold,
                temporary suspension, or permanent account termination.
              </p>
            </section>

            {/* Termination */}
            <section className="mb-4">
              <h5 className="fw-bold">
                <FaBan className="me-2 text-danger" />
                Suspension & Termination
              </h5>
              <p className="text-muted">
                FixKar reserves the right to suspend or permanently terminate a
                professional’s account if repeated complaints, fraud,
                misconduct, or serious violations are reported.
              </p>
            </section>

            {/* Disputes */}
            <section className="mb-4">
              <h5 className="fw-bold">
                <FaBalanceScale className="me-2 text-secondary" />
                Dispute Resolution
              </h5>
              <p className="text-muted">
                All disputes shall be reviewed internally by FixKar. FixKar’s
                decision shall be final and binding.
              </p>
            </section>

            {/* Law */}
            <section className="mb-4">
              <h5 className="fw-bold">
                <FaGavel className="me-2 text-dark" />
                Governing Law
              </h5>
              <p className="text-muted">
                This agreement shall be governed by the laws of India.
              </p>
            </section>

            <div className="alert alert-primary mt-5 text-center">
              By registering as a professional on FixKar, you confirm that you
              have read, understood, and agreed to this Professional Onboarding
              Policy.
            </div>
          </div>
        </div>
      </div>

      {pathname !== "/" && <Footer />}
    </>
  );
};

export default ProfessionalOnboardingPolicy;
