import React from "react";
import {
  FaUserLock,
  FaCookieBite,
  FaImages,
  FaMapMarkedAlt,
  FaCreditCard,
  FaShieldAlt,
  FaUserCog,
  FaShareAlt,
  FaSyncAlt,
  FaEnvelope,
  FaGlobe,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useLocation } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { Helmet } from "react-helmet-async";

const PrivacyPolicy = () => {
  const location = useLocation();
const { pathname } = location;

  return (
<>  <Helmet>
  <title>Privacy Policy – Fixkar</title>
  <meta
    name="description"
    content="Read Fixkar’s Privacy Policy to understand how we collect, use, and protect user data while delivering secure and technology-driven services."
  />
</Helmet>
    {pathname !== '/' && <Navbar/>}
    <div className="container my-5">
      <div className="card shadow border-0">
        <div className="card-body p-4 p-md-5">
          {/* Title */}
          <h2 className="text-center fw-bold text-primary mb-3">
            Privacy Policy
          </h2>

          <p className="text-center text-muted mb-5">
            This Privacy Policy explains how FixKar collects, uses, and protects
            your personal information.
          </p>

          {/* Intro */}
          <section className="mb-4">
            <h5 className="fw-bold">
              <FaUserLock className="me-2 text-primary" />
              Information We Collect
            </h5>
            <p className="text-muted">
              FixKar collects personal and technical information to provide
              better services and a secure user experience.
            </p>
          </section>

          {/* Cookies */}
          <section className="mb-4">
            <h5 className="fw-bold">
              <FaCookieBite className="me-2 text-warning" />
              Cookies & Tracking Technologies
            </h5>
            <p className="text-muted">
              We use cookies and similar technologies to enhance website
              functionality, analyze traffic, remember user preferences, and
              improve security. Users can manage cookie preferences through
              their browser settings.
            </p>
          </section>

          {/* Media Access */}
          <section className="mb-4">
            <h5 className="fw-bold">
              <FaImages className="me-2 text-success" />
              Media & File Access
            </h5>
            <p className="text-muted">
              When uploading documents, profile photos, or service-related
              images, FixKar may request access to your device storage or media.
              This access is used only to upload files selected by the user and
              never without consent.
            </p>
          </section>

          {/* Location */}
          <section className="mb-4">
            <h5 className="fw-bold">
              <FaMapMarkedAlt className="me-2 text-danger" />
              Location Access
            </h5>
            <p className="text-muted">
              We may collect location information to connect customers with
              nearby service professionals, improve service accuracy, and
              enhance availability. Location access can be managed anytime from
              device settings.
            </p>
          </section>

          {/* Payment */}
          <section className="mb-4">
            <h5 className="fw-bold">
              <FaCreditCard className="me-2 text-info" />
              Payment & Bank Details
            </h5>
            <p className="text-muted">
              Payment-related information is processed securely through
              authorized third-party payment gateways. FixKar does not store
              sensitive banking details such as card numbers, CVV, UPI PIN, or
              net banking passwords.
            </p>
          </section>

          {/* Data Usage */}
          <section className="mb-4">
            <h5 className="fw-bold">
              <FaShieldAlt className="me-2 text-secondary" />
              How We Use Your Data
            </h5>
            <ul className="text-muted">
              <li>To provide and manage services</li>
              <li>To process bookings and transactions</li>
              <li>To improve platform security and performance</li>
              <li>To prevent fraud and misuse</li>
            </ul>
          </section>

          {/* Sharing */}
          <section className="mb-4">
            <h5 className="fw-bold">
              <FaShareAlt className="me-2 text-warning" />
              Data Sharing
            </h5>
            <p className="text-muted">
              User information may be shared only with service professionals,
              payment partners, or legal authorities when required. FixKar does
              not sell or rent personal data to third parties.
            </p>
          </section>

          {/* User Rights */}
          <section className="mb-4">
            <h5 className="fw-bold">
              <FaUserCog className="me-2 text-success" />
              User Rights & Control
            </h5>
            <p className="text-muted">
              Users have the right to access, update, or delete their data and
              withdraw permissions related to cookies, location, or media
              access, subject to legal requirements.
            </p>
          </section>

          {/* Policy Changes */}
          <section className="mb-4">
            <h5 className="fw-bold">
              <FaSyncAlt className="me-2 text-dark" />
              Changes to This Policy
            </h5>
            <p className="text-muted">
              FixKar reserves the right to modify this Privacy Policy at any
              time. Continued use of the platform after updates indicates
              acceptance of the revised policy.
            </p>
          </section>

          {/* Contact */}
          <section className="mt-5 p-4 bg-light rounded">
            <h5 className="fw-bold mb-3">Contact Us</h5>

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
            By using FixKar, you agree to this Privacy Policy.
          </div>
        </div>
      </div>
    </div>
     {pathname !== '/' && <Footer/>}
</>

    
  );
};

export default PrivacyPolicy;
