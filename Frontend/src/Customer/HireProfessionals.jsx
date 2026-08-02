import React, { useEffect, useState } from "react";
import SearchSection from "./SearchComponent";
import ProfessionalCard from "./ProfessionalCard";
import { useSelector } from "react-redux";
import axios from "axios";
import { server_url } from "../App";
import { MdPersonSearch } from "react-icons/md";
import { FaFilter, FaMapMarkerAlt, FaStar } from "react-icons/fa";
import DashboardNavigator from "../utils/DashboardNavigator";


const HireProfessionals = () => {
  const {currentUserData} = useSelector(state => state.user);
  const { selectedLocation, selectedService } = useSelector((state) => state.location);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("distance_asc");
  const [minRating, setMinRating] = useState("");

 const { services } = useSelector(state => state.services);
  const serviceName =
  services.find(s => s._id === selectedService)?.name;

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
 const fetchProfessionals = async (pageNo = 1, reset = false) => {
  const hasLocation = selectedLocation?.lat && selectedLocation?.lng;
    try {
      setLoading(true);

      const params = {
        service: selectedService || "",
        page: pageNo,
        limit: 20,
        sortBy,
      };

      if (minRating) params.minRating = minRating;

        if (hasLocation) {
      params.lat = selectedLocation.lat;
      params.lng = selectedLocation.lng;
    }

      // 🔥 OPTIONAL skills
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

  // 🔁 Re-search when location / service / skills change
  useEffect(() => {
      setPage(1)
      fetchProfessionals(1, true);
  }, [selectedLocation, selectedService, selectedSkills, sortBy, minRating]);

  useEffect(() => {
    if (!selectedLocation?.lat || !selectedLocation?.lng) {
      setSortBy((current) => current === "distance_asc" ? "rating_desc" : current);
    }
  }, [selectedLocation]);


  return (
   <div className="professionals container px-3 px-md-5 mt-5">
    {currentUserData && <div
        className="text-white p-4"
        style={{
          background: "linear-gradient(135deg,#0d6efd,#00c6ff)",
          borderBottomLeftRadius: "25px",
          borderBottomRightRadius: "25px"
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="fw-bold mb-0">Hire Professionals</h5>

          <DashboardNavigator/>
        </div>
         <p className="mt-2 small opacity-75">
          Find Best Professionals near you!
        </p>
      </div>}

  {/* Heading */}
  <div className="text-center mb-4 mt-2">
    <h2 className="fw-bold mb-1">Search Professionals</h2>
    <p className="text-muted small">
      Find trusted professionals near your location
    </p>
  </div>

  {/* Search */}
  <div className="mb-4">
    <SearchSection onSkillsChange={setSelectedSkills} />
  </div>

  <div className="card border-0 shadow-sm rounded-4 mb-4">
    <div className="card-body p-3 d-flex flex-column flex-md-row align-items-md-end gap-3">
      <div className="d-flex align-items-center gap-2 text-primary fw-semibold">
        <FaFilter />
        <span>Sort & Filter</span>
      </div>
      <div className="flex-grow-1 row g-2">
        <div className="col-12 col-sm-6">
          <label className="form-label small fw-semibold mb-1"><FaMapMarkerAlt className="me-1" />Order results</label>
          <select className="form-select" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="distance_asc" disabled={!selectedLocation?.lat}>Nearest first</option>
            <option value="rating_desc">Highest rated</option>
            <option value="rating_asc">Lowest rated</option>
          </select>
        </div>
        <div className="col-12 col-sm-6">
          <label className="form-label small fw-semibold mb-1"><FaStar className="me-1 text-warning" />Minimum rating</label>
          <select className="form-select" value={minRating} onChange={(event) => setMinRating(event.target.value)}>
            <option value="">All ratings</option>
            <option value="4">4 stars & above</option>
            <option value="3">3 stars & above</option>
            <option value="2">2 stars & above</option>
          </select>
        </div>
      </div>
    </div>
  </div>

  {/* Search summary */}
  {selectedService && ( 
    <div
      className="alert alert-light border rounded-4 shadow-sm mb-4"
      style={{ background: "rgba(255,255,255,0.9)" }}
    >
      <h6 className="fw-semibold mb-1">Search results for</h6>
     {selectedLocation?.address && (
      <p className="mb-0 small">
        <span className="badge bg-primary me-2">Location</span>
        {selectedLocation.address}
      </p>
    )}


      {selectedService && (
        <p className="mb-0 small mt-1">
          <span className="badge bg-success me-2">Service</span>
          {serviceName}
        </p>
      )}
    </div>
  )}

  {!selectedLocation && !selectedService && !loading && (
  <p className="text-center text-muted small">
    Select location or service to start searching professionals
  </p>
)}

  {loading ? (
    /* LOADING */
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
    /* NO RESULT */
    <div className="text-center py-5">
      <h5 className="fw-semibold mb-1">No professionals found</h5>
      <p className="text-muted small">
        Try another service or change your location
      </p>
    </div>
  ) :  (
    <>
      {/* GRID */}
      <div className="row g-4 mt-2">
        {professionals.map((pro) => (
          <div key={pro._id} className="col-12 col-sm-6 col-lg-4">
            <div className="h-100 shadow-sm rounded-4">
              <ProfessionalCard data={pro} />
            </div>
          </div>
        ))}
      </div>

      {/* LOAD MORE */}
      {hasMore && !loading && (
        <div className="text-center mt-4">
          <button
            className="btn btn-outline-primary rounded-pill px-4 py-2"
            onClick={() => fetchProfessionals(page + 1)}
          >
            Load More Professionals
          </button>
        </div>
      )}

      {/* BOTTOM LOADING */}
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
