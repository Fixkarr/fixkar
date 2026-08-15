import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaRegEye,
  FaRegEyeSlash,
  FaArrowLeft,
} from "react-icons/fa6";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { server_url } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUserData } from "../redux/user.slice";

import {
  auth,
  provider,
  signInWithPopup,
} from "../firebase.js";

import {
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";

import { Capacitor } from "@capacitor/core";
import { SocialLogin } from "@capgo/capacitor-social-login";

import { FcGoogle } from "react-icons/fc";
import { MdEmail } from "react-icons/md";
import { FaLock, FaShieldAlt } from "react-icons/fa";

import Footer from "../Components/Footer.jsx";

const Login = () => {
  const [showPass, setShowPass] = useState(false);
  const [floading, setFloading] = useState(false);
  const [gloading, setGloading] = useState(false);

  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const { currentUserData } = useSelector(
    (state) => state.user
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleShowPass = () => {
    setShowPass(!showPass);
  };

  useEffect(() => {
    if (currentUserData?.user) {
      navigate(from, { replace: true });
    }
  }, [currentUserData, from, navigate]);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),

    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema,

    onSubmit: async (values, { resetForm }) => {
      try {
        setFloading(true);

        const result = await axios.post(
          `${server_url}/api/auth/login`,
          values,
          { withCredentials: true }
        );

        setFloading(false);

        dispatch(setCurrentUserData(result.data));

        dispatch(setCurrentAdmin(null));

        navigate(from, { replace: true });

        resetForm();
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Login failed"
        );

        setFloading(false);
      }
    },
  });

  const handleLoginWithGoogle = async () => {
    try {
      setGloading(true);

      if (Capacitor.getPlatform() === "android") {
        const login = await SocialLogin.login({
          provider: "google",
        });

        const googleIdToken = login.result?.idToken;

        if (!googleIdToken) {
          throw new Error("Google ID Token not received");
        }

        const credential =
          GoogleAuthProvider.credential(googleIdToken);

        const firebaseCredential =
          await signInWithCredential(auth, credential);

        const firebaseIdToken =
          await firebaseCredential.user.getIdToken();

        const response = await axios.post(
          `${server_url}/api/auth/google-auth-login-native`,
          { idToken: firebaseIdToken },
          { withCredentials: true }
        );

        dispatch(setCurrentUserData(response.data));

        setGloading(false);

        return;
      }

      const result = await signInWithPopup(
        auth,
        provider
      );

      const firebaseIdToken =
        await result.user.getIdToken();

      const response = await axios.post(
        `${server_url}/api/auth/google-auth-login`,
        { idToken: firebaseIdToken },
        { withCredentials: true }
      );

      dispatch(setCurrentUserData(response.data));

      setGloading(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Google login failed"
      );

      setGloading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="fixkar-auth-page">
        {/* Decorative Background */}
        <div className="fixkar-auth-bg">
          <span className="fixkar-orb fixkar-orb-one" />
          <span className="fixkar-orb fixkar-orb-two" />
          <span className="fixkar-orb fixkar-orb-three" />

          <div className="fixkar-grid-pattern" />
        </div>

        <div className="container position-relative">
          <div className="row align-items-center justify-content-center g-4 g-lg-5">
            {/* ================= LEFT BRAND PANEL ================= */}
            <div className="col-lg-6 d-none d-lg-block">
              <div className="fixkar-auth-intro">
                <div className="fixkar-auth-brand">
                  <div className="fixkar-brand-icon">
                    <FaShieldAlt />
                  </div>

                  <span>Fixkar</span>
                </div>

                <h1>
                  Welcome back to
                  <span> smarter services.</span>
                </h1>

                <p>
                  Login to continue using Fixkar and connect
                  with trusted professionals around you.
                </p>

                <div className="fixkar-auth-points">
                  <div>
                    <span>01</span>
                    <div>
                      <strong>Trusted professionals</strong>
                      <small>
                        Connect with verified service providers.
                      </small>
                    </div>
                  </div>

                  <div>
                    <span>02</span>
                    <div>
                      <strong>Simple & convenient</strong>
                      <small>
                        Find and hire professionals with ease.
                      </small>
                    </div>
                  </div>

                  <div>
                    <span>03</span>
                    <div>
                      <strong>Secure experience</strong>
                      <small>
                        Your account and information stay protected.
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= LOGIN CARD ================= */}
            <div className="col-12 col-sm-10 col-md-7 col-lg-5">
              <div className="fixkar-login-card">
                {/* Mobile brand */}
                <div className="fixkar-mobile-brand d-lg-none">
                  <div className="fixkar-mobile-brand-icon">
                    <FaShieldAlt />
                  </div>

                  <div>
                    <strong>Fixkar</strong>
                    <small>Smart service platform</small>
                  </div>
                </div>

                {/* Header */}
                <div className="fixkar-login-header">
                  <button
                    type="button"
                    className="fixkar-back-btn"
                    onClick={() => navigate("/")}
                    aria-label="Go back"
                  >
                    <FaArrowLeft size={14} />
                  </button>

                  <div>
                    <h2>Welcome back</h2>

                    <p>
                      Login to continue using{" "}
                      <strong>Fixkar</strong>
                    </p>
                  </div>
                </div>

                {/* Form */}
                <form
                  onSubmit={formik.handleSubmit}
                  className="fixkar-login-form"
                >
                  {/* Email */}
                  <div className="fixkar-field">
                    <label htmlFor="email">
                      Email Address
                    </label>

                    <div
                      className={`fixkar-input ${
                        formik.touched.email &&
                        formik.errors.email
                          ? "error"
                          : ""
                      }`}
                    >
                      <MdEmail />

                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="you@example.com"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        autoComplete="email"
                      />
                    </div>

                    {formik.touched.email &&
                      formik.errors.email && (
                        <small className="fixkar-field-error">
                          {formik.errors.email}
                        </small>
                      )}
                  </div>

                  {/* Password */}
                  <div className="fixkar-field">
                    <div className="d-flex justify-content-between align-items-center">
                      <label htmlFor="password">
                        Password
                      </label>
                    </div>

                    <div
                      className={`fixkar-input ${
                        formik.touched.password &&
                        formik.errors.password
                          ? "error"
                          : ""
                      }`}
                    >
                      <FaLock />

                      <input
                        type={
                          showPass ? "text" : "password"
                        }
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        autoComplete="current-password"
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
                        <small className="fixkar-field-error">
                          {formik.errors.password}
                        </small>
                      )}
                  </div>

                  {/* Login */}
                  <button
                    type="submit"
                    disabled={floading || gloading}
                    className="fixkar-login-submit"
                  >
                    {floading ? (
                      <ClipLoader
                        size={18}
                        color="#fff"
                      />
                    ) : (
                      <>
                        Login
                        <span>→</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="fixkar-divider">
                  <span>or continue with</span>
                </div>

                {/* Google */}
                <button
                  type="button"
                  disabled={floading || gloading}
                  onClick={handleLoginWithGoogle}
                  className="fixkar-google-btn"
                >
                  {gloading ? (
                    <ClipLoader size={18} />
                  ) : (
                    <FcGoogle size={21} />
                  )}

                  <span>
                    {gloading
                      ? "Signing you in..."
                      : "Continue with Google"}
                  </span>
                </button>

                {/* Forgot */}
                <div className="fixkar-forgot">
                  <button
                    type="button"
                    onClick={() =>
                      navigate("/forget-password")
                    }
                  >
                    Forgotten Password?
                  </button>
                </div>

                {/* Security note */}
                <div className="fixkar-security-note">
                  <FaShieldAlt />

                  <span>
                    Your login information is securely
                    protected.
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

export default Login;