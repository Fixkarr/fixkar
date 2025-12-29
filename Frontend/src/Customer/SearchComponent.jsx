import React, { useState, useEffect, useRef } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/customerhome.css";
import useLoadGoogleMaps from "../hooks/useLoadGoogleMap";
import { useDispatch } from "react-redux";
import { setSelectedLocation, setSelectedService } from "../redux/location.slice";
import MapPinDrop from "./MapPinDrop";

const SearchSection = ({ onLocationSelect, onServiceSelect }) => {
  const googleLoaded = useLoadGoogleMaps();
  const inputRef = useRef(null);

  const [coords, setCoords] = useState({
    lat: null,
    lng: null,
    address: "",
  });

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

  // 🔹 Autocomplete (ONLY initial location)
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
      if (!place.geometry) return;

      setCoords({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        address: place.formatted_address,
      });
    });
  }, [googleLoaded]);

  const handleServiceChange = (value) => {
    setService(value);
    dispatch(setSelectedService(value));
    if (onServiceSelect) onServiceSelect(value);
  };

  return (
    <div className="search container">
      <div className="p-lg-4 p-2 rounded-4 shadow-sm bg-white bg-opacity-75">
        {/* Location Input */}
        <div className="mb-2">
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

        {/* Map + Confirm */}
        {coords.lat && coords.lng && (
          <>
            <MapPinDrop coords={coords} setCoords={setCoords} />

            <div className="mt-2 small text-muted">
              📍 {coords.address || "Updating address..."}
            </div>

            <button
              className="btn btn-primary w-100 mt-3"
              onClick={() => {
                const finalLocation = {
                  lat: Number(coords.lat),
                  lng: Number(coords.lng),
                  address: coords.address,
                };

                dispatch(setSelectedLocation(finalLocation));
                if (onLocationSelect) onLocationSelect(finalLocation);

                console.log("✅ Final Location:", finalLocation);
              }}
            >
              📍 Confirm Exact Location
            </button>
          </>
        )}

        {/* Services */}
        <div className="d-flex flex-wrap gap-2 mt-3">
          {services.map((srv) => (
            <button
              key={srv}
              onClick={() => handleServiceChange(srv)}
              className="btn btn-outline-primary rounded-pill px-3 py-1"
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
