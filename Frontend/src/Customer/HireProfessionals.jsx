import React, { useEffect, useState } from "react";
import SearchSection from "./SearchComponent";
import ProfessionalCard from "./ProfessionalCard";
import { useSelector } from "react-redux";
import axios from "axios";

import { server_url } from "../App";
import { MdPersonSearch } from "react-icons/md";


const HireProfessionals = () => {

 
  const { selectedLocation, selectedService } = useSelector((state) => state.location);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(false);

 const { services } = useSelector(state => state.services);
  const serviceName =
  services.find(s => s._id === selectedService)?.name;

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
 const fetchProfessionals = async (pageNo = 1, reset = false) => {
    if (!selectedLocation?.lat || !selectedLocation?.lng) return;

    try {
      setLoading(true);

      const params = {
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        service: selectedService || "",
        page: pageNo,
        limit: 20,
      };

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
    if (selectedLocation?.lat && selectedLocation?.lng) {
      fetchProfessionals(1, true);
    }
  }, [selectedLocation, selectedService, selectedSkills]);


  return (
   <div className="professionals container px-3 px-md-5 py-4">

  {/* Heading */}
  <div className="text-center mb-4">
    <h2 className="fw-bold mb-1">Search Professionals</h2>
    <p className="text-muted small">
      Find trusted professionals near your location
    </p>
  </div>

  {/* Search */}
  <div className="mb-4">
    <SearchSection onSkillsChange={setSelectedSkills} />
  </div>

  {/* Search summary */}
  {selectedLocation?.address && (
    <div
      className="alert alert-light border rounded-4 shadow-sm mb-4"
      style={{ background: "rgba(255,255,255,0.9)" }}
    >
      <h6 className="fw-semibold mb-1">Search results for</h6>
      <p className="mb-0 small">
        <span className="badge bg-primary me-2">Location</span>
        {selectedLocation.address}
      </p>

      {selectedService && (
        <p className="mb-0 small mt-1">
          <span className="badge bg-success me-2">Service</span>
          {serviceName}
        </p>
      )}
    </div>
  )}

  {/* STATES */}
  {!selectedLocation?.lat ? (
    /* EMPTY STATE */
    <div className="text-center py-5">
     <div
                className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
                style={{
                  width: "100px",
                  height: "100px",
                  background: "rgba(13,110,253,0.1)",
                }}
              >
                <MdPersonSearch size={40} className="text-primary" />
              </div>
      <h4 className="fw-semibold mb-1">Find Professionals Near You</h4>
      <p className="text-muted">
        Enter your location to see available professionals
      </p>
    </div>
  ) : loading ? (
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
  ) : (
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
