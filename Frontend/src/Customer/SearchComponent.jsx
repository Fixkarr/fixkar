import React, { useState, useEffect, useRef } from "react";
import { FaCrosshairs, FaMapMarkerAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/customerhome.css";
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
  const [service, setService] = useState("");

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
    <div className="container">
      <div className="p-lg-4 p-2 rounded-4 shadow-sm bg-white bg-opacity-75">
        {/* Location Input */}
        <div className="mb-2">
          <label className="form-label fw-semibold">Your Location</label>
         <div className="input-group">
  {/* Left icon */}
  <span className="input-group-text bg-white border-end-0">
    <FaMapMarkerAlt />
  </span>

  {/* Input */}
  <input
    ref={inputRef}
    type="text"
    className="form-control border-start-0 border-end-0"
    placeholder="Enter your location"
  />

  {/* Use current location button */}
  <button
    type="button"
    className="btn btn-primary input-group-text"
    onClick={handleUseCurrentLocation}
    title="Use current location"
  >
    <FaCrosshairs /> Detect 
  </button>
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
              onClick={() => handleServiceChange(srv)}
              className="border-0 bg-transparent p-0"
              style={{ outline: "none" }}
            >
               <div
        className="card border-0 bg-primary-subtle text-primary shadow-sm rounded-4 text-center px-2"
        style={{ 
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
        <div className="p-1">
          <img
            src={srv.image}
            alt={srv.name}
            className="img-fluid rounded-circle"
            style={{
              width: "20px",
              height: "20px",
              objectFit: "cover",
            }}
          />
        </div>

        {/* Name */}
        <div>
          <small className="fw-semibold text-primary" style={{fontSize : "0.5vmax"}}>
            {srv.name}
          </small>
        </div>
      </div>
            </button>
          ))}
        </div>
            {/* 🔥 SKILLS CHECKBOXES */}
        {serviceSkills.length > 0 && (
          <div className="mt-3">
            <h6 className="fw-semibold">Filter by Skills</h6>

            <div className="row">
              {serviceSkills.map((skill) => (
                <div key={skill._id} className="col-6">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedSkills.includes(skill._id)}
                      onChange={() => handleSkillToggle(skill._id)}
                      id={`skill-${skill._id}`}
                    />
                    <label
                      htmlFor={`skill-${skill._id}`}
                      className="form-check-label"
                    >
                      {skill.name}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


      </div>
    </div>
  );
};

export default SearchSection;
