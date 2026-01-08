import React, { useState } from 'react'
import Navbar from '../Components/Navbar'
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import axios from 'axios';
import { FaArrowLeft } from "react-icons/fa6";
import {ClipLoader} from "react-spinners"
import '../css/login.css'
import { server_url } from '../App';
import { useDispatch } from 'react-redux';
import { setCurrentUserData } from '../redux/user.slice';
import {
  auth,
  provider,
  signInWithPopup,
} from "../firebase.js";
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
   const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    // 👁️ Show/Hide Password
    const handleShowPass = () => {
      setShowPass(!showPass);
    };

     const navigate = useNavigate();
  
     const validationSchema = Yup.object({
        email: Yup.string()
          .email("Invalid email format")
          .required("Email is required"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
      });

      const formik = useFormik({
        initialValues : {
          email : "",
          password : ""
        },
        validationSchema,
        onSubmit : async (values, {resetForm})=>{
         try {
          setLoading(true)
          const result = await axios.post(`${server_url}/api/auth/login`, values, {withCredentials : true})
          toast.success(result?.data?.message)
          setLoading(false)
          dispatch(setCurrentUserData(result.data))
          resetForm()
         } catch (error) {
          console.log(error)
          toast.error(error.response.data.message)
          setLoading(false)
         }
        }
      })

      const handleLoginWithGoogle = async () => {
    try {
        setLoading(true)
      const result = await signInWithPopup(auth, provider);

      const user = {
        email : result.user.email,
      }
      
      const response = await axios.post(`${server_url}/api/auth/google-auth-login`, user, {withCredentials : true})
      dispatch(setCurrentUserData(response.data))
      setLoading(false)
    } catch (error) {
  
      toast.error(error.response.data.message)
      setLoading(false)
    }
  };

  return (
    
    <>
    
      <Navbar/>
   <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
  <div className="card shadow-lg border-0 rounded-4 p-4 p-md-5" style={{ maxWidth: "420px", width: "100%" }}>

    {/* Header */}
    <div className="d-flex align-items-center mb-3">
      <span
        role="button"
        className="text-primary me-2"
        onClick={() => navigate("/")}
      >
        <FaArrowLeft />
      </span>
      <h4 className="fw-bold text-primary mb-0">Welcome Back</h4>
    </div>

    <p className="text-muted small mb-4">
      Login to continue using <strong>Fixkar</strong>
    </p>

    {/* Form */}
    <form onSubmit={formik.handleSubmit}>
      {/* Email */}
      <div className="mb-3">
        <label htmlFor="email" className="form-label fw-semibold small">
          Email Address
        </label>
        <input
          className="form-control form-control-lg"
          type="email"
          id="email"
          name="email"
          placeholder="you@example.com"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.email && formik.errors.email && (
          <small className="text-danger">{formik.errors.email}</small>
        )}
      </div>

      {/* Password */}
      <div className="mb-3">
        <label htmlFor="password" className="form-label fw-semibold small">
          Password
        </label>

        <div className="input-group input-group-lg">
          <input
            type={showPass ? "text" : "password"}
            className="form-control"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <span
            className="input-group-text bg-white"
            role="button"
            onClick={handleShowPass}
          >
            {showPass ? <FaRegEyeSlash /> : <FaRegEye />}
          </span>
        </div>

        {formik.touched.password && formik.errors.password && (
          <small className="text-danger">{formik.errors.password}</small>
        )}
      </div>

      {/* Button */}
      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary w-100 py-2 fw-semibold"
      >
        {loading ? <ClipLoader size={20} color="#fff" /> : "Login"}
      </button>
    </form>
            <hr />
                  <center>
                    <span className="or">or</span>
                  </center>
                  <center>
                    <button
                      className="btn border border-secondary w-100 mt-2"  disabled={loading}
                      onClick={handleLoginWithGoogle}
                    >
                      <FcGoogle />{loading ? <ClipLoader size={20}/> : "Login with Google"}
                    </button>
                  </center>
    {/* Footer */}
    <div className="text-center mt-4">
      <span
        role="button"
        className="text-danger fw-semibold small"
        onClick={() => navigate("/forget-password")}
      >
        Forgotten Password?
      </span>
    </div>
  </div>
</div>

    </>
  )
}

export default Login
