
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
    profession: Yup.string().required("Please select your profession"),
    profilePicture: Yup.mixed().required("Profile picture is required"),
    poi: Yup.mixed().required("Proof of identity is required"),
  });

  const formik = useFormik({
    initialValues: {
      dob: "",
      address: "",
      profession: "",
      profilePicture: null,
      poi: null,
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
        formData.append("profilePicture", values.profilePicture);
        formData.append("poi", values.poi);
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
<div className="mt-5">

  <div className="card border-0 rounded-4 shadow overflow-hidden">

  {/* ===== Header ===== */}
  <div
    className="p-4 text-white"
    style={{
      background: "linear-gradient(135deg, #0d6efd, #6ea8fe)",
    }}
  >
    <div className="d-flex align-items-center gap-3">
      <FaUserCheck size={36} />
      <div>
        <h4 className="mb-0 fw-bold">
          Welcome, {userData?.user?.userId?.fullName || "Professional"}
        </h4>
        <small className="opacity-75">
          Complete your onboarding to start getting jobs
        </small>
      </div>
    </div>
  </div>

  {/* ===== Body ===== */}
  <div className="card-body bg-light">

    <form onSubmit={formik.handleSubmit} encType="multipart/form-data">

      {/* DOB */}
      <div className="mb-3">
        <label className="form-label fw-semibold text-primary">
          <FaBirthdayCake className="me-2" />
          Date of Birth
        </label>
        <input
          type="date"
          name="dob"
          max={maxDate}
          value={formik.values.dob}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="form-control rounded-3"
        />
        {formik.touched.dob && formik.errors.dob && (
          <div className="text-danger small">{formik.errors.dob}</div>
        )}
      </div>

      {/* Profession */}
      <div className="mb-3">
        <label className="form-label fw-semibold text-primary">
          <MdWork className="me-2" />
          Profession
        </label>
        <select
          name="profession"
          className="form-select rounded-3"
          value={formik.values.profession}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          <option value="">Select Profession</option>
          {services?.map((srv)=>{
            return <option value={srv._id} key={srv._id}>{srv.name}</option>
          })}
        </select>
      </div>

      {/* Address */}
      <div className="mb-3">
        <label className="form-label fw-semibold text-primary">
          <FaMapMarkerAlt className="me-2" />
          Address
        </label>
        <input
          type="text"
          ref={addressInputRef}
          name="address"
          placeholder="Enter your full address"
          value={formik.values.address}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="form-control rounded-3"
        />
        {formik.touched.address && formik.errors.address && (
          <div className="text-danger small">{formik.errors.address}</div>
        )}
      </div>

      {/* Profile Picture */}
      <div className="mb-4">
        <label className="form-label fw-semibold text-primary">
          <FaCamera className="me-2" />
          Profile Picture
        </label>

        <div className="alert alert-warning py-2 small mb-2">
          <FaInfoCircle className="me-1" />
          Upload a clear photo of your face, front-facing, no sunglasses or blur.
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            formik.setFieldValue("profilePicture", e.target.files[0])
          }
          className="form-control rounded-3"
        />

        {/* Preview (UI only) */}
        {formik.values.profilePicture && (
          <div className="mt-3 text-center">
            <img
              src={URL.createObjectURL(formik.values.profilePicture)}
              alt="Profile Preview"
              className="rounded-circle border shadow"
              style={{ width: "120px", height: "120px", objectFit: "cover" }}
            />
            <div className="small text-muted mt-1">Profile Preview</div>
          </div>
        )}
      </div>

      {/* POI */}
      <div className="mb-4">
        <label className="form-label fw-semibold text-primary">
          <FaIdCard className="me-2" />
          Proof of Identity
        </label>

        <div className="alert alert-warning py-2 small mb-2">
          <FaInfoCircle className="me-1" />
          Upload a valid government ID (Aadhaar / PAN / Driving License).  
          Image must be readable or PDF only.
        </div>

        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => formik.setFieldValue("poi", e.target.files[0])}
          className="form-control rounded-3"
        />

        {/* POI Preview (image only) */}
        {formik.values.poi && formik.values.poi.type.startsWith("image/") && (
          <div className="mt-3 text-center">
            <img
              src={URL.createObjectURL(formik.values.poi)}
              alt="POI Preview"
              className="rounded border shadow-sm"
              style={{ maxWidth: "220px" }}
            />
            <div className="small text-muted mt-1">ID Preview</div>
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="text-center">
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary px-5 rounded-pill fw-semibold"
        >
          {loading ? <ClipLoader size={20} /> : "Complete Onboarding"}
        </button>
      </div>
    </form>
  </div>
</div>

</div>

    </>
  );
};

export default Onboarding;

