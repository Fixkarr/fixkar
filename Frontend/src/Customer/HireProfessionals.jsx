import React, { useEffect, useState } from "react";
import SearchSection from "./SearchComponent";
import ProfessionalCard from "./ProfessionalCard";
import { useSelector } from "react-redux";
import axios from "axios";
import { server_url } from "../App";
import {
  FaFilter,
  FaMapMarkerAlt,
  FaStar,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaRedo,
} from "react-icons/fa";
import DashboardNavigator from "../utils/DashboardNavigator";

const PAGE_SIZE = 5;

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
  const [searchError, setSearchError] = useState(false);
  const [sortBy, setSortBy] = useState("distance_asc");
  const [minRating, setMinRating] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setSelectedSkills(selectedTask?._id ? [selectedTask._id] : []);
  }, [selectedTask?._id]);

  const { services } = useSelector((state) => state.services);

  const selectedServiceId =
    typeof selectedService === "object"
      ? selectedService?._id
      : selectedService;

  const serviceName = services.find((s) => s._id === selectedServiceId)?.name;

  const fetchProfessionals = async (pageNo = 1) => {
    const hasLocation = Boolean(selectedLocation?.lat && selectedLocation?.lng);
    const hasService = Boolean(selectedServiceId);

    // Do not call the search API until the user has supplied a search context.
    // This prevents confusing "all professionals" results on an empty search.
    if (!hasLocation && !hasService) {
      setProfessionals([]);
      setPage(1);
      setHasMore(false);
      setSearchError(false);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setSearchError(false);

      const params = {
        service: selectedServiceId || "",
        page: pageNo,
        limit: PAGE_SIZE,
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

      setProfessionals(newPros);
      setPage(pageNo);
      setHasMore(newPros.length === PAGE_SIZE);
    } catch (error) {
      console.error("Error fetching professionals:", error);
      setProfessionals([]);
      setHasMore(false);
      setSearchError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchProfessionals(1);
  }, [selectedLocation, selectedServiceId, selectedSkills, sortBy, minRating]);

  useEffect(() => {
    if (!selectedLocation?.lat || !selectedLocation?.lng) {
      setSortBy((current) =>
        current === "distance_asc" ? "rating_desc" : current
      );
    }
  }, [selectedLocation]);

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage === page || loading) return;
    if (nextPage > page && !hasMore) return;

    fetchProfessionals(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="professionals container px-2 px-md-4 mt-3 mt-md-5">
      <style>{`
        .fixkar-results {
          max-width: 980px;
          margin: 0 auto;
        }

        .fixkar-pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin: 22px 0 32px;
        }

        .fixkar-page-btn {
          min-width: 38px;
          height: 38px;
          border: 1px solid #dee2e6;
          background: #fff;
          color: #495057;
          border-radius: 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: .15s ease;
        }

        .fixkar-page-btn:hover:not(:disabled) {
          border-color: #86b7fe;
          color: #0d6efd;
          background: #f5f9ff;
        }

        .fixkar-page-btn.active {
          border-color: #0d6efd;
          background: #0d6efd;
          color: #fff;
          font-weight: 700;
        }

        .fixkar-page-btn:disabled {
          opacity: .45;
          cursor: not-allowed;
        }

        @media (max-width: 575.98px) {
          .fixkar-results {
            padding-inline: 2px;
          }

          .professional-results {
            --bs-gutter-x: .65rem;
            --bs-gutter-y: .75rem;
          }

          /* One professional card per row on phones */
          .professional-results > .professional-col {
            width: 100%;
            flex: 0 0 100%;
          }

          .professional-results .card {
            border-radius: 16px !important;
          }

          .fixkar-pagination {
            margin-top: 18px;
            margin-bottom: 24px;
          }

          .fixkar-page-btn {
            min-width: 34px;
            height: 34px;
            border-radius: 9px;
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

      <div className="fixkar-results">
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
                    <FaMapMarkerAlt className="me-1" /> Sort by
                  </label>
                  <select
                    className="form-select"
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                  >
                    <option
                      value="distance_asc"
                      disabled={!selectedLocation?.lat}
                    >
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

        {!selectedLocation && !selectedServiceId && !loading && !searchError && (
          <div className="text-center py-5 px-3">
            <h5 className="fw-semibold mb-1">Start your search</h5>
            <p className="text-muted small mb-0">
              Select a location or service to find trusted professionals.
            </p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-5" role="status" aria-live="polite">
            <div
              className="spinner-border text-primary mb-3"
              style={{ width: "2.5rem", height: "2.5rem" }}
              aria-hidden="true"
            />
            <p className="text-muted fw-medium mb-0">
              Searching nearby professionals...
            </p>
          </div>
        ) : searchError ? (
          <div className="text-center py-5 px-3">
            <h5 className="fw-semibold mb-1">We couldn't load professionals</h5>
            <p className="text-muted small mb-3">
              Please check your connection and try again.
            </p>
            <button
              type="button"
              className="btn btn-primary btn-sm rounded-pill px-3"
              onClick={() => fetchProfessionals(page)}
            >
              <FaRedo className="me-2" /> Try again
            </button>
          </div>
        ) : professionals.length === 0 && (selectedLocation || selectedServiceId) ? (
          <div className="text-center py-5 px-3">
            <h5 className="fw-semibold mb-1">No professionals found</h5>
            <p className="text-muted small mb-0">
              Try another service or change your location.
            </p>
          </div>
        ) : (
          professionals.length > 0 && (
            <>
              <div className="row g-3 professional-results">
                {professionals.map((pro) => (
                  <div
                    key={pro._id}
                    className="professional-col col-6 col-sm-6 col-lg-4"
                  >
                    <ProfessionalCard data={pro} />
                  </div>
                ))}
              </div>

              <div className="fixkar-pagination" aria-label="Professional results pagination">
                <button
                  type="button"
                  className="fixkar-page-btn"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1 || loading}
                  aria-label="Previous page"
                >
                  <FaChevronLeft size={11} />
                </button>

                <button
                  type="button"
                  className="fixkar-page-btn active"
                  aria-current="page"
                  disabled
                >
                  {page}
                </button>

                <button
                  type="button"
                  className="fixkar-page-btn"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={!hasMore || loading}
                  aria-label="Next page"
                >
                  <FaChevronRight size={11} />
                </button>
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default HireProfessionals;
