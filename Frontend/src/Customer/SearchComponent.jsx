import React, { useState, useEffect, useRef } from "react";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/customerhome.css";
import useLoadGoogleMaps from "../hooks/useLoadGoogleMap";



const SearchSection = () => {
  const googleLoaded = useLoadGoogleMaps(); // script load status
  const inputRef = useRef(null);

  const [service, setService] = useState("");

  const services = ["Electrician", "Plumber", "Painter", "Carpenter", "Labour", "Cleaner"];

  // Initialize autocomplete AFTER script loads
  useEffect(() => {
    if (!googleLoaded || !inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["geocode"],
      componentRestrictions: { country: "in" },
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();

      const locationData = {
        address: place.formatted_address,
        lat: place.geometry?.location?.lat(),
        lng: place.geometry?.location?.lng(),
      };

      console.log("Selected Location:", locationData);
    });
  }, [googleLoaded]);

  return (
    <div className="search container mt-4">
      <div
        className="p-2 p-md-4 rounded-4 shadow-sm"
        style={{
          backdropFilter: "blur(10px)",
          background: "rgba(255, 255, 255, 0.6)",
        }}
      >
        {/* Location Input */}
        <div className="mb-3 position-relative">
          <label className="form-label fw-semibold">Your Location</label>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <FaMapMarkerAlt />
            </span>
            <input
              ref={inputRef}
              type="text"
              className="form-control border-start-0"
              placeholder="Enter your location"
            />
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

        {/* Quick Service Buttons */}
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
