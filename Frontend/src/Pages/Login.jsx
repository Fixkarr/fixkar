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



  return (
    
    <>
    
      <Navbar/>
      <div className='login container-fluid d-flex align-items-center justify-content-center bg-secondary-subtle'>
            <div className="signup-container bg-white p-3 rounded shadow">

               <div className="flex flex-row">
                          <span className="text-primary" role='button' onClick={()=> navigate('/')}><FaArrowLeft /></span>
                          <center><h4 className="text-primary mb-3">Log in</h4></center>
                        </div>
            <form onSubmit={formik.handleSubmit}>
       <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                className="form-control"
                type="email"
                id="email"
                name="email"
                placeholder="Enter email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <small className="text-danger">{formik.errors.email}</small>
              )}
            </div>

                <div className="mb-3 position-relative">
                            <label htmlFor="password" className="form-label">
                              Password
                            </label>
                            <input
                              className="form-control"
                              type={showPass ? "text" : "password"}
                              id="password"
                              name="password"
                              placeholder="Enter password"
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
               { loading ? <ClipLoader size={20}/>: "Login"}
              </button>
            </center>
            </form>
          
                       <div className="p-2 lowerDiv">
                          <span className="text-danger" onClick={()=>navigate('/forget-password')}>Forgotten Password?</span>
                       </div>
   
            </div>
      </div>
    </>
  )
}

export default Login
