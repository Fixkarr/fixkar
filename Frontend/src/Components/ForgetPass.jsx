import React, { useState } from "react";
import Navbar from "./Navbar";
import "../css/forgetPass.css";
import { ToastContainer, toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaArrowLeft } from "react-icons/fa6";

import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { server_url } from "../App";

import { useAuth } from "../context/AuthContext";
import {ClipLoader} from "react-spinners"
const ForgetPass = () => {
  const navigator = useNavigate()
  const [loading, setLoading] = useState(false);
  const {setEmail} = useAuth();

  

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true)
        const result = await axios.post(`${server_url}/api/otp/send-email-otp`, values)
        toast.success(result.data.message);
        setLoading(false)
        setEmail(values.email);
        resetForm();
        navigator("/verify-otp");

      } catch (error) {
       
        toast.error(error.response.data.message)
          setLoading(false)

      }
    },
  });

  return (
    <>
      <Navbar />
      <div className="forget-pass container-fluid d-flex align-items-center justify-content-center bg-secondary-subtle">
        <div className="signup-container bg-white p-3 rounded shadow">
          <div className="flex flex-row">
            <span className="text-primary" role="button" onClick={()=> navigator('/login')}><FaArrowLeft /></span>
            <center><h4 className="text-primary mb-3">Verify it's you!</h4></center>
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Enter Your Email
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
            <center>
              <button type="submit" disabled={loading} className="btn btn-primary w-100">
                {loading ? <ClipLoader size={20}/> :"Send Otp"}
              </button>
            </center>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgetPass;
