
import React, { useRef, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/onboarding.css";
import axios from "axios";
import { server_url } from "../App.jsx";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import useLoadGoogleMaps from "../hooks/useLoadGoogleMap";
import { FaCamera, FaIdCard, FaUserCheck } from "react-icons/fa6";
import { FaBirthdayCake, FaInfoCircle, FaMapMarkerAlt } from "react-icons/fa";
import { MdWork } from "react-icons/md";
import { useSelector } from "react-redux";
import useGetServices from "../hooks/useGetServices.jsx";

const Onboarding = ({ userData }) => {
  useGetServices()
  const [loading, setLoading] = useState(false);
  const {services} = useSelector(state=> state.services)
  const navigate = useNavigate();
  const googleLoaded = useLoadGoogleMaps(); // ✅ Google script load status
  const addressInputRef = useRef(null);
  const [isCustomService, setIsCustomService] = useState(false);

   const [latLng, setLatLng] = useState({ lat: null, lng: null });

  // Date Validation
  const today = new Date();
  const maxDate = `${today.getFullYear() - 18}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const validationSchema = Yup.object({
    dob: Yup.date()
      .required("Date of Birth is required")
      .max(new Date(maxDate), "You must be at least 18 years old"),
    address: Yup.string().required("Address is required"),
  profession: Yup.string().when([], {
  is: () => !isCustomService,
  then: (schema) => schema.required("Please select a profession"),
  otherwise: (schema) => schema.notRequired(),
}),

serviceName: Yup.string().when([], {
  is: () => isCustomService,
  then: (schema) =>
    schema
      .required("Service name is required")
      .max(100, "Service name is too long"),
  otherwise: (schema) => schema.notRequired(),
}),

description: Yup.string().when([], {
  is: () => isCustomService,
  then: (schema) =>
    schema
      .required("Service description is required")
      .max(500, "Description is too long"),
  otherwise: (schema) => schema.notRequired(),
}),
    profilePicture: Yup.mixed().required("Profile picture is required"),
    poiFront: Yup.mixed()
    .required("Front side of ID proof is required"),

    poiBack: Yup.mixed()
      .required("Back side of ID proof is required"),
    });

  const formik = useFormik({
    initialValues: {
      dob: "",
      address: "",
      profession: "",
      serviceName: "",
      description: "",
      profilePicture: null,
      poiFront: null,
      poiBack : null
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        if(!latLng.lat || !latLng.lng){
           toast.error("Please select a valid address from suggestions.");
          return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("dob", values.dob);
        formData.append("address", values.address);
        formData.append("profession", values.profession);
        formData.append("serviceName", values.serviceName);
        formData.append("description", values.description);
        formData.append("profilePicture", values.profilePicture);
        formData.append("poiFront", values.poiFront);
        formData.append("poiBack", values.poiBack);
        formData.append("lat", latLng.lat);
        formData.append("lng", latLng.lng);


        const response = await axios.post(
          `${server_url}/api/user/onboard`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
        );

        if (response.data.success) {
          toast.success("Onboarding completed successfully!");
          resetForm();
          navigate("/application/pending");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    },
  });

  // ✅ Initialize Autocomplete on Address Input
 useEffect(() => {
  if (!googleLoaded || !addressInputRef.current) return;

  const autocomplete = new window.google.maps.places.Autocomplete(
    addressInputRef.current,
    {
      fields: ["formatted_address", "geometry"],
      componentRestrictions: { country: "in" },
    }
  );

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();

    if (!place.geometry) {
      toast.error("Please select address from suggestions only.");
      return;
    }

    const formattedAddress = place.formatted_address;
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    // ✅ Set address in formik
    formik.setFieldValue("address", formattedAddress);

    // ✅ Save coordinates to state for backend
    setLatLng({ lat, lng });
  });

}, [googleLoaded]);


 return (
  <>
    <div className="fixkar-onboarding">

      {/* ================= DECORATIVE BACKGROUND ================= */}
      <div className="fixkar-onboarding-bg" aria-hidden="true">
        <span className="onboard-orb onboard-orb-1"></span>
        <span className="onboard-orb onboard-orb-2"></span>
        <span className="onboard-orb onboard-orb-3"></span>
        <div className="onboard-grid"></div>
      </div>

      <div className="container position-relative py-3 py-md-4">

        {/* ================= TOP INTRO ================= */}
        <div className="row justify-content-center mb-3 mb-md-4">
          <div className="col-12 col-xl-11">

            <div className="onboard-hero">

              <div className="d-flex align-items-center gap-3">

                <div className="onboard-hero-icon">
                  <FaUserCheck />
                </div>

                <div className="flex-grow-1 min-w-0">

                  <div className="d-flex align-items-center gap-2 flex-wrap mb-1">

                    <h4 className="mb-0 fw-bold">
                      Welcome,{" "}
                      {userData?.user?.userId?.fullName ||
                        "Professional"}
                    </h4>

                    <span className="badge rounded-pill onboard-status">
                      <span className="onboard-status-dot"></span>
                      Professional Onboarding
                    </span>

                  </div>

                  <p className="mb-0">
                    Complete your profile carefully to start receiving
                    customer requests.
                  </p>

                </div>

              </div>

            </div>

          </div>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="row justify-content-center">

          <div className="col-12 col-xl-11">

            <div className="onboard-main-card">

              {/* ================= TOP PROGRESS ================= */}
              <div className="onboard-progress-wrap">

                <div className="d-flex align-items-center justify-content-between mb-2">

                  <div>
                    <span className="onboard-eyebrow">
                      PROFILE SETUP
                    </span>

                    <h5 className="mb-0 fw-bold">
                      Tell us about yourself
                    </h5>
                  </div>

                  <span className="onboard-progress-label">
                    Step 1 of 1
                  </span>

                </div>

                <div className="progress onboard-progress">
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: "100%" }}
                  />
                </div>

              </div>

              {/* ================= FORM ================= */}
              <form
                onSubmit={formik.handleSubmit}
                encType="multipart/form-data"
                className="onboard-form"
              >

                <div className="row g-3 g-lg-4">

                  {/* ==================================================
                      BASIC INFORMATION
                  ================================================== */}
                  <div className="col-12 col-lg-6">

                    <div className="onboard-section h-100">

                      <div className="onboard-section-head">

                        <div className="onboard-section-icon blue">
                          <FaBirthdayCake />
                        </div>

                        <div>
                          <h6 className="mb-0 fw-bold">
                            Basic Information
                          </h6>

                          <small>
                            Tell us about your age and profession.
                          </small>
                        </div>

                      </div>

                      {/* DOB */}
                      <div className="onboard-field">

                        <label className="onboard-label">
                          Date of Birth
                          <span className="required-star">*</span>
                        </label>

                        <div className="onboard-input-wrap">

                          <FaBirthdayCake />

                          <input
                            type="date"
                            name="dob"
                            max={maxDate}
                            value={formik.values.dob}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="form-control"
                          />

                        </div>

                        <div className="onboard-helper">
                          <FaInfoCircle />
                          You must be at least 18 years old.
                        </div>

                        {formik.touched.dob &&
                          formik.errors.dob && (
                            <div className="onboard-error">
                              {formik.errors.dob}
                            </div>
                          )}

                      </div>

                      {/* PROFESSION */}
                      <div className="onboard-field mb-0">

                        <label className="onboard-label">
                          Profession
                          <span className="required-star">*</span>
                        </label>
                    {!isCustomService ? (
                      <>
                        <div className="onboard-input-wrap">

                          <MdWork />

                          <select
                            name="profession"
                            className="form-select"
                            value={formik.values.profession}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          >
                            <option value="">
                              Select your profession
                            </option>

                            {services?.map((srv) => (
                              <option
                                value={srv._id}
                                key={srv._id}
                              >
                                {srv.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="onboard-helper">
                          <FaInfoCircle />
                          Choose the service you are skilled in.
                        </div>
                        {formik.touched.profession &&
                          formik.errors.profession && (
                            <div className="onboard-error">
                              {formik.errors.profession}
                            </div>
                          )}
                            <button
                              type="button"
                              className="custom-service-trigger"
                              onClick={() => {
                                setIsCustomService(true);
                                formik.setFieldValue("profession", "");
                              }}
                            >
                              Can't find your service? <span>Add your service</span>
                            </button>
                          </>
                        ) : (
                          <>
                           <div className="custom-service-form">
  <div className="custom-service-header">
    <div>
      <span className="custom-service-eyebrow">
        SERVICE NOT LISTED?
      </span>

      <h3>Tell us what service you provide</h3>

      <p>
        Don't worry if you can't find your service. Tell us about it and
        our team will review your request.
      </p>
    </div>

    <button
      type="button"
      className="custom-service-back"
      onClick={() => {
        setIsCustomService(false);
        formik.setFieldValue("serviceName", "");
        formik.setFieldValue("description", "");
      }}
    >
      ← Choose from list
    </button>
  </div>

  <div className="custom-service-fields">

    {/* Service Name */}
    <div className="custom-service-field">
      <label htmlFor="serviceName">
        Service Name
        <span>*</span>
      </label>

      <input
        type="text"
        id="serviceName"
        name="serviceName"
        placeholder="e.g. AC Repair, Home Painting, RO Service"
        value={formik.values.serviceName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />

      {formik.touched.serviceName &&
        formik.errors.serviceName && (
          <small className="custom-service-error">
            {formik.errors.serviceName}
          </small>
        )}
    </div>

    {/* Description */}
    <div className="custom-service-field">
      <label htmlFor="description">
        Describe Your Service
        <span>*</span>
      </label>

      <textarea
        id="description"
        name="description"
        rows={5}
        maxLength={500}
        placeholder="Briefly explain what service you provide, what kind of work you handle, and what customers can expect..."
        value={formik.values.description}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />

      <div className="custom-service-description-footer">
        <span>
          {formik.values.description?.length || 0}/500
        </span>
      </div>

      {formik.touched.description &&
        formik.errors.description && (
          <small className="custom-service-error">
            {formik.errors.description}
          </small>
        )}
    </div>

  </div>

  <div className="custom-service-info">
    <span>ⓘ</span>
    <p>
      Your service request will be reviewed by the Fixkar team.
      You can continue with your onboarding while we review it.
    </p>
  </div>
</div>

                          </>
                        )}

                      </div>

                    </div>

                  </div>

                  {/* ==================================================
                      LOCATION
                  ================================================== */}
                  <div className="col-12 col-lg-6">

                    <div className="onboard-section h-100">

                      <div className="onboard-section-head">

                        <div className="onboard-section-icon purple">
                          <FaMapMarkerAlt />
                        </div>

                        <div>
                          <h6 className="mb-0 fw-bold">
                            Service Location
                          </h6>

                          <small>
                            Tell customers where you provide services.
                          </small>
                        </div>

                      </div>

                      <div className="onboard-field mb-0">

                        <label className="onboard-label">
                          Full Address
                          <span className="required-star">*</span>
                        </label>

                        <div className="onboard-input-wrap">

                          <FaMapMarkerAlt />

                          <input
                            type="text"
                            ref={addressInputRef}
                            name="address"
                            placeholder="Start typing your address..."
                            value={formik.values.address}
                            onChange={(e) => {
                              formik.handleChange(e);

                              // Existing architecture/logic remains intact.
                              // Coordinates are still populated only through
                              // Google Places selection.
                              setLatLng({
                                lat: null,
                                lng: null,
                              });
                            }}
                            onBlur={formik.handleBlur}
                            className="form-control"
                          />

                        </div>

                        <div className="onboard-location-tip">

                          <div className="location-tip-icon">
                            <FaMapMarkerAlt />
                          </div>

                          <div>
                            <strong>
                              Select from Google suggestions
                            </strong>

                            <small>
                              This helps Fixkar find nearby customers
                              and accurately locate your service area.
                            </small>
                          </div>

                        </div>

                        {latLng.lat && latLng.lng ? (
                          <div className="onboard-location-success">
                            <span>
                              <FaUserCheck />
                            </span>

                            <div>
                              <strong>
                                Location selected
                              </strong>

                              <small>
                                Your service location has been detected
                                successfully.
                              </small>
                            </div>
                          </div>
                        ) : (
                          <div className="onboard-helper">
                            <FaInfoCircle />
                            Do not type a random address. Select a
                            suggestion from the dropdown.
                          </div>
                        )}

                        {formik.touched.address &&
                          formik.errors.address && (
                            <div className="onboard-error">
                              {formik.errors.address}
                            </div>
                          )}

                      </div>

                    </div>

                  </div>

                  {/* ==================================================
                      PROFILE PHOTO
                  ================================================== */}
                  <div className="col-12 col-lg-6">

                    <div className="onboard-section">

                      <div className="onboard-section-head">

                        <div className="onboard-section-icon green">
                          <FaCamera />
                        </div>

                        <div>
                          <h6 className="mb-0 fw-bold">
                            Profile Photo
                          </h6>

                          <small>
                            Help customers recognise you easily.
                          </small>
                        </div>

                      </div>

                      <div className="onboard-upload-card">

                        <input
                          type="file"
                          id="profilePicture"
                          accept="image/*"
                          hidden
                          onChange={(e) =>
                            formik.setFieldValue(
                              "profilePicture",
                              e.target.files[0]
                            )
                          }
                        />

                        <label
                          htmlFor="profilePicture"
                          className="onboard-upload-zone"
                        >

                          {formik.values.profilePicture ? (
                            <div className="onboard-profile-preview">

                              <img
                                src={URL.createObjectURL(
                                  formik.values.profilePicture
                                )}
                                alt="Profile Preview"
                              />

                              <div className="profile-preview-overlay">
                                <FaCamera />
                                <span>
                                  Change photo
                                </span>
                              </div>

                            </div>
                          ) : (
                            <>
                              <div className="upload-zone-icon">
                                <FaCamera />
                              </div>

                              <strong>
                                Upload your profile photo
                              </strong>

                              <small>
                                Tap here to choose an image
                              </small>
                            </>
                          )}

                        </label>

                        <div className="onboard-instruction">

                          <div className="instruction-icon">
                            <FaInfoCircle />
                          </div>

                          <div>
                            <strong>
                              Photo guidelines
                            </strong>

                            <ul>
                              <li>Use a clear front-facing photo.</li>
                              <li>Face should be clearly visible.</li>
                              <li>Avoid sunglasses or heavy blur.</li>
                              <li>Use a recent photo of yourself.</li>
                            </ul>
                          </div>

                        </div>

                      </div>

                      {formik.touched.profilePicture &&
                        formik.errors.profilePicture && (
                          <div className="onboard-error">
                            {formik.errors.profilePicture}
                          </div>
                        )}

                    </div>

                  </div>

                  {/* ==================================================
                      IDENTITY PROOF
                  ================================================== */}
                {/* ==================================================
    IDENTITY PROOF
================================================== */}
<div className="col-12 col-lg-6">

  <div className="onboard-section">

    <div className="onboard-section-head">

      <div className="onboard-section-icon orange">
        <FaIdCard />
      </div>

      <div>
        <h6 className="mb-0 fw-bold">
          Identity Verification
        </h6>

        <small>
          Upload both sides of your government ID.
        </small>
      </div>

    </div>


    <div className="onboard-upload-card poi-upload-card">

      {/* ================= FRONT ================= */}

      <div className="poi-side-block">

        <div className="poi-side-header">
          <div>
            <strong>Front Side</strong>
            <small>
              Upload the front of your ID
            </small>
          </div>

          <span className="poi-required">
            Required
          </span>
        </div>

        <input
          type="file"
          id="poiFront"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (file) {
              formik.setFieldValue("poiFront", file);
            }
          }}
        />

        <label
          htmlFor="poiFront"
          className={`poi-upload-zone ${
            formik.values.poiFront
              ? "has-file"
              : ""
          }`}
        >

          {formik.values.poiFront ? (
            <div className="poi-preview-modern">

              <img
                src={URL.createObjectURL(
                  formik.values.poiFront
                )}
                alt="ID front preview"
              />

              <div className="poi-preview-overlay">
                <FaCamera />
                <span>Change image</span>
              </div>

            </div>
          ) : (
            <div className="poi-empty-state">

              <div className="poi-upload-icon">
                <FaIdCard />
              </div>

              <strong>
                Upload front side
              </strong>

              <small>
                JPG, PNG or WEBP
              </small>

            </div>
          )}

        </label>

        {formik.values.poiFront && (
          <div className="poi-file-meta">

            <FaIdCard />

            <div>
              <strong>
                Front side selected
              </strong>

              <span>
                {formik.values.poiFront.name}
              </span>
            </div>

            <span className="poi-check">
              ✓
            </span>

          </div>
        )}

      </div>


      {/* ================= BACK ================= */}

      <div className="poi-side-block">

        <div className="poi-side-header">
          <div>
            <strong>Back Side</strong>
            <small>
              Upload the back of your ID
            </small>
          </div>

          <span className="poi-required">
            Required
          </span>
        </div>

        <input
          type="file"
          id="poiBack"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (file) {
              formik.setFieldValue("poiBack", file);
            }
          }}
        />

        <label
          htmlFor="poiBack"
          className={`poi-upload-zone ${
            formik.values.poiBack
              ? "has-file"
              : ""
          }`}
        >

          {formik.values.poiBack ? (
            <div className="poi-preview-modern">

              <img
                src={URL.createObjectURL(
                  formik.values.poiBack
                )}
                alt="ID back preview"
              />

              <div className="poi-preview-overlay">
                <FaCamera />
                <span>Change image</span>
              </div>

            </div>
          ) : (
            <div className="poi-empty-state">

              <div className="poi-upload-icon">
                <FaIdCard />
              </div>

              <strong>
                Upload back side
              </strong>

              <small>
                JPG, PNG or WEBP
              </small>

            </div>
          )}

        </label>

        {formik.values.poiBack && (
          <div className="poi-file-meta">

            <FaIdCard />

            <div>
              <strong>
                Back side selected
              </strong>

              <span>
                {formik.values.poiBack.name}
              </span>
            </div>

            <span className="poi-check">
              ✓
            </span>

          </div>
        )}

      </div>


      {/* ================= GUIDELINE ================= */}

      <div className="onboard-instruction warning poi-guideline">

        <div className="instruction-icon">
          <FaInfoCircle />
        </div>

        <div>
          <strong>
            Identity document guidelines
          </strong>

          <ul>
            <li>
              Upload clear and readable images.
            </li>

            <li>
              Make sure all important details are visible.
            </li>

            <li>
              Upload both front and back sides.
            </li>

            <li>
              Avoid glare, blur and cropped edges.
            </li>
          </ul>
        </div>

      </div>

    </div>


    {/* FRONT ERROR */}

    {formik.touched.poiFront &&
      formik.errors.poiFront && (
        <div className="onboard-error">
          {formik.errors.poiFront}
        </div>
      )}


    {/* BACK ERROR */}

    {formik.touched.poiBack &&
      formik.errors.poiBack && (
        <div className="onboard-error">
          {formik.errors.poiBack}
        </div>
      )}
  </div>
</div>

                </div>

                {/* ==================================================
                    FINAL NOTE
                ================================================== */}
                <div className="onboard-final-note">

                  <div className="final-note-icon">
                    <FaUserCheck />
                  </div>

                  <div>
                    <strong>
                      Almost there!
                    </strong>

                    <span>
                      Make sure all information and documents are
                      correct before submitting. Your details will be
                      reviewed during the professional verification process.
                    </span>
                  </div>

                </div>

                {/* ================= SUBMIT ================= */}

                <div className="onboard-submit-area">

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn onboard-submit-btn"
                  >
                    {loading ? (
                      <>
                        <ClipLoader
                          size={18}
                          color="#fff"
                        />

                        <span>
                          Submitting...
                        </span>
                      </>
                    ) : (
                      <>
                        <FaUserCheck />

                        <span>
                          Complete Onboarding
                        </span>

                        <span className="submit-arrow">
                          →
                        </span>
                      </>
                    )}
                  </button>

                  <small>
                    By submitting, you confirm that the information
                    provided is accurate.
                  </small>

                </div>

              </form>

            </div>

          </div>

        </div>

      </div>

      <ToastContainer />

    </div>
  </>
);
};

export default Onboarding;

