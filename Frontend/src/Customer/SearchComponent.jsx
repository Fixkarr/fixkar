import React, { useState } from "react";
import { FaMapMarkerAlt, FaSearch, FaCrosshairs } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/customerhome.css"
const SearchSection = () => {
  const [location, setLocation] = useState("");
  const [service, setService] = useState("");

  // Detect user location
  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation(`Lat: ${latitude.toFixed(3)}, Lng: ${longitude.toFixed(3)}`);
        },
        () => alert("Location access denied!")
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const services = ["Electrician", "Plumber", "Painter", "Carpenter", "Labour", "Cleaner"];

  return (
    <div className="search container mt-4">
      <div className="p-2 p-md-4 rounded-4 shadow-sm" 
           style={{
             backdropFilter: "blur(10px)",
             background: "rgba(255, 255, 255, 0.6)",
           }}>
        
        {/* Location Input */}
        <div className="mb-3 position-relative">
          <label className="form-label fw-semibold">Your Location</label>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <FaMapMarkerAlt />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Enter your location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <button className="btn btn-outline-primary" onClick={handleDetectLocation}>
              <FaCrosshairs/> Detect
            </button>
          </div>
        </div>

        {/* Service Search Input */}
        <div className="mb-3 position-relative">
          <label className="form-label fw-semibold">Search for Services</label>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <FaSearch />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search services (e.g. plumber, electrician)"
              value={service}
              onChange={(e) => setService(e.target.value)}
            />
          </div>
        </div>

        {/* Service Buttons */}
        <div className="d-flex flex-wrap gap-2 mt-3">
          {services.map((srv) => (
            <button key={srv} className="btn btn-outline-primary rounded-pill px-3 py-1">
              {srv}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
