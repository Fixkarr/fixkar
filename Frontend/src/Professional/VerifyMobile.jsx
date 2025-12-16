import React, { useState } from "react";
import "../css/verifyMobile.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from 'axios'
import { server_url } from "../App";
import {ClipLoader} from 'react-spinners'
import Countdown from "react-countdown";
import useGetCurrentUser from "../hooks/useGetCurrentUser";
import { useDispatch } from "react-redux";
import { setCurrentUserData } from "../redux/user.slice";


const VerifyMobile = () => {
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

      navigate("/onboard")
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
    <div className="verify-container d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow p-4 verify-card">
        <h4 className="text-center fw-bold mb-3">
          {step === "mobile" ? "Verify Your Mobile" : "Enter OTP"}
        </h4>

        <p className="text-muted text-center mb-4">
          {step === "mobile"
            ? "Please enter your mobile number to receive an OTP."
            : `OTP has been sent to +91 ${mobile}`}
        </p>

        {step === "mobile" ? (
          <form onSubmit={handleSendOtp}>
            <div className="mb-3">
              <label htmlFor="mobile" className="form-label fw-semibold">
                Mobile Number
              </label>
              <input
                type="text"
                id="mobile"
                className="form-control"
                placeholder="Enter 10-digit mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                maxLength={10}
              />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary w-100">
             {loading ? <ClipLoader size={20}/> : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div className="mb-3 text-center">
              <input
                type="text"
                className="form-control text-center otp-input"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
              />
            </div>
            <button type="submit" disabled={loading} onClick={handleVerifyOtp} className="btn btn-success w-100 mb-3">
              {loading? <ClipLoader size={20}/> : "Verify OTP"}
            </button>
            <div className="text-center">
                  {!timerActive ? (
                            <button
                            type="button"
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
                                      type="button"
                                      onClick={handleResendOtp}
                                      className="text-primary btn btn-border"
                                      disabled={loading}
                                    >
                                      {loading ? <ClipLoader size={20}/> :"Resend Otp"}
                                    </button>
                                  );
                                } else {
                                  return (
                                    <button type="button" disabled={loading} className="text-primary btn btn-border-0">
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
                className="btn btn-outline-secondary mt-2"
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
