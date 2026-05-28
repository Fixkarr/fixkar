export default function About() {
  const services = [
    "Electrician",
    "Plumber",
    "Carpenter",
    "AC Repair",
    "Painter",
    "RO Service",
    "Home Cleaning",
    "CCTV Installation",
  ];

  const features = [
    {
      title: "Verified Professionals",
      desc: "Trusted and skilled service providers near your location.",
    },
    {
      title: "Easy Booking",
      desc: "Book services in just a few clicks anytime.",
    },
    {
      title: "Location Based Search",
      desc: "Find nearby professionals instantly.",
    },
    {
      title: "Fast Response",
      desc: "Quick service requests and instant communication.",
    },
  ];

  const stats = [
    {
      number: "500+",
      label: "Service Requests",
    },
    {
      number: "100+",
      label: "Professionals",
    },
    {
      number: "20+",
      label: "Categories",
    },
    {
      number: "10+",
      label: "Cities Target",
    },
  ];

  return (
    <div
      className="w-100 overflow-hidden"
      style={{
        background: "#f8fafc",
        color: "#0f172a",
        fontFamily: "sans-serif",
      }}
    >
      {/* HERO SECTION */}
      <section
        className="position-relative py-5"
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg,#eff6ff 0%, #ffffff 40%, #dbeafe 100%)",
        }}
      >
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="mb-3 d-inline-block px-3 py-2 rounded-pill bg-primary bg-opacity-25 border border-primary">
                India's Smart Local Service Platform
              </div>

              <h1
                className="fw-bold mb-4"
                style={{
                  fontSize: "clamp(2.5rem,6vw,5rem)",
                  lineHeight: "1.1",
                }}
              >
                Trusted Local Services At Your Fingertips
              </h1>

              <p
                className="text-secondary mb-4"
                style={{
                  fontSize: "1.1rem",
                  lineHeight: "1.8",
                  opacity: 0.85,
                }}
              >
                Fixkar helps users connect with trusted nearby professionals
                like electricians, plumbers, carpenters, AC technicians,
                painters and many more with a smooth booking experience.
              </p>

              <div className="d-flex flex-wrap gap-3">
                <button className="btn btn-primary btn-lg px-4 py-3 rounded-pill fw-semibold shadow">
                  Book a Service
                </button>

                <button className="btn btn-outline-light btn-lg px-4 py-3 rounded-pill fw-semibold">
                  Become a Professional
                </button>
              </div>
            </div>

            <div className="col-lg-6 text-center">
              <div
                className="position-relative mx-auto"
                style={{
                  maxWidth: "520px",
                }}
              >
                <img
                  src="Images/about-banner.webp"
                  alt="Fixkar"
                  className="img-fluid rounded-5 shadow-lg w-100"
                  style={{
                    objectFit: "cover",
                    height: "520px",
                    width: "100%",
                  }}
                />

                <div
                  className="position-absolute top-0 start-0 translate-middle p-4 rounded-4"
                  style={{
                    background: "rgba(255,255,255,0.9)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(59,130,246,0.15)",
                  }}
                >
                  <h3 className="fw-bold mb-1">100+</h3>
                  <p className="mb-0 small">Trusted Professionals</p>
                </div>

                <div
                  className="position-absolute bottom-0 end-0 translate-middle-y p-4 rounded-4"
                  style={{
                    background: "rgba(255,255,255,0.9)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(59,130,246,0.15)",
                  }}
                >
                  <h3 className="fw-bold mb-1">24/7</h3>
                  <p className="mb-0 small">Smart Service Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-5">
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop"
                alt="About Fixkar"
                className="img-fluid rounded-5 shadow-lg"
              />
            </div>

            <div className="col-lg-6">
              <span className="text-primary fw-semibold text-uppercase">
                Who We Are
              </span>

              <h2
                className="fw-bold mt-3 mb-4"
                style={{ fontSize: "clamp(2rem,5vw,3.5rem)" }}
              >
                Empowering Local Professionals Digitally
              </h2>

              <p
                className="text-secondary"
                style={{ lineHeight: "1.9", opacity: 0.85 }}
              >
                Fixkar is a smart local service marketplace designed to help
                users find trusted professionals nearby quickly and easily. Our
                platform bridges the gap between skilled workers and customers
                using modern technology and location-based service discovery.
              </p>

              <p
                className="text-secondary"
                style={{ lineHeight: "1.9", opacity: 0.85 }}
              >
                From electricians and plumbers to painters and appliance repair
                experts, Fixkar makes service booking simple, transparent, and
                reliable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section
        className="py-5"
        style={{
          background: "linear-gradient(135deg,#eff6ff,#ffffff)"
        }}
      >
        <div className="container py-5">
          <div className="text-center mb-5">
            <span className="text-primary fw-semibold text-uppercase">
              Services
            </span>

            <h2
              className="fw-bold mt-3"
              style={{ fontSize: "clamp(2rem,5vw,3.5rem)" }}
            >
              Services Available On Fixkar
            </h2>
          </div>

          <div className="row g-4">
            {services.map((service, index) => (
              <div className="col-6 col-md-4 col-lg-3" key={index}>
                <div
                  className="h-100 p-4 rounded-5 text-center"
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    backdropFilter: "blur(8px)",
                    transition: "0.3s",
                  }}
                >
                  <div
                    className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
                    style={{
                      width: "90px",
                      height: "90px",
                      background:
                        "linear-gradient(135deg,#3b82f6,#2563eb)",
                      fontSize: "2rem",
                    }}
                  >
                    🔧
                  </div>

                  <h5 className="fw-bold mb-0">{service}</h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-5">
        <div className="container py-5">
          <div className="text-center mb-5">
            <span className="text-primary fw-semibold text-uppercase">
              Why Choose Us
            </span>

            <h2
              className="fw-bold mt-3"
              style={{ fontSize: "clamp(2rem,5vw,3.5rem)" }}
            >
              Why Users Trust Fixkar
            </h2>
          </div>

          <div className="row g-4">
            {features.map((item, index) => (
              <div className="col-md-6 col-lg-3" key={index}>
                <div
                  className="h-100 p-4 rounded-5"
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle mb-4"
                    style={{
                      width: "80px",
                      height: "80px",
                      background:
                        "linear-gradient(135deg,#3b82f6,#1d4ed8)",
                      fontSize: "2rem",
                    }}
                  >
                    ⭐
                  </div>

                  <h4 className="fw-bold mb-3">{item.title}</h4>

                  <p className="text-secondary mb-0" style={{ opacity: 0.8 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        className="py-5"
        style={{
          background: "linear-gradient(135deg,#ffffff,#eff6ff)"
        }}
      >
        <div className="container py-5">
          <div className="text-center mb-5">
            <span className="text-primary fw-semibold text-uppercase">
              Workflow
            </span>

            <h2
              className="fw-bold mt-3"
              style={{ fontSize: "clamp(2rem,5vw,3.5rem)" }}
            >
              How Fixkar Works
            </h2>
          </div>

          <div className="row g-4">
            {[
              "Choose Service",
              "Confirm Location",
              "Find Nearby Professionals",
              "Chat or Hire",
              "Get Service Done",
            ].map((step, index) => (
              <div className="col-md-6 col-lg" key={index}>
                <div
                  className="text-center h-100 p-4 rounded-5"
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <div
                    className="mx-auto mb-4 rounded-circle d-flex align-items-center justify-content-center fw-bold"
                    style={{
                      width: "90px",
                      height: "90px",
                      background:
                        "linear-gradient(135deg,#2563eb,#1d4ed8)",
                      fontSize: "2rem",
                      color  : "#fff"
                    }}
                  >
                    {index + 1}
                  </div>

                  <h5 className="fw-bold">{step}</h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-5">
        <div className="container py-5">
          <div className="row g-4">
            {stats.map((item, index) => (
              <div className="col-6 col-lg-3" key={index}>
                <div
                  className="text-center p-5 rounded-5 h-100"
                  style={{
                    background:
                      "linear-gradient(135deg,#1d4ed8,#2563eb,#3b82f6)",
                  }}
                >
                  <h2
                    className="fw-bold mb-2"
                    style={{ fontSize: "3rem", color : "#fff" }}
                  >
                    {item.number}
                  </h2>

                  <p className="mb-0 fw-semibold">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section
        className="py-5"
        style={{
          background: "linear-gradient(135deg,#eff6ff,#ffffff)"
        }}
      >
        <div className="container py-5">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <div
                className="p-5 rounded-5 h-100"
                style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                }}
              >
                <h2 className="fw-bold mb-4">Our Mission</h2>

                <p
                  className="text-secondary mb-0"
                  style={{ lineHeight: "1.9", opacity: 0.85 }}
                >
                  Our mission is to digitally empower local professionals and
                  make trusted home services accessible, transparent, and fast
                  for everyone.
                </p>
              </div>
            </div>

            <div className="col-lg-6">
              <div
                className="p-5 rounded-5 h-100"
                style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                }}
              >
                <h2 className="fw-bold mb-4">Our Vision</h2>

                <p
                  className="text-secondary mb-0"
                  style={{ lineHeight: "1.9", opacity: 0.85 }}
                >
                  We envision building India's most trusted local service
                  ecosystem where users and professionals connect seamlessly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5">
        <div className="container py-5">
          <div
            className="p-5 rounded-5 text-center"
            style={{
              background:
                "linear-gradient(135deg,#2563eb,#1d4ed8,#3b82f6)",
            }}
          >
            <h2
              className="fw-bold mb-4"
              style={{ fontSize: "clamp(2rem,5vw,4rem)", color : "#fff" }}
            >
              Need a Trusted Professional Near You?
            </h2>

            <p
              className="mx-auto mb-4"
              style={{
                maxWidth: "700px",
                opacity: 0.9,
                lineHeight: "1.8",
                color : "#fff"
              }}
            >
              Join thousands of users and professionals using Fixkar for smart,
              fast, and trusted local services.
            </p>

            <div className="d-flex flex-wrap justify-content-center gap-3">
              <button className="btn btn-light btn-lg px-5 py-3 rounded-pill fw-bold">
                Book Service
              </button>

              <button className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill fw-bold">
                Join as Professional
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
