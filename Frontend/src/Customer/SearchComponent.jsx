// import React, { useState, useEffect, useRef } from "react";
// import { FaCrosshairs, FaMapMarkerAlt, FaCheck } from "react-icons/fa";
// import useLoadGoogleMaps from "../hooks/useLoadGoogleMap";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   setSelectedLocation,
//   setSelectedService,
//   setSelectedTask,
// } from "../redux/location.slice";
// import MapPinDrop from "./MapPinDrop";
// import useGetServices from "../hooks/useGetServices";
// import axios from "axios";
// import { server_url } from "../App";

// import { Geolocation } from "@capacitor/geolocation";
// import { Capacitor } from "@capacitor/core";
// import { requestLocationPermission } from "../utils/permissionManager.js";
// import RequestHireForm from "./RequestHireForm.jsx";
// import { toast } from "react-toastify";

// const SearchSection = ({
//   onLocationSelect,
//   onServiceSelect,
//   onSkillsChange,
//   onTaskSelect,
//   onlyLocation = false,
// }) => {
//   useGetServices();
//   const { services } = useSelector((state) => state.services);
//   const [showHireForm, setShowHireForm] = useState(false);
//   const googleLoaded = useLoadGoogleMaps();
//   const inputRef = useRef(null);
//   const [coords, setCoords] = useState({
//     lat: null,
//     lng: null,
//     address: "",
//   });
//   const dispatch = useDispatch();
//   const [selectedServiceId, setSelectedServiceId] = useState(null);
//   const [serviceSkills, setServiceSkills] = useState([]);
//   const [selectedFixedTask, setSelectedFixedTask] = useState(null);
//   const [selectedSkills, setSelectedSkills] = useState([]);

//   const { selectedLocation } = useSelector((state) => state.location);
//   const chooseTask = (skill) => {
//     // Pehle har case me selected chip update karo
//     setSelectedSkills([skill._id]);

//     if (onSkillsChange) {
//       onSkillsChange([skill._id]);
//     }

//     dispatch(setSelectedTask(skill));

//     // ================= Fixed Task =================
//     if (skill.bookingType === "fixed") {
//       if (!selectedLocation?.lat) {
//         toast.info("Please confirm your location first.");
//         return;
//       }

//       setSelectedFixedTask(skill);
//       setShowHireForm(true);

//       return;
//     }

//     // ================= Inspection Task =================
//     setSelectedFixedTask(null);
//     setShowHireForm(false);

//     if (onTaskSelect) {
//       onTaskSelect(skill);
//     }
//   };

//   // 🔹 Autocomplete (ONLY initial location)
//   useEffect(() => {
//     if (!googleLoaded || !inputRef.current) return;

//     const autocomplete = new window.google.maps.places.Autocomplete(
//       inputRef.current,
//       {
//         types: ["geocode"],
//         componentRestrictions: { country: "in" },
//       },
//     );

//     autocomplete.addListener("place_changed", () => {
//       const place = autocomplete.getPlace();
//       if (!place.geometry) return;

//       setCoords({
//         lat: place.geometry.location.lat(),
//         lng: place.geometry.location.lng(),
//         address: place.formatted_address,
//       });
//     });
//   }, [googleLoaded]);

//   const handleServiceChange = async (service) => {
//     setSelectedServiceId(service._id);

//     dispatch(setSelectedTask(null));

//     setSelectedSkills([]);

//     if (onSkillsChange) {
//       onSkillsChange([]);
//     }

//     if (onServiceSelect) {
//       onServiceSelect(service._id);
//     }

//     try {
//       const res = await axios.get(
//         `${server_url}/api/user/get-service-skills/${service._id}`,
//         { withCredentials: true },
//       );

//       const completeService = {
//         ...service,
//         skills: res.data.skills || [],
//       };

//       dispatch(setSelectedService(completeService));

//       setServiceSkills(res.data.skills || []);
//     } catch {
//       setServiceSkills([]);

//       dispatch(
//         setSelectedService({
//           ...service,
//           skills: [],
//         }),
//       );
//     }
//   };

//   const updateAddress = (lat, lng) => {
//     if (!window.google) {
//       setCoords({
//         lat,
//         lng,
//         address: "",
//       });

//       return;
//     }

//     const geocoder = new window.google.maps.Geocoder();

//     geocoder.geocode(
//       {
//         location: { lat, lng },
//       },
//       (results, status) => {
//         if (status === "OK" && results[0]) {
//           setCoords({
//             lat,
//             lng,
//             address: results[0].formatted_address,
//           });
//         } else {
//           setCoords({
//             lat,
//             lng,
//             address: "",
//           });
//         }
//       },
//     );
//   };

//   const handleUseCurrentLocation = async () => {
//     if (Capacitor.getPlatform() === "android") {
//       const granted = await requestLocationPermission();

//       if (!granted) {
//         alert("Location permission is required");
//         return;
//       }

//       try {
//         const position = await Geolocation.getCurrentPosition({
//           enableHighAccuracy: true,
//         });

//         const lat = position.coords.latitude;
//         const lng = position.coords.longitude;

//         updateAddress(lat, lng);
//       } catch (err) {
//         console.log(err);
//         alert("Unable to fetch location");
//       }

//       return;
//     }

//     if (!navigator.geolocation) {
//       alert("Geolocation is not supported by your browser");
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const lat = position.coords.latitude;
//         const lng = position.coords.longitude;

//         if (!window.google) {
//           setCoords({ lat, lng, address: "" });
//           return;
//         }

//         const geocoder = new window.google.maps.Geocoder();
//         geocoder.geocode({ location: { lat, lng } }, (results, status) => {
//           if (status === "OK" && results[0]) {
//             setCoords({
//               lat,
//               lng,
//               address: results[0].formatted_address,
//             });
//           } else {
//             setCoords({
//               lat,
//               lng,
//               address: "",
//             });
//           }
//         });
//       },
//       () => {
//         alert("Location permission denied");
//       },
//     );
//   };

//   return (
//     <div className="container my-3">
//       <div
//         className="p-lg-4 p-3 rounded-4 shadow"
//         style={{ background: "rgba(255,255,255,0.9)" }}
//       >
//         {/* Location Input */}
//         <label className="fw-semibold mb-1">
//           <FaMapMarkerAlt className="me-1 text-primary" />
//           Your Location
//         </label>

//         <div className="input-group shadow-sm rounded-pill overflow-hidden">
//           <span className="input-group-text bg-white border-0">
//             <FaMapMarkerAlt className="text-primary" />
//           </span>

//           <input
//             ref={inputRef}
//             type="text"
//             className="form-control border-0"
//             placeholder="Enter your location"
//           />

//           <button
//             type="button"
//             className="btn btn-primary"
//             onClick={handleUseCurrentLocation}
//           >
//             <FaCrosshairs className="me-1" />
//             Detect
//           </button>
//         </div>

//         {/* Map + Confirm */}
//         {coords.lat && coords.lng && (
//           <>
//             <MapPinDrop coords={coords} setCoords={setCoords} />

//             <div className="small text-muted mt-2">
//               📍 {coords.address || "Updating address..."}
//             </div>

//             <button
//               className="btn btn-success w-100 mt-3 rounded-pill"
//               onClick={() => {
//                 const finalLocation = {
//                   lat: Number(coords.lat),
//                   lng: Number(coords.lng),
//                   address: coords.address,
//                 };
//                 dispatch(setSelectedLocation(finalLocation));
//                 if (onLocationSelect) onLocationSelect(finalLocation);
//               }}
//             >
//               Confirm Exact Location
//             </button>
//           </>
//         )}
//         {/* Services */}
//         {!onlyLocation && (
//           <div className="d-flex flex-wrap gap-3 justify-content-center mt-4">
//             {services?.map((srv) => (
//               <button
//                 key={srv._id}
//                 onClick={() => handleServiceChange(srv)}
//                 className={`btn p-2 rounded-4 shadow-sm ${
//                   selectedServiceId === srv._id
//                     ? "btn-primary text-white"
//                     : "btn-light"
//                 }`}
//                 style={{ width: 90 }}
//               >
//                 <img
//                   src={srv.image}
//                   alt={srv.name}
//                   className="rounded-circle mb-1"
//                   style={{ width: 32, height: 32, objectFit: "cover" }}
//                 />
//                 <div className="small fw-semibold">{srv.name}</div>
//               </button>
//             ))}
//           </div>
//         )}
//         {/* 🔥 SKILLS CHECKBOXES */}
//         {!onlyLocation && serviceSkills.length > 0 && (
//           <div className="mt-4">
//             <div className="d-flex align-items-center justify-content-between mb-3">
//               <div>
//                 <h6 className="fw-bold mb-1">Choose your task</h6>
//                 <small className="text-muted">Select one to see the booking options</small>
//               </div>
//               <span className="badge rounded-pill text-primary border border-primary-subtle bg-primary-subtle px-3 py-2">
//                 {serviceSkills.length} options
//               </span>
//             </div>
//             <div className="row g-2">
//               {serviceSkills.map((skill) => {
//                 const active = selectedSkills.includes(skill._id);
//                 const isFixed = skill.bookingType === "fixed";
//                 const priceLabel = isFixed && skill.pricingSource === "admin"
//                   ? `₹${skill.fixedPrice}`
//                   : skill.pricingSource === "professional"
//                     ? "Price after selection"
//                     : "Inspection required";
//                 return (
//                   <div className="col-12 col-sm-6" key={skill._id}>
//                     <button
//                       type="button"
//                       onClick={() => chooseTask(skill)}
//                       className="w-100 text-start border-0 rounded-4 p-3 position-relative"
//                       style={{
//                         minHeight: "106px",
//                         background: active
//                           ? "linear-gradient(135deg,#2563eb,#7c3aed)"
//                           : "linear-gradient(145deg,#ffffff,#f5f8ff)",
//                         color: active ? "#fff" : "#172554",
//                         boxShadow: active
//                           ? "0 10px 24px rgba(79,70,229,.28)"
//                           : "0 4px 14px rgba(37,99,235,.09)",
//                         outline: active ? "2px solid #c4b5fd" : "1px solid #dbeafe",
//                         transition: "transform .2s ease, box-shadow .2s ease",
//                       }}
//                     >
//                       <div className="d-flex align-items-start justify-content-between gap-2">
//                         <div>
//                           <div className="fw-bold">{skill.name}</div>
//                           <small className={active ? "text-white-50" : "text-muted"}>
//                             {isFixed ? "Fixed-price service" : "Professional inspection"}
//                           </small>
//                         </div>
//                         <span className={`rounded-circle d-inline-flex align-items-center justify-content-center ${active ? "bg-white text-primary" : "bg-primary-subtle text-primary"}`} style={{ width: 28, height: 28 }}>
//                           {active ? <FaCheck size={12} /> : "→"}
//                         </span>
//                       </div>
//                       <div className={`small fw-semibold mt-3 ${active ? "text-white" : "text-primary"}`}>{priceLabel}</div>
//                     </button>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {selectedFixedTask && showHireForm && (
//           <div className="mt-3 p-2">
//             <RequestHireForm
//               task={selectedFixedTask}
//               onClose={() => {
//                 setShowHireForm(false);
//                 setSelectedFixedTask(null);
//               }}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SearchSection;

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FaCrosshairs,
  FaMapMarkerAlt,
  FaCheck,
  FaSearch,
  FaTimes,
  FaChevronRight,
  FaClock,
  FaTag,
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

  // -----------------------------
  // Location State
  // -----------------------------
  const [coords, setCoords] = useState({
    lat: null,
    lng: null,
    address: "",
  });

  // -----------------------------
  // Service / Task State
  // -----------------------------
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [serviceSkills, setServiceSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);

  // -----------------------------
  // Booking Form State
  // -----------------------------
  const [selectedFixedTask, setSelectedFixedTask] = useState(null);
  const [showHireForm, setShowHireForm] = useState(false);

  // -----------------------------
  // Search State
  // -----------------------------
  const [taskSearch, setTaskSearch] = useState("");

  // =========================================================
  // TASK SEARCH
  // =========================================================

  const filteredTasks = useMemo(() => {
    const query = taskSearch.trim().toLowerCase();

    if (!query) {
      return serviceSkills;
    }

    return serviceSkills.filter((skill) =>
      skill.name?.toLowerCase().includes(query)
    );
  }, [serviceSkills, taskSearch]);

  // =========================================================
  // SELECT TASK
  // =========================================================

  const chooseTask = (skill) => {
    // Location is required before booking
    if (!selectedLocation?.lat) {
      toast.info("Please confirm your location first.");
      return;
    }

    setSelectedSkills([skill._id]);

    if (onSkillsChange) {
      onSkillsChange([skill._id]);
    }

    dispatch(setSelectedTask(skill));

    // -----------------------------------------
    // Fixed Price Task
    // -----------------------------------------
    if (skill.bookingType === "fixed") {
      setSelectedFixedTask(skill);
      setShowHireForm(true);
      return;
    }

    // -----------------------------------------
    // Inspection / Professional Pricing Task
    // -----------------------------------------
    setSelectedFixedTask(null);
    setShowHireForm(false);

    if (onTaskSelect) {
      onTaskSelect(skill);
    }
  };

  // =========================================================
  // GOOGLE AUTOCOMPLETE
  // =========================================================

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

  // =========================================================
  // SERVICE CHANGE
  // =========================================================

  const handleServiceChange = async (service) => {
    setSelectedServiceId(service._id);

    // Reset previous task selection
    dispatch(setSelectedTask(null));
    setSelectedSkills([]);
    setSelectedFixedTask(null);
    setShowHireForm(false);

    // Reset task search
    setTaskSearch("");

    if (onSkillsChange) {
      onSkillsChange([]);
    }

    if (onServiceSelect) {
      onServiceSelect(service._id);
    }

    try {
      const res = await axios.get(
        `${server_url}/api/user/get-service-skills/${service._id}`,
        {
          withCredentials: true,
        }
      );

      const skills = res.data.skills || [];

      const completeService = {
        ...service,
        skills,
      };

      dispatch(setSelectedService(completeService));
      setServiceSkills(skills);
    } catch (error) {
      console.log(error);

      setServiceSkills([]);

      dispatch(
        setSelectedService({
          ...service,
          skills: [],
        })
      );

      toast.error("Unable to load tasks for this service.");
    }
  };

  // =========================================================
  // UPDATE ADDRESS
  // =========================================================

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
      }
    );
  };

  // =========================================================
  // CURRENT LOCATION
  // =========================================================

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
          }
        );
      },
      () => {
        alert("Location permission denied");
      }
    );
  };

  // =========================================================
  // CONFIRM LOCATION
  // =========================================================

  const handleConfirmLocation = () => {
    const finalLocation = {
      lat: Number(coords.lat),
      lng: Number(coords.lng),
      address: coords.address,
    };

    dispatch(setSelectedLocation(finalLocation));

    if (onLocationSelect) {
      onLocationSelect(finalLocation);
    }

    toast.success("Location confirmed");
  };

  // =========================================================
  // CLOSE HIRE FORM
  // =========================================================

  const closeHireForm = () => {
    setShowHireForm(false);
    setSelectedFixedTask(null);
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <>
      <div className="container my-3 my-md-4">
        <div
          className="bg-white border rounded-4 p-3 p-md-4"
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          {/* =================================================
              LOCATION
          ================================================= */}

          <div className="mb-4">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <div>
                <div className="fw-bold text-dark">
                  <FaMapMarkerAlt className="text-primary me-2" />
                  Service Location
                </div>

                <small className="text-muted">
                  Where do you need the service?
                </small>
              </div>

              {selectedLocation?.lat && (
                <span className="badge rounded-pill bg-success-subtle text-success px-3 py-2">
                  <FaCheck size={11} className="me-1" />
                  Confirmed
                </span>
              )}
            </div>

            <div className="input-group border rounded-3 overflow-hidden">
              <span className="input-group-text bg-white border-0">
                <FaMapMarkerAlt className="text-primary" />
              </span>

              <input
                ref={inputRef}
                type="text"
                className="form-control border-0 shadow-none"
                placeholder="Enter your location"
              />

              <button
                type="button"
                className="btn btn-light border-0 px-3"
                onClick={handleUseCurrentLocation}
              >
                <FaCrosshairs className="text-primary me-1" />
                <span className="d-none d-sm-inline">Detect</span>
              </button>
            </div>

            {/* Map */}
            {coords.lat && coords.lng && (
              <div className="mt-3">
                <MapPinDrop
                  coords={coords}
                  setCoords={setCoords}
                />

                <div className="d-flex align-items-start gap-2 mt-2 small text-muted">
                  <FaMapMarkerAlt className="text-primary mt-1" />

                  <span>
                    {coords.address || "Updating address..."}
                  </span>
                </div>

                <button
                  type="button"
                  className={`btn ${
                    selectedLocation?.lat ? "btn-outline-success" : "btn-primary"
                  } w-100 rounded-3 mt-3`}
                  onClick={handleConfirmLocation}
                >
                  <FaCheck className="me-2" />

                  {selectedLocation?.lat
                    ? "Location Confirmed"
                    : "Confirm Exact Location"}
                </button>
              </div>
            )}
          </div>

          {/* =================================================
              SERVICE SECTION
          ================================================= */}

          {!onlyLocation && (
            <>
              <div className="border-top pt-4">
                <div className="mb-3">
                  <h6 className="fw-bold mb-1">Choose a service</h6>

                  <small className="text-muted">
                    Select the type of professional you need
                  </small>
                </div>

                {/* Service Horizontal List */}
                <div
                  className="d-flex gap-2 pb-2"
                  style={{
                    overflowX: "auto",
                    scrollbarWidth: "thin",
                  }}
                >
                  {services?.map((service) => {
                    const active = selectedServiceId === service._id;

                    return (
                      <button
                        key={service._id}
                        type="button"
                        onClick={() => handleServiceChange(service)}
                        className="btn flex-shrink-0 text-start"
                        style={{
                          width: "145px",
                          borderRadius: "12px",
                          border: active
                            ? "2px solid #0d6efd"
                            : "1px solid #dee2e6",
                          background: active ? "#eff6ff" : "#fff",
                          padding: "10px",
                          transition: "all .15s ease",
                        }}
                      >
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src={service.image}
                            alt={service.name}
                            style={{
                              width: "38px",
                              height: "38px",
                              objectFit: "cover",
                              borderRadius: "10px",
                            }}
                          />

                          <div className="flex-grow-1 min-w-0">
                            <div
                              className={`small fw-semibold text-truncate ${
                                active ? "text-primary" : "text-dark"
                              }`}
                            >
                              {service.name}
                            </div>

                            <small className="text-muted">
                              {active ? "Selected" : "View tasks"}
                            </small>
                          </div>

                          {active && (
                            <FaCheck
                              size={12}
                              className="text-primary flex-shrink-0"
                            />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* =================================================
                  TASK SECTION
              ================================================= */}

              {serviceSkills.length > 0 && (
                <div className="border-top mt-4 pt-4">
                  <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-3">
                    <div>
                      <h6 className="fw-bold mb-1">
                        Choose a task
                      </h6>

                      <small className="text-muted">
                        Select the exact work you need
                      </small>
                    </div>

                    {/* Task Search */}
                    <div
                      className="input-group border rounded-3 overflow-hidden"
                      style={{
                        maxWidth: "320px",
                        height: "42px",
                      }}
                    >
                      <span className="input-group-text bg-white border-0">
                        <FaSearch
                          size={13}
                          className="text-muted"
                        />
                      </span>

                      <input
                        type="text"
                        className="form-control border-0 shadow-none ps-0"
                        placeholder="Search task..."
                        value={taskSearch}
                        onChange={(e) => setTaskSearch(e.target.value)}
                      />

                      {taskSearch && (
                        <button
                          type="button"
                          className="btn bg-white border-0"
                          onClick={() => setTaskSearch("")}
                        >
                          <FaTimes
                            size={13}
                            className="text-muted"
                          />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Task Count */}
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <small className="text-muted">
                      {filteredTasks.length}{" "}
                      {filteredTasks.length === 1
                        ? "task"
                        : "tasks"}{" "}
                      available
                    </small>

                    {taskSearch && (
                      <small className="text-primary">
                        Searching for "{taskSearch}"
                      </small>
                    )}
                  </div>

                  {/* Task List */}
                  {filteredTasks.length > 0 ? (
                    <div className="row g-2">
                      {filteredTasks.map((skill) => {
                        const active = selectedSkills.includes(
                          skill._id
                        );

                        const isFixed =
                          skill.bookingType === "fixed";

                        const priceLabel =
                          isFixed &&
                          skill.pricingSource === "admin"
                            ? `₹${skill.fixedPrice}`
                            : skill.pricingSource ===
                              "professional"
                            ? "Price after selection"
                            : "Inspection required";

                        return (
                          <div
                            className="col-12 col-md-6"
                            key={skill._id}
                          >
                            <button
                              type="button"
                              onClick={() => chooseTask(skill)}
                              className="w-100 text-start bg-white"
                              style={{
                                border: active
                                  ? "2px solid #0d6efd"
                                  : "1px solid #dee2e6",
                                borderRadius: "12px",
                                padding: "12px 14px",
                                transition: "all .15s ease",
                                minHeight: "76px",
                              }}
                            >
                              <div className="d-flex align-items-center gap-3">
                                {/* Icon */}
                                <div
                                  className="d-flex align-items-center justify-content-center flex-shrink-0"
                                  style={{
                                    width: "38px",
                                    height: "38px",
                                    borderRadius: "10px",
                                    background: active
                                      ? "#0d6efd"
                                      : "#f1f5f9",
                                    color: active
                                      ? "#fff"
                                      : "#0d6efd",
                                  }}
                                >
                                  {active ? (
                                    <FaCheck size={13} />
                                  ) : (
                                    <FaChevronRight size={12} />
                                  )}
                                </div>

                                {/* Task Details */}
                                <div className="flex-grow-1 min-w-0">
                                  <div
                                    className={`fw-semibold text-truncate ${
                                      active
                                        ? "text-primary"
                                        : "text-dark"
                                    }`}
                                  >
                                    {skill.name}
                                  </div>

                                  <div className="d-flex flex-wrap gap-2 mt-1">
                                    <small className="text-muted">
                                      <FaTag
                                        size={9}
                                        className="me-1"
                                      />

                                      {isFixed
                                        ? "Fixed price"
                                        : "Inspection"}
                                    </small>

                                    <small
                                      className={
                                        active
                                          ? "text-primary"
                                          : "text-muted"
                                      }
                                    >
                                      {priceLabel}
                                    </small>
                                  </div>
                                </div>

                                <FaChevronRight
                                  size={11}
                                  className={
                                    active
                                      ? "text-primary"
                                      : "text-muted"
                                  }
                                />
                              </div>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* No Search Results */
                    <div className="text-center border rounded-3 py-4 px-3">
                      <FaSearch
                        size={20}
                        className="text-muted mb-2"
                      />

                      <div className="fw-semibold">
                        No tasks found
                      </div>

                      <small className="text-muted">
                        Try searching with another task name.
                      </small>

                      <div>
                        <button
                          type="button"
                          className="btn btn-sm btn-link text-decoration-none mt-1"
                          onClick={() => setTaskSearch("")}
                        >
                          Clear search
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* =================================================
                  SELECTED TASK SUMMARY
              ================================================= */}

              {selectedFixedTask && !showHireForm && (
                <div className="mt-3 border rounded-3 p-3 bg-light">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <small className="text-muted">
                        Selected task
                      </small>

                      <div className="fw-semibold">
                        {selectedFixedTask.name}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary btn-sm rounded-3"
                      onClick={() => setShowHireForm(true)}
                    >
                      Continue
                      <FaChevronRight
                        size={10}
                        className="ms-2"
                      />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* =====================================================
          HIRE FORM MODAL
      ===================================================== */}

      {showHireForm && selectedFixedTask && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            zIndex: 1055,
            background: "rgba(0, 0, 0, 0.45)",
            padding: "15px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeHireForm();
            }
          }}
        >
          <div
            className="bg-white rounded-4 shadow-lg w-100"
            style={{
              maxWidth: "720px",
              maxHeight: "92vh",
              overflowY: "auto",
            }}
          >
            {/* Modal Header */}
            <div
              className="d-flex align-items-center justify-content-between border-bottom p-3 p-md-4"
              style={{
                position: "sticky",
                top: 0,
                background: "#fff",
                zIndex: 2,
              }}
            >
              <div>
                <small className="text-primary fw-semibold">
                  BOOK SERVICE
                </small>

                <h5 className="fw-bold mb-0 mt-1">
                  {selectedFixedTask.name}
                </h5>
              </div>

              <button
                type="button"
                className="btn btn-light rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: "36px",
                  height: "36px",
                }}
                onClick={closeHireForm}
              >
                <FaTimes size={14} />
              </button>
            </div>

            {/* Form */}
            <div className="p-2 p-md-3">
              <RequestHireForm
                task={selectedFixedTask}
                onClose={closeHireForm}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchSection;

