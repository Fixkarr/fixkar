import axios from "axios";
import React, { useState } from "react";
import {
  FaTools,
  FaFileImage,
  FaAlignLeft,
  FaPlusCircle,
  FaServicestack,
} from "react-icons/fa";
import { server_url } from "../../../App";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setServices } from "../../../redux/service.Slice";

const AddServiceForm = () => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    // 🔥 For now only console
    try {
        setLoading(true)
            const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("image", formData.image); // 🔥 FILE HERE

        const result = await axios.post(`${server_url}/api/admin/create-service`, data, {withCredentials : true,
            headers : {
          "Content-Type": "multipart/form-data",
        }
        });
        dispatch(setServices(result.data.services))
        toast.info(result.data.message)
        setLoading(false)
    } catch (error) {
        console.log(error)
        toast.error(error.response.data.message)
        setLoading(false)
    }
  };

  return (
    <div className="container py-4">
      <div
        className="card border-0 shadow-lg rounded-4 text-white"
        style={{
          background: "linear-gradient(135deg, #0f2027, #2c5364)",
        }}
      >
        {/* ===== Header ===== */}
        <div className="card-body border-bottom border-secondary">
          <h4 className="fw-bold mb-1">
            <FaTools className="me-2 text-warning" />
            Add New Service
          </h4>
          <p className="mb-0 text-light opacity-75">
            Create a new service for FixKar platform
          </p>
        </div>

        {/* ===== Form ===== */}
        <div className="card-body bg-light text-dark rounded-bottom-4">
          <form onSubmit={handleSubmit}>
            {/* Service Name */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                <FaServicestack className="me-2 text-primary" />
                Service Name
              </label>
              <input
                type="text"
                name="name"
                className="form-control rounded-3"
                placeholder="Enter service name (e.g. Electrician)"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                <FaAlignLeft className="me-2 text-success" />
                Short Description
              </label>
              <textarea
                name="description"
                className="form-control rounded-3"
                rows="4"
                placeholder="Write a short description about the service"
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            {/* Image Upload */}
            <div className="mb-4">
              <label className="form-label fw-semibold">
                <FaFileImage className="me-2 text-danger" />
                Service Image
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                className="form-control rounded-3"
                onChange={handleChange}
                required
              />
              {formData.image && (
                <small className="text-muted">
                  Selected file: {formData.image.name}
                </small>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-100 fw-semibold py-2 rounded-pill"
              disabled={loading}
            >
              <FaPlusCircle className="me-2" />
              {loading && <ClipLoader size={20}/>} Add Service
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddServiceForm;
