import React, { useState, useEffect, useRef } from "react";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/customerhome.css";
import useLoadGoogleMaps from "../hooks/useLoadGoogleMap";
import { useDispatch } from "react-redux";
import { setSelectedLocation, setSelectedService } from "../redux/location.slice";

const SearchSection = ({ onLocationSelect, onServiceSelect }) => {
  const googleLoaded = useLoadGoogleMaps();
  const inputRef = useRef(null);

  const dispatch = useDispatch();
  const [service, setService] = useState("");

  const services = [
    "Electrician",
    "Plumber",
    "Painter",
    "Carpenter",
    "Labour",
    "Cleaner",
  ];

  // Location autocomplete
  useEffect(() => {
    if (!googleLoaded || !inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["geocode"],
        componentRestrictions: { country: "in" },
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();

      const locationData = {
        address: place.formatted_address,
        lat: place.geometry?.location?.lat(),
        lng: place.geometry?.location?.lng(),
      };

      // Save location to Redux
      dispatch(setSelectedLocation(locationData));

      // If parent component wants callback (CustomerHome case)
      if (onLocationSelect) onLocationSelect(locationData);
    });
  }, [googleLoaded, dispatch, onLocationSelect]);

  // When typing in service input
  const handleServiceChange = (value) => {
    setService(value);
    dispatch(setSelectedService(value));
    if(onServiceSelect) onServiceSelect(value)
  };

  return (
    <div className="search container">
      <div
        className="p-lg-4 p-2 rounded-4 shadow-sm"
        style={{
          backdropFilter: "blur(10px)",
          background: "rgba(255, 255, 255, 0.6)",
        }}
      >
        {/* Location Input */}
        <div className="mb-2 position-relative">
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
        {/* <div className="mb-3 position-relative">
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
              onChange={(e) => handleServiceChange(e.target.value)}
            />
          </div>
        </div> */}

        {/* Quick Service Buttons */}
        <div className="d-flex flex-wrap gap-2 mt-3">
          {services.map((srv) => (
            <button
              key={srv}
              onClick={() => handleServiceChange(srv)}
              className="btn btn-outline-primary rounded-pill px-lg-3 px-1 py-lg-1 py-0"
            >
              {srv}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
