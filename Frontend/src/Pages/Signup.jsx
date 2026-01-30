import React, { useState } from "react";
import { FaCheck, FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { useFormik } from "formik";
import { FaArrowLeft } from "react-icons/fa6";
import { FaUser, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import * as Yup from "yup";
import Navbar from "../Components/Navbar.jsx";
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import {ClipLoader} from 'react-spinners'
import {useDispatch} from 'react-redux'
import {
  auth,
  provider,
  signInWithPopup,
} from "../firebase.js";

import { createUserWithEmailAndPassword, sendEmailVerification } from "../firebase.js";

import { server_url } from "../App.jsx";
import { setCurrentUserData } from "../redux/user.slice.js";
import { useLocation } from "react-router-dom";
import Footer from "../Components/Footer.jsx";

const Signup = () => {

  // to find the respective role
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get("role") || "customer";
  const [wait, setWait] = useState(false)
  
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

   const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otp, setOtp] = useState("");

  // 👁️ Show/Hide Password
  const handleShowPass = () => {
    setShowPass(!showPass);
  };


  //navigation
  const navigate = useNavigate();




  // 🔹 Google Signup
  const handleSignupWithGoogle = async () => {
    try {
        setLoading(true)
      const result = await signInWithPopup(auth, provider);

      const user = {
        fullName: result.user.displayName,
        email : result.user.email,
        role,
        acceptedTerms: true,
        acceptedProfessionalPolicy: role === "professional"
      }
      
      const response = await axios.post(`${server_url}/api/auth/google-auth-signup`, user, {withCredentials : true})
      dispatch(setCurrentUserData(response.data))
      setLoading(false)
    } catch (error) {
    
      toast.error(error.response.data.message);
      setLoading(false)
    }
  };

  // ✅ Yup Validation Schema
  const validationSchema = Yup.object({
    fullName: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    acceptedTerms: Yup.boolean().oneOf([true], "You must accept Terms & Privacy Policy"),
    acceptedProfessionalPolicy: Yup.boolean().when([], {
  is: () => role === "professional",
  then: schema =>
    schema.oneOf([true], "You must accept Professional Onboarding Policy"),
})
  });

  // 🧾 Formik Setup
  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      acceptedTerms: false,
      acceptedProfessionalPolicy: false,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true)
        
        const result = await axios.post(`${server_url}/api/auth/signup-customer`, {...values, role}, {withCredentials :true})

        dispatch(setCurrentUserData(result.data))
        toast.success(result.data.message)
        setLoading(false)
      // jab bhi api mein data bhejna hoga values ko bhejenge na ki user ko 
        resetForm(); // clear form after success
      } catch (error) {
      //  console.log("error in form submition:", error.response.data.message)
       toast.error(error.response.data.message)
          setLoading(false)
      }
    },
  });

  // handle send otp
  const handleSendOtp = async()=>{
     try {
      setWait(true)
      await axios.post(`${server_url}/api/otp/send-email-otp`, {
        email: formik.values.email,
      });
      setOtpSent(true);
      toast.success("OTP sent to email");
      setWait(false)
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
      setWait(false)
    }
  }

    const handleVerifyOtp = async () => {
    try {
      setWait(true)
      await axios.post(`${server_url}/api/otp/verify-email-otp`, {
        email: formik.values.email,
        otp,
      });
      setEmailVerified(true);
      toast.success("Email verified successfully");
      setWait(false)
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
      setWait(false)
    }
  };



  return (
    <>
      <Navbar />
      <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light mt-5">
  <div className="col-11 col-sm-9 col-md-6 col-lg-4">

    <div className="card border-0 shadow-lg rounded-4 p-4">

      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <span
          className="text-primary fs-5 me-2"
          role="button"
          onClick={() => navigate("/")}
        >
          <FaArrowLeft />
        </span>
        <h4 className="fw-bold text-primary m-0 text-center flex-grow-1">
          Create Account
        </h4>
      </div>

      {/* Form */}
      <form onSubmit={formik.handleSubmit}>

        {/* Full Name */}
        <div className="mb-3">
          <label className="form-label fw-semibold small">Full Name</label>
          <div className="input-group">
            <span className="input-group-text bg-white">
              <FaUser className="text-primary" />
            </span>
            <input
              type="text"
              className="form-control"
              id="fullName"
              name="fullName"
              placeholder="Enter your full name"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.touched.fullName && formik.errors.fullName && (
            <small className="text-danger">{formik.errors.fullName}</small>
          )}
        </div>

        {/* Email */}
        <div className="mb-3 d-flex flex-column">
          <label className="form-label fw-semibold small">Email Address</label>
          <div className="input-group">
            <span className="input-group-text bg-white">
              <MdEmail className="text-primary" />
            </span>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={emailVerified}
            />
          </div>
          {formik.touched.email && formik.errors.email && (
            <small className="text-danger">{formik.errors.email}</small>
          )}
           {!otpSent && (
                  <button
                    type="button"
                    className="btn btn-outline-dark btn-sm mt-2"
                    onClick={handleSendOtp} 
                    disabled={!formik.values.email}
                  >
                    Send OTP
                  </button>
                )}
        </div>
         
         {otpSent && !emailVerified && (
                <div className="mb-3">
                  <label className="form-label">Enter OTP</label>
                  <input
                    type="text"
                    className="form-control"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-success btn-sm mt-2"
                    onClick={handleVerifyOtp}
                  >
                    Verify OTP
                  </button>
                </div>
              )}

               {emailVerified && (
                <div className="alert alert-success py-2">
                  <FaCheck className="text-success" size={10}/> Email verified
                </div>
              )}
        {/* Password */}
        <div className="mb-3 position-relative">
          <label className="form-label fw-semibold small">Password</label>
          <div className="input-group">
            <span className="input-group-text bg-white">
              <FaLock className="text-primary" />
            </span>
            <input
              type={showPass ? "text" : "password"}
              className="form-control"
              id="password"
              name="password"
              placeholder="Create a password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>

          <span
            onClick={handleShowPass}
            className="position-absolute top-50 end-0 translate-middle-y me-3"
            style={{ cursor: "pointer" }}
          >
            {showPass ? <FaRegEyeSlash /> : <FaRegEye />}
          </span>

          {formik.touched.password && formik.errors.password && (
            <small className="text-danger">{formik.errors.password}</small>
          )}
        </div>

        <div className="form-check mb-2">
  <input
    type="checkbox"
    className="form-check-input"
    id="acceptedTerms"
    name="acceptedTerms"
    onChange={formik.handleChange}
    checked={formik.values.acceptedTerms}
    role="button"
    required
  />
  <label className="form-check-label small" htmlFor="acceptedTerms">
    I agree to the{" "}
    <a href="/terms-and-conditions" target="_blank">Terms & Conditions</a> and{" "}
    <a href="/privacy-policy" target="_blank">Privacy Policy</a>
  </label> <br />
{formik.touched.acceptedTerms && formik.errors.acceptedTerms && (
  <small className="text-danger">{formik.errors.acceptedTerms}</small>
)}
</div>

{role === "professional" && (
  <>
    <div className="form-check mb-2">
      <input
        type="checkbox"
        className="form-check-input"
        id="acceptedProfessionalPolicy"
        name="acceptedProfessionalPolicy"
        onChange={formik.handleChange}
        checked={formik.values.acceptedProfessionalPolicy}
        role="button"
        required
      />
      <label className="form-check-label small">
        I agree to the{" "}
        <a href="/professional-policy" target="_blank">
          Professional Onboarding Policy
        </a>
      </label>
    </div>

    {formik.touched.acceptedProfessionalPolicy &&
      formik.errors.acceptedProfessionalPolicy && (
        <small className="text-danger">
          {formik.errors.acceptedProfessionalPolicy}
        </small>
      )}
  </>
)}




        {/* Submit */}
        <button
          type="submit"
          disabled={!emailVerified || loading}
          className="btn btn-primary w-100 rounded-pill py-2 fw-semibold mt-2"
        >
          {loading ? <ClipLoader size={18} /> : "Create Account"}
        </button>

      </form>

      {/* Divider */}
      <div className="text-center my-3 text-muted small">OR</div>

      {/* Google */}
      <button
        className="btn btn-outline-secondary w-100 rounded-pill py-2 d-flex align-items-center justify-content-center gap-2"
         disabled={
    loading ||
    !formik.values.acceptedTerms ||
    (role === "professional" && !formik.values.acceptedProfessionalPolicy)}
        onClick={handleSignupWithGoogle}
      >
        <FcGoogle size={20} />
        {loading ? <ClipLoader size={18} /> : "Continue with Google"}
      </button>
      {(!formik.values.acceptedTerms ||
  (role === "professional" && !formik.values.acceptedProfessionalPolicy)) && (
  <small className="text-muted d-block text-center mt-2">
    Please accept the required policies to continue with Google
  </small>
)}

      {/* Footer */}
      <div className="text-center mt-4">
        <span
          className="text-primary fw-semibold"
          role="button"
          onClick={() => navigate("/login")}
        >
          Already have an account? Login
        </span>
      </div>

    </div>
  </div>
</div>
          <Footer/>
    </>
  );
};

export default Signup;
