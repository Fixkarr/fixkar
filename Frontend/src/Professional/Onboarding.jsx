
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

const Onboarding = ({ userData }) => {
  const [loading, setLoading] = useState(false);
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

      <div className="onboarding bg-primary-subtle mt-5">
        <h2>Welcome, {userData?.user?.userId?.fullName || "Professional"}</h2>
        <p>Let's complete your onboarding process.</p>
        <hr className="text-primary" />

        <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
          {/* Date */}
          <div className="input-container">
            <label className="text-primary">Date of Birth</label>
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
          {formik.touched.dob && formik.errors.dob && (
            <div className="text-danger">{formik.errors.dob}</div>
          )}

          {/* Profession */}
          <div className="input-container">
            <label className="text-primary">Profession</label>
            <select
              name="profession"
              className="form-select"
              value={formik.values.profession}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="">Select Profession</option>
              <option value="Electrician">Electrician</option>
              <option value="Painter">Painter</option>
              <option value="Plumber">Plumber</option>
              <option value="Carpenter">Carpenter</option>
              <option value="Labour">Labour</option>
              <option value="Engineer">Engineer</option>
            </select>
          </div>

          {/* ✅ Address with Google Autocomplete */}
          <div className="input-container">
            <label className="text-primary">Address</label>
            <input
              type="text"
              ref={addressInputRef}
              name="address"
              placeholder="Enter your address"
              value={formik.values.address}
              onChange={formik.handleChange}
             
              onBlur={formik.handleBlur}
              className="form-control"
            />
          </div>
          {formik.touched.address && formik.errors.address && (
            <div className="text-danger">{formik.errors.address}</div>
          )}

          {/* Profile Picture */}
          <div className="input-container">
            <label className="text-primary">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                formik.setFieldValue("profilePicture", e.target.files[0])
              }
              className="form-control"
            />
          </div>

          {/* POI */}
          <div className="input-container">
            <label className="text-primary">Proof of Identity</label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => formik.setFieldValue("poi", e.target.files[0])}
              className="form-control"
            />
          </div>

          <center>
            <button type="submit" disabled={loading} className="btn btn-primary mt-3">
              {loading ? <ClipLoader size={20} /> : "Submit"}
            </button>
          </center>
        </form>
      </div>
    </>
  );
};

export default Onboarding;

