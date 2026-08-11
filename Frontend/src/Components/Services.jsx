
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import {
  FaArrowRight,
  FaCheck,
  FaSearch,
  FaTimes,
  FaTools,
} from "react-icons/fa";
import { FaBroom } from "react-icons/fa6";

import useGetServices from "../hooks/useGetServices";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ProfessionalJoin from "./ProfessionalJoin";

const Services = () => {
  const location = useLocation();
  const { pathname } = location;

  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  useGetServices();

  const { services } = useSelector(
    (state) => state.services
  );

  // =========================================================
  // FILTER SERVICES
  // =========================================================

  const filteredServices = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return services || [];
    }

    return (services || []).filter((service) => {
      const name =
        service?.name?.toLowerCase() || "";

      const description =
        service?.description?.toLowerCase() || "";

      return (
        name.includes(query) ||
        description.includes(query)
      );
    });
  }, [services, search]);

  // =========================================================
  // SERVICE NAVIGATION
  // =========================================================

  const handleExplore = (service) => {
    /*
      Existing navigation flow is preserved.

      State is additionally passed so Explore page can use
      the selected service later without changing the URL.
    */
    navigate("/explore", {
      state: {
        selectedService: service,
      },
    });
  };

  // =========================================================
  // LOADING
  // =========================================================

  const isLoading = !services;

  return (
    <>
      {/* =====================================================
          NAVBAR + SEO
      ===================================================== */}

      {pathname !== "/" && (
        <>
          <Helmet>
            <title>
              Home Services in Varanasi | Fixkar
            </title>

            <meta
              name="description"
              content="Find electricians, plumbers, painters, carpenters and other trusted home service professionals in Varanasi with Fixkar."
            />
          </Helmet>

          <Navbar />
        </>
      )}

      {/* =====================================================
          PAGE
      ===================================================== */}

      <main className="bg-light min-vh-100 pt-5">

        {/* ===================================================
            HERO
        =================================================== */}

        <section className="container pt-4 pb-4">

          <div className="row justify-content-center">
            <div className="col-12 col-lg-9 text-center">

              {/* Small Badge */}

              <div className="d-inline-flex align-items-center gap-2 bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2 mb-3">

                <FaTools size={13} />

                <span className="small fw-semibold">
                  Home Services
                </span>

              </div>

              {/* Heading */}

              <h1 className="fw-bold display-6 mb-3 text-dark">
                What service do you need?
              </h1>

              <p className="text-secondary mb-4 mx-auto">
                Find the right professional for your
                home, repair, maintenance and improvement
                needs.
              </p>

              {/* =================================================
                  SEARCH
              ================================================= */}

              <div
                className="mx-auto"
                style={{ maxWidth: "650px" }}
              >
                <div className="input-group input-group-lg bg-white border rounded-4 shadow-sm overflow-hidden">

                  <span className="input-group-text bg-white border-0 ps-4">
                    <FaSearch
                      size={16}
                      className="text-primary"
                    />
                  </span>

                  <input
                    type="text"
                    className="form-control border-0 shadow-none ps-2"
                    placeholder="Search for a service..."
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                  />

                  {search && (
                    <button
                      type="button"
                      className="btn bg-white border-0 px-3"
                      onClick={() => setSearch("")}
                      aria-label="Clear search"
                    >
                      <FaTimes
                        size={14}
                        className="text-secondary"
                      />
                    </button>
                  )}

                </div>
              </div>

            </div>
          </div>

        </section>

        {/* ===================================================
            SERVICES
        =================================================== */}

        <section className="container pb-5">

          {/* Section Header */}

          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">

            <div>
              <h5 className="fw-bold mb-1 text-dark">
                {search
                  ? "Search results"
                  : "All services"}
              </h5>

              <p className="small text-secondary mb-0">
                {search
                  ? `Services matching "${search}"`
                  : "Choose a service to find the right professional."}
              </p>
            </div>

            {!isLoading && (
              <span className="badge rounded-pill bg-white text-primary border px-3 py-2">
                {filteredServices.length}{" "}
                {filteredServices.length === 1
                  ? "service"
                  : "services"}
              </span>
            )}

          </div>

          {/* =================================================
              LOADING
          ================================================= */}

          {isLoading && (
            <div className="row g-3 g-md-4">

              {Array.from({ length: 8 }).map(
                (_, index) => (
                  <div
                    className="col-6 col-md-4 col-lg-3"
                    key={index}
                  >
                    <div className="card border-0 rounded-4 overflow-hidden shadow-sm">

                      <div className="ratio ratio-4x3 bg-secondary bg-opacity-10">
                        <div className="placeholder-glow">
                          <span className="placeholder w-100 h-100" />
                        </div>
                      </div>

                      <div className="card-body p-3">

                        <div className="placeholder-glow">
                          <span className="placeholder col-8 mb-2" />
                          <span className="placeholder col-12 mb-2" />
                          <span className="placeholder col-5" />
                        </div>

                      </div>

                    </div>
                  </div>
                )
              )}

            </div>
          )}

          {/* =================================================
              SERVICES GRID
          ================================================= */}

          {!isLoading &&
            filteredServices.length > 0 && (
              <div className="row g-3 g-md-4">

                {filteredServices.map((service) => (

                  <div
                    className="col-6 col-md-4 col-lg-3"
                    key={service._id}
                  >

                    <button
                      type="button"
                      onClick={() =>
                        handleExplore(service)
                      }
                      className="card w-100 h-100 border-0 rounded-4 overflow-hidden bg-white shadow-sm text-start p-0"
                    >

                      {/* =================================================
                          IMAGE
                      ================================================= */}

                      <div className="ratio ratio-4x3 bg-light overflow-hidden">

                        <img
                          src={service.image}
                          alt={`${service.name} service`}
                          className="w-100 h-100 object-fit-cover"
                          loading="lazy"
                        />

                      </div>

                      {/* =================================================
                          BODY
                      ================================================= */}

                      <div className="card-body p-3">

                        <div className="d-flex align-items-start justify-content-between gap-2">

                          <h6 className="fw-bold text-dark mb-1 text-truncate">
                            {service.name}
                          </h6>

                          <span
                            className="d-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 text-primary flex-shrink-0"
                            style={{
                              width: "28px",
                              height: "28px",
                            }}
                          >
                            <FaArrowRight size={10} />
                          </span>

                        </div>

                        <p className="small text-secondary mb-3">
                          {service.description
                            ? service.description.length >
                              65
                              ? `${service.description.slice(
                                  0,
                                  65
                                )}...`
                              : service.description
                            : "Professional service for your home."}
                        </p>

                        {/* CTA */}

                        <div className="d-flex align-items-center justify-content-between">

                          <span className="small text-primary fw-semibold">
                            Explore service
                          </span>

                          <FaArrowRight
                            size={11}
                            className="text-primary"
                          />

                        </div>

                      </div>

                    </button>

                  </div>

                ))}

              </div>
            )}

          {/* =================================================
              NO RESULTS
          ================================================= */}

          {!isLoading &&
            filteredServices.length === 0 && (
              <div className="bg-white border rounded-4 text-center py-5 px-3 shadow-sm">

                <div
                  className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 text-primary"
                  style={{
                    width: "56px",
                    height: "56px",
                  }}
                >
                  <FaSearch size={20} />
                </div>

                <h6 className="fw-bold text-dark">
                  No service found
                </h6>

                <p className="text-secondary small mb-3">
                  We couldn't find a service matching
                  "{search}".
                </p>

                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm rounded-pill px-4"
                  onClick={() => setSearch("")}
                >
                  Clear search
                </button>

              </div>
            )}

        </section>

        {/* ===================================================
            QUICK TRUST STRIP
        =================================================== */}

        <section className="container pb-5">

          <div className="row g-3 justify-content-center">

            <div className="col-6 col-md-3">
              <div className="bg-white border rounded-4 p-3 h-100 text-center shadow-sm">

                <div className="text-primary mb-2">
                  <FaTools size={20} />
                </div>

                <div className="small fw-bold text-dark">
                  Multiple Services
                </div>

                <div className="small text-secondary mt-1">
                  Find the right service easily
                </div>

              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="bg-white border rounded-4 p-3 h-100 text-center shadow-sm">

                <div className="text-success mb-2">
                  <FaCheck size={20} />
                </div>

                <div className="small fw-bold text-dark">
                  Verified Professionals
                </div>

                <div className="small text-secondary mt-1">
                  Connect with professionals
                </div>

              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="bg-white border rounded-4 p-3 h-100 text-center shadow-sm">

                <div className="text-primary mb-2">
                  <FaSearch size={20} />
                </div>

                <div className="small fw-bold text-dark">
                  Easy Discovery
                </div>

                <div className="small text-secondary mt-1">
                  Search services instantly
                </div>

              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="bg-white border rounded-4 p-3 h-100 text-center shadow-sm">

                <div className="text-warning mb-2">
                  <FaBroom size={20} />
                </div>

                <div className="small fw-bold text-dark">
                  Home Solutions
                </div>

                <div className="small text-secondary mt-1">
                  From repair to maintenance
                </div>

              </div>
            </div>

          </div>

        </section>

        {/* ===================================================
            PROFESSIONAL JOIN
        =================================================== */}

        <ProfessionalJoin />

      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      {pathname !== "/" && <Footer />}
    </>
  );
};

export default Services;

