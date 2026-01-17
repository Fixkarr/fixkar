import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaTools,
  FaFileImage,
  FaAlignLeft,
  FaPlusCircle,
  FaServicestack,
  FaTimes,
  FaEdit
} from "react-icons/fa";
import { server_url } from "../../../App";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { setServices } from "../../../redux/service.Slice";
import useGetServices from "../../../hooks/useGetServices";
import { useParams } from "react-router-dom";


const UpdateServiceForm = () => {
     useGetServices()
     const {services} = useSelector(state => state.services)
     const {serviceId} = useParams();
   const service = services?.find(
    (s) => s._id === serviceId
    );


  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
  });

  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);

  // 🔁 preload service data
  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || "",
        description: service.description || "",
        image: null,
      });

      setSkills(service.skills?.map((s) => s.name) || []);
    }
  }, [service]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;

    if (skills.includes(skillInput.trim())) {
      toast.warning("Skill already added");
      return;
    }

    setSkills([...skills, skillInput.trim()]);
    setSkillInput("");
  };

  const removeSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description) {
      toast.error("Name and description are required");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);

      if (formData.image) {
        data.append("image", formData.image);
      }

      // 🔥 FULL SKILLS ARRAY (replace mode)
      skills.forEach((skill) => {
        data.append("skills[]", skill);
      });

      const res = await axios.post(
        `${server_url}/api/admin/update-service/${service._id}`,
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      dispatch(setServices(res.data.services));
      toast.success(res.data.message || "Service updated");

      if (onClose) onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!service) return null;

  return (
    <div className="container py-3">
      <div className="card border-0 shadow-lg rounded-4"
       style={{
          background: "linear-gradient(135deg, #0f2027, #2c5364)",
        }}
      >
        {/* ===== Header ===== */}
        <div className="card-body border-bottom">
          <h5 className="fw-bold text-light mb-1">
            <FaEdit className="me-2 text-primary" />
            Update Service
          </h5>
          <small className="text-light">
            Editing <strong>{service.name}</strong>
          </small>
        </div>

        {/* ===== Form ===== */}
        <div className="card-body bg-light">
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                <FaServicestack className="me-2" />
                Service Name
              </label>
              <input
                type="text"
                name="name"
                className="form-control rounded-3"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                <FaAlignLeft className="me-2" />
                Description
              </label>
              <textarea
                name="description"
                rows="4"
                className="form-control rounded-3"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            {/* Skills */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                <FaTools className="me-2" />
                Skills (will replace old ones)
              </label>

              <div className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control rounded-3"
                  placeholder="Fan Repair"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={addSkill}
                >
                  Add
                </button>
              </div>

              <div className="mt-2 d-flex flex-wrap gap-2">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="badge bg-primary d-flex align-items-center gap-2 px-3 py-2"
                  >
                    {skill}
                    <FaTimes
                      style={{ cursor: "pointer" }}
                      onClick={() => removeSkill(skill)}
                    />
                  </span>
                ))}
              </div>
            </div>

            {/* Image */}
            <div className="mb-4">
              <label className="form-label fw-semibold">
                <FaFileImage className="me-2" />
                Update Image (optional)
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                className="form-control rounded-3"
                onChange={handleChange}
              />
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
                  Update Service
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateServiceForm;
