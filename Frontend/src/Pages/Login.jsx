import React, { useEffect, useState } from 'react'
import Navbar from '../Components/Navbar'
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import axios from 'axios';
import { FaArrowLeft } from "react-icons/fa6";
import {ClipLoader} from "react-spinners"
import { server_url } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentUserData } from '../redux/user.slice';
import {
  auth,
  provider,
  signInWithPopup,
} from "../firebase.js";
import { FcGoogle } from 'react-icons/fc';
import { MdEmail } from 'react-icons/md';
import { FaLock } from 'react-icons/fa';
import Footer from '../Components/Footer.jsx';

const Login = () => {
   const [showPass, setShowPass] = useState(false);
    const [floading, setFloading] = useState(false)
    const [gloading, setGloading] = useState(false)
    const location = useLocation()
     const from = location.state?.from?.pathname || "/";
     const {currentUserData} = useSelector(state=>state.user);

    const dispatch = useDispatch()
    // 👁️ Show/Hide Password
    const handleShowPass = () => {
      setShowPass(!showPass);
    };

     const navigate = useNavigate();


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
        initialValues : {
          email : "",
          password : ""
        },
        validationSchema,
        onSubmit : async (values, {resetForm})=>{
         try {
          setFloading(true)
          const result = await axios.post(`${server_url}/api/auth/login`, values, {withCredentials : true})
          toast.success(result?.data?.message)
          setFloading(false)
          dispatch(setCurrentUserData(result.data))
          console.log("FROM STATE:", location.state);
          console.log("FROM PATH:", from);
          navigate(from, { replace: true }); 
          resetForm()
         } catch (error) {
          console.log(error)
          toast.error(error.response.data.message)
          setFloading(false)
         }
        }
      })

      const handleLoginWithGoogle = async () => {
    try {
        setGloading(true)
      const result = await signInWithPopup(auth, provider);

      const user = {
        email : result.user.email,
      }
      
      const response = await axios.post(`${server_url}/api/auth/google-auth-login`, user, {withCredentials : true})
      dispatch(setCurrentUserData(response?.data))
      setGloading(false)
    } catch (error) {
  
      toast.error(error.response.data.message)
      setGloading(false)
    }
  };


  return (
    
    <>
    
      <Navbar/>
   <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
  <div className="col-11 col-sm-9 col-md-6 col-lg-4">

    <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5">

      {/* Header */}
      <div className="d-flex align-items-center mb-3">
        <span
          role="button"
          className="text-primary fs-5 me-2"
          onClick={() => navigate("/")}
        >
          <FaArrowLeft />
        </span>
        <h4 className="fw-bold text-primary mb-0 flex-grow-1 text-center">
          Welcome Back
        </h4>
      </div>

      <p className="text-muted small text-center mb-4">
        Login to continue using <strong>Fixkar</strong>
      </p>

      {/* Form */}
      <form onSubmit={formik.handleSubmit}>

        {/* Email */}
        <div className="mb-3">
          <label className="form-label fw-semibold small">
            Email Address
          </label>
          <div className="input-group">
            <span className="input-group-text bg-white">
              <MdEmail className="text-primary" />
            </span>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              placeholder="you@example.com"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.touched.email && formik.errors.email && (
            <small className="text-danger">{formik.errors.email}</small>
          )}
        </div>

        {/* Password */}
        <div className="mb-3 position-relative">
          <label className="form-label fw-semibold small">
            Password
          </label>

          <div className="input-group">
            <span className="input-group-text bg-white">
              <FaLock className="text-primary" />
            </span>
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
          </div>

          <span
            role="button"
            onClick={handleShowPass}
            className="position-absolute top-50 end-0 translate-middle-y me-3"
            style={{ cursor: "pointer" }}
          >
            {showPass ? <FaRegEyeSlash /> : <FaRegEye />}
          </span>

          {formik.touched.password && formik.errors.password && (
            <small className="text-danger">{formik.errors.password}</small>
          )}
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={floading || gloading}
          className="btn btn-primary w-100 rounded-pill py-2 fw-semibold mt-2"
        >
          {floading ? <ClipLoader size={18} color="#fff" /> : "Login"}
        </button>

      </form>

      {/* Divider */}
      <div className="text-center my-3 text-muted small">OR</div>

      {/* Google Login */}
      <button
        className="btn btn-outline-secondary w-100 rounded-pill py-2 d-flex align-items-center justify-content-center gap-2"
        disabled={floading || gloading}
        onClick={handleLoginWithGoogle}
      >
        <FcGoogle size={20} />
        {gloading ? <ClipLoader size={18} /> : "Continue with Google"}
      </button>

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
</div>

        <Footer/>
    </>
  )
}

export default Login
