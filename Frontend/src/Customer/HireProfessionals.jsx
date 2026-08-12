import React, { useEffect, useState } from "react";
import SearchSection from "./SearchComponent";
import ProfessionalCard from "./ProfessionalCard";
import { useSelector } from "react-redux";
import axios from "axios";
import { server_url } from "../App";
import { FaFilter, FaMapMarkerAlt, FaStar, FaChevronDown } from "react-icons/fa";
import DashboardNavigator from "../utils/DashboardNavigator";

const HireProfessionals = () => {
  const { currentUserData } = useSelector((state) => state.user);
  const { selectedLocation, selectedService, selectedTask } = useSelector(
    (state) => state.location
  );

  const [selectedSkills, setSelectedSkills] = useState(
    selectedTask?._id ? [selectedTask._id] : []
  );
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("distance_asc");
  const [minRating, setMinRating] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setSelectedSkills(selectedTask?._id ? [selectedTask._id] : []);
  }, [selectedTask?._id]);

  const { services } = useSelector((state) => state.services);

  const selectedServiceId =
    typeof selectedService === "object"
      ? selectedService?._id
      : selectedService;

  const serviceName = services.find((s) => s._id === selectedServiceId)?.name;

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchProfessionals = async (pageNo = 1, reset = false) => {
    const hasLocation = selectedLocation?.lat && selectedLocation?.lng;

    try {
      setLoading(true);

      const params = {
        service: selectedServiceId || "",
        page: pageNo,
        limit: 20,
        sortBy,
      };

      if (minRating) params.minRating = minRating;

      if (hasLocation) {
        params.lat = selectedLocation.lat;
        params.lng = selectedLocation.lng;
      }

      if (selectedSkills.length > 0) {
        params.skills = selectedSkills.join(",");
      }

      const res = await axios.get(
        `${server_url}/api/user/professionals/search`,
        { params }
      );

      const newPros = res.data.professionals || [];

      setProfessionals((prev) =>
        reset ? newPros : [...prev, ...newPros]
      );

      setHasMore(newPros.length === 20);
      setPage(pageNo);
    } catch (error) {
      console.log("Error fetching professionals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchProfessionals(1, true);
  }, [selectedLocation, selectedServiceId, selectedSkills, sortBy, minRating]);

  useEffect(() => {
    if (!selectedLocation?.lat || !selectedLocation?.lng) {
      setSortBy((current) =>
        current === "distance_asc" ? "rating_desc" : current
      );
    }
  }, [selectedLocation]);

  return (
    <div className="professionals container px-2 px-md-5 mt-3 mt-md-5">
      <style>{`
        .fixkar-search-shell .service-scroll-area {
          max-height: 420px;
          overflow-y: auto;
          overflow-x: hidden;
          padding-right: 2px;
        }

        .fixkar-search-shell .service-scroll-area::-webkit-scrollbar {
          width: 4px;
        }

        .fixkar-search-shell .service-scroll-area::-webkit-scrollbar-thumb {
          background: #ced4da;
          border-radius: 10px;
        }

        @media (max-width: 575.98px) {
          .fixkar-search-shell .service-scroll-area {
            max-height: 250px;
          }

          .fixkar-search-shell .service-scroll-area .col-12 {
            width: 50%;
            flex: 0 0 50%;
          }

          .fixkar-search-shell .service-card {
            min-height: 74px;
            padding: 8px !important;
            gap: 7px !important;
          }

          .fixkar-search-shell .service-icon {
            width: 36px !important;
            height: 36px !important;
            min-width: 36px !important;
          }

          .fixkar-search-shell .service-name {
            font-size: 13px !important;
            line-height: 1.2;
          }

          .fixkar-search-shell .service-card-content small {
            display: none;
          }

          .fixkar-search-shell .service-check {
            width: 20px !important;
            height: 20px !important;
            min-width: 20px !important;
          }

          .fixkar-search-shell .border-top.pt-4 {
            padding-top: 12px !important;
          }

          /* Professional results: always two equal columns on phones */
          .professional-results > .professional-col {
            width: 50%;
            flex: 0 0 50%;
          }
        }
      `}</style>

      {currentUserData && (
        <div
          className="text-white p-3 p-md-4"
          style={{
            background: "linear-gradient(135deg,#0d6efd,#00c6ff)",
            borderBottomLeftRadius: "25px",
            borderBottomRightRadius: "25px",
          }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0">Hire Professionals</h5>
            <DashboardNavigator />
          </div>
          <p className="mt-2 mb-0 small opacity-75">
            Find Best Professionals near you!
          </p>
        </div>
      )}

      <div className="text-center mb-3 mt-3">
        <h2 className="fw-bold mb-1 fs-4 fs-md-2">Search Professionals</h2>
        <p className="text-muted small mb-0">
          Find trusted professionals near your location
        </p>
      </div>

      <div className="mb-3 fixkar-search-shell">
        <SearchSection onSkillsChange={setSelectedSkills} />
      </div>

      <div className="card border-0 shadow-sm rounded-4 mb-3">
        <button
          type="button"
          className="btn w-100 text-start p-3"
          onClick={() => setShowFilters((current) => !current)}
          aria-expanded={showFilters}
        >
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2 text-primary fw-semibold">
              <FaFilter />
              <span>Sort & Filter</span>
              {(minRating || sortBy !== "distance_asc") && (
                <span className="badge bg-primary rounded-pill">Active</span>
              )}
            </div>
            <FaChevronDown
              style={{
                transition: "transform .2s ease",
                transform: showFilters ? "rotate(180deg)" : "none",
              }}
            />
          </div>
        </button>

        {showFilters && (
          <div className="card-body pt-0 px-3 pb-3">
            <div className="row g-2">
              <div className="col-12 col-sm-6">
                <label className="form-label small fw-semibold mb-1">
                  <FaMapMarkerAlt className="me-1" /> Order results
                </label>
                <select
                  className="form-select"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                >
                  <option value="distance_asc" disabled={!selectedLocation?.lat}>
                    Nearest first
                  </option>
                  <option value="rating_desc">Highest rated</option>
                  <option value="rating_asc">Lowest rated</option>
                </select>
              </div>

              <div className="col-12 col-sm-6">
                <label className="form-label small fw-semibold mb-1">
                  <FaStar className="me-1 text-warning" /> Minimum rating
                </label>
                <select
                  className="form-select"
                  value={minRating}
                  onChange={(event) => setMinRating(event.target.value)}
                >
                  <option value="">All ratings</option>
                  <option value="4">4 stars & above</option>
                  <option value="3">3 stars & above</option>
                  <option value="2">2 stars & above</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedServiceId && (
        <div className="alert alert-light border rounded-4 shadow-sm mb-3 py-2 px-3">
          <div className="d-flex flex-wrap gap-2 align-items-center small">
            <span className="fw-semibold text-dark">Results for:</span>
            {selectedLocation?.address && (
              <span className="badge bg-primary-subtle text-primary border">
                <FaMapMarkerAlt className="me-1" /> Location selected
              </span>
            )}
            {serviceName && (
              <span className="badge bg-success-subtle text-success border">
                {serviceName}
              </span>
            )}
          </div>
        </div>
      )}

      {!selectedLocation && !selectedServiceId && !loading && (
        <p className="text-center text-muted small">
          Select a location or service to start searching professionals.
        </p>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div
            className="spinner-border text-primary mb-3"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          />
          <p className="text-muted fw-medium">
            Searching nearby professionals...
          </p>
        </div>
      ) : professionals.length === 0 ? (
        <div className="text-center py-5">
          <h5 className="fw-semibold mb-1">No professionals found</h5>
          <p className="text-muted small">
            Try another service or change your location.
          </p>
        </div>
      ) : (
        <>
          <div className="row g-2 mt-1 professional-results">
            {professionals.map((pro) => (
              <div
                key={pro._id}
                className="professional-col col-6 col-sm-6 col-lg-4"
              >
                <div className="h-100">
                  <ProfessionalCard data={pro} />
                </div>
              </div>
            ))}
          </div>

          {hasMore && !loading && (
            <div className="text-center mt-4 mb-4">
              <button
                className="btn btn-outline-primary rounded-pill px-4 py-2"
                onClick={() => fetchProfessionals(page + 1)}
              >
                Load More Professionals
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center mt-4">
              <div className="spinner-border text-primary" />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HireProfessionals;
