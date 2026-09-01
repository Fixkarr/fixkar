import React, { useState } from "react";
import { FaCheck, FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { useFormik } from "formik";
import { FaArrowLeft } from "react-icons/fa6";
import { FaUser, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import * as Yup from "yup";
import Navbar from "../Components/Navbar.jsx";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import {ClipLoader} from 'react-spinners'
import {useDispatch} from 'react-redux'
import { auth, provider, signInWithPopup } from "../firebase.js";
import { Capacitor } from "@capacitor/core";
import { SocialLogin } from "@capgo/capacitor-social-login";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { server_url } from "../App.jsx";
import { setCurrentUserData } from "../redux/user.slice.js";
import { useLocation } from "react-router-dom";
import Footer from "../Components/Footer.jsx";

const Signup = () => {
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
  const navigate = useNavigate();

  const handleShowPass = () => setShowPass(!showPass);

  const handleSignupWithGoogle = async () => {
    try {
      setLoading(true)

      if (Capacitor.getPlatform() === "android") {
        const login = await SocialLogin.login({ provider: "google",
            options: {
    scopes: ["email", "profile"],
    style: "standard",
    filterByAuthorizedAccounts: false,
  },
         });

           sessionStorage.setItem(
  "fixkar:returnTo",
  window.location.pathname +
  window.location.search +
  window.location.hash
);

        const googleIdToken = login.result?.idToken;
        if (!googleIdToken) throw new Error("Google ID Token not received");

        const credential = GoogleAuthProvider.credential(googleIdToken);
        const firebaseCredential = await signInWithCredential(auth, credential);
        const firebaseIdToken = await firebaseCredential.user.getIdToken();

        const response = await axios.post(
          `${server_url}/api/auth/google-auth-signup-native`,
          {
            idToken: firebaseIdToken,
            role,
            acceptedTerms: true,
            acceptedProfessionalPolicy: role === "professional",
          },
          { withCredentials: true }
        );

        dispatch(setCurrentUserData(response.data));
        setLoading(false);
        return;
      }

      const result = await signInWithPopup(auth, provider);
      const firebaseIdToken = await result.user.getIdToken();

      const response = await axios.post(
        `${server_url}/api/auth/google-auth-signup`,
        {
          idToken: firebaseIdToken,
          fullName: result.user.displayName,
          role,
          acceptedTerms: true,
          acceptedProfessionalPolicy: role === "professional"
        },
        { withCredentials: true }
      );

      dispatch(setCurrentUserData(response.data));
      setLoading(false)
      const returnTo = sessionStorage.getItem("fixkar:returnTo");
sessionStorage.removeItem("fixkar:returnTo");
navigate(returnTo || "/", { replace: true });
    } catch (error) {
      toast.error("Google signup failed");
      setLoading(false)
    }
  };

  const validationSchema = Yup.object({
    fullName: Yup.string().min(3, "Name must be at least 3 characters").required("Name is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    acceptedTerms: Yup.boolean().oneOf([true], "You must accept Terms & Privacy Policy"),
    acceptedProfessionalPolicy: Yup.boolean().when([], {
      is: () => role === "professional",
      then: schema => schema.oneOf([true], "You must accept Professional Onboarding Policy"),
    })
  });

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
        resetForm();
      } catch (error) {
        toast.error(error?.response?.data?.message || "Signup failed")
        setLoading(false)
      }
    },
  });

  const handleSendOtp = async()=>{
    try {
      setWait(true)
      await axios.post(`${server_url}/api/otp/send-email-otp`, { email: formik.values.email });
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
      }, { withCredentials: true });
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

    <main className="fixkar-signup-page">
      {/* ================= BACKGROUND GRAPHICS ================= */}
      <div className="fixkar-signup-bg">
        <span className="fixkar-signup-orb signup-orb-one" />
        <span className="fixkar-signup-orb signup-orb-two" />
        <span className="fixkar-signup-orb signup-orb-three" />

        <div className="fixkar-signup-grid" />
      </div>

      <div className="container position-relative">
        <div className="row align-items-center justify-content-center g-4 g-lg-5">

          {/* =====================================================
              LEFT BRAND / INTRO
          ===================================================== */}
          <div className="col-lg-6 d-none d-lg-block">
            <div className="fixkar-signup-intro">

              <div className="fixkar-signup-brand">
                <div className="fixkar-signup-brand-icon">
                  <FaCheck />
                </div>

                <span>Fixkar</span>
              </div>

              <div className="fixkar-signup-role-badge">
                {role === "professional"
                  ? "Professional account"
                  : "Customer account"}
              </div>

              <h1>
                Start your journey with
                <span> Fixkar.</span>
              </h1>

              <p>
                Create your account and get started with
                Fixkar's smart service platform.
              </p>

              <div className="fixkar-signup-points">

                <div>
                  <span className="signup-point-number">
                    01
                  </span>

                  <div>
                    <strong>
                      {role === "professional"
                        ? "Build your professional profile"
                        : "Find trusted professionals"}
                    </strong>

                    <small>
                      {role === "professional"
                        ? "Showcase your skills and services to customers."
                        : "Discover skilled professionals for your service needs."}
                    </small>
                  </div>
                </div>

                <div>
                  <span className="signup-point-number">
                    02
                  </span>

                  <div>
                    <strong>
                      Simple and convenient
                    </strong>

                    <small>
                      Manage your Fixkar experience from one place.
                    </small>
                  </div>
                </div>

                <div>
                  <span className="signup-point-number">
                    03
                  </span>

                  <div>
                    <strong>
                      Secure account
                    </strong>

                    <small>
                      Your account information is protected.
                    </small>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* =====================================================
              SIGNUP CARD
          ===================================================== */}
          <div className="col-12 col-sm-10 col-md-8 col-lg-5">

            <div className="fixkar-signup-card">

              {/* ================= MOBILE BRAND ================= */}
              <div className="fixkar-signup-mobile-brand d-lg-none">

                <div className="signup-mobile-brand-icon">
                  <FaCheck />
                </div>

                <div>
                  <strong>Fixkar</strong>
                  <small>
                    Smart service platform
                  </small>
                </div>

              </div>

              {/* ================= HEADER ================= */}
              <div className="fixkar-signup-header">

                <button
                  type="button"
                  className="fixkar-signup-back"
                  onClick={() => navigate("/")}
                  aria-label="Go back"
                >
                  <FaArrowLeft size={14} />
                </button>

                <div>
                  <h2>Create Account</h2>

                  <p>
                    Create your account to get started with{" "}
                    <strong>Fixkar</strong>
                  </p>
                </div>

              </div>

              {/* ================= ROLE INDICATOR ================= */}
              <div className="fixkar-role-indicator">

                <div className="role-indicator-dot" />

                <span>
                  Creating{" "}
                  <strong>
                    {role === "professional"
                      ? "Professional"
                      : "Customer"}
                  </strong>{" "}
                  account
                </span>

              </div>

              {/* ================= FORM ================= */}
              <form
                onSubmit={formik.handleSubmit}
                className="fixkar-signup-form"
              >

                {/* FULL NAME */}
                <div className="fixkar-signup-field">

                  <label htmlFor="fullName">
                    Full Name
                  </label>

                  <div
                    className={`fixkar-signup-input ${
                      formik.touched.fullName &&
                      formik.errors.fullName
                        ? "signup-input-error"
                        : ""
                    }`}
                  >
                    <FaUser />

                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      placeholder="Enter your full name"
                      value={formik.values.fullName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>

                  {formik.touched.fullName &&
                    formik.errors.fullName && (
                      <small className="fixkar-signup-error">
                        {formik.errors.fullName}
                      </small>
                    )}

                </div>

                {/* EMAIL */}
                <div className="fixkar-signup-field">

                  <label htmlFor="email">
                    Email Address
                  </label>

                  <div
                    className={`fixkar-signup-input ${
                      formik.touched.email &&
                      formik.errors.email
                        ? "signup-input-error"
                        : ""
                    } ${
                      emailVerified
                        ? "signup-input-verified"
                        : ""
                    }`}
                  >
                    <MdEmail />

                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={emailVerified}
                    />

                    {emailVerified && (
                      <FaCheck className="signup-verified-icon" />
                    )}
                  </div>

                  {formik.touched.email &&
                    formik.errors.email && (
                      <small className="fixkar-signup-error">
                        {formik.errors.email}
                      </small>
                    )}

                  {/* SEND OTP */}
                  {!otpSent && (
                    <button
                      type="button"
                      className="fixkar-send-otp"
                      onClick={handleSendOtp}
                      disabled={
                        !formik.values.email || wait
                      }
                    >
                      {wait ? (
                        <>
                          <ClipLoader
                            size={12}
                            color="#0d6efd"
                          />
                          Sending...
                        </>
                      ) : (
                        "Send OTP"
                      )}
                    </button>
                  )}

                </div>

                {/* ================= OTP ================= */}
                {otpSent && !emailVerified && (
                  <div className="fixkar-otp-box">

                    <div className="fixkar-otp-header">

                      <div>
                        <strong>
                          Verify your email
                        </strong>

                        <small>
                          Enter the 6-digit OTP sent to your email.
                        </small>
                      </div>

                      <div className="otp-icon">
                        <MdEmail />
                      </div>

                    </div>

                    <div className="fixkar-otp-row">

                      <input
                        type="text"
                        className="fixkar-otp-input"
                        placeholder="000000"
                        value={otp}
                        onChange={(e) =>
                          setOtp(e.target.value)
                        }
                        maxLength={6}
                        inputMode="numeric"
                      />

                      <button
                        type="button"
                        className="fixkar-verify-btn"
                        onClick={handleVerifyOtp}
                        disabled={wait}
                      >
                        {wait ? (
                          <ClipLoader
                            size={14}
                            color="#fff"
                          />
                        ) : (
                          "Verify"
                        )}
                      </button>

                    </div>

                  </div>
                )}

                {/* VERIFIED */}
                {emailVerified && (
                  <div className="fixkar-email-success">

                    <div className="email-success-icon">
                      <FaCheck />
                    </div>

                    <div>
                      <strong>
                        Email verified
                      </strong>

                      <small>
                        Your email address has been verified successfully.
                      </small>
                    </div>

                  </div>
                )}

                {/* PASSWORD */}
                <div className="fixkar-signup-field">

                  <label htmlFor="password">
                    Password
                  </label>

                  <div
                    className={`fixkar-signup-input ${
                      formik.touched.password &&
                      formik.errors.password
                        ? "signup-input-error"
                        : ""
                    }`}
                  >
                    <FaLock />

                    <input
                      type={
                        showPass
                          ? "text"
                          : "password"
                      }
                      id="password"
                      name="password"
                      placeholder="Create a password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />

                    <button
                      type="button"
                      className="fixkar-password-toggle"
                      onClick={handleShowPass}
                      aria-label={
                        showPass
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPass ? (
                        <FaRegEyeSlash />
                      ) : (
                        <FaRegEye />
                      )}
                    </button>

                  </div>

                  {formik.touched.password &&
                    formik.errors.password && (
                      <small className="fixkar-signup-error">
                        {formik.errors.password}
                      </small>
                    )}

                </div>

                {/* TERMS */}
                <div className="fixkar-policy-box">

                  <div className="form-check">

                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="acceptedTerms"
                      name="acceptedTerms"
                      onChange={formik.handleChange}
                      checked={
                        formik.values.acceptedTerms
                      }
                      role="button"
                      required
                    />

                    <label
                      className="form-check-label"
                      htmlFor="acceptedTerms"
                    >
                      I agree to the{" "}
                      <a
                        href="/terms-and-conditions"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Terms & Conditions
                      </a>{" "}
                      and{" "}
                      <a
                        href="/privacy-policy"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Privacy Policy
                      </a>
                    </label>

                  </div>

                  {formik.touched.acceptedTerms &&
                    formik.errors.acceptedTerms && (
                      <small className="fixkar-signup-error d-block">
                        {formik.errors.acceptedTerms}
                      </small>
                    )}

                </div>

                {/* PROFESSIONAL POLICY */}
                {role === "professional" && (
                  <div className="fixkar-policy-box professional-policy">

                    <div className="form-check">

                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="acceptedProfessionalPolicy"
                        name="acceptedProfessionalPolicy"
                        onChange={formik.handleChange}
                        checked={
                          formik.values
                            .acceptedProfessionalPolicy
                        }
                        role="button"
                        required
                      />

                      <label
                        className="form-check-label"
                        htmlFor="acceptedProfessionalPolicy"
                      >
                        I agree to the{" "}
                        <a
                          href="/professional-policy"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Professional Onboarding Policy
                        </a>
                      </label>

                    </div>

                    {formik.touched
                      .acceptedProfessionalPolicy &&
                      formik.errors
                        .acceptedProfessionalPolicy && (
                        <small className="fixkar-signup-error d-block">
                          {
                            formik.errors
                              .acceptedProfessionalPolicy
                          }
                        </small>
                      )}

                  </div>
                )}

                {/* CREATE ACCOUNT */}
                <button
                  type="submit"
                  disabled={!emailVerified || loading}
                  className="fixkar-create-account"
                >
                  {loading ? (
                    <ClipLoader
                      size={18}
                      color="#fff"
                    />
                  ) : (
                    <>
                      Create Account
                      <span>→</span>
                    </>
                  )}
                </button>

              </form>

              {/* ================= DIVIDER ================= */}
              <div className="fixkar-signup-divider">
                <span>or continue with</span>
              </div>

              {/* ================= GOOGLE ================= */}
              <button
                type="button"
                className="fixkar-google-signup"
                disabled={
                  loading ||
                  !formik.values.acceptedTerms ||
                  (role === "professional" &&
                    !formik.values
                      .acceptedProfessionalPolicy)
                }
                onClick={handleSignupWithGoogle}
              >
                {loading ? (
                  <ClipLoader size={18} />
                ) : (
                  <FcGoogle size={21} />
                )}

                <span>
                  {loading
                    ? "Creating account..."
                    : "Continue with Google"}
                </span>
              </button>

              {(!formik.values.acceptedTerms ||
                (role === "professional" &&
                  !formik.values
                    .acceptedProfessionalPolicy)) && (
                <small className="fixkar-google-note">
                  Please accept the required policies to
                  continue with Google
                </small>
              )}

              {/* ================= LOGIN ================= */}
              <div className="fixkar-login-link">
                <span>
                  Already have an account?
                </span>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/login")
                  }
                >
                  Login
                </button>
              </div>

              {/* SECURITY */}
              <div className="fixkar-signup-security">
                <FaCheck />

                <span>
                  Your account information is securely protected.
                </span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </>
);
};

export default Signup
