import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const steps = [
  {
    id: "01",
    title: "Register as a Professional",
    description:
      "Create your account by filling in your basic details, select your profession and submit your registration.",
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800",
  },
  {
    id: "02",
    title: "OnBoard to the Platform",
    description:
      "Submit your application and documents. Our team will review your application and contact you.",
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800",
  },
  {
    id: "03",
    title: "Verification & Approval",
    description:
      "After successful verification and approval, you will be officially joined as your profession on Fixkar.",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
  },
  {
    id: "04",
    title: "Complete Profile & Start Working",
    description:
      "Complete your profile, add your services, availability and start receiving job requests.",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
  },
];

const JoinProcess = () => {
  return (
    <>
        <Navbar/>
        <section className="container py-5">
      {/* Heading */}
      <div className="text-center mb-5">
        <span className="badge bg-primary-subtle text-primary px-3 py-2">
          Join Fixkar
        </span>

        <h2 className="fw-bold mt-3">
          How Professionals Join Fixkar
        </h2>

        <p className="text-secondary col-lg-7 mx-auto">
          Follow these simple steps to become a verified professional
          and start receiving service requests from customers.
        </p>
      </div>

      {/* Steps */}
      {steps.map((step, index) => (
        <div
          key={step.id}
          className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden"
        >
          <div
            className={`row g-0 align-items-center ${
              index % 2 !== 0 ? "flex-lg-row-reverse" : ""
            }`}
          >
            {/* Image */}
            <div className="col-lg-6">
              <img
                src={step.image}
                alt={step.title}
                className="img-fluid w-100 h-100 object-fit-cover"
                style={{
                  minHeight: "320px",
                }}
              />
            </div>

            {/* Content */}
            <div className="col-lg-6 p-4 p-lg-5">
              <div
                className="rounded-circle bg-primary bg-opacity-10 text-primary fw-bold d-flex align-items-center justify-content-center mb-3"
                style={{
                  width: "60px",
                  height: "60px",
                }}
              >
                {step.id}
              </div>

              <h3 className="fw-bold mb-3">
                {step.title}
              </h3>

              <p className="text-secondary mb-0 fs-5">
                {step.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </section>
    <Footer/>
    </>
  );
};

export default JoinProcess;