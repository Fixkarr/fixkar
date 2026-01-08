import React, { useState } from "react";
import "../css/customersignup.css";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { useFormik } from "formik";
import { FaArrowLeft } from "react-icons/fa6";
import * as Yup from "yup";
import Navbar from "../Components/Navbar.jsx";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import {ClipLoader} from 'react-spinners'
import {useDispatch} from 'react-redux'
import {
  auth,
  provider,
  signInWithPopup,
} from "../firebase.js";
import { server_url } from "../App.jsx";
import { setCurrentUserData } from "../redux/user.slice.js";
import { useLocation } from "react-router-dom";

const Signup = () => {

  // to find the respective role
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get("role") || "customer";
  
  
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  // const [user, setUser] = useState(null);

  // 👁️ Show/Hide Password
  const handleShowPass = () => {
    setShowPass(!showPass);
  };


  //navigation
  const navigate = useNavigate();




  // 🔹 Google Signup
  const handleSignupWithGoogle = async () => {
    try {
        setLoading(true)
      const result = await signInWithPopup(auth, provider);

      const user = {
        fullName: result.user.displayName,
        email : result.user.email,
        role
      }
      
      const response = await axios.post(`${server_url}/api/auth/google-auth-signup`, user, {withCredentials : true})
      dispatch(setCurrentUserData(response.data))
      setLoading(false)
    } catch (error) {
    
      toast.error(error.response.data.message);
      setLoading(false)
    }
  };

  // ✅ Yup Validation Schema
  const validationSchema = Yup.object({
    fullName: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // 🧾 Formik Setup
  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true)
        const result = await axios.post(`${server_url}/api/auth/signup-customer`, {...values, role}, {withCredentials :true})
        dispatch(setCurrentUserData(result.data))
        toast.success(result.data.message)
        setLoading(false)
      // jab bhi api mein data bhejna hoga values ko bhejenge na ki user ko 
        resetForm(); // clear form after success
      } catch (error) {
      //  console.log("error in form submition:", error.response.data.message)
       toast.error(error.response.data.message)
          setLoading(false)
      }
    },
  });

  return (
    <>
      <Navbar />
      <div className="customer-signup container-fluid d-flex align-items-center pt-5 justify-content-center bg-secondary-subtle">
        <div className="signup-container bg-white p-3 rounded shadow">
         <div className="flex flex-row">
                                   <span className="text-primary" role='button' onClick={()=> navigate('/')}><FaArrowLeft /></span>
                                   <center><h4 className="text-primary mb-3">Sign up</h4></center>
                                 </div>

          <form onSubmit={formik.handleSubmit}>
            {/* Full Name */}
            <div className="mb-3">
              <label htmlFor="fullName" className="form-label">
                Name
              </label>
              <input
                className="form-control"
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Enter your full name"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.fullName && formik.errors.fullName && (
                <small className="text-danger">{formik.errors.fullName}</small>
              )}
            </div>

            {/* Email */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                className="form-control"
                type="email"
                id="email"
                name="email"
                placeholder="Enter your valid email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <small className="text-danger">{formik.errors.email}</small>
              )}
            </div>

            {/* Password */}
            <div className="mb-3 position-relative">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                className="form-control"
                type={showPass ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Set password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <span
                onClick={handleShowPass}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "38px",
                  cursor: "pointer",
                }}
              >
                {showPass ? <FaRegEyeSlash /> : <FaRegEye />}
              </span>
              {formik.touched.password && formik.errors.password && (
                <small className="text-danger">{formik.errors.password}</small>
              )}
            </div>

            <center>
              <button type="submit" disabled={loading} className="btn btn-primary w-100">
                {loading ? <ClipLoader size={20}/> : "Sign Up"}
              </button>
            </center>
          </form>

          <hr />
          <center>
            <span className="or">or</span>
          </center>
          <center>
            <button
              className="btn border border-secondary w-100 mt-2"  disabled={loading}
              onClick={handleSignupWithGoogle}
            >
              <FcGoogle />{loading ? <ClipLoader size={20}/> : "Sign up with Google"}
            </button>
          </center>

             <div className="p-2 lowerDiv">
                <span className="text-primary" onClick={()=>navigate('/login')}>Already have an account? Login</span>
             </div>
        
        </div>
      </div>
    </>
  );
};

export default Signup;
