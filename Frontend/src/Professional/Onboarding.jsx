import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/onboarding.css";
import axios from "axios";
import { server_url } from "../App.jsx";
import {ClipLoader} from 'react-spinners'
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const Onboarding = ({ userData }) => {

  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  // Calculate max date (today - 18 years)
  const today = new Date();
  const year = today.getFullYear() - 18;
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const maxDate = `${year}-${month}-${day}`;

  // ✅ Yup Validation Schema
  const validationSchema = Yup.object({
    dob: Yup.date()
      .required("Date of Birth is required")
      .max(new Date(maxDate), "You must be at least 18 years old"),
    address: Yup.string()
      .min(5, "Address must be at least 5 characters")
      .required("Address is required"),
    profession: Yup.string().required("Please select your profession"),
    profilePicture: Yup.mixed().required("Profile picture is required"),
    poi: Yup.mixed().required("Proof of identity is required"),
  });

  // ✅ Formik Hook
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
        setLoading(true)
        // Age and date recheck before sending
        const selectedDate = new Date(values.dob);
        if (selectedDate > today) {
          toast.error("Future dates are not allowed!");
          return;
        }

        // ✅ Prepare FormData for backend (Cloudinary upload)
        const formData = new FormData();
        formData.append("dob", values.dob);
        formData.append("address", values.address);
        formData.append("profession", values.profession);
        formData.append("profilePicture", values.profilePicture);
        formData.append("poi", values.poi);

        // ✅ Send to backend
        const response = await axios.post(
          `${server_url}/api/user/onboard`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials : true
          },
        );

        if (response.data.success) {

          toast.success("Onboarding completed successfully!");
          setLoading(false)
          resetForm();
          navigate("/application/pending")
        }
      } catch (error) {
        console.error(error);
        toast.error(
          error.response?.data?.message || "Something went wrong while submitting."
        );
        setLoading(false)
      }
    },
  });

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        theme="colored"
      />

      <div className="onboarding bg-primary-subtle">
        <div>
          <h2>Welcome, {userData?.user?.fullName || "Professional"}</h2>
          <p>Let's complete your onboarding process.</p>
        </div>
        <hr className="text-primary" />

        <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
          {/* Date of Birth */}
          <div className="input-container">
            <label htmlFor="dob" className="text-primary">
              Date of Birth
            </label>
            <input
              type="date"
              id="dob"
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
            <label htmlFor="profession" className="text-primary">
              Profession
            </label>
            <select
              id="profession"
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
            {formik.touched.profession && formik.errors.profession && (
              <div className="text-danger">{formik.errors.profession}</div>
            )}

          {/* Address */}
          <div className="input-container">
            <label htmlFor="address" className="text-primary">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Enter your permanent address"
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
            <label htmlFor="profilePicture" className="text-primary">
              Profile Picture
            </label>
            <input
              type="file"
              id="profilePicture"
              name="profilePicture"
              accept="image/*"
              onChange={(e) =>
                formik.setFieldValue("profilePicture", e.target.files[0])
              }
              onBlur={formik.handleBlur}
              className="form-control"
            />
          </div>
            {formik.touched.profilePicture && formik.errors.profilePicture && (
              <div className="text-danger">{formik.errors.profilePicture}</div>
            )}

          <p className="text-danger small">
            1. Face the camera clearly. <br />
            2. Make sure the photo is well-lit and clear. <br />
            3. Avoid using filters or blurry images.
          </p>

          {/* Proof of Identity */}
          <div className="input-container">
            <label htmlFor="poi" className="text-primary">
              Proof of Identity
            </label>
            <input
              type="file"
              id="poi"
              name="poi"
              accept="image/*,application/pdf"
              onChange={(e) => formik.setFieldValue("poi", e.target.files[0])}
              onBlur={formik.handleBlur}
              className="form-control"
            />
          </div>
            {formik.touched.poi && formik.errors.poi && (
              <div className="text-danger">{formik.errors.poi}</div>
            )}

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
