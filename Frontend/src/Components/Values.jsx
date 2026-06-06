import React from "react";
import {
  FaShieldAlt,
  FaMapMarkerAlt,
  FaStar,
  FaComments,
  FaWallet,
  FaHeadset,
  FaUsers,
  FaArrowRight,
} from "react-icons/fa";

const Values = () => {
  const features = [
    {
      icon: <FaShieldAlt />,
      title: "Trusted Professionals",
      desc: "All professionals are verified before joining the platform.",
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "Nearby Service",
      desc: "Find local professionals quickly in your area.",
    },
    {
      icon: <FaStar />,
      title: "Quality Assurance",
      desc: "Ratings and reviews help ensure high service quality.",
    },
    {
      icon: <FaComments />,
      title: "Easy Communication",
      desc: "Chat directly with professionals before hiring.",
    },
    {
      icon: <FaWallet />,
      title: "Secure Payments",
      desc: "Safe transactions with transparent pricing.",
    },
    {
      icon: <FaHeadset />,
      title: "Customer Support",
      desc: "Dedicated support whenever you need assistance.",
    },
  ];

  return (
    <section className="py-5 bg-white">
      <div className="container">

        {/* Heading */}

        <div className="text-center mb-5">

          <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill">
            WHY CHOOSE FIXKAR
          </span>

          <h2 className="display-5 fw-bold mt-3">
            Why Thousands Choose
            <span className="text-primary"> Fixkar</span>
          </h2>

          <p
            className="text-secondary mx-auto mt-3"
            style={{ maxWidth: "700px" }}
          >
            Fixkar connects customers with trusted local professionals
            through a secure, reliable and transparent platform.
          </p>

        </div>

        {/* Cards */}

        <div className="row g-4">

          {features.map((item, index) => (
            <div className="col-md-6 col-lg-4" key={index}>

              <div className="feature-card h-100 p-4">

                <div className="icon-circle mb-4">
                  {item.icon}
                </div>

                <h5 className="fw-bold mb-3">
                  {item.title}
                </h5>

                <p className="text-secondary mb-0">
                  {item.desc}
                </p>

              </div>

            </div>
          ))}

        </div>

        {/* Bottom CTA */}

        <div className="cta-banner mt-5 p-4 p-lg-5">

          <div className="row align-items-center">

            <div className="col-lg-8">

              <div className="d-flex align-items-center gap-3">

                <div className="cta-icon">
                  <FaUsers />
                </div>

                <div>
                  <h3 className="fw-bold mb-2">
                    Join Thousands of Happy Customers
                  </h3>

                  <p className="mb-0 text-secondary">
                    Grow your business and connect with trusted
                    professionals through Fixkar.
                  </p>
                </div>

              </div>

            </div>

            <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">

              <button className="btn btn-primary btn-lg px-4">
                Get Started
                <FaArrowRight className="ms-2" />
              </button>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Values;