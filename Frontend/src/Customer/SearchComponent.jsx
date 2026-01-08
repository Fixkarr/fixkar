import React, { useState, useEffect, useRef } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/customerhome.css";
import useLoadGoogleMaps from "../hooks/useLoadGoogleMap";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedLocation, setSelectedService } from "../redux/location.slice";
import MapPinDrop from "./MapPinDrop";
import useGetServices from "../hooks/useGetServices";

const SearchSection = ({ onLocationSelect, onServiceSelect }) => {
  useGetServices()
  const {services} = useSelector(state => state.services)
  const googleLoaded = useLoadGoogleMaps();
  const inputRef = useRef(null);

  const [coords, setCoords] = useState({
    lat: null,
    lng: null,
    address: "",
  });

  const dispatch = useDispatch();
  const [service, setService] = useState("");



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

              }}
            >
              📍 Confirm Exact Location
            </button>
          </>
        )}

        {/* Services */}
        <div className="d-flex flex-wrap gap-2 mt-3">
          {services?.map((srv) => (
            <button
              key={srv._id}
              onClick={() => handleServiceChange(srv.name)}
              className="border-0 bg-transparent p-0"
              style={{ outline: "none" }}
            >
               <div
        className="card border-0 bg-primary-subtle text-primary shadow-sm rounded-4 text-center"
        style={{
          width: "90px", 
          cursor: "pointer",
          transition: "all 0.25s ease",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = "translateY(-4px)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.transform = "translateY(0)")
        }
      >
        {/* Image */}
        <div className="pt-3">
          <img
            src={srv.image}
            alt={srv.name}
            className="img-fluid rounded-circle"
            style={{
              width: "45px",
              height: "45px",
              objectFit: "cover",
            }}
          />
        </div>

        {/* Name */}
        <div className="px-2 pb-3 mt-2">
          <small className="fw-semibold text-primary">
            {srv.name}
          </small>
        </div>
      </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
