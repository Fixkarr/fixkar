
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

      {/* ================= HERO SECTION ================= */}

      <section
        className="position-relative overflow-hidden d-flex align-items-center"
        style={{
          minHeight: "100vh",

          backgroundImage: `
            linear-gradient(
              90deg,
              rgba(255,255,255,0.97) 0%,
              rgba(255,255,255,0.92) 30%,
              rgba(255,255,255,0.72) 55%,
              rgba(255,255,255,0.25) 100%
            ),
            url('/Images/about-banner.webp')
          `,

          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* MOBILE OVERLAY */}
        <div
          className="d-block d-lg-none position-absolute top-0 start-0 w-100 h-100"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.92), rgba(255,255,255,0.85))",
          }}
        />

        {/* GLOW */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            left: "-120px",
            width: "320px",
            height: "320px",
            borderRadius: "50%",
            background: "rgba(13,110,253,0.12)",
            filter: "blur(100px)",
          }}
        />

        <div className="container position-relative py-5">
          <div className="row align-items-center min-vh-100">
            <div className="col-12 col-lg-7">

              {/* TAG */}

              <span
                className="px-3 px-md-4 py-2 rounded-pill fw-semibold d-inline-block"
                style={{
                  background: "rgba(13,110,253,0.1)",
                  color: "#0d6efd",
                  fontSize: "13px",
                  letterSpacing: "1px",
                }}
              >
                ABOUT FIXKAR
              </span>

              {/* HEADING */}

              <h1
                className="fw-bold mt-4 mb-4"
                style={{
                  fontSize: "clamp(2.3rem,7vw,5rem)",
                  lineHeight: "1.1",
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
                  fontSize: "clamp(15px,2vw,18px)",
                  lineHeight: "32px",
                  maxWidth: "720px",
                }}
              >
                Fixkar delivers smart contracting and maintenance
                solutions including painting, electrical works,
                civil projects, and technology-driven services
                for homes, offices, builders, and businesses.
              </p>

              {/* FEATURES */}

              <div className="row mt-4 g-3">
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
                  <div
                    className="col-12 col-sm-6"
                    key={index}
                  >
                    <div
                      className="d-flex align-items-center gap-3 p-3 p-md-4 h-100"
                      style={{
                        background: "rgba(255,255,255,0.6)",
                        backdropFilter: "blur(12px)",
                        borderRadius: "24px",
                        border:
                          "1px solid rgba(255,255,255,0.5)",
                        boxShadow:
                          "0 10px 25px rgba(0,0,0,0.05)",
                      }}
                    >
                      {/* ICON */}

                      <div
                        className="d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{
                          width: "72px",
                          height: "72px",
                          borderRadius: "22px",
                          background:
                            "linear-gradient(135deg,#0d6efd,#4dabff)",
                          color: "#fff",
                          fontSize: "28px",
                          boxShadow:
                            "0 10px 30px rgba(13,110,253,0.25)",
                        }}
                      >
                        {item.icon}
                      </div>

                      {/* CONTENT */}

                      <div>
                        <h5
                          className="fw-bold mb-1"
                          style={{
                            fontSize: "18px",
                          }}
                        >
                          {item.title}
                        </h5>

                        <p
                          className="text-muted mb-0"
                          style={{
                            fontSize: "14px",
                          }}
                        >
                          Premium Contract Solutions
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* STATS */}

              <div
                className="d-flex flex-wrap align-items-center justify-content-between gap-4 mt-4 px-4 py-4"
                style={{
                  background: "rgba(255,255,255,0.65)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "26px",
                  border: "1px solid rgba(255,255,255,0.5)",
                  boxShadow:
                    "0 10px 30px rgba(0,0,0,0.06)",

                  maxWidth: "620px",
                }}
              >
                {[
                  {
                    value: "150+",
                    label: "Projects",
                  },
                  {
                    value: "98%",
                    label: "Satisfaction",
                  },
                  {
                    value: "50+",
                    label: "Experts",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="text-center flex-fill"
                  >
                    <h3
                      className="fw-bold mb-1"
                      style={{
                        color: "#0d6efd",
                      }}
                    >
                      {item.value}
                    </h3>

                    <small className="text-muted">
                      {item.label}
                    </small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MISSION SECTION ================= */}

      <section
        className="py-5"
        style={{
          background: "#fff",
        }}
      >
        <div className="container py-lg-5 py-4">

          <div className="text-center mb-5">
            <h2
              className="fw-bold"
              style={{
                fontSize: "clamp(2rem,5vw,3.8rem)",
              }}
            >
              Our Vision & Mission
            </h2>

            <p
              className="text-muted mt-3 mx-auto"
              style={{
                maxWidth: "760px",
                lineHeight: "32px",
                fontSize: "16px",
              }}
            >
              We aim to become India’s most trusted contracting
              and maintenance ecosystem by combining skilled
              professionals with technology-driven operations.
            </p>
          </div>

          <div className="row g-4">

            {[
              {
                icon: <FaBuilding />,
                title: "Large Scale Contracting",
                desc: "From residential projects to commercial contracts, Fixkar manages complete execution with quality assurance and professional delivery.",
              },

              {
                icon: <FaTools />,
                title: "Smart Maintenance",
                desc: "Technology-enabled maintenance solutions with skilled professionals, transparent workflow, and fast response system.",
              },

              {
                icon: <FaHandshake />,
                title: "Trusted Partnerships",
                desc: "We collaborate with architects, engineers, businesses, and property owners to execute projects with accountability and trust.",
              },
            ].map((item, index) => (
              <div
                className="col-12 col-md-6 col-lg-4"
                key={index}
              >
                <div
                  className="h-100 p-4 p-lg-5"
                  style={{
                    borderRadius: "35px",
                    background:
                      "linear-gradient(135deg,#f4f9ff,#ffffff)",
                    border: "1px solid #edf2ff",
                    boxShadow:
                      "0 10px 30px rgba(0,0,0,0.04)",
                  }}
                >
                  {/* ICON */}

                  <div
                    className="d-inline-flex align-items-center justify-content-center mb-4"
                    style={{
                      width: "90px",
                      height: "90px",
                      borderRadius: "28px",
                      background:
                        "linear-gradient(135deg,#0d6efd,#4dabff)",
                      color: "#fff",
                      fontSize: "38px",
                      boxShadow:
                        "0 12px 30px rgba(13,110,253,0.2)",
                    }}
                  >
                    {item.icon}
                  </div>

                  <h3
                    className="fw-bold mb-3"
                    style={{
                      fontSize: "28px",
                    }}
                  >
                    {item.title}
                  </h3>

                  <p
                    className="text-muted mb-0"
                    style={{
                      lineHeight: "32px",
                      fontSize: "15px",
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}

      <section
        className="py-5"
        style={{
          background: "#f8fbff",
        }}
      >
        <div className="container py-lg-5 py-4">

          <div className="text-center mb-5">
            <h2
              className="fw-bold"
              style={{
                fontSize: "clamp(2rem,5vw,3.5rem)",
              }}
            >
              End-to-End Contracting Solutions
            </h2>

            <p className="text-muted mt-3">
              Complete project execution from planning to delivery.
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
              <div
                className="col-12 col-sm-6 col-lg-3"
                key={index}
              >
                <div
                  className="h-100 p-4 text-center"
                  style={{
                    background: "#fff",
                    borderRadius: "32px",
                    border: "1px solid #edf2ff",
                    boxShadow:
                      "0 10px 30px rgba(0,0,0,0.05)",
                  }}
                >
                  {/* ICON */}

                  <div
                    className="mx-auto mb-4 d-flex align-items-center justify-content-center"
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "30px",
                      background:
                        "linear-gradient(135deg,#0d6efd,#4dabff)",
                      color: "#fff",
                      fontSize: "42px",
                      boxShadow:
                        "0 12px 30px rgba(13,110,253,0.2)",
                    }}
                  >
                    {item.icon}
                  </div>

                  <h4 className="fw-bold">
                    {item.title}
                  </h4>

                  <p
                    className="text-muted mt-3 mb-0"
                    style={{
                      lineHeight: "30px",
                    }}
                  >
                    Professional quality execution with modern
                    equipment and skilled teams.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}

      <section className="py-5">
        <div className="container">

          <div
            className="p-4 p-lg-5 overflow-hidden position-relative"
            style={{
              borderRadius: "40px",
              background:
                "linear-gradient(135deg,#071c3d,#0d6efd)",
            }}
          >
            <div className="row align-items-center text-center text-lg-start">

              <div className="col-lg-8">
                <h2
                  className="fw-bold text-white"
                  style={{
                    fontSize: "clamp(2rem,5vw,4rem)",
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

              <div className="col-lg-4 text-center text-lg-end mt-4 mt-lg-0">
                <button
                  className="btn btn-light fw-bold"
                  style={{
                    borderRadius: "18px",
                    fontSize: "17px",
                    padding: "14px 34px",
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

