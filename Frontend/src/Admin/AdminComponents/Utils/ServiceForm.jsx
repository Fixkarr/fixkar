import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  FaTools,
  FaFileImage,
  FaAlignLeft,
  FaPlusCircle,
  FaServicestack,
  FaTimes,
} from "react-icons/fa";
import { server_url } from "../../../App";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setServices } from "../../../redux/service.Slice";
import { MdOutlineMoney } from "react-icons/md";

const ServiceForm = ({ mode = "create", service = null}) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
    commission: "",
  });

  const [serviceType, setServiceType] = useState("skill_based");

  const [skillForm, setSkillForm] = useState({
    name: "",

    bookingType: "inspection",

    fixedPrice: "",
  });

  const [skills, setSkills] = useState([]);

  useEffect(() => {
    if (mode !== "update" || !service) return;

    setFormData({
      name: service.name,

      description: service.description,

      commission: service.commission,

      image: null,
    });

    setServiceType(service.serviceType);

    setSkills(service.skills || []);
  }, [mode, service]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addSkill = () => {
    if (!skillForm.name.trim()) {
      toast.warning("Enter skill name");
      return;
    }

    if (serviceType === "skill_based" && skillForm.bookingType === "fixed" && !skillForm.fixedPrice) {
      toast.warning("Enter fixed price");
      return;
    }

    const alreadyExists = skills.find(
      (s) => s.name.toLowerCase() === skillForm.name.toLowerCase(),
    );

    if (alreadyExists) {
      toast.warning("Skill already added");
      return;
    }

    setSkills([
      ...skills,
      {
        name: skillForm.name,
        bookingType: serviceType === "specialized" ? "fixed" : skillForm.bookingType,
        fixedPrice:
          serviceType === "skill_based" && skillForm.bookingType === "fixed"
            ? Number(skillForm.fixedPrice)
            : null,
      },
    ]);

    setSkillForm({
      name: "",
      bookingType: "inspection",
      fixedPrice: "",
    });
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === "create" && !formData.image) {
      toast.error("Service image is required");
      return;
    }


    if (skills.length === 0) {
      toast.error("Please add at least one skill");
      return;
    }

    // 🔥 For now only console
    try {
      setLoading(true);
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("commission", formData.commission);
      data.append("image", formData.image); // 🔥 FILE HERE
      data.append("serviceType", serviceType);
      data.append("skills", JSON.stringify(skills));

      let result;

      if (mode == "create") {
        result = await axios.post(
          `${server_url}/api/admin/create-service`,
          data,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
      } else {
        result = await axios.post(
          `${server_url}/api/admin/update-service/${service._id}`,
          data,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
      }

      dispatch(setServices(result.data.services));
      toast.info(result.data.message);

      setFormData({ name: "", description: "", image: null, commission: "" });
      setSkills([]);
      setServiceType("skill_based");
      setSkillForm({
        name: "",
        bookingType: "inspection",
        fixedPrice: "",
      });

      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div
        className="card border-0 shadow-lg rounded-4 overflow-hidden"
        style={{
          background: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
        }}
      >
        {/* Header */}
        <div className="card-body text-white border-bottom border-secondary py-4">
          <h3 className="fw-bold mb-1">
            <FaTools className="me-2 text-warning" />
            {mode === "create" ? "Add New Service" : "Update Service"}
          </h3>

          <p className="mb-0 text-light opacity-75">
            {mode === "create"
              ? "Create a service..."
              : `Editing ${service?.name}`}{" "}
            and configure how professionals can receive bookings.
          </p>
        </div>

        <div className="card-body bg-light">
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Left */}
              <div className="col-lg-6">
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    <FaServicestack className="me-2 text-primary" />
                    Service Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    className="form-control rounded-3"
                    placeholder="Electrical, Plumbing, AC Service..."
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    <MdOutlineMoney className="me-2 text-success" />
                    Commission (%)
                  </label>

                  <input
                    type="number"
                    name="commission"
                    className="form-control rounded-3"
                    placeholder="Enter platform commission"
                    value={formData.commission}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Right */}
              <div className="col-lg-6">
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    <FaAlignLeft className="me-2 text-info" />
                    Description
                  </label>

                  <textarea
                    rows={5}
                    name="description"
                    className="form-control rounded-3"
                    placeholder="Describe this service..."
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Service Type */}

            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white fw-bold">Service Type</div>

              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <div
                      className={`card h-100 ${
                        serviceType === "skill_based"
                          ? "border-primary shadow"
                          : ""
                      }`}
                      style={{ cursor: "pointer" }}
                      onClick={() => setServiceType("skill_based")}
                    >
                      <div className="card-body">
                        <h6 className="fw-bold">Skill Based Service</h6>

                        <small className="text-muted">
                          Professionals choose tasks like Fan Installation,
                          Socket Repair, Wiring etc.
                        </small>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div
                      className={`card h-100 ${
                        serviceType === "specialized"
                          ? "border-success shadow"
                          : ""
                      }`}
                      style={{ cursor: "pointer" }}
                      onClick={() => setServiceType("specialized")}
                    >
                      <div className="card-body">
                        <h6 className="fw-bold">Specialized Service</h6>

                        <small className="text-muted">
                          Professionals register directly for this service.
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {(serviceType === "skill_based" || serviceType === "specialized") && (
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-white fw-bold d-flex justify-content-between align-items-center">
                  <span>Tasks / Bookable Services</span>

                  <small className="text-muted">
                    Add all bookable tasks under this service
                  </small>
                </div>

                <div className="card-body">
                  <div className="row g-3 align-items-end">
                    {/* Task Name */}
                    <div className="col-lg-5">
                      <label className="form-label fw-semibold">
                        Task Name
                      </label>

                      <input
                        type="text"
                        className="form-control rounded-3"
                        placeholder="Fan Installation"
                        value={skillForm.name}
                        onChange={(e) =>
                          setSkillForm({
                            ...skillForm,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>

                    {/* Booking Type */}

                    {serviceType === "skill_based" && <div className="col-lg-3">
                      <label className="form-label fw-semibold">
                        Booking Type
                      </label>

                      <select
                        className="form-select rounded-3"
                        value={skillForm.bookingType}
                        onChange={(e) =>
                          setSkillForm({
                            ...skillForm,
                            bookingType: e.target.value,
                          })
                        }
                      >
                        <option value="inspection">Inspection</option>

                        <option value="fixed">Fixed Price</option>
                      </select>
                    </div>}

                    {/* Fixed Price */}

                    {serviceType === "skill_based" && skillForm.bookingType === "fixed" && (
                      <div className="col-lg-2">
                        <label className="form-label fw-semibold">Price</label>

                        <input
                          type="number"
                          className="form-control rounded-3"
                          placeholder="250"
                          value={skillForm.fixedPrice}
                          onChange={(e) =>
                            setSkillForm({
                              ...skillForm,
                              fixedPrice: e.target.value,
                            })
                          }
                        />
                      </div>
                    )}

                    {/* Add Button */}

                    <div
                      className={
                        serviceType === "skill_based" && skillForm.bookingType === "fixed"
                          ? "col-lg-2"
                          : "col-lg-4"
                      }
                    >
                      <button
                        type="button"
                        className="btn btn-success w-100 rounded-3"
                        onClick={addSkill}
                      >
                        <FaPlusCircle className="me-2" />
                        Add Task
                      </button>
                    </div>
                  </div>

                  {/* Task List */}

                  {skills.length > 0 && (
                    <div className="table-responsive mt-4">
                      <table className="table table-hover align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>Task</th>

                            <th>{serviceType === "skill_based" ? "Booking Type" : "Pricing"}</th>

                            <th>Price</th>

                            <th width="80">Action</th>
                          </tr>
                        </thead>

                        <tbody>
                          {skills.map((skill, index) => (
                            <tr key={index}>
                              <td className="fw-semibold">{skill.name}</td>

                              <td>
                                {serviceType === "specialized" ? (
                                  <span className="badge bg-info text-dark">Professional-defined</span>
                                ) : skill.bookingType === "fixed" ? (
                                  <span className="badge bg-success">
                                    Fixed
                                  </span>
                                ) : (
                                  <span className="badge bg-warning text-dark">
                                    Inspection
                                  </span>
                                )}
                              </td>

                              <td>
                                {serviceType === "specialized"
                                  ? "Professional sets price"
                                  : skill.bookingType === "fixed"
                                  ? `₹${skill.fixedPrice}`
                                  : "--"}
                              </td>

                              <td>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => removeSkill(index)}
                                >
                                  <FaTimes />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ================= Image Upload ================= */}

            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white fw-bold">Service Image</div>

              <div className="card-body">
                <label className="form-label fw-semibold">
                  <FaFileImage className="me-2 text-danger" />
                  Upload Image
                </label>

                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="form-control rounded-3"
                  onChange={handleChange}
                  required={mode === "create"}
                />

                {formData.image && (
                  <div className="alert alert-success mt-3 mb-0 py-2">
                    <strong>Selected:</strong> {formData.image.name}
                  </div>
                )}
              </div>
            </div>

            {/* ================= Submit ================= */}

            <div className="d-flex justify-content-end gap-3">
              <button
                type="reset"
                className="btn btn-outline-secondary px-4 rounded-pill"
                onClick={() => {
                  setFormData({
                    name: "",
                    description: "",
                    image: null,
                    commission: "",
                  });

                  setSkills([]);

                  setServiceType("skill_based");

                  setSkillForm({
                    name: "",
                    bookingType: "inspection",
                    fixedPrice: "",
                  });
                }}
              >
                Reset
              </button>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary px-5 rounded-pill fw-semibold"
              >
                {loading ? (
                  <>
                    <ClipLoader size={18} color="#fff" />

                    <span className="ms-2">
                      {loading
                        ? mode === "create"
                          ? "Creating..."
                          : "Updating..."
                        : mode === "create"
                          ? "Add Service"
                          : "Update Service"}
                    </span>
                  </>
                ) : (
                  <>
                    <FaPlusCircle className="me-2" />
                    Add Service
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServiceForm;
