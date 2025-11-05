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

const OtpVerify = () => {
  const [otp, setOtp] = useState("");
  const [timerActive, setTimerActive] = useState(false);
  const [key, setKey] = useState(0); // for restarting countdown
  const navigate = useNavigate();
  const {email, setOtpVerified} = useAuth()
  const [loading, setLoading] = useState(false);

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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        theme="colored"
      />
      <Navbar />
      <div className="forget-pass container-fluid d-flex align-items-center justify-content-center bg-secondary-subtle">
        <div className="signup-container bg-white p-3 rounded shadow">
           <div className="flex flex-row">
                      <span className="text-primary" role="button" onClick={()=> navigate('/forget-pass')}><FaArrowLeft /></span>
                      <center><h4 className="text-primary mb-3">Enter OTP!</h4></center>
            </div>

          <form onSubmit={handleVerifyOtp}>
            <div className="mb-3">
              <label htmlFor="otp" className="form-label">
                Enter 6-digit OTP sent to your email
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                className="form-control text-center"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
              />
            </div>

            <center>
              <button type="submit" disabled={loading} className="btn btn-primary w-100">
                {loading ? <ClipLoader size={20}/> :"Verify Otp"}
              </button>
            </center>
          </form>

          <div className="p-2 lowerDiv">
            {!timerActive ? (
              <button
                onClick={handleResendOtp}
                className="text-primary btn btn-border"
              >
                {loading ? <ClipLoader size={20}/> :"Resend Otp"}
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
                        className="text-primary btn btn-border"
                        disabled={loading}
                      >
                        {loading ? <ClipLoader size={20}/> :"Resend Otp"}
                      </button>
                    );
                  } else {
                    return (
                      <button disabled={loading} className="text-primary btn btn-border-0">
                        Resend OTP ({seconds}s)
                      </button>
                    );
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OtpVerify;
