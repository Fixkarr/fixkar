import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";

import {
  FaCheckCircle,
  FaUsers,
  FaHardHat,
  FaBuilding,
  FaPaintRoller,
  FaBolt,
  FaTools,
  FaHandshake,
  FaArrowRight,
} from "react-icons/fa";

const About = () => {
  const location = useLocation();
  const { pathname } = location;

  return (
    <>
      {/* ===== SEO ===== */}
      {pathname !== "/" && (
        <>
          <Helmet>
            <title>
              About Fixkar – Smart Contracting & Maintenance Platform
            </title>

            <meta
              name="description"
              content="Fixkar is a modern service and contracting platform offering repair, maintenance, painting contracts, electrical works, civil projects, and smart technology-driven solutions."
            />
          </Helmet>

          <Navbar />
        </>
      )}

      {/* ===== HERO SECTION ===== */}
      {/* ===== HERO SECTION ===== */}
<section
  className="position-relative overflow-hidden d-flex align-items-center"
  style={{
    minHeight: "100vh",
    backgroundImage: `
      linear-gradient(
        90deg,
        rgba(255,255,255,0.97) 0%,
        rgba(255,255,255,0.92) 35%,
        rgba(255,255,255,0.75) 55%,
        rgba(255,255,255,0.35) 100%
      ),
      url('/Images/about-banner.webp')
    `,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>
  {/* BLUE GLOW */}
  <div
    style={{
      position: "absolute",
      top: "-100px",
      left: "-100px",
      width: "350px",
      height: "350px",
      background: "rgba(13,110,253,0.15)",
      filter: "blur(100px)",
      borderRadius: "50%",
    }}
  />

  <div className="container py-5 mt-5 position-relative">
    <div className="row">
      <div className="col-lg-7">
        {/* TAG */}
        <span
          className="px-4 py-2 rounded-pill fw-semibold"
          style={{
            background: "rgba(13,110,253,0.1)",
            color: "#0d6efd",
            fontSize: "14px",
            letterSpacing: "1px",
            backdropFilter: "blur(10px)",
          }}
        >
          ABOUT FIXKAR
        </span>

        {/* HEADING */}
        <h1
          className="fw-bold mt-4 mb-4"
          style={{
            fontSize: "clamp(2.8rem,6vw,6rem)",
            lineHeight: "1.05",
            color: "#0b1320",
          }}
        >
          Building Spaces.
          <br />

          <span
            style={{
              background:
                "linear-gradient(90deg,#0d6efd,#00bfff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Delivering Trust.
          </span>
        </h1>

        {/* DESCRIPTION */}
        <p
          className="text-secondary"
          style={{
            fontSize: "18px",
            lineHeight: "35px",
            maxWidth: "700px",
          }}
        >
          Fixkar is not just a repair & maintenance platform.
          We provide complete contracting solutions including
          painting contracts, electrical projects, civil works,
          maintenance contracts, and smart technology-driven
          services for homes, offices, builders, and businesses.
        </p>

        {/* FEATURES */}
        <div className="row mt-5 g-4">
          {[
            {
              icon: <FaCheckCircle />,
              title: "Quality Work",
            },
            {
              icon: <FaUsers />,
              title: "Skilled Team",
            },
            {
              icon: <FaHardHat />,
              title: "Professional Execution",
            },
            {
              icon: <FaHandshake />,
              title: "Trusted Partnership",
            },
          ].map((item, index) => (
            <div className="col-sm-6" key={index}>
              <div
                className="d-flex align-items-center gap-3 p-3"
                style={{
                  background: "rgba(255,255,255,0.55)",
                  backdropFilter: "blur(12px)",
                  borderRadius: "22px",
                  border: "1px solid rgba(255,255,255,0.6)",
                  boxShadow:
                    "0 10px 30px rgba(0,0,0,0.05)",
                }}
              >
                {/* ICON */}
                <div
                  className="d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: "65px",
                    height: "65px",
                    borderRadius: "20px",
                    background:
                      "linear-gradient(135deg,#0d6efd,#4dabff)",
                    color: "#fff",
                    fontSize: "24px",
                    boxShadow:
                      "0 10px 30px rgba(13,110,253,0.25)",
                  }}
                >
                  {item.icon}
                </div>

                {/* TITLE */}
                <div>
                  <h6
                    className="mb-1 fw-bold"
                    style={{
                      fontSize: "17px",
                    }}
                  >
                    {item.title}
                  </h6>

                  <small className="text-muted">
                    Premium Contract Solutions
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FLOATING STATS */}
        <div
          className="d-inline-flex align-items-center gap-4 mt-5 px-4 py-3"
          style={{
            background: "rgba(255,255,255,0.65)",
            backdropFilter: "blur(12px)",
            borderRadius: "24px",
            border: "1px solid rgba(255,255,255,0.5)",
            boxShadow:
              "0 15px 40px rgba(0,0,0,0.08)",
          }}
        >
          <div>
            <h3
              className="fw-bold mb-0"
              style={{ color: "#0d6efd" }}
            >
              150+
            </h3>
            <small className="text-muted">
              Projects
            </small>
          </div>

          <div
            style={{
              width: "1px",
              height: "40px",
              background: "#dbe4ff",
            }}
          />

          <div>
            <h3
              className="fw-bold mb-0"
              style={{ color: "#0d6efd" }}
            >
              98%
            </h3>
            <small className="text-muted">
              Client Satisfaction
            </small>
          </div>

          <div
            style={{
              width: "1px",
              height: "40px",
              background: "#dbe4ff",
            }}
          />

          <div>
            <h3
              className="fw-bold mb-0"
              style={{ color: "#0d6efd" }}
            >
              50+
            </h3>
            <small className="text-muted">
              Skilled Professionals
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* ===== MISSION SECTION ===== */}
      <section
        className="py-5"
        style={{
          background: "#ffffff",
        }}
      >
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2
              className="fw-bold"
              style={{
                fontSize: "clamp(2rem,4vw,3.5rem)",
              }}
            >
              Our Vision & Mission
            </h2>

            <p
              className="text-muted mt-3 mx-auto"
              style={{
                maxWidth: "700px",
                lineHeight: "32px",
              }}
            >
              We aim to become India’s most trusted contracting
              and maintenance ecosystem by combining skilled
              professionals with technology-driven operations.
            </p>
          </div>

          <div className="row g-4">
            {/* CARD 1 */}
            <div className="col-lg-4">
              <div
                className="h-100 p-5"
                style={{
                  borderRadius: "35px",
                  background:
                    "linear-gradient(135deg,#f4f9ff,#ffffff)",
                  border: "1px solid #edf2ff",
                  transition: "0.4s",
                }}
              >
                <div
                  className="d-inline-flex align-items-center justify-content-center mb-4"
                  style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "22px",
                    background:
                      "linear-gradient(135deg,#0d6efd,#4dabff)",
                    color: "#fff",
                    fontSize: "28px",
                  }}
                >
                  <FaBuilding />
                </div>

                <h3 className="fw-bold mb-3">
                  Large Scale Contracting
                </h3>

                <p
                  className="text-muted"
                  style={{
                    lineHeight: "32px",
                  }}
                >
                  From residential projects to commercial
                  contracts, Fixkar manages complete execution
                  with quality assurance and professional
                  delivery.
                </p>
              </div>
            </div>

            {/* CARD 2 */}
            <div className="col-lg-4">
              <div
                className="h-100 p-5"
                style={{
                  borderRadius: "35px",
                  background:
                    "linear-gradient(135deg,#f8fff8,#ffffff)",
                  border: "1px solid #edf2ff",
                }}
              >
                <div
                  className="d-inline-flex align-items-center justify-content-center mb-4"
                  style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "22px",
                    background:
                      "linear-gradient(135deg,#00b894,#55efc4)",
                    color: "#fff",
                    fontSize: "28px",
                  }}
                >
                  <FaTools />
                </div>

                <h3 className="fw-bold mb-3">
                  Smart Maintenance
                </h3>

                <p
                  className="text-muted"
                  style={{
                    lineHeight: "32px",
                  }}
                >
                  Technology-enabled maintenance solutions
                  with skilled professionals, transparent
                  workflow, and fast response system.
                </p>
              </div>
            </div>

            {/* CARD 3 */}
            <div className="col-lg-4">
              <div
                className="h-100 p-5"
                style={{
                  borderRadius: "35px",
                  background:
                    "linear-gradient(135deg,#fff8f2,#ffffff)",
                  border: "1px solid #edf2ff",
                }}
              >
                <div
                  className="d-inline-flex align-items-center justify-content-center mb-4"
                  style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "22px",
                    background:
                      "linear-gradient(135deg,#ff9800,#ffc107)",
                    color: "#fff",
                    fontSize: "28px",
                  }}
                >
                  <FaHandshake />
                </div>

                <h3 className="fw-bold mb-3">
                  Trusted Partnerships
                </h3>

                <p
                  className="text-muted"
                  style={{
                    lineHeight: "32px",
                  }}
                >
                  We collaborate with architects, engineers,
                  businesses, and property owners to execute
                  projects with accountability and trust.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section
        className="py-5"
        style={{
          background: "#f8fbff",
        }}
      >
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold">
              End-to-End Contracting Solutions
            </h2>

            <p className="text-muted mt-3">
              Complete project execution from planning to
              delivery.
            </p>
          </div>

          <div className="row g-4">
            {[
              {
                icon: <FaPaintRoller />,
                title: "Painting Contracts",
              },
              {
                icon: <FaBolt />,
                title: "Electrical Works",
              },
              {
                icon: <FaBuilding />,
                title: "Civil Construction",
              },
              {
                icon: <FaTools />,
                title: "Maintenance Contracts",
              },
            ].map((item, index) => (
              <div className="col-md-6 col-lg-3" key={index}>
                <div
                  className="h-100 p-4 text-center"
                  style={{
                    background: "#fff",
                    borderRadius: "30px",
                    border: "1px solid #edf2ff",
                    transition: "0.4s",
                    boxShadow:
                      "0 10px 30px rgba(0,0,0,0.05)",
                  }}
                >
                  <div
                    className="mx-auto mb-4 d-flex align-items-center justify-content-center"
                    style={{
                      width: "90px",
                      height: "90px",
                      borderRadius: "25px",
                      background:
                        "linear-gradient(135deg,#0d6efd,#4dabff)",
                      color: "#fff",
                      fontSize: "35px",
                    }}
                  >
                    {item.icon}
                  </div>

                  <h5 className="fw-bold">
                    {item.title}
                  </h5>

                  <p className="text-muted mt-3">
                    Professional quality execution with
                    modern equipment and skilled teams.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-5">
        <div className="container">
          <div
            className="p-5 position-relative overflow-hidden"
            style={{
              borderRadius: "40px",
              background:
                "linear-gradient(135deg,#071c3d,#0d6efd)",
            }}
          >
            <div className="row align-items-center">
              <div className="col-lg-8">
                <h2
                  className="fw-bold text-white"
                  style={{
                    fontSize: "clamp(2rem,4vw,3.5rem)",
                  }}
                >
                  Let’s Build Something Great Together
                </h2>

                <p
                  className="text-light mt-3"
                  style={{
                    lineHeight: "32px",
                    maxWidth: "700px",
                  }}
                >
                  Whether it’s maintenance, electrical work,
                  painting, or complete project contracting,
                  Fixkar is ready to deliver excellence.
                </p>
              </div>

              <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">
                <button
                  className="btn btn-light px-5 py-3 fw-bold"
                  style={{
                    borderRadius: "18px",
                    fontSize: "18px",
                  }}
                >
                  Get a Quote
                  <FaArrowRight className="ms-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {pathname !== "/" && <Footer />}
    </>
  );
};

export default About;