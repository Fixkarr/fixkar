import React from "react";
import {
  FaUserShield,
  FaLock,
  FaKey,
  FaUserCog,
  FaRegUser,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from 'axios'
import { server_url } from "../../App";
import { toast } from "react-toastify";

const AdminSignup = () => {
  const navigate = useNavigate();

  // 🔐 Username regex (no spaces)
  const usernameRegex = /^[a-zA-Z0-9_.@]+$/;

  // ✅ Formik setup
  const formik = useFormik({
    initialValues: {
      adminName: "",
      username: "",
      password: "",
      role: "",
      secret: "",
    },

    validationSchema: Yup.object({
      adminName: Yup.string()
        .min(3, "Minimum 3 characters")
        .required("Admin name is required"),

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

      role: Yup.string().required("Please select a role"),

      secret: Yup.string().required("Secret key is required"),
    }),

    onSubmit: async (values, {resetForm}) => {
        try {
            const result  = await axios.post(`${server_url}/api/admin/signup`, values);
            toast.success(result.data.message);
            resetForm();
           } catch (error) {
              console.log(error.message);
              toast.error(error.response.data.message);
           }
      }
})

  return (
    <div
      className="min-vh-100 d-flex justify-content-center py-4"
      style={{
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
      }}
    >
      <div
        className="card border-0 shadow-lg text-primary p-4"
        style={{
          width: "80%",
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
          <h4 className="fw-bold">Create a new Admin</h4>
          <p className="text-muted small mb-0">
            Restricted Access – FixKar Admin Panel
          </p>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit}>
          {/* Admin Name */}
          <div className="mb-3">
            <label className="form-label small">Admin Name</label>
            <input
              type="text"
              name="adminName"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.adminName}
              className="form-control bg-dark text-white border-0"
              placeholder="Enter admin name"
            />
            {formik.touched.adminName && formik.errors.adminName && (
              <small className="text-danger">{formik.errors.adminName}</small>
            )}
          </div>

          {/* Username */}
          <div className="mb-3">
            <label className="form-label small">Username</label>
            <div className="input-group">
              <span className="input-group-text bg-dark text-white border-0">
                <FaRegUser />
              </span>
              <input
                type="text"
                name="username"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
                className="form-control bg-dark text-white border-0"
                placeholder="fixkar_admin01"
              />
            </div>
            {formik.touched.username && formik.errors.username && (
              <small className="text-danger">{formik.errors.username}</small>
            )}
          </div>

          {/* Password */}
          <div className="mb-3">
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

          {/* Role */}
          <div className="mb-3">
            <label className="form-label small">Select Admin Role</label>
            <div className="input-group">
              <span className="input-group-text bg-dark text-white border-0">
                <FaUserCog />
              </span>
              <select
                name="role"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.role}
                className="form-select bg-dark text-white border-0"
              >
                <option value="">-- Select Role --</option>
                <option value="super_admin">Super Admin</option>
                <option value="support_admin">Support Team</option>
                <option value="booking_admin">Booking Management</option>
                <option value="professional_admin">
                  Hiring / Professional Management
                </option>
                <option value="content_admin">
                  Enquiry / Content Management
                </option>
              </select>
            </div>
            {formik.touched.role && formik.errors.role && (
              <small className="text-danger">{formik.errors.role}</small>
            )}
          </div>

          {/* Secret Key */}
          <div className="mb-4">
            <label className="form-label small">Secret Key</label>
            <div className="input-group">
              <span className="input-group-text bg-dark text-white border-0">
                <FaKey />
              </span>
              <input
                type="password"
                name="secret"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.secret}
                className="form-control bg-dark text-white border-0"
                placeholder="Enter secret key"
              />
            </div>
            {formik.touched.secret && formik.errors.secret && (
              <small className="text-danger">
                {formik.errors.secret}
              </small>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn w-100 fw-semibold text-white"
            style={{
              background: "linear-gradient(135deg,#00c6ff,#0072ff)",
              borderRadius: "30px",
            }}
          >
            Create Admin Account
          </button>
        </form>

        <div className="text-center mt-4">
          <small className="text-muted">
            © {new Date().getFullYear()} FixKar Admin Panel
          </small>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;
