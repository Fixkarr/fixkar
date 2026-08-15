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
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase";
import { useEffect } from "react";

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

 useEffect(() => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth, // 🔥 FIRST PARAM = auth
      "recaptcha-container",
      {
        size: "invisible"
      }
    );
  }
}, []);


  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      toast.info("Please enter a valid 10-digit mobile number")
      return;
    }
    try {
      setLoading(true)
      // const result = await axios.post(`${server_url}/api/otp/send`, {phone : `+91${mobile}`}, {withCredentials : true});
      // toast.success(result.data.message)
         const appVerifier = window.recaptchaVerifier;

    const confirmationResult = await signInWithPhoneNumber(
      auth,
      "+91" + mobile,
      appVerifier
    );

    window.confirmationResult = confirmationResult;
      toast.success("OTP Sent Successfully");
      setLoading(false)
      setStep("otp");
    } catch (error) {
      // toast.error(error.response.data.message)
      toast.error("Otp send failed!")
      setLoading(false)
    }
  
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      

         const result = await window.confirmationResult.confirm(otp);
    const user = result.user;

    // 🔥 Firebase token
    const token = await user.getIdToken();

    // 🔥 Backend ko bhej
    const res = await axios.post(
      `${server_url}/api/otp/firebase-phone-verify`,
      { token },
      { withCredentials: true }
    );

    toast.success("Mobile Verified Successfully");

    if (res.data.user) {
      dispatch(setCurrentUserData({ user: res.data.user }));
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

       handleSendOtp(new Event("submit"));
        setTimerActive(true);
        setKey((prev) => prev + 1);
    } catch (error) {
     
    }
  
  }

 return (
  <>
    <style>{`
      /* =====================================================
         FIXKAR MOBILE VERIFICATION
      ===================================================== */

      .fixkar-verify-page {
        position: relative;
        min-height: 100vh;

        display: flex;
        align-items: center;

        padding: 90px 15px 45px;

        overflow: hidden;

        background:
          radial-gradient(
            circle at 10% 15%,
            rgba(13, 110, 253, 0.15),
            transparent 30%
          ),
          radial-gradient(
            circle at 90% 85%,
            rgba(111, 66, 193, 0.12),
            transparent 32%
          ),
          #f7faff;
      }

      /* ================= BACKGROUND ================= */

      .fixkar-verify-bg {
        position: absolute;
        inset: 0;

        overflow: hidden;

        pointer-events: none;
      }

      .verify-orb {
        position: absolute;

        border-radius: 50%;
      }

      .verify-orb-one {
        width: 320px;
        height: 320px;

        top: -160px;
        left: -100px;

        background:
          radial-gradient(
            circle,
            rgba(13, 110, 253, 0.17),
            transparent 70%
          );
      }

      .verify-orb-two {
        width: 380px;
        height: 380px;

        right: -160px;
        bottom: -170px;

        background:
          radial-gradient(
            circle,
            rgba(111, 66, 193, 0.13),
            transparent 70%
          );
      }

      .verify-orb-three {
        width: 150px;
        height: 150px;

        right: 12%;
        top: 20%;

        background:
          radial-gradient(
            circle,
            rgba(13, 110, 253, 0.08),
            transparent 70%
          );
      }

      .fixkar-verify-grid {
        position: absolute;
        inset: 0;

        opacity: 0.28;

        background-image:
          linear-gradient(
            rgba(13, 110, 253, 0.045) 1px,
            transparent 1px
          ),
          linear-gradient(
            90deg,
            rgba(13, 110, 253, 0.045) 1px,
            transparent 1px
          );

        background-size: 42px 42px;

        mask-image: linear-gradient(
          to bottom,
          black,
          transparent 90%
        );
      }

      /* ================= CARD ================= */

      .fixkar-verify-card {
        position: relative;

        width: 100%;
        max-width: 470px;

        margin: 0 auto;

        padding: 32px;

        border-radius: 26px;

        background: rgba(255, 255, 255, 0.91);

        border: 1px solid rgba(255, 255, 255, 0.9);

        box-shadow:
          0 30px 70px rgba(15, 23, 42, 0.12);

        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);

        overflow: hidden;
      }

      .fixkar-verify-card::before {
        content: "";

        position: absolute;

        top: 0;
        left: 0;
        right: 0;

        height: 3px;

        background:
          linear-gradient(
            90deg,
            #0d6efd,
            #6f42c1
          );
      }

      /* ================= BRAND ================= */

      .fixkar-verify-brand {
        display: flex;
        align-items: center;

        justify-content: center;

        gap: 8px;

        margin-bottom: 20px;

        color: #0d6efd;

        font-size: 17px;
        font-weight: 800;
      }

      .fixkar-verify-brand-icon {
        width: 35px;
        height: 35px;

        display: flex;
        align-items: center;
        justify-content: center;

        border-radius: 11px;

        color: white;

        background:
          linear-gradient(
            135deg,
            #0d6efd,
            #6f42c1
          );

        box-shadow:
          0 8px 18px rgba(13, 110, 253, 0.20);
      }

      /* ================= STEP INDICATOR ================= */

      .fixkar-verify-steps {
        display: flex;
        align-items: center;

        width: 100%;

        margin-bottom: 25px;
      }

      .verify-step {
        display: flex;
        align-items: center;

        gap: 7px;

        color: #94a3b8;

        font-size: 10px;
        font-weight: 700;

        white-space: nowrap;
      }

      .verify-step-number {
        width: 27px;
        height: 27px;

        display: flex;
        align-items: center;
        justify-content: center;

        border-radius: 50%;

        background: #edf2f7;

        color: #94a3b8;

        font-size: 10px;

        transition: 0.25s ease;
      }

      .verify-step.active {
        color: #0d6efd;
      }

      .verify-step.active
        .verify-step-number {
        color: white;

        background:
          linear-gradient(
            135deg,
            #0d6efd,
            #4f8dfd
          );

        box-shadow:
          0 5px 12px rgba(13, 110, 253, 0.20);
      }

      .verify-step-line {
        height: 1px;

        flex: 1;

        margin: 0 9px;

        background: #e5eaf1;

        transition: 0.25s ease;
      }

      .verify-step-line.active {
        background: #9ec0f7;
      }

      /* ================= HEADER ================= */

      .fixkar-verify-header {
        text-align: center;

        margin-bottom: 25px;
      }

      .fixkar-verify-icon {
        width: 68px;
        height: 68px;

        display: flex;
        align-items: center;
        justify-content: center;

        margin: 0 auto 16px;

        border-radius: 20px;

        color: white;

        font-size: 25px;

        background:
          linear-gradient(
            135deg,
            #0d6efd,
            #6610f2
          );

        box-shadow:
          0 13px 28px rgba(13, 110, 253, 0.22);

        transition: 0.25s ease;
      }

      .fixkar-verify-header h2 {
        color: #172033;

        font-size: 25px;

        font-weight: 800;

        margin-bottom: 7px;
      }

      .fixkar-verify-header p {
        max-width: 350px;

        margin: 0 auto;

        color: #94a3b8;

        font-size: 11px;

        line-height: 1.6;
      }

      /* ================= INPUT ================= */

      .fixkar-verify-field {
        margin-bottom: 17px;
      }

      .fixkar-verify-label {
        display: block;

        margin-bottom: 7px;

        color: #334155;

        font-size: 11px;
        font-weight: 700;
      }

      .fixkar-mobile-input {
        height: 50px;

        display: flex;
        align-items: center;

        overflow: hidden;

        border: 1px solid #e2e8f0;

        border-radius: 13px;

        background: white;

        transition:
          border-color 0.2s ease,
          box-shadow 0.2s ease;
      }

      .fixkar-mobile-input:focus-within {
        border-color: #78aaf5;

        box-shadow:
          0 0 0 4px rgba(13, 110, 253, 0.07);
      }

      .fixkar-country-code {
        height: 100%;

        display: flex;
        align-items: center;

        padding: 0 13px;

        border-right: 1px solid #e9edf3;

        color: #475569;

        background: #f8fafc;

        font-size: 12px;
        font-weight: 700;
      }

      .fixkar-mobile-input svg {
        margin-left: 12px;

        color: #94a3b8;
      }

      .fixkar-mobile-input input {
        flex: 1;

        min-width: 0;

        height: 100%;

        padding: 0 12px;

        border: 0;
        outline: 0;

        background: transparent;

        color: #1e293b;

        font-size: 13px;

        letter-spacing: 0.5px;
      }

      .fixkar-mobile-input input::placeholder {
        color: #b0bac8;
      }

      /* ================= PRIMARY BUTTON ================= */

      .fixkar-verify-primary {
        width: 100%;

        min-height: 50px;

        display: flex;
        align-items: center;
        justify-content: center;

        gap: 9px;

        border: 0;

        border-radius: 13px;

        color: white;

        background:
          linear-gradient(
            135deg,
            #0d6efd,
            #4f8dfd
          );

        font-size: 13px;
        font-weight: 700;

        box-shadow:
          0 10px 22px rgba(13, 110, 253, 0.20);

        transition:
          transform 0.2s ease,
          box-shadow 0.2s ease;
      }

      .fixkar-verify-primary:hover:not(:disabled) {
        transform: translateY(-2px);

        box-shadow:
          0 14px 28px rgba(13, 110, 253, 0.27);
      }

      .fixkar-verify-primary:disabled {
        opacity: 0.65;

        cursor: not-allowed;
      }

      /* ================= OTP BOX ================= */

      .fixkar-otp-wrapper {
        padding: 14px;

        border-radius: 15px;

        background:
          linear-gradient(
            135deg,
            #f5f9ff,
            #faf8ff
          );

        border: 1px solid #e4ebf7;

        margin-bottom: 17px;
      }

      .fixkar-otp-label {
        display: flex;
        align-items: center;
        justify-content: space-between;

        margin-bottom: 10px;
      }

      .fixkar-otp-label strong {
        color: #334155;

        font-size: 11px;
      }

      .fixkar-otp-label span {
        color: #0d6efd;

        font-size: 9px;
        font-weight: 600;
      }

      .fixkar-otp-input {
        width: 100%;

        height: 56px;

        border: 1px solid #dce4ef;

        border-radius: 12px;

        outline: none;

        text-align: center;

        letter-spacing: 9px;

        padding-left: 9px;

        color: #172033;

        background: white;

        font-size: 21px;
        font-weight: 800;

        transition:
          border-color 0.2s ease,
          box-shadow 0.2s ease;
      }

      .fixkar-otp-input:focus {
        border-color: #78aaf5;

        box-shadow:
          0 0 0 4px rgba(13, 110, 253, 0.07);
      }

      .fixkar-otp-input::placeholder {
        color: #cbd5e1;

        letter-spacing: 8px;
      }

      /* ================= OTP VERIFY ================= */

      .fixkar-otp-submit {
        width: 100%;

        min-height: 49px;

        border: 0;

        border-radius: 13px;

        display: flex;
        align-items: center;
        justify-content: center;

        gap: 8px;

        color: white;

        background:
          linear-gradient(
            135deg,
            #198754,
            #20a66a
          );

        font-size: 13px;
        font-weight: 700;

        box-shadow:
          0 9px 20px rgba(25, 135, 84, 0.17);

        transition: 0.2s ease;
      }

      .fixkar-otp-submit:hover:not(:disabled) {
        transform: translateY(-2px);

        box-shadow:
          0 13px 25px rgba(25, 135, 84, 0.24);
      }

      .fixkar-otp-submit:disabled {
        opacity: 0.65;

        cursor: not-allowed;
      }

      /* ================= RESEND ================= */

      .fixkar-resend-area {
        text-align: center;

        margin-top: 15px;
      }

      .fixkar-resend-btn {
        border: 0;

        background: transparent;

        color: #0d6efd;

        font-size: 10px;
        font-weight: 700;

        padding: 4px;

        cursor: pointer;
      }

      .fixkar-resend-btn:hover {
        text-decoration: underline;
      }

      .fixkar-resend-btn:disabled {
        color: #94a3b8;

        cursor: not-allowed;
        text-decoration: none;
      }

      .fixkar-change-number {
        margin-top: 12px;

        width: 100%;

        min-height: 42px;

        border: 1px solid #e1e7ef;

        border-radius: 11px;

        background: white;

        color: #64748b;

        font-size: 10px;
        font-weight: 700;

        transition: 0.2s ease;
      }

      .fixkar-change-number:hover {
        color: #0d6efd;

        border-color: #bfd4f5;

        background: #f7faff;
      }

      /* ================= SECURITY ================= */

      .fixkar-verify-security {
        display: flex;
        align-items: center;
        justify-content: center;

        gap: 6px;

        margin-top: 22px;

        padding-top: 14px;

        border-top: 1px solid #edf1f5;

        color: #94a3b8;

        font-size: 8px;
      }

      .fixkar-verify-security svg {
        color: #22a06b;
      }

      /* ================= MOBILE ================= */

      @media (max-width: 767.98px) {

        .fixkar-verify-page {
          min-height: 100vh;

          padding:
            82px
            10px
            35px;

          align-items: flex-start;
        }

        .fixkar-verify-card {
          max-width: 440px;

          padding: 22px 17px;

          border-radius: 21px;

          box-shadow:
            0 18px 45px rgba(15, 23, 42, 0.10);
        }

        .fixkar-verify-brand {
          margin-bottom: 17px;
        }

        .fixkar-verify-icon {
          width: 60px;
          height: 60px;

          border-radius: 18px;

          font-size: 22px;

          margin-bottom: 13px;
        }

        .fixkar-verify-header h2 {
          font-size: 22px;
        }

        .fixkar-verify-header {
          margin-bottom: 21px;
        }

        .fixkar-verify-steps {
          margin-bottom: 21px;
        }

        .verify-step {
          font-size: 9px;
        }

        .verify-step-number {
          width: 25px;
          height: 25px;
        }

        .fixkar-mobile-input {
          height: 48px;
        }

        .fixkar-otp-input {
          height: 53px;

          font-size: 20px;

          letter-spacing: 8px;
        }
      }

      @media (max-width: 380px) {

        .fixkar-verify-page {
          padding-left: 7px;
          padding-right: 7px;
        }

        .fixkar-verify-card {
          padding: 20px 14px;

          border-radius: 19px;
        }

        .fixkar-verify-steps {
          margin-bottom: 18px;
        }

        .verify-step {
          font-size: 8px;
        }

        .verify-step-line {
          margin: 0 5px;
        }

        .fixkar-verify-header h2 {
          font-size: 20px;
        }

        .fixkar-otp-input {
          letter-spacing: 6px;
          padding-left: 6px;
        }
      }
    `}</style>

    <div className="fixkar-verify-page">

      {/* ================= BACKGROUND ================= */}

      <div className="fixkar-verify-bg">
        <span className="verify-orb verify-orb-one" />
        <span className="verify-orb verify-orb-two" />
        <span className="verify-orb verify-orb-three" />

        <div className="fixkar-verify-grid" />
      </div>

      <div className="container position-relative">

        <div className="row justify-content-center">

          <div className="col-12 col-sm-10 col-md-7 col-lg-5">

            <div className="fixkar-verify-card">

              {/* ================= BRAND ================= */}

              <div className="fixkar-verify-brand">
                <div className="fixkar-verify-brand-icon">
                  <FaMobileAlt size={16} />
                </div>

                <span>Fixkar</span>
              </div>

              {/* ================= STEPS ================= */}

              <div className="fixkar-verify-steps">

                <div
                  className={`verify-step ${
                    step === "mobile" ? "active" : ""
                  }`}
                >
                  <span className="verify-step-number">
                    1
                  </span>

                  <span className="d-none d-sm-inline">
                    Mobile
                  </span>
                </div>

                <div
                  className={`verify-step-line ${
                    step === "otp" ? "active" : ""
                  }`}
                />

                <div
                  className={`verify-step ${
                    step === "otp" ? "active" : ""
                  }`}
                >
                  <span className="verify-step-number">
                    2
                  </span>

                  <span className="d-none d-sm-inline">
                    Verification
                  </span>
                </div>

              </div>

              {/* ================= HEADER ================= */}

              <div className="fixkar-verify-header">

                <div className="fixkar-verify-icon">
                  {step === "mobile" ? (
                    <FaMobileAlt />
                  ) : (
                    <FaLock />
                  )}
                </div>

                <h2>
                  {step === "mobile"
                    ? "Verify your mobile"
                    : "Enter your OTP"}
                </h2>

                <p>
                  {step === "mobile"
                    ? "Enter your mobile number to receive a secure OTP."
                    : `We've sent a verification code to +91 ${mobile}`}
                </p>

              </div>

              {/* ================= MOBILE ================= */}

              {step === "mobile" ? (
                <form onSubmit={handleSendOtp}>

                  {/* Firebase reCAPTCHA */}
                  <div id="recaptcha-container"></div>

                  <div className="fixkar-verify-field">

                    <label className="fixkar-verify-label">
                      Mobile Number
                    </label>

                    <div className="fixkar-mobile-input">

                      <span className="fixkar-country-code">
                        +91
                      </span>

                      <FaMobileAlt size={14} />

                      <input
                        type="text"
                        placeholder="Enter 10-digit mobile number"
                        value={mobile}
                        onChange={(e) =>
                          setMobile(e.target.value)
                        }
                        maxLength={10}
                        inputMode="numeric"
                        autoComplete="tel"
                      />

                    </div>

                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="fixkar-verify-primary"
                  >
                    {loading ? (
                      <ClipLoader
                        size={18}
                        color="#fff"
                      />
                    ) : (
                      <>
                        Send OTP
                        <span>→</span>
                      </>
                    )}
                  </button>

                </form>
              ) : (

                /* ================= OTP ================= */

                <form onSubmit={handleVerifyOtp}>

                  <div className="fixkar-otp-wrapper">

                    <div className="fixkar-otp-label">

                      <strong>
                        Verification code
                      </strong>

                      <span>
                        6 digits
                      </span>

                    </div>

                    <input
                      type="text"
                      className="fixkar-otp-input"
                      maxLength="6"
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value)
                      }
                      placeholder="••••••"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                    />

                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="fixkar-otp-submit"
                  >
                    {loading ? (
                      <ClipLoader
                        size={18}
                        color="#fff"
                      />
                    ) : (
                      <>
                        <FaLock size={12} />
                        Verify OTP
                      </>
                    )}
                  </button>

                  {/* ================= RESEND ================= */}

                  <div className="fixkar-resend-area">

                    {!timerActive ? (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="fixkar-resend-btn"
                        disabled={loading}
                      >
                        <FaRedo
                          className="me-1"
                        />

                        {loading ? (
                          <ClipLoader size={13} />
                        ) : (
                          "Resend OTP"
                        )}
                      </button>
                    ) : (
                      <Countdown
                        key={key}
                        date={
                          Date.now() + 60000
                        }
                        renderer={({
                          seconds,
                          completed,
                        }) => {

                          if (completed) {
                            setTimerActive(false);

                            return (
                              <button
                                type="button"
                                onClick={
                                  handleResendOtp
                                }
                                className="fixkar-resend-btn"
                                disabled={loading}
                              >
                                <FaRedo className="me-1" />

                                {loading ? (
                                  <ClipLoader
                                    size={13}
                                  />
                                ) : (
                                  "Resend OTP"
                                )}
                              </button>
                            );
                          }

                          return (
                            <button
                              type="button"
                              disabled
                              className="fixkar-resend-btn"
                            >
                              Resend OTP ({seconds}s)
                            </button>
                          );
                        }}
                      />
                    )}

                    <button
                      type="button"
                      className="fixkar-change-number"
                      onClick={() =>
                        setStep("mobile")
                      }
                    >
                      Change Mobile Number
                    </button>

                  </div>

                </form>
              )}

              {/* ================= SECURITY ================= */}

              <div className="fixkar-verify-security">
                <FaLock />

                <span>
                  Your mobile verification is securely
                  handled through OTP verification.
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  </>
);
};

export default VerifyMobile;
