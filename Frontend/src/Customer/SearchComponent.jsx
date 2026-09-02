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
      <style>{`
      .fixkar-search .search-icon-btn{width:42px;height:42px;display:inline-flex;align-items:center;justify-content:center;border:1px solid #e9ecef;background:#fff;color:#0d6efd;border-radius:12px}
      .fixkar-search .location-input{min-height:50px;border:1px solid #e8edf3!important;box-shadow:0 2px 10px rgba(20,40,70,.05)}
      .fixkar-search .detect-btn{min-width:74px;min-height:40px;margin:3px;border-radius:10px!important;font-size:14px;font-weight:600;padding:5px 8px!important}
      .fixkar-search .service-scroll-area{max-height:310px;overflow-y:auto;overflow-x:hidden;padding:2px}
      .fixkar-search .task-list{display:flex;flex-wrap:wrap;gap:8px;max-height:250px;overflow-y:auto;padding:2px}
      .fixkar-search .task-chip{flex:1 1 230px;min-width:0;border:1px solid #e5e9ef;background:#fff;border-radius:14px;padding:11px 12px;text-align:left;display:flex;align-items:center;justify-content:space-between;gap:10px;transition:.18s ease}
      .fixkar-search .task-chip-active{border-color:#0d6efd;background:#f4f8ff;box-shadow:0 4px 12px rgba(13,110,253,.1)}
      .fixkar-search .task-price{white-space:nowrap;font-size:13px;font-weight:700;color:#198754;background:#eaf7ef;border-radius:8px;padding:5px 8px}
      .fixkar-search .task-inspection{white-space:nowrap;font-size:11px;font-weight:600;color:#6c757d;background:#f1f3f5;border-radius:8px;padding:5px 8px}
      .fixkar-search .service-card{width:100%;min-height:82px;padding:10px;border:1px solid #e7ebf0;border-radius:14px;background:#fff;display:flex;align-items:center;gap:9px;text-align:left}
      .fixkar-search .service-card-active{border-color:#0d6efd;background:#f4f8ff}
      .fixkar-search .service-icon{width:42px;height:42px;min-width:42px;border-radius:11px;overflow:hidden;background:#f1f4f8}
      .fixkar-search .service-icon img{width:100%;height:100%;object-fit:cover}
      .fixkar-search .service-card-content{min-width:0;flex:1}.fixkar-search .service-name{font-size:14px;font-weight:700;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.fixkar-search .service-card-hint{color:#8a94a3;font-size:10px}.fixkar-search .service-check{width:24px;height:24px;min-width:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#f1f3f5;color:#8a94a3}.fixkar-search .service-check-active{background:#0d6efd;color:#fff}
      .fixkar-hire-modal{position:fixed;inset:0;z-index:1060;background:rgba(15,23,42,.58);display:flex;align-items:center;justify-content:center;padding:12px}.fixkar-hire-modal-content{width:min(720px,100%);max-height:94vh;overflow-y:auto;background:#fff;border-radius:18px;box-shadow:0 20px 60px rgba(0,0,0,.25)}
      @media(max-width:575.98px){.fixkar-search .service-scroll-area{max-height:230px}.fixkar-search .service-card{min-height:70px;padding:7px;gap:6px}.fixkar-search .service-icon{width:34px;height:34px;min-width:34px;border-radius:9px}.fixkar-search .service-name{font-size:12px}.fixkar-search .service-card-hint{display:none}.fixkar-search .task-chip{flex-basis:100%;padding:10px}.fixkar-search .detect-btn{min-width:74px;min-height:40px;font-size:14px}.fixkar-search .selected-location-address {
    font-size: 10.5px;
    line-height: 1.35;
  }}
      .fixkar-search .selected-location-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid #e8edf3;
  border-radius: 16px;
  background: #f8fbff;
}

.fixkar-search .selected-location-icon {
  width: 40px;
  height: 40px;
  min-width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: #eaf2ff;
  color: #0d6efd;
}

.fixkar-search .selected-location-info {
  min-width: 0;
  flex: 1;
}

.fixkar-search .selected-location-label {
  font-size: 11px;
  font-weight: 600;
  color: #7b8794;
  margin-bottom: 2px;
}

.fixkar-search .selected-location-address {
  font-size: 11px;
  font-weight: 600;
  line-height: 1.35;
  color: #4b5563;
  white-space: normal;
  overflow: visible;
  word-break: break-word;
}

.fixkar-search .change-location-btn {
  border: 0;
  background: transparent;
  color: #0d6efd;
  font-size: 13px;
  font-weight: 700;
  padding: 7px 4px;
  flex-shrink: 0;
}

.fixkar-search .change-location-btn:hover {
  color: #084298;
}

.fixkar-search .location-confirm-area {
  margin-top: 10px;
}

.fixkar-search .location-address-preview {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 9px;
  padding: 9px 10px;
  border-radius: 10px;
  background: #f8f9fa;
  font-size: 12px;
  line-height: 1.4;
  color: #59636e;
}

.fixkar-search .location-confirm-btn {
  margin-top: 9px;
  border-radius: 12px;
  min-height: 44px;
  font-size: 14px;
  font-weight: 700;
}
      
      `}</style>
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
