import React, { useState, useEffect, useRef } from "react";
import { FaCrosshairs, FaMapMarkerAlt, FaCheck } from "react-icons/fa";
import useLoadGoogleMaps from "../hooks/useLoadGoogleMap";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedLocation,
  setSelectedService,
  setSelectedTask,
} from "../redux/location.slice";
import MapPinDrop from "./MapPinDrop";
import useGetServices from "../hooks/useGetServices";
import axios from "axios";
import { server_url } from "../App";

import { Geolocation } from "@capacitor/geolocation";
import { Capacitor } from "@capacitor/core";
import { requestLocationPermission } from "../utils/permissionManager.js";
import RequestHireForm from "./RequestHireForm.jsx";
import { toast } from "react-toastify";

const SearchSection = ({
  onLocationSelect,
  onServiceSelect,
  onSkillsChange,
  onTaskSelect,
  onlyLocation = false,
}) => {
  useGetServices();
  const { services } = useSelector((state) => state.services);
  const [showHireForm, setShowHireForm] = useState(false);
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
  const [selectedFixedTask, setSelectedFixedTask] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);

  const { selectedLocation } = useSelector((state) => state.location);
  const chooseTask = (skill) => {
    // Pehle har case me selected chip update karo
    setSelectedSkills([skill._id]);

    if (onSkillsChange) {
      onSkillsChange([skill._id]);
    }

    dispatch(setSelectedTask(skill));

    // ================= Fixed Task =================
    if (skill.bookingType === "fixed") {
      if (!selectedLocation?.lat) {
        toast.info("Please confirm your location first.");
        return;
      }

      setSelectedFixedTask(skill);
      setShowHireForm(true);

      return;
    }

    // ================= Inspection Task =================
    setSelectedFixedTask(null);
    setShowHireForm(false);

    if (onTaskSelect) {
      onTaskSelect(skill);
    }
  };

  // 🔹 Autocomplete (ONLY initial location)
  useEffect(() => {
    if (!googleLoaded || !inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["geocode"],
        componentRestrictions: { country: "in" },
      },
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

    dispatch(setSelectedTask(null));

    setSelectedSkills([]);

    if (onSkillsChange) {
      onSkillsChange([]);
    }

    if (onServiceSelect) {
      onServiceSelect(service._id);
    }

    try {
      const res = await axios.get(
        `${server_url}/api/user/get-service-skills/${service._id}`,
        { withCredentials: true },
      );

      const completeService = {
        ...service,
        skills: res.data.skills || [],
      };

      dispatch(setSelectedService(completeService));

      setServiceSkills(res.data.skills || []);
    } catch {
      setServiceSkills([]);

      dispatch(
        setSelectedService({
          ...service,
          skills: [],
        }),
      );
    }
  };

  const updateAddress = (lat, lng) => {
    if (!window.google) {
      setCoords({
        lat,
        lng,
        address: "",
      });

      return;
    }

    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode(
      {
        location: { lat, lng },
      },
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
      },
    );
  };

  const handleUseCurrentLocation = async () => {
    if (Capacitor.getPlatform() === "android") {
      const granted = await requestLocationPermission();

      if (!granted) {
        alert("Location permission is required");
        return;
      }

      try {
        const position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
        });

        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        updateAddress(lat, lng);
      } catch (err) {
        console.log(err);
        alert("Unable to fetch location");
      }

      return;
    }

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
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
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
        });
      },
      () => {
        alert("Location permission denied");
      },
    );
  };

  return (
    <div className="container my-3">
      <div
        className="p-lg-4 p-3 rounded-4 shadow"
        style={{ background: "rgba(255,255,255,0.9)" }}
      >
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
        {!onlyLocation && (
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
        )}
        {/* 🔥 SKILLS CHECKBOXES */}
        {!onlyLocation && serviceSkills.length > 0 && (
          <div className="mt-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h6 className="fw-bold mb-1">Choose your task</h6>
                <small className="text-muted">Select one to see the booking options</small>
              </div>
              <span className="badge rounded-pill text-primary border border-primary-subtle bg-primary-subtle px-3 py-2">
                {serviceSkills.length} options
              </span>
            </div>
            <div className="row g-2">
              {serviceSkills.map((skill) => {
                const active = selectedSkills.includes(skill._id);
                const isFixed = skill.bookingType === "fixed";
                const priceLabel = isFixed && skill.pricingSource === "admin"
                  ? `₹${skill.fixedPrice}`
                  : skill.pricingSource === "professional"
                    ? "Price after selection"
                    : "Inspection required";
                return (
                  <div className="col-12 col-sm-6" key={skill._id}>
                    <button
                      type="button"
                      onClick={() => chooseTask(skill)}
                      className="w-100 text-start border-0 rounded-4 p-3 position-relative"
                      style={{
                        minHeight: "106px",
                        background: active
                          ? "linear-gradient(135deg,#2563eb,#7c3aed)"
                          : "linear-gradient(145deg,#ffffff,#f5f8ff)",
                        color: active ? "#fff" : "#172554",
                        boxShadow: active
                          ? "0 10px 24px rgba(79,70,229,.28)"
                          : "0 4px 14px rgba(37,99,235,.09)",
                        outline: active ? "2px solid #c4b5fd" : "1px solid #dbeafe",
                        transition: "transform .2s ease, box-shadow .2s ease",
                      }}
                    >
                      <div className="d-flex align-items-start justify-content-between gap-2">
                        <div>
                          <div className="fw-bold">{skill.name}</div>
                          <small className={active ? "text-white-50" : "text-muted"}>
                            {isFixed ? "Fixed-price service" : "Professional inspection"}
                          </small>
                        </div>
                        <span className={`rounded-circle d-inline-flex align-items-center justify-content-center ${active ? "bg-white text-primary" : "bg-primary-subtle text-primary"}`} style={{ width: 28, height: 28 }}>
                          {active ? <FaCheck size={12} /> : "→"}
                        </span>
                      </div>
                      <div className={`small fw-semibold mt-3 ${active ? "text-white" : "text-primary"}`}>{priceLabel}</div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {selectedFixedTask && showHireForm && (
          <div className="mt-3 p-2">
            <RequestHireForm
              task={selectedFixedTask}
              onClose={() => {
                setShowHireForm(false);
                setSelectedFixedTask(null);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchSection;
