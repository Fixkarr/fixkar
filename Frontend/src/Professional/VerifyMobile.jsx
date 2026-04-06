import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from 'axios'
import { server_url } from "../App";
import {ClipLoader} from 'react-spinners'
import Countdown from "react-countdown";
import useGetCurrentUser from "../hooks/useGetCurrentUser";
import { useDispatch } from "react-redux";
import { setCurrentUserData } from "../redux/user.slice";
import { useSelector } from "react-redux";
import { FaMobileAlt, FaLock, FaRedo } from "react-icons/fa";

const VerifyMobile = () => {
  const {currentUserData} = useSelector(state=>state.user);
  const role = currentUserData?.user?.userId?.role;
  const [timerActive, setTimerActive] = useState(false);
  const [key, setKey] = useState(0);
  const [loading, setLoading] = useState(false)
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("mobile"); // "mobile" or "otp"
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      toast.info("Please enter a valid 10-digit mobile number")
      return;
    }
    try {
      setLoading(true)
      const result = await axios.post(`${server_url}/api/otp/send`, {phone : `+91${mobile}`}, {withCredentials : true});
      toast.success(result.data.message)
      setLoading(false)
      setStep("otp");
    } catch (error) {
      toast.error(error.response.data.message)
      setLoading(false)
    }
  
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const result = await axios.post(`${server_url}/api/otp/verify`, {phone : `+91${mobile}`,otp }, {withCredentials : true})
      toast.success(result.data.message);
      if(result.data.user){
        dispatch(setCurrentUserData({user : result.data.user}))
      }else{
        dispatch(useGetCurrentUser());
      }

      role === "professional" ? navigate("/onboard") : navigate(-1);
      setLoading(false)
    } catch (error) {
      toast.error(error.response.data.message)
      setLoading(false)
    }
  };

  const handleResendOtp = async ()=>{
        try {
      setLoading(true)
      const result = await axios.post(`${server_url}/api/otp/send`, {phone : `+91${mobile}`}, {withCredentials : true});
      toast.success(result.data.message)
      setLoading(false)
      setTimerActive(true);
      setKey((prev) => prev + 1);
      setStep("otp");
    } catch (error) {
      toast.error(error.response.data.message)
        setLoading(false)
    }
  
  }

  return (
    <>
    

<div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
  <div className="card shadow-lg border-0 p-5" style={{ maxWidth: "480px", width: "100%", borderRadius: "20px" }}>
    
    {/* Header */}
    <div className="text-center mb-4">
      <div
        className="d-flex align-items-center justify-content-center mx-auto mb-3"
        style={{
          width: "70px",
          height: "70px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #0d6efd, #6610f2)",
          color: "#fff",
          fontSize: "28px"
        }}
      >
        {step === "mobile" ? <FaMobileAlt /> : <FaLock />}
      </div>

      <h3 className="fw-bold">
        {step === "mobile" ? "Verify Your Mobile" : "Enter OTP"}
      </h3>

      <p className="text-muted">
        {step === "mobile"
          ? "Enter your mobile number to receive a secure OTP."
          : `OTP sent to +91 ${mobile}`}
      </p>
    </div>

    {/* MOBILE STEP */}
    {step === "mobile" ? (
      <form onSubmit={handleSendOtp}>
        <div className="mb-4">
          <label className="form-label fw-semibold">Mobile Number</label>
          <div className="input-group">
            <span className="input-group-text">+91</span>
            <input
              type="text"
              className="form-control"
              placeholder="Enter mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              maxLength={10}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-100 py-2 fw-semibold"
          style={{ borderRadius: "10px" }}
        >
          {loading ? <ClipLoader size={20} color="#fff" /> : "Send OTP"}
        </button>
      </form>
    ) : (
      /* OTP STEP */
      <form onSubmit={handleVerifyOtp}>
        
        <div className="mb-4 text-center">
          <input
            type="text"
            className="form-control text-center fs-4 fw-bold"
            style={{
              letterSpacing: "8px",
              height: "55px",
              borderRadius: "10px"
            }}
            maxLength="6"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-success w-100 py-2 fw-semibold mb-3"
          style={{ borderRadius: "10px" }}
        >
          {loading ? <ClipLoader size={20} color="#fff" /> : "Verify OTP"}
        </button>

        {/* Resend Section */}
        <div className="text-center">

          {!timerActive ? (
            <button
              type="button"
              onClick={handleResendOtp}
              className="btn btn-link text-decoration-none fw-semibold"
            >
              <FaRedo className="me-1" />
              {loading ? <ClipLoader size={16} /> : "Resend OTP"}
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
                      type="button"
                      onClick={handleResendOtp}
                      className="btn btn-link text-decoration-none fw-semibold"
                      disabled={loading}
                    >
                      <FaRedo className="me-1" />
                      {loading ? <ClipLoader size={16} /> : "Resend OTP"}
                    </button>
                  );
                } else {
                  return (
                    <button
                      type="button"
                      disabled
                      className="btn btn-link text-decoration-none text-muted"
                    >
                      Resend OTP ({seconds}s)
                    </button>
                  );
                }
              }}
            />
          )}

          <br />

          <button
            type="button"
            className="btn btn-outline-secondary mt-3 px-4"
            style={{ borderRadius: "10px" }}
            onClick={() => setStep("mobile")}
          >
            Change Mobile Number
          </button>
        </div>
      </form>
    )}
  </div>
</div>
    </>
  );
};

export default VerifyMobile;
