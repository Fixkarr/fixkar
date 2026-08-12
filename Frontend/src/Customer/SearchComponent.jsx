import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FaCrosshairs,
  FaMapMarkerAlt,
  FaCheck,
  FaSearch,
  FaTimes,
  FaChevronRight,
} from "react-icons/fa";
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
  const { selectedLocation } = useSelector((state) => state.location);

  const dispatch = useDispatch();
  const googleLoaded = useLoadGoogleMaps();
  const inputRef = useRef(null);

  const [coords, setCoords] = useState({
    lat: null,
    lng: null,
    address: "",
  });

  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [serviceSkills, setServiceSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedFixedTask, setSelectedFixedTask] = useState(null);
  const [showHireForm, setShowHireForm] = useState(false);
  const [taskSearch, setTaskSearch] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");

  const filteredTasks = useMemo(() => {
    const query = taskSearch.trim().toLowerCase();
    if (!query) return serviceSkills;

    return serviceSkills.filter((skill) =>
      skill.name?.toLowerCase().includes(query)
    );
  }, [serviceSkills, taskSearch]);

  const filteredServices = useMemo(() => {
    const query = serviceSearch.trim().toLowerCase();
    if (!query) return services || [];

    return (services || []).filter((service) =>
      service.name?.toLowerCase().includes(query)
    );
  }, [services, serviceSearch]);

  const chooseTask = (skill) => {
    if (!selectedLocation?.lat) {
      toast.info("Please confirm your location first.");
      return;
    }

    setSelectedSkills([skill._id]);
    onSkillsChange?.([skill._id]);
    dispatch(setSelectedTask(skill));

    if (skill.bookingType === "fixed") {
      setSelectedFixedTask(skill);
      setShowHireForm(true);
      return;
    }

    setSelectedFixedTask(null);
    setShowHireForm(false);
    onTaskSelect?.(skill);
  };

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

    return () => {
      window.google?.maps?.event?.clearInstanceListeners(autocomplete);
    };
  }, [googleLoaded]);

  const handleServiceChange = async (service) => {
    const serviceId = service._id;

    setSelectedServiceId(serviceId);
    setSelectedSkills([]);
    setSelectedFixedTask(null);
    setShowHireForm(false);
    setTaskSearch("");
    onSkillsChange?.([]);

    dispatch(setSelectedService(serviceId));
    onServiceSelect?.(serviceId);

    try {
      const res = await axios.get(
        `${server_url}/api/user/get-service-skills/${serviceId}`,
        { withCredentials: true }
      );

      const skills = res.data.skills || [];
      setServiceSkills(skills);
      dispatch(setSelectedService(serviceId));
    } catch (error) {
      console.log(error);
      setServiceSkills([]);
      toast.error("Unable to load tasks for this service.");
    }
  };

  const updateAddress = (lat, lng) => {
    if (!window.google) {
      setCoords({ lat, lng, address: "" });
      return;
    }

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      setCoords({
        lat,
        lng,
        address:
          status === "OK" && results[0] ? results[0].formatted_address : "",
      });
    });
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
        updateAddress(position.coords.latitude, position.coords.longitude);
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
        updateAddress(position.coords.latitude, position.coords.longitude);
      },
      () => alert("Location permission denied")
    );
  };

  const handleConfirmLocation = () => {
    const finalLocation = {
      lat: Number(coords.lat),
      lng: Number(coords.lng),
      address: coords.address,
    };

    dispatch(setSelectedLocation(finalLocation));
    onLocationSelect?.(finalLocation);
    toast.success("Location confirmed");
  };

  const closeHireForm = () => {
    setShowHireForm(false);
    setSelectedFixedTask(null);
  };

  return (
    <>
      <div className="container my-2 my-md-4 px-0">
        <div
          className="bg-white border rounded-4 p-2 p-md-4"
          style={{ maxWidth: "1100px", margin: "0 auto" }}
        >
          <div className="mb-3 mb-md-4">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <div className="min-w-0">
                <div className="fw-bold text-dark small small-md-normal">
                  <FaMapMarkerAlt className="text-primary me-2" />
                  Service Location
                </div>
                <small className="text-muted d-block text-truncate">
                  Where do you need the service?
                </small>
              </div>

              {selectedLocation?.lat && (
                <span className="badge rounded-pill bg-success-subtle text-success px-2 px-md-3 py-2 flex-shrink-0">
                  <FaCheck size={10} className="me-1" />
                  Confirmed
                </span>
              )}
            </div>

            <div
              className="input-group border rounded-3 overflow-hidden"
              style={{ minHeight: 46 }}
            >
              <span className="input-group-text bg-white border-0 px-2 px-md-3">
                <FaMapMarkerAlt className="text-primary" />
              </span>

              <input
                ref={inputRef}
                type="text"
                className="form-control border-0 shadow-none px-1"
                placeholder="Enter your location"
              />

              <button
                type="button"
                className="btn btn-light border-0 px-3"
                onClick={handleUseCurrentLocation}
                aria-label="Use current location"
              >
                <FaCrosshairs className="text-primary" />
                <span className="d-none d-sm-inline ms-1">Detect</span>
              </button>
            </div>

            {coords.lat && coords.lng && (
              <div className="mt-2 mt-md-3">
                <MapPinDrop coords={coords} setCoords={setCoords} />

                <div className="d-flex align-items-start gap-2 mt-2 small text-muted">
                  <FaMapMarkerAlt className="text-primary mt-1 flex-shrink-0" />
                  <span className="text-truncate">
                    {coords.address || "Updating address..."}
                  </span>
                </div>

                <button
                  type="button"
                  className={`btn ${
                    selectedLocation?.lat
                      ? "btn-outline-success"
                      : "btn-primary"
                  } w-100 rounded-3 mt-2 mt-md-3`}
                  onClick={handleConfirmLocation}
                >
                  <FaCheck className="me-2" />
                  {selectedLocation?.lat
                    ? "Location Confirmed"
                    : "Confirm Location"}
                </button>
              </div>
            )}
          </div>

          {!onlyLocation && (
            <div className="border-top pt-3 pt-md-4">
              <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                <div className="min-w-0">
                  <h6 className="fw-bold mb-0">Choose a service</h6>
                  <small className="text-muted d-none d-sm-block">
                    Select what you need help with
                  </small>
                </div>
                <span className="badge bg-light text-primary border rounded-pill px-2 py-2 flex-shrink-0">
                  {filteredServices.length}
                </span>
              </div>

              <div
                className="input-group border rounded-3 overflow-hidden mb-2 mb-md-3"
                style={{ height: 44 }}
              >
                <span className="input-group-text bg-white border-0 px-2 px-md-3">
                  <FaSearch size={13} className="text-muted" />
                </span>

                <input
                  type="text"
                  className="form-control border-0 shadow-none ps-0"
                  placeholder="Search service"
                  value={serviceSearch}
                  onChange={(e) => setServiceSearch(e.target.value)}
                />

                {serviceSearch && (
                  <button
                    type="button"
                    className="btn bg-white border-0 px-3"
                    onClick={() => setServiceSearch("")}
                    aria-label="Clear service search"
                  >
                    <FaTimes size={12} className="text-muted" />
                  </button>
                )}
              </div>

              <div className="service-scroll-area">
                {filteredServices.length > 0 ? (
                  <div className="row g-2">
                    {filteredServices.map((service) => {
                      const active = selectedServiceId === service._id;

                      return (
                        <div
                          className="col-6 col-sm-4 col-lg-3"
                          key={service._id}
                        >
                          <button
                            type="button"
                            onClick={() => handleServiceChange(service)}
                            className={`service-card ${
                              active ? "service-card-active" : ""
                            }`}
                            aria-pressed={active}
                          >
                            <div
                              className={`service-icon ${
                                active ? "service-icon-active" : ""
                              }`}
                            >
                              <img src={service.image} alt={service.name} />
                            </div>

                            <div className="service-card-content">
                              <div
                                className={`service-name ${
                                  active ? "text-primary" : "text-dark"
                                }`}
                              >
                                {service.name}
                              </div>
                              <small className="service-card-hint">
                                {active ? "Selected" : "Tap to select"}
                              </small>
                            </div>

                            <div
                              className={`service-check ${
                                active ? "service-check-active" : ""
                              }`}
                            >
                              {active ? (
                                <FaCheck size={10} />
                              ) : (
                                <FaChevronRight size={9} />
                              )}
                            </div>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="service-empty-state py-4">
                    <FaSearch size={18} className="text-muted mb-2" />
                    <div className="fw-semibold">No services found</div>
                    <small className="text-muted">
                      Try another service name.
                    </small>
                    <div>
                      <button
                        type="button"
                        className="btn btn-sm btn-link text-decoration-none"
                        onClick={() => setServiceSearch("")}
                      >
                        Clear search
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {selectedServiceId && (
                <div className="mt-3 pt-3 border-top">
                  <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                    <div>
                      <h6 className="fw-bold mb-0">Choose a task</h6>
                      <small className="text-muted d-none d-sm-block">
                        Pick the specific work you need
                      </small>
                    </div>
                    {serviceSkills.length > 0 && (
                      <span className="badge bg-light text-primary border rounded-pill px-2 py-2">
                        {serviceSkills.length}
                      </span>
                    )}
                  </div>

                  {serviceSkills.length > 6 && (
                    <div
                      className="input-group border rounded-3 overflow-hidden mb-2"
                      style={{ height: 40 }}
                    >
                      <span className="input-group-text bg-white border-0 px-3">
                        <FaSearch size={12} className="text-muted" />
                      </span>
                      <input
                        type="text"
                        className="form-control border-0 shadow-none ps-0"
                        placeholder="Search task"
                        value={taskSearch}
                        onChange={(e) => setTaskSearch(e.target.value)}
                      />
                      {taskSearch && (
                        <button
                          type="button"
                          className="btn bg-white border-0 px-3"
                          onClick={() => setTaskSearch("")}
                          aria-label="Clear task search"
                        >
                          <FaTimes size={11} className="text-muted" />
                        </button>
                      )}
                    </div>
                  )}

                  {filteredTasks.length > 0 ? (
                    <div className="task-list">
                      {filteredTasks.map((skill) => {
                        const active = selectedSkills.includes(skill._id);

                        return (
                          <button
                            key={skill._id}
                            type="button"
                            onClick={() => chooseTask(skill)}
                            className={`task-option ${
                              active ? "task-option-active" : ""
                            }`}
                          >
                            <div className="min-w-0 text-start">
                              <div className="fw-semibold text-truncate">
                                {skill.name}
                              </div>
                              {skill.bookingType && (
                                <small className="text-muted text-capitalize">
                                  {skill.bookingType === "fixed"
                                    ? "Fixed price"
                                    : "Inspection"}
                                </small>
                              )}
                            </div>
                            {active && (
                              <FaCheck
                                className="text-primary flex-shrink-0"
                                size={12}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="small text-muted py-2">
                      No tasks found for this service.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showHireForm && selectedFixedTask && (
        <RequestHireForm
          task={selectedFixedTask}
          onClose={closeHireForm}
        />
      )}
    </>
  );
};

export default SearchSection;
