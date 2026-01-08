import React from "react";
import {
  FaTools,
  FaUserCheck,
  FaClock,
  FaExclamationTriangle,
  FaHandshake,
  FaCheckCircle,
  FaTruck,
  FaHeadset,
  FaMapMarkerAlt,
  FaEnvelope,
  FaGlobe,
} from "react-icons/fa";
import { useLocation } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
const ServiceDelieveryPolicy = () => {
   const location = useLocation();
const { pathname } = location;

  return (
    <>
     {pathname !== '/' && <Navbar/>}
    <div className="container my-5">
      <div className="card shadow-lg border-0">
        <div className="card-body p-4 p-md-5">
          {/* Header */}
          <h2 className="text-center mb-4 fw-bold text-primary">
            Service Delievery Policy
          </h2>

          <p className="text-muted text-center mb-5">
            Please read these terms carefully before using the FixKar platform.
          </p>

          {/* Service Delivery Policy */}
          <section className="mb-4">
            <h5 className="fw-bold">
              <FaTools className="me-2 text-primary" />
              Service Delivery Policy
            </h5>
            <p className="text-muted">
              FixKar is a service-based online platform that helps customers find
              and book trusted service professionals such as carpenters,
              painters, builders, engineers, and other skilled workers. We do
              not sell or deliver any physical products.
            </p>
          </section>

          {/* How Service Works */}
          <section className="mb-4">
            <h5 className="fw-bold">
              <FaUserCheck className="me-2 text-success" />
              How Our Service Works
            </h5>
            <ul className="text-muted">
              <li>Services are delivered by independent professionals listed on FixKar.</li>
              <li>Customers can book services by selecting date, time, and location.</li>
              <li>The assigned professional visits the customer’s location.</li>
            </ul>
          </section>

          {/* Service Timing */}
          <section className="mb-4">
            <h5 className="fw-bold">
              <FaClock className="me-2 text-warning" />
              Service Timing
            </h5>
            <ul className="text-muted">
              <li>Service delivery depends on professional availability.</li>
              <li>Estimated service time is shown during booking.</li>
              <li>Actual completion time may vary based on work complexity.</li>
            </ul>
          </section>

          {/* Delays */}
          <section className="mb-4">
            <h5 className="fw-bold">
              <FaExclamationTriangle className="me-2 text-danger" />
              Delays or Changes
            </h5>
            <p className="text-muted">
              Delays may occur due to weather conditions, traffic, emergencies,
              or technical issues. Customers will be informed whenever possible.
              FixKar is not responsible for delays beyond its control.
            </p>
          </section>

          {/* Responsibility */}
          <section className="mb-4">
            <h5 className="fw-bold">
              <FaHandshake className="me-2 text-info" />
              Service Responsibility
            </h5>
            <ul className="text-muted">
              <li>Professionals are expected to behave professionally.</li>
              <li>Any service-related issue can be reported to FixKar support.</li>
              <li>FixKar acts only as a connecting platform.</li>
            </ul>
          </section>

          {/* Completion */}
          <section className="mb-4">
            <h5 className="fw-bold">
              <FaCheckCircle className="me-2 text-success" />
              Service Completion
            </h5>
            <p className="text-muted">
              A service is considered completed once the work is finished and
              confirmed by the customer. Payments are handled as per FixKar’s
              payment and refund policies.
            </p>
          </section>

          {/* No Shipping */}
          <section className="mb-4">
            <h5 className="fw-bold">
              <FaTruck className="me-2 text-secondary" />
              No Physical Shipping
            </h5>
            <p className="text-muted">
              FixKar does not ship or deliver physical goods. All offerings on
              the platform are service-based only.
            </p>
          </section>

          {/* Help Section */}
          <section className="mt-5 p-4 bg-light rounded">
            <h5 className="fw-bold mb-3">
              <FaHeadset className="me-2 text-primary" />
              Need Help?
            </h5>

            <p className="mb-1">
              <FaEnvelope className="me-2 text-muted" />
              <strong>Email:</strong> fixkarteam@gmail.com
            </p>

            <p className="mb-1">
              <FaGlobe className="me-2 text-muted" />
              <strong>Website:</strong> fixkar.netlify.app
            </p>

            <p className="mb-0">
              <FaMapMarkerAlt className="me-2 text-muted" />
              <strong>Location:</strong> Lohta, Varanasi, Uttarpradesh
            </p>
          </section>
        </div>
      </div>
    </div>
     {pathname !== '/' && <Footer/>}
    </>
  );
};

export default ServiceDelieveryPolicy;
