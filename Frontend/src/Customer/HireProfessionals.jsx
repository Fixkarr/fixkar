import React, { useEffect, useState } from "react";
import SearchSection from "./SearchComponent";
import ProfessionalCard from "./ProfessionalCard";
import { useSelector } from "react-redux";
import axios from "axios";

import { server_url } from "../App";


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
      <h2 className="fw-semibold mt-2 welcome mb-3">Search Professionals</h2>

      {/* Search */}
      <SearchSection onSkillsChange={setSelectedSkills}/>

      {/* Search summary */}
      {selectedLocation?.address && (
        <div className="mt-3 mb-4">
          <h5 className="welcome mb-1">Search results for:</h5>
          <p className="mb-0 text-muted">
            <strong className="text-primary">Location:</strong> {selectedLocation.address}
            {selectedService && (
              <>
                <br />
                <strong className="text-primary">Service:</strong> {serviceName}
              </>
            )}
          </p>
        </div>
      )}

      {/* Content states */}
      {!selectedLocation?.lat ? (
        <div className="text-center py-5">
          <center>
            <div className="searchPlaceholder mb-3">
            <img
              src="/Images/searchPlaceholder.png"
              alt="Search"
              style={{ maxWidth: "180px", opacity: 0.85, width: "100%" }}
            />
          </div>
          </center>
          <h4 className="fw-semibold welcome">Find Professionals Near You</h4>
          <p className="text-muted">Enter your location to see available professionals.</p>
        </div>
      ) : loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Searching nearby professionals...</p>
        </div>
      ) : professionals.length === 0 ? (
        <div className="text-center py-5">
          <h5 className="fw-semibold welcome">No professionals found nearby</h5>
          <p className="text-muted small">Try another service or change location</p>
        </div>
      ) : (
        // Professionals grid
       <>
       
         <div className="row mt-4 g-3">
          {professionals.map((pro) => (
            <div key={pro._id} className="col-12 col-sm-6 col-lg-4">
              <ProfessionalCard data={pro} />
            </div>
          ))}
        </div>
         {hasMore && !loading && (
            <div className="text-center mt-4">
              <button
                className="btn btn-outline-primary px-4"
                onClick={() => fetchProfessionals(page + 1)}
              >
                Load More
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center mt-3">
              <div className="spinner-border text-primary" />
            </div>
          )}
       </>
        
      )}
    </div>
  );
};

export default HireProfessionals;
