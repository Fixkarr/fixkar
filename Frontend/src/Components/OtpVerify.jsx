import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import "../css/forgetPass.css";
import { ToastContainer, toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import Countdown from "react-countdown";
import axios from 'axios'
import { server_url } from "../App";
import { useAuth } from "../context/AuthContext";
import {ClipLoader} from 'react-spinners'
import { FaArrowLeft } from "react-icons/fa6";
import Footer from "./Footer";

const OtpVerify = () => {
  const [otp, setOtp] = useState("");
  const [timerActive, setTimerActive] = useState(false);
  const [key, setKey] = useState(0); // for restarting countdown
  const navigate = useNavigate();
  const {email, setOtpVerified} = useAuth()
  const [loading, setLoading] = useState(false);

   useEffect(() => {
      if (email == "") {
        navigate("/forget-password");
      }
    }, [email]);
  

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (otp.trim().length === 0) {
      toast.error("Please enter OTP!");
      return;
    }

    try {
       setLoading(true)
       const result = await axios.post(`${server_url}/api/otp/verify-email-otp`, {
        email, // 👈 ye ForgetPass se aayi email hai
        otp});
        toast.success(result.data.message)
        setLoading(false)
        setOtpVerified(true)
        navigate('/reset-password')
    } catch (error) {
      toast.error(error.response.data.message)
          setLoading(false)

    }

  };

  const handleResendOtp = async () => {
   try {
    setLoading(true)
     const result = await axios.post(`${server_url}/api/otp/send-email-otp`, {email})
        toast.info(result.data.message)
        setLoading(false)
    setTimerActive(true);
    setKey((prev) => prev + 1);
   } catch (error) {
    toast.error(error.response.data.message)
    setLoading(false)
   }
  };

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
        onClick={() => navigate("/forget-pass")}
      >
        <FaArrowLeft />
      </span>
      <h4 className="text-primary fw-bold m-0">Enter OTP</h4>
    </div>

    <p className="text-muted small mb-4">
      Enter the 6-digit verification code sent to your registered email address.
    </p>

    {/* Form */}
    <form onSubmit={handleVerifyOtp}>
      <div className="mb-4">
        <label htmlFor="otp" className="form-label fw-semibold">
          Verification Code
        </label>
        <input
          type="text"
          id="otp"
          name="otp"
          className="form-control form-control-lg text-center fw-bold"
          placeholder="••••••"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary w-100 py-2 fw-semibold"
      >
        {loading ? <ClipLoader size={20} /> : "Verify OTP"}
      </button>
    </form>

    {/* Resend Section */}
    <div className="text-center mt-4">
      {!timerActive ? (
        <button
          onClick={handleResendOtp}
          className="btn btn-link text-primary fw-semibold p-0"
          disabled={loading}
        >
          {loading ? <ClipLoader size={20} /> : "Resend OTP"}
        </button>
      ) : (
        <Countdown
          key={key}
          date={Date.now() + 60000}
          renderer={({ seconds, completed }) => {
            if (completed) {
              setTimerActive(false);
              return (
                <button
                  onClick={handleResendOtp}
                  className="btn btn-link text-primary fw-semibold p-0"
                  disabled={loading}
                >
                  {loading ? <ClipLoader size={20} /> : "Resend OTP"}
                </button>
              );
            } else {
              return (
                <span className="text-muted small">
                  Resend OTP in <strong>{seconds}s</strong>
                </span>
              );
            }
          }}
        />
      )}
    </div>
  </div>
</div>

      <Footer/>
    </>
  );
};

export default OtpVerify;
