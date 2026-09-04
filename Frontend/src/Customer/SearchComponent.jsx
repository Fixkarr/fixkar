import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FaMapMarkerAlt,
  FaCheck,
  FaSearch,
  FaTimes,
  FaChevronRight,
  FaLocationArrow,
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
import '../css/searchComponent.css'

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
  const autocompleteRef = useRef(null);
  const [coords, setCoords] = useState({ lat: null, lng: null, address: "" });
  const [isChangingLocation, setIsChangingLocation] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [serviceSkills, setServiceSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedFixedTask, setSelectedFixedTask] = useState(null);
  const [showHireForm, setShowHireForm] = useState(false);
  const [taskSearch, setTaskSearch] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");
  const [showServiceSearch, setShowServiceSearch] = useState(false);
  const [showTaskSearch, setShowTaskSearch] = useState(false);

  const filteredTasks = useMemo(() => {
    const query = taskSearch.trim().toLowerCase();
    return query
      ? serviceSkills.filter((skill) =>
          skill.name?.toLowerCase().includes(query),
        )
      : serviceSkills;
  }, [serviceSkills, taskSearch]);

  const filteredServices = useMemo(() => {
    const query = serviceSearch.trim().toLowerCase();
    return query
      ? (services || []).filter((service) =>
          service.name?.toLowerCase().includes(query),
        )
      : services || [];
  }, [services, serviceSearch]);

  const getTaskPrice = (skill) => {
    const price =
      skill?.price ?? skill?.fixedPrice ?? skill?.amount ?? skill?.rate;
    if (price === undefined || price === null || price === "") return null;
    if (typeof price === "object")
      return price?.amount ?? price?.value ?? price?.price ?? null;
    return price;
  };

  const chooseTask = (skill) => {
    if (!selectedLocation?.lat || !selectedLocation?.lng) {
      toast.info("Please confirm your location first.");
      return;
    }
    setSelectedSkills([skill._id]);
    onSkillsChange?.([skill._id]);
    dispatch(setSelectedTask(skill));
    if (skill.bookingType === "fixed") {
      setSelectedFixedTask(skill);
      setShowHireForm(true);
    } else {
      setSelectedFixedTask(null);
      onTaskSelect?.(skill);
    }
  };

  useEffect(() => {
  if (selectedLocation?.lat != null && selectedLocation?.lng != null) {
    setCoords({
      lat: Number(selectedLocation.lat),
      lng: Number(selectedLocation.lng),
      address: selectedLocation.address || "",
    });

    setIsChangingLocation(false);
  }
}, [selectedLocation]);

 useEffect(() => {
  if (!googleLoaded || !inputRef.current) return;

  autocompleteRef.current =
    new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["geocode"],
        componentRestrictions: { country: "in" },
      }
    );

  const listener = autocompleteRef.current.addListener(
    "place_changed",
    () => {
      const place = autocompleteRef.current.getPlace();

      if (place.geometry) {
        setCoords({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          address: place.formatted_address || "",
        });
      }
    }
  );

  return () => {
    if (listener) {
      window.google.maps.event.removeListener(listener);
    }

    autocompleteRef.current = null;
  };
}, [googleLoaded, isChangingLocation]);

  const handleServiceChange = async (service) => {
    const serviceId = service._id;
    setSelectedServiceId(serviceId);
    setSelectedSkills([]);
    setSelectedFixedTask(null);
    setShowHireForm(false);
    setServiceSkills([]);
    setTaskSearch("");
    setShowTaskSearch(false);
    onSkillsChange?.([]);
    dispatch(setSelectedService(serviceId));
    onServiceSelect?.(serviceId);
    try {
      const res = await axios.get(
        `${server_url}/api/user/get-service-skills/${serviceId}`,
        { withCredentials: true },
      );
      setServiceSkills(res.data.skills || []);
    } catch (error) {
      console.log(error);
      toast.error("Unable to load tasks for this service.");
    }
  };

  const updateAddress = (lat, lng) => {
    if (!window.google) return setCoords({ lat, lng, address: "" });
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) =>
      setCoords({
        lat,
        lng,
        address:
          status === "OK" && results[0] ? results[0].formatted_address : "",
      }),
    );
  };

  const handleUseCurrentLocation = async () => {
    if (Capacitor.getPlatform() === "android") {
      const granted = await requestLocationPermission();
      if (!granted) return alert("Location permission is required");
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
    if (!navigator.geolocation)
      return alert("Geolocation is not supported by your browser");
    navigator.geolocation.getCurrentPosition(
      (position) =>
        updateAddress(position.coords.latitude, position.coords.longitude),
      () => alert("Location permission denied"),
    );
  };

  const handleChangeLocation = () => {
  setIsChangingLocation(true);

  setCoords({
    lat: null,
    lng: null,
    address: "",
  });
   if (inputRef.current) {
    inputRef.current.value = "";
  }
  setServiceSearch("");
  setTaskSearch("");
};

  const handleConfirmLocation = async() => {
    const finalLocation = {
      lat: Number(coords.lat),
      lng: Number(coords.lng),
      address: coords.address,
    };
     try {
    const response = await axios.put(
      `${server_url}/api/user/selected-location`,
      finalLocation,
      { withCredentials: true }
    );
    // Redux mein location tab update karo jab request successfully process ho
    dispatch(setSelectedLocation(finalLocation));
    onLocationSelect?.(finalLocation);
  } catch (error) {
    dispatch(setSelectedLocation(finalLocation));
    onLocationSelect?.(finalLocation);
  }
  };

  const closeHireForm = () => {
    setShowHireForm(false);
    setSelectedFixedTask(null);
  };

  return (
    <>
      <div className="container my-2 my-md-4 px-0 fixkar-search">
        <div
          className="bg-white border rounded-4 p-2 p-md-4"
          style={{ maxWidth: "1100px", margin: "0 auto" }}
        >
          <div className="mb-3 mb-md-4">

  {!isChangingLocation &&
  selectedLocation?.lat != null &&
  selectedLocation?.lng != null ? (
    <div className="selected-location-card">

      <div className="selected-location-icon">
        <FaMapMarkerAlt size={20}/>
      </div>

      <div className="selected-location-info">
        <div className="selected-location-label">
          Service location
        </div>

        <div className="selected-location-address">
          {selectedLocation.address || "Selected location"}
        </div>
      </div>

      <button
        type="button"
        className="change-location-btn"
        onClick={handleChangeLocation}
      >
        Change
      </button>

    </div>
  ) : (
    <>
      <div className="location-heading">
        <div>
          <div className="fw-bold text-dark">
            <FaMapMarkerAlt className="text-primary me-2" />
            Where do you need the service?
          </div>

          <small className="text-muted">
            Search your address or use your current location
          </small>
        </div>
      </div>

      <div className="input-group location-input">
        <span className="input-group-text bg-white border-0">
          <FaMapMarkerAlt className="text-primary" />
        </span>

        <input
          ref={inputRef}
          type="text"
          className="form-control border-0 shadow-none"
          placeholder="Search your location"
        />

        <button
          type="button"
          className="btn btn-primary detect-btn"
          onClick={handleUseCurrentLocation}
        >
          <FaLocationArrow className="me-1" />
          Detect
        </button>
      </div>

      {coords.lat != null && coords.lng != null && (
        <div className="location-confirm-area">

          <MapPinDrop
            coords={coords}
            setCoords={setCoords}
          />

          <div className="location-address-preview">
            <FaMapMarkerAlt className="text-primary flex-shrink-0" />

            <span>
              {coords.address || "Updating address..."}
            </span>
          </div>

          <button
            type="button"
            className="btn btn-primary w-100 location-confirm-btn"
            onClick={handleConfirmLocation}
          >
            <FaCheck className="me-2" />
            Confirm location
          </button>

        </div>
      )}
    </>
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
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-light text-primary border rounded-pill px-2 py-2">
                    {filteredServices.length}
                  </span>
                  <button
                    type="button"
                    className="search-icon-btn"
                    onClick={() => {
                      setShowServiceSearch((v) => !v);
                      if (showServiceSearch) setServiceSearch("");
                    }}
                  >
                    {showServiceSearch ? (
                      <FaTimes size={14} />
                    ) : (
                      <FaSearch size={14} />
                    )}
                  </button>
                </div>
              </div>
              {showServiceSearch && (
                <div
                  className="input-group border rounded-3 overflow-hidden mb-2 mb-md-3"
                  style={{ height: 44 }}
                >
                  <span className="input-group-text bg-white border-0 px-3">
                    <FaSearch size={13} />
                  </span>
                  <input
                    autoFocus
                    className="form-control border-0 shadow-none ps-0"
                    placeholder="Search service"
                    value={serviceSearch}
                    onChange={(e) => setServiceSearch(e.target.value)}
                  />
                </div>
              )}
              <div className="service-scroll-area">
                {filteredServices.length ? (
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
                          >
                            <div className="service-icon">
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
                  <div className="text-center py-4">
                    <FaSearch className="text-muted mb-2" />
                    <div className="fw-semibold">No services found</div>
                  </div>
                )}
              </div>
              {selectedServiceId && (
                <div className="mt-3 pt-3 border-top">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div>
                      <h6 className="fw-bold mb-0">Choose a task</h6>
                      <small className="text-muted">
                        Select the exact work you need
                      </small>
                    </div>
                    {serviceSkills.length > 6 && (
                      <button
                        type="button"
                        className="search-icon-btn"
                        onClick={() => setShowTaskSearch((v) => !v)}
                      >
                        {showTaskSearch ? <FaTimes /> : <FaSearch />}
                      </button>
                    )}
                  </div>
                  {showTaskSearch && (
                    <input
                      autoFocus
                      className="form-control mb-2"
                      placeholder="Search task"
                      value={taskSearch}
                      onChange={(e) => setTaskSearch(e.target.value)}
                    />
                  )}
                  <div className="task-list">
                    {filteredTasks.map((skill) => {
                      const price = getTaskPrice(skill);
                      return (
                        <button
                          type="button"
                          key={skill._id}
                          className="task-chip"
                          onClick={() => chooseTask(skill)}
                        >
                          <div className="min-w-0">
                            <div className="fw-semibold text-truncate">
                              {skill.name}
                            </div>
                            <small className="text-muted">
                              {skill.bookingType === "fixed"
                                ? "Fixed price service"
                                : "Professional will quote after inspection"}
                            </small>
                          </div>
                          <div className="d-flex align-items-center gap-1 flex-shrink-0">
                            {price !== null ? (
                              <span className="task-price">₹{price}</span>
                            ) : (
                              <span className="task-inspection">
                                Inspection
                              </span>
                            )}
                            <FaChevronRight size={10} className="text-muted" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {showHireForm && selectedFixedTask && (
        <div className="fixkar-hire-modal" role="dialog" aria-modal="true">
          <div className="fixkar-hire-modal-content">
            <RequestHireForm task={selectedFixedTask} onClose={closeHireForm} />
          </div>
        </div>
      )}
    </>
  );
};
export default SearchSection;

