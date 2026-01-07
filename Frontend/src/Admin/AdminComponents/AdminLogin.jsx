import React from "react";
import { FaUserShield, FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from 'axios'
import { server_url} from '../../App'
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setCurrentUserData } from "../../redux/user.slice";
import { setCurrentAdmin } from "../../redux/admin.Slice";

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const usernameRegex = /^[a-zA-Z0-9_.@]+$/;

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },

    validationSchema: Yup.object({
      username: Yup.string()
        .matches(
          usernameRegex,
          "Only letters, numbers, _ . @ allowed (no spaces)"
        )
        .min(4, "Minimum 4 characters")
        .max(20, "Maximum 20 characters")
        .required("Username is required"),

      password: Yup.string()
        .min(6, "Minimum 6 characters")
        .required("Password is required"),
    }),

    onSubmit: async (values, {resetForm}) => {
     try {
                const result  = await axios.post(`${server_url}/api/admin/login`, values, {withCredentials : true});
                toast.success(result.data.message);
                dispatch(setCurrentAdmin(result.data.admin))
                resetForm();
               } catch (error) {
                  console.log(error.message);
                  toast.error(error.response.data.message);
               }
    },
  });

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
      }}
    >
      <div
        className="card border-0 shadow-lg text-white p-4"
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(12px)",
          borderRadius: "18px",
          animation: "fadeInUp 0.8s ease",
        }}
      >
        {/* Header */}
        <div className="text-center mb-4">
          <div
            className="mx-auto d-flex align-items-center justify-content-center mb-3"
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "linear-gradient(135deg,#00c6ff,#0072ff)",
            }}
          >
            <FaUserShield size={30} />
          </div>
          <h4 className="fw-bold">Admin Login</h4>
          <p className="text-muted small mb-0">
            FixKar Admin Panel Access
          </p>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit}>
          {/* Username */}
          <div className="mb-3">
            <label className="form-label small">Username</label>
            <div className="input-group">
              <span className="input-group-text bg-dark text-white border-0">
                <FaUser />
              </span>
              <input
                type="text"
                name="username"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
                className="form-control bg-dark text-white border-0"
                placeholder="Enter username"
              />
            </div>
            {formik.touched.username && formik.errors.username && (
              <small className="text-danger">{formik.errors.username}</small>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="form-label small">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-dark text-white border-0">
                <FaLock />
              </span>
              <input
                type="password"
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className="form-control bg-dark text-white border-0"
                placeholder="••••••••"
              />
            </div>
            {formik.touched.password && formik.errors.password && (
              <small className="text-danger">{formik.errors.password}</small>
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="btn w-100 fw-semibold text-white"
            style={{
              background: "linear-gradient(135deg,#00c6ff,#0072ff)",
              borderRadius: "30px",
              transition: "all 0.3s ease",
            }}
          >
            Login to Admin Panel
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-4">
          <small className="text-muted">
            Restricted Access • FixKar © {new Date().getFullYear()}
          </small>
        </div>
      </div>

      {/* Animation */}
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(35px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default AdminLogin;
