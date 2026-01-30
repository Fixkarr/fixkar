import React, { useState, useEffect, useRef } from "react";
import { FaCrosshairs, FaMapMarkerAlt, FaCheck } from "react-icons/fa";
import useLoadGoogleMaps from "../hooks/useLoadGoogleMap";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedLocation, setSelectedService } from "../redux/location.slice";
import MapPinDrop from "./MapPinDrop";
import useGetServices from "../hooks/useGetServices";
import axios from 'axios'
import { server_url } from "../App";

const SearchSection = ({ onLocationSelect, onServiceSelect, onSkillsChange }) => {
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

  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [serviceSkills, setServiceSkills] = useState([]);

  const [selectedSkills, setSelectedSkills] = useState([]);

  const handleSkillToggle = (skillId) => {
  setSelectedSkills((prev) =>
{   const updated =  prev.includes(skillId)
      ? prev.filter((id) => id !== skillId)
      : [...prev, skillId];

    if (onSkillsChange) onSkillsChange(updated);
    return updated;
  });
};

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

  const handleServiceChange = async (service) => {
    setSelectedServiceId(service._id);
    dispatch(setSelectedService(service._id));
      setSelectedSkills([]);
      if (onSkillsChange) onSkillsChange([]);
    if (onServiceSelect) onServiceSelect(service._id);
    
      try {
      const res = await axios.get(
        `${server_url}/api/user/get-service-skills/${service._id}`,
        { withCredentials: true }
      );

      setServiceSkills(res.data.skills || []);
    } catch (error) {
      setServiceSkills([]);
    }



  };

    const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        if (!window.google) {
          setCoords({ lat, lng, address: "" });
          return;
        }

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode(
          { location: { lat, lng } },
          (results, status) => {
            if (status === "OK" && results[0]) {
              setCoords({
                lat,
                lng,
                address: results[0].formatted_address,
              });
            } else {
              setCoords({
                lat,
                lng,
                address: "",
              });
            }
          }
        );
      },
      () => {
        alert("Location permission denied");
      }
    );
  };


  return (
    <div className="container my-3">
      <div className="p-lg-4 p-3 rounded-4 shadow" style={{ background: "rgba(255,255,255,0.9)" }}>
        {/* Location Input */}
         <label className="fw-semibold mb-1">
          <FaMapMarkerAlt className="me-1 text-primary" />
          Your Location
        </label>

        <div className="input-group shadow-sm rounded-pill overflow-hidden">
          <span className="input-group-text bg-white border-0">
            <FaMapMarkerAlt className="text-primary" />
          </span>

          <input
            ref={inputRef}
            type="text"
            className="form-control border-0"
            placeholder="Enter your location"
          />

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleUseCurrentLocation}
          >
            <FaCrosshairs className="me-1" />
            Detect
          </button>
        </div>

        {/* Map + Confirm */}
       {coords.lat && coords.lng && (
          <>
            <MapPinDrop coords={coords} setCoords={setCoords} />

            <div className="small text-muted mt-2">
              📍 {coords.address || "Updating address..."}
            </div>

            <button
              className="btn btn-success w-100 mt-3 rounded-pill"
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
              Confirm Exact Location
            </button>
          </>
        )}
        {/* Services */}
          <div className="d-flex flex-wrap gap-3 justify-content-center mt-4">
          {services?.map((srv) => (
            <button
              key={srv._id}
              onClick={() => handleServiceChange(srv)}
              className={`btn p-2 rounded-4 shadow-sm ${
                selectedServiceId === srv._id
                  ? "btn-primary text-white"
                  : "btn-light"
              }`}
              style={{ width: 90 }}
            >
              <img
                src={srv.image}
                alt={srv.name}
                className="rounded-circle mb-1"
                style={{ width: 32, height: 32, objectFit: "cover" }}
              />
              <div className="small fw-semibold">{srv.name}</div>
            </button>
          ))}
        </div>
            {/* 🔥 SKILLS CHECKBOXES */}
  {serviceSkills.length > 0 && (
          <div className="mt-4">
            <h6 className="fw-semibold mb-2">Filter by Skills</h6>

            <div className="d-flex flex-wrap gap-2">
              {serviceSkills.map((skill) => {
                const active = selectedSkills.includes(skill._id);

                return (
                  <button
                    key={skill._id}
                    type="button"
                    onClick={() => handleSkillToggle(skill._id)}
                    className={`btn btn-sm rounded-pill d-flex align-items-center gap-1 ${
                      active ? "btn-success" : "btn-outline-secondary"
                    }`}
                  >
                    {active && <FaCheck />}
                    {skill.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}


      </div>
    </div>
  );
};

export default SearchSection;
