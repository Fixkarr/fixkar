import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { toast } from "react-toastify";
import axios from 'axios'
import { server_url } from "../App";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {ClipLoader} from 'react-spinners'
import Footer from "./Footer";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const {email, otpVerified} = useAuth()
  const [showLoginBtn, setShowLoginBtn] = useState(false);
  const [loader, setLoader] = useState(false)

  const navigate = useNavigate()
   useEffect(() => {
    if (!otpVerified) {
      navigate("/forget-password");
    }
  }, [otpVerified, navigate]);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Please fill in both fields!");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setLoader(true)
      const result = await axios.post(
        `${server_url}/api/auth/request-reset-password`,
        { newPassword: password },
        { withCredentials: true }
      )
      toast.success(result.data.message)
      setShowLoginBtn(true)
    } catch (error) {
      toast.error(error?.response?.data?.message || "Password reset failed")
    } finally {
      setLoader(false)
    }
  };

  return (
    <>
      <Navbar />
      <div className="forget-pass container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="bg-white p-4 p-md-5 rounded-4 shadow-lg" style={{ maxWidth: "460px", width: "100%" }}>
          <div className="text-center mb-4">
            <h4 className="text-primary fw-bold mb-1">Reset Your Password</h4>
            <p className="text-muted small">Create a strong password to secure your account</p>
          </div>

          <form onSubmit={handleResetPassword}>
            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-semibold">New Password</label>
              <input type="password" id="password" className="form-control form-control-lg" placeholder="Enter new password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="form-label fw-semibold">Confirm Password</label>
              <input type="password" id="confirmPassword" className="form-control form-control-lg" placeholder="Re-enter new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
            </div>

            <button type="submit" disabled={loader} className="btn btn-primary w-100 py-2 fw-semibold">
              {loader ? <ClipLoader size={20} /> : "Reset Password"}
            </button>

            {showLoginBtn && (
              <div className="text-center mt-3">
                <Link to="/login" className="text-success fw-semibold text-decoration-none">Go to Login page</Link>
              </div>
            )}
          </form>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default ResetPassword;
