import React, { useState } from "react";
import Navbar from "./Navbar";
import "../css/forgetPass.css";
import { ToastContainer, toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaArrowLeft } from "react-icons/fa6";

import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { server_url } from "../App";

import { useAuth } from "../context/AuthContext";
import {ClipLoader} from "react-spinners"
import Footer from "./Footer";
const ForgetPass = () => {
  const navigator = useNavigate()
  const [loading, setLoading] = useState(false);
  const {setEmail} = useAuth();

  

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true)
        const result = await axios.post(`${server_url}/api/otp/send-email-otp`, values)
        toast.success(result.data.message);
        setLoading(false)
        setEmail(values.email);
        resetForm();
        navigator("/verify-otp");

      } catch (error) {
       
        toast.error(error.response.data.message)
          setLoading(false)

      }
    },
  });

  return (
    <>
      <Navbar />
    <div className="forget-pass container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
  <div
    className="bg-white p-4 p-md-5 rounded-4 shadow-lg"
    style={{ maxWidth: "460px", width: "100%" }}
  >
    {/* Header */}
    <div className="d-flex align-items-center mb-4">
      <span
        className="text-primary me-2"
        role="button"
        onClick={() => navigator("/login")}
      >
        <FaArrowLeft />
      </span>
      <h4 className="text-primary fw-bold m-0">Verify it’s you</h4>
    </div>

    <p className="text-muted small mb-4">
      Enter your registered email address. We’ll send you a verification code.
    </p>

    {/* Form */}
    <form onSubmit={formik.handleSubmit}>
      <div className="mb-4">
        <label htmlFor="email" className="form-label fw-semibold">
          Email Address
        </label>
        <input
          className="form-control form-control-lg"
          type="email"
          id="email"
          name="email"
          placeholder="you@example.com"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.email && formik.errors.email && (
          <small className="text-danger">{formik.errors.email}</small>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary w-100 py-2 fw-semibold"
      >
        {loading ? <ClipLoader size={20} /> : "Send OTP"}
      </button>
    </form>
  </div>
</div>

      <Footer/>
    </>
  );
};

export default ForgetPass;
