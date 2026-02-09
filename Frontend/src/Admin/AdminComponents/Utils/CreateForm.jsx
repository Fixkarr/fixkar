import { useState } from "react";
import axios from "axios";
import {
  FaWpforms,
  FaInfoCircle,
  FaBullseye,
  FaTag,
  FaToggleOn,
  FaPlusCircle
} from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { server_url } from "../../../App";

const CreateForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    key: "",
    purpose: "",
    title: "",
    description: "",
    targetEntity: "",
    isActive: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.key || !formData.purpose || !formData.title) {
      toast.error("Key, Purpose and Title are required");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        key: formData.key.trim(),
        purpose: formData.purpose,
        title: formData.title,
        description: formData.description,
        isActive: formData.isActive,
        target: {
          entity: formData.targetEntity || undefined
        }
      };

      await axios.post(
        `${server_url}/api/admin/forms`,
        payload,
        { withCredentials: true }
      );

      toast.success("Form created successfully");
      navigate("/admin/forms");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-3">
      <div
        className="card border-0 shadow-lg rounded-4"
        style={{
          background: "linear-gradient(135deg, #0f2027, #2c5364)"
        }}
      >
        {/* ===== HEADER ===== */}
        <div className="card-body border-bottom">
          <h5 className="fw-bold text-light mb-1">
            <FaWpforms className="me-2 text-primary" />
            Create New Form
          </h5>
          <small className="text-light opacity-75">
            Define basic structure before adding sections & fields
          </small>
        </div>

        {/* ===== FORM BODY ===== */}
        <div className="card-body bg-light">
          <form onSubmit={handleSubmit}>
            {/* Form Title */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                <FaInfoCircle className="me-2" />
                Form Title
              </label>
              <input
                type="text"
                name="title"
                className="form-control rounded-3"
                placeholder="Electrician Pricing Form"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Form Key */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                <FaTag className="me-2" />
                Form Key (unique)
              </label>
              <input
                type="text"
                name="key"
                className="form-control rounded-3"
                placeholder="electrician_pricing_v1"
                value={formData.key}
                onChange={handleChange}
                required
              />
              <small className="text-muted">
                Use snake_case and versioning (v1, v2…)
              </small>
            </div>

            {/* Purpose */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                <FaBullseye className="me-2" />
                Purpose
              </label>
              <select
                name="purpose"
                className="form-select rounded-3"
                value={formData.purpose}
                onChange={handleChange}
                required
              >
                <option value="">Select purpose</option>
                <option value="pricing">Pricing</option>
                <option value="onboarding">Onboarding</option>
                <option value="kyc">KYC</option>
                <option value="profile">Profile</option>
                <option value="survey">Survey</option>
                <option value="settings">Settings</option>
              </select>
            </div>

            {/* Target Entity */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                <FaBullseye className="me-2" />
                Target Entity (optional)
              </label>
              <select
                name="targetEntity"
                className="form-select rounded-3"
                value={formData.targetEntity}
                onChange={handleChange}
              >
                <option value="">None</option>
                <option value="service">Service</option>
                <option value="professional">Professional</option>
                <option value="booking">Booking</option>
                <option value="user">User</option>
              </select>
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Description
              </label>
              <textarea
                name="description"
                rows="3"
                className="form-control rounded-3"
                placeholder="This form is used to define electrician service charges"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* Active Toggle */}
            <div className="form-check form-switch mb-4">
              <input
                className="form-check-input"
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
              <label className="form-check-label fw-semibold">
                <FaToggleOn className="me-2 text-success" />
                Form is Active
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary w-100 rounded-pill fw-semibold"
              disabled={loading}
            >
              {loading ? (
                <ClipLoader size={20} />
              ) : (
                <>
                  <FaPlusCircle className="me-2" />
                  Create Form
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateForm;
