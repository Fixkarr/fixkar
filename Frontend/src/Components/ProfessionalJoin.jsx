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
import { useNavigate } from "react-router-dom";

const ProfessionalJoin = () => {
    const navigate = useNavigate();

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
         <div>
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
            </div>
       <div className="row align-items-center g-4">

  {/* Image */}
  <div className="col-12 col-lg-5">
    <div className="image-wrapper">
      <img
        src="/images/professionals-group.webp"
        alt="Join Fixkar"
        className="img-fluid w-100 shadow-sm"
      />
    </div>
  </div>

  {/* Content */}
  <div className="col-12 col-lg-7">
    <div className="mt-lg-4">

      {features.map((item, index) => (
        <div
          key={index}
          className="d-flex align-items-start gap-3 mb-4"
        >
          <div className="feature-icon flex-shrink-0">
            {item.icon}
          </div>

          <div>
            <h6 className="fw-bold mb-2">
              {item.title}
            </h6>

            <p className="text-muted mb-0">
              {item.desc}
            </p>
          </div>
        </div>
      ))}

      <button className="btn btn-primary rounded-3 px-4 py-3 mt-3" onClick={()=>{navigate('/professional-join-process')}}>
        See Joining Process
        <FaArrowRight className="ms-2" />
      </button>

    </div>
  </div>

</div>
      </div>
    </section>
  );
};

export default ProfessionalJoin;