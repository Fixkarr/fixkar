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
      <section
        className="position-relative overflow-hidden d-flex align-items-center"
        style={{
          minHeight: window.innerWidth < 768 ? "auto" : "50vh",

          backgroundImage: `
      linear-gradient(
        90deg,
        rgba(255,255,255,0.96) 0%,
        rgba(255,255,255,0.9) 35%,
        rgba(255,255,255,0.7) 55%,
        rgba(255,255,255,0.25) 100%
      ),
      url('/Images/about-banner.webp')
    `,

          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",

          paddingTop: "80px",
          paddingBottom: "80px",
        }}
      >
        {/* BLUR GLOW */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "-100px",
            width: "280px",
            height: "280px",
            background: "rgba(13,110,253,0.12)",
            filter: "blur(90px)",
            borderRadius: "50%",
          }}
        />

        <div className="container py-lg-5 py-4 mt-lg-4 mt-0 position-relative">
          <div className="row">
            <div className="col-12 col-md-10 col-lg-6">
              {/* TAG */}
              <span
                className="px-3 py-2 rounded-pill fw-semibold"
                style={{
                  background: "rgba(13,110,253,0.1)",
                  color: "#0d6efd",
                  fontSize: "12px",
                  letterSpacing: "1px",
                }}
              >
                ABOUT FIXKAR
              </span>

              {/* HEADING */}
              <h1
                className="fw-bold mt-3 mb-3"
                style={{
                  fontSize: "clamp(2rem,8vw,3.5rem)",
                  lineHeight: window.innerWidth < 768 ? "1.2" : "1.1",
                  color: "#0b1320",
                }}
              >
                Building Spaces.
                <br />
                <span
                  style={{
                    background: "linear-gradient(90deg,#0d6efd,#00bfff)",
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
                  fontSize: "clamp(14px,3vw,15px)",
                  lineHeight: window.innerWidth < 768 ? "28px" : "30px",
                  maxWidth: "620px",
                }}
              >
                Fixkar delivers smart contracting and maintenance solutions
                including painting, electrical works, civil projects, and
                technology-driven services for homes and businesses.
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
                  <div className="col-12 col-sm-6" key={index}>
                    <div
                      className="d-flex align-items-center gap-3 p-3 h-100"
                      style={{
                        background: "rgba(255,255,255,0.55)",
                        backdropFilter: "blur(12px)",
                        borderRadius: "18px",
                        border: "1px solid rgba(255,255,255,0.5)",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.04)",

                        minHeight: "100%",
                      }}
                    >
                      {/* ICON */}
                      <div
  className="d-flex align-items-center justify-content-center flex-shrink-0"
  style={{
    width: window.innerWidth < 768 ? "60px" : "72px",
    height: window.innerWidth < 768 ? "60px" : "72px",

    borderRadius: window.innerWidth < 768 ? "18px" : "22px",

    background:
      "linear-gradient(135deg,#0d6efd,#4dabff)",

    color: "#fff",

    fontSize: window.innerWidth < 768 ? "22px" : "28px",

    boxShadow:
      "0 10px 30px rgba(13,110,253,0.25)",
  }}
>
  {item.icon}
</div>

                      {/* TITLE */}
                      <div>
                        <h6
                          className="mb-0 fw-bold"
                          style={{
                            fontSize: "15px",
                          }}
                        >
                          {item.title}
                        </h6>

                        <small className="text-muted">Premium Solutions</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* STATS */}
              <div
                className="
    d-flex
    flex-wrap
    justify-content-start
    justify-content-sm-between
    align-items-center
    gap-3
    gap-md-4
    mt-4
    px-3
    px-md-4
    py-3
  "
                style={{
                  background: "rgba(255,255,255,0.6)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "20px",
                  border: "1px solid rgba(255,255,255,0.5)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.06)",

                  width: "100%",
                  maxWidth: "520px",
                }}
              >
                <div>
                  <h4 className="fw-bold mb-0" style={{ color: "#0d6efd" }}>
                    150+
                  </h4>

                  <small className="text-muted">Projects</small>
                </div>

                <div
                  style={{
                    width: "1px",
                    height: "35px",
                    background: "#dbe4ff",
                  }}
                />

                <div>
                  <h4 className="fw-bold mb-0" style={{ color: "#0d6efd" }}>
                    98%
                  </h4>

                  <small className="text-muted">Satisfaction</small>
                </div>

                <div
                  style={{
                    width: "1px",
                    height: "35px",
                    background: "#dbe4ff",
                  }}
                />

                <div>
                  <h4 className="fw-bold mb-0" style={{ color: "#0d6efd" }}>
                    50+
                  </h4>

                  <small className="text-muted">Experts</small>
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
       <div className="container py-lg-5 py-4">
          <div className="text-center mb-5">
           <h2
  className="fw-bold"
  style={{
    fontSize: "clamp(1.8rem,6vw,3.5rem)",
  }}
>
              Our Vision & Mission
            </h2>

            <p
              className="text-muted mt-3 mx-auto"
  style={{
    maxWidth: "700px",
    lineHeight: window.innerWidth < 768 ? "28px" : "32px",
    fontSize: "clamp(14px,3vw,16px)",
  }}
            >
              We aim to become India’s most trusted contracting and maintenance
              ecosystem by combining skilled professionals with
              technology-driven operations.
            </p>
          </div>

          <div className="row g-4">
            {/* CARD 1 */}
            <div className="col-lg-4">
              <div
  className="h-100 p-lg-5 p-4"
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
    width: window.innerWidth < 768 ? "75px" : "90px",

    height: window.innerWidth < 768 ? "75px" : "90px",

    borderRadius: window.innerWidth < 768 ? "22px" : "28px",

    background:
      "linear-gradient(135deg,#0d6efd,#4dabff)",

    color: "#fff",

    fontSize: window.innerWidth < 768 ? "30px" : "38px",

    boxShadow:
      "0 12px 30px rgba(13,110,253,0.2)",
  }}
                >
                  <FaBuilding />
                </div>

                <h3 className="fw-bold mb-3">Large Scale Contracting</h3>

                <p
                  className="text-muted"
                  style={{
                    lineHeight: "32px",
                  }}
                >
                  From residential projects to commercial contracts, Fixkar
                  manages complete execution with quality assurance and
                  professional delivery.
                </p>
              </div>
            </div>

            {/* CARD 2 */}
            <div className="col-lg-4">
              <div
  className="h-100 p-lg-5 p-4"
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
    width: window.innerWidth < 768 ? "75px" : "90px",

    height: window.innerWidth < 768 ? "75px" : "90px",

    borderRadius: window.innerWidth < 768 ? "22px" : "28px",

    background:
      "linear-gradient(135deg,#0d6efd,#4dabff)",

    color: "#fff",

    fontSize: window.innerWidth < 768 ? "30px" : "38px",

    boxShadow:
      "0 12px 30px rgba(13,110,253,0.2)",
  }}
                >
                  <FaTools />
                </div>

                <h3 className="fw-bold mb-3">Smart Maintenance</h3>

                <p
                  className="text-muted"
                  style={{
                    lineHeight: "32px",
                  }}
                >
                  Technology-enabled maintenance solutions with skilled
                  professionals, transparent workflow, and fast response system.
                </p>
              </div>
            </div>

            {/* CARD 3 */}
            <div className="col-lg-4">
              <div
  className="h-100 p-lg-5 p-4"
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
    width: window.innerWidth < 768 ? "75px" : "90px",

    height: window.innerWidth < 768 ? "75px" : "90px",

    borderRadius: window.innerWidth < 768 ? "22px" : "28px",

    background:
      "linear-gradient(135deg,#0d6efd,#4dabff)",

    color: "#fff",

    fontSize: window.innerWidth < 768 ? "30px" : "38px",

    boxShadow:
      "0 12px 30px rgba(13,110,253,0.2)",
  }}
                >
                  <FaHandshake />
                </div>

                <h3 className="fw-bold mb-3">Trusted Partnerships</h3>

                <p
                  className="text-muted"
                  style={{
                    lineHeight: "32px",
                  }}
                >
                  We collaborate with architects, engineers, businesses, and
                  property owners to execute projects with accountability and
                  trust.
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
        <div className="container py-lg-5 py-4">
          <div className="text-center mb-5">
            <h2 className="fw-bold">End-to-End Contracting Solutions</h2>

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
              <div className="col-12 col-sm-6 col-lg-3" key={index}>
               <div
  className="h-100 p-lg-4 p-3 text-center"
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
    width: window.innerWidth < 768 ? "80px" : "100px",

    height: window.innerWidth < 768 ? "80px" : "100px",

    borderRadius: window.innerWidth < 768 ? "22px" : "28px",

    background:
      "linear-gradient(135deg,#0d6efd,#4dabff)",

    color: "#fff",

    fontSize: window.innerWidth < 768 ? "32px" : "42px",

    boxShadow:
      "0 12px 30px rgba(13,110,253,0.2)",
  }}
>
  {item.icon}
</div>
                  <h5 className="fw-bold">{item.title}</h5>

                  <p className="text-muted mt-3">
                    Professional quality execution with modern equipment and
                    skilled teams.
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
  className="p-lg-5 p-4 position-relative overflow-hidden"
  style={{
    borderRadius: window.innerWidth < 768 ? "25px" : "40px",
    background:
      "linear-gradient(135deg,#071c3d,#0d6efd)",
  }}
>
           <div className="row align-items-center text-center text-lg-start">
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
                  Whether it’s maintenance, electrical work, painting, or
                  complete project contracting, Fixkar is ready to deliver
                  excellence.
                </p>
              </div>

          <div className="col-lg-4 text-center text-lg-end mt-4 mt-lg-0">
               <button
  className="btn btn-light fw-bold"
  style={{
    borderRadius: "18px",
    fontSize: "16px",
    padding:
      window.innerWidth < 768
        ? "12px 24px"
        : "14px 32px",
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
