import React from "react";
import {
  FaUsers,
  FaIdCard,
  FaImages,
  FaComments,
  FaBriefcase,
  FaWallet,
  FaArrowRight,
} from "react-icons/fa";

import {
  MdLocationOn,
  MdVerified,
} from "react-icons/md";

const ProfessionalJoin = () => {
  const features = [
    {
      icon: <FaUsers />,
      title: "Connect with Nearby Customers",
      desc: "Get discovered by customers in your local area looking for your services.",
    },
    {
      icon: <FaIdCard />,
      title: "Create Your Digital Profile",
      desc: "Build a professional profile and stand out from the crowd.",
    },
    {
      icon: <FaImages />,
      title: "Showcase Your Services & Work",
      desc: "Display services, pricing, and previous work to build trust.",
    },
    {
      icon: <FaComments />,
      title: "Chat Directly with Customers",
      desc: "Communicate easily and understand customer requirements faster.",
    },
    {
      icon: <FaBriefcase />,
      title: "Get More Jobs & Earn More",
      desc: "Receive more job requests and increase your income.",
    },
    {
      icon: <FaWallet />,
      title: "Easy Withdrawals",
      desc: "Withdraw your earnings securely and hassle-free.",
    },
  ];

  return (
    <section className="professional-join-section py-5 overflow-hidden">
      <div className="container">
        <div className="row g-5">

          {/* Left Side */}
         <div className="col-5 col-lg-5 mb-4 mb-lg-0">
            <div className="position-relative">

              <div className="image-wrapper"></div>

              <img
                src="/images/professionals-group.webp"
                alt="Join Fixkar"
                className="img-fluid"
              />

              {/* Floating Cards */}

              <div className="floating-card card-1">
                <MdLocationOn />
                <span>Nearby Customers</span>
              </div>

              <div className="floating-card card-2">
                <FaBriefcase />
                <span>More Jobs</span>
              </div>

              <div className="floating-card card-3">
                <FaWallet />
                <span>Secure Earnings</span>
              </div>

              <div className="floating-card card-4">
                <FaComments />
                <span>Direct Chat</span>
              </div>
            </div>
          </div>

          {/* Right Side */}

          <div className="col-7 col-lg-7">

            <span className="small-heading">
              GROW YOUR BUSINESS WITH FIXKAR
            </span>

            <h2 className="main-heading mt-3">
              Are You a <br />
              Working Professional?
            </h2>

            <p className="hero-text mt-3">
              Join Fixkar and unlock endless opportunities. Connect with
              nearby customers, showcase your skills, and grow your business
              effortlessly.
            </p>

            <div className="mt-4">

              {features.map((item, index) => (
                <div
                  key={index}
                  className="feature-item d-flex align-items-start"
                >
                  <div className="feature-icon">
                    {item.icon}
                  </div>

                  <div>
                    <h6>{item.title}</h6>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}

            </div>

            <button className="btn join-btn mt-3">
              See Joining Process
              <FaArrowRight className="ms-2" />
            </button>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalJoin;