import React from "react";
import {
  FaInfoCircle,
  FaUserTie,
  FaBan,
  FaMoneyCheckAlt,
  FaUserShield,
  FaSyncAlt,
  FaUserCheck,
  FaGavel,
  FaTools,
} from "react-icons/fa";
import { useLocation } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { Helmet } from "react-helmet-async";

const TermsAndConditions = () => {
   const location = useLocation();
const { pathname } = location;
  return (
    <>
    <Helmet>
  <title>Terms & Conditions – Fixkar</title>
  <meta
    name="description"
    content="Review Fixkar’s Terms and Conditions outlining platform usage, professional responsibilities, user obligations, and service guidelines."
  />
</Helmet>

    {pathname !== '/' && <Navbar/>}
      <div className="container my-5">
      <div className="card shadow border-0">
        <div className="card-body p-4 p-md-5">
          {/* Page Title */}
          <h2 className="text-center fw-bold text-primary mb-3">
            Terms & Conditions
          </h2>

          <p className="text-center text-muted mb-5">
            By accessing or using the FixKar platform, you agree to comply with
            the following terms and conditions.
          </p>

          {/* Platform Disclaimer */}
          <section className="mb-4">
            <h5 className="fw-bold">
              <FaInfoCircle className="me-2 text-primary" />
              Platform Disclaimer
            </h5>
            <p className="text-muted">
              FixKar is an online platform that connects customers with
              independent service professionals. FixKar is not a direct service
              provider and does not perform services itself.
            </p>
          </section>

          {/* Independent Professionals */}
          <section className="mb-4">
            <h5 className="fw-bold">
              <FaUserTie className="me-2 text-success" />
              Independent Professionals
            </h5>
            <ul className="text-muted">
              <li>All professionals listed on FixKar work independently.</li>
              <li>
                Service quality, execution, and tools used are the sole
                responsibility of the professional.
              </li>
              <li>
                FixKar only facilitates service discovery, booking, and payment
                support.
              </li>
            </ul>
          </section>

          {/* Fake Bookings */}
          <section className="mb-4">
            <h5 className="fw-bold">
              <FaBan className="me-2 text-danger" />
              Fake Bookings
            </h5>
            <p className="text-muted">
              Any fake, misleading, or intentionally false booking is strictly
              prohibited. Accounts found involved in such activities may be
              suspended or permanently terminated without prior notice.
            </p>
          </section>

          {/* Payments & Disputes */}
          <section className="mb-4">
            <h5 className="fw-bold">
              <FaMoneyCheckAlt className="me-2 text-warning" />
              Payments & Disputes
            </h5>
            <ul className="text-muted">
              <li>All payments must be made through the FixKar platform only.</li>
              <li>
                In case of any payment or service dispute, FixKar will review the
                matter fairly.
              </li>
              <li>
                FixKar’s decision in such cases shall be final and binding.
              </li>
            </ul>
          </section>

          {/* Account Actions */}
          <section className="mb-4">
            <h5 className="fw-bold">
              <FaUserShield className="me-2 text-info" />
              Account Actions
            </h5>
            <p className="text-muted">
              FixKar reserves the right to suspend or terminate user accounts,
              hold payments, or take appropriate action in case of any violation
              of platform policies or misuse of services.
            </p>
            <h5 className="fw-bold">
              <FaTools className="me-2 text-info" />
              Equipment Usage & Security Policy
            </h5>
            <p className="text-muted">
           

Any tools, equipment, or devices provided by FixKar to service professionals
remain the property of FixKar. Professionals are authorized to use such
equipment only for official service-related work booked through the FixKar
platform.

Professionals must ensure proper care, safety, and responsible usage of all
equipment. Use of equipment for personal, unauthorized, illegal, or third-party
purposes is strictly prohibited.

In case of loss, theft, damage, or misuse due to negligence or avoidable
circumstances, FixKar reserves the right to recover repair or replacement costs,
hold payments, suspend accounts, or take further disciplinary or legal action
where necessary.

Any incident involving equipment must be reported immediately to FixKar
support.

            </p>
          </section>

          {/* Changes to Terms */}
          <section className="mb-4">
            <h5 className="fw-bold">
              <FaSyncAlt className="me-2 text-secondary" />
              Changes to Terms
            </h5>
            <p className="text-muted">
              FixKar may update or modify these Terms & Conditions at any time
              without prior notice. Continued use of the platform after such
              changes indicates acceptance of the updated terms.
            </p>
          </section>

          {/* User Responsibility */}
          <section className="mb-4">
            <h5 className="fw-bold">
              <FaUserCheck className="me-2 text-success" />
              User Responsibility
            </h5>
            <p className="text-muted">
              Users are responsible for providing accurate and complete
              information during booking and for cooperating with professionals
              during service delivery.
            </p>
          </section>

          {/* Governing Law */}
          <section className="mb-4">
            <h5 className="fw-bold">
              <FaGavel className="me-2 text-dark" />
              Governing Law
            </h5>
            <p className="text-muted">
              These Terms & Conditions shall be governed and interpreted in
              accordance with the applicable laws of India.
            </p>
          </section>

          {/* Acceptance */}
          <div className="alert alert-primary mt-5 text-center">
            By using FixKar, you acknowledge that you have read, understood, and
            agreed to these Terms & Conditions.
          </div>
        </div>
      </div>
    </div>
    {pathname !== '/' && <Footer/>}
    </>
    
  );
};

export default TermsAndConditions;
