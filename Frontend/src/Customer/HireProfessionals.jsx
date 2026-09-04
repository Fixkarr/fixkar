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
import '../css/hireProfessionals.css'
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
    <div className="professionals hire-professionals-page">
      {currentUserData && (
        <div
          className="hire-professionals-hero"
          style={{
            background: "linear-gradient(135deg,#0d6efd,#00c6ff)",
            borderBottomLeftRadius: "25px",
            borderBottomRightRadius: "25px",
          }}
        >
          <div className="hire-professionals-hero-inner">
            <h5 className="fw-bold mb-0 hire-hero-title">Hire Professionals</h5>
            <DashboardNavigator />
          </div>
          <p className="mt-2 mb-0 small opacity-75 hire-hero-description">
            Find Best Professionals near you!
          </p>
        </div>
      )}

      <div className="hire-search-heading">
        <h2>Search Professionals</h2>
        <p>
          Find trusted professionals near your location
        </p>
      </div>

      <div className="mb-3 hire-search-shell">
        <SearchSection onSkillsChange={setSelectedSkills} />
      </div>

      <div className="hire-results">
        <div className="hire-filter-card">
          <button
            type="button"
            className="hire-filter-toggle"
            onClick={() => setShowFilters((current) => !current)}
            aria-expanded={showFilters}
          >
            <div className="hire-filter-row">
              <div className="hire-filter-left">
              <span className="hire-filter-icon">
                <FaFilter />
              </span>
               <span className="hire-filter-title">
                Sort & Filter
              </span>
                {(minRating || sortBy !== "distance_asc") && (
                 <span className="hire-filter-active">
                    ACTIVE
                  </span>
                )}
              </div>
             <FaChevronDown
              className={`hire-filter-chevron ${
                showFilters ? "open" : ""
              }`}
            />
            </div>
          </button>

          {showFilters && (
            <div className="hire-filter-body">
              <div className="row g-2">
                <div className="col-12 col-sm-6">
                  <label className="hire-filter-label">
                    <FaMapMarkerAlt className="me-1" /> Sort by
                  </label>
                  <select
                   className="form-select hire-filter-select"
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
         <div className="hire-context-card">
           <div className="hire-context-inner">
             <span className="hire-context-title">
              Results for:
            </span>
              {selectedLocation?.address && (
                <span className="hire-context-chip location">
  <FaMapMarkerAlt className="me-1" />
  Location selected
</span>
              )}
              {serviceName && (
                <span className="hire-context-chip service">
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
              <div className="row professional-results">
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
