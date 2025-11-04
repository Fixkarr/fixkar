import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "../css/forgetPass.css";
import { ToastContainer, toast } from "react-toastify";
import axios from 'axios'
import { server_url } from "../App";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {ClipLoader} from 'react-spinners'
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
  }, [otpVerified]);

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

    // Dummy logic (replace with backend call)
  try {
      setLoader(true)
      const result = await axios.post(`${server_url}/api/auth/request-reset-password`, {newPassword : password, email
      })
      toast.success(result.data.message)
      setLoader(false)
      setShowLoginBtn(true)
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
          <center>
            <h4 className="text-primary mb-3">Reset Your Password</h4>
          </center>

          <form onSubmit={handleResetPassword}>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                New Password
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="form-control"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <center>
              <button type="submit" disabled={loader} className="btn btn-primary w-100">
                {loader ? <ClipLoader size={20}/> : "Reset Password"}
              </button>
              {showLoginBtn && <Link to="/login" className="text-success decoration-none">
                Go to Login page
              </Link>}
            </center>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
