import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { server_url } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUserData } from "../redux/user.slice";
import { useNavigate } from "react-router-dom";
import {
  FaUserEdit,
  FaTools,
  FaCheckCircle,
  FaRupeeSign,
  FaInfoCircle,
  FaArrowRight,
  FaShieldAlt,
} from "react-icons/fa";
import { MdDescription, MdPriceCheck } from "react-icons/md";
import { toast } from "react-toastify";
import DynamicForm from "../Admin/AdminComponents/Utils/DynamicForm";
import useGetForm from "../hooks/useGetForm";

export default function CompleteProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { currentUserData } = useSelector((state) => state.user);

  const availableSkills = currentUserData?.user?.profession?.skills || [];
  const serviceId = currentUserData?.user?.profession?._id;
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [visitingCharge, setVisitingCharge] = useState("");
  const [taskPrices, setTaskPrices] = useState({});
  const isSpecialized =
    currentUserData?.user?.profession?.serviceType === "specialized";

  const isProfileComplete = currentUserData?.user?.description;
  const ChargesDefined = currentUserData?.user?.isChargesDefined;
  const form = useGetForm(serviceId);

  const handleSkillChange = (skillId) => {
    setSelectedSkills((prev) =>
      prev.includes(skillId)
        ? prev.filter((id) => id !== skillId)
        : [...prev, skillId]
    );
  };

  const formik = useFormik({
    initialValues: {
      description: "",
      skills: selectedSkills,
    },
    validationSchema: Yup.object({
      description: Yup.string()
        .min(20, "Description must be at least 20 characters.")
        .required("Description is required."),
    }),
    onSubmit: async (values, { resetForm }) => {
      const payload = {
        description: values.description,
        skills: selectedSkills,
        visitingCharge: isSpecialized ? Number(visitingCharge) : null,
        taskPricing: isSpecialized
          ? selectedSkills.map((skill) => ({
              skill,
              price: Number(taskPrices[skill]),
            }))
          : [],
      };

      if (
        isSpecialized &&
        (!Number.isFinite(Number(visitingCharge)) || Number(visitingCharge) < 0)
      ) {
        toast.error("Please define a valid visiting charge");
        return;
      }

      if (
        isSpecialized &&
        selectedSkills.some(
          (skill) =>
            !Number.isFinite(Number(taskPrices[skill])) ||
            Number(taskPrices[skill]) < 0
        )
      ) {
        toast.error("Please define a price for every selected specialised task");
        return;
      }

      try {
        setLoading(true);
        const result = await axios.post(
          `${server_url}/api/user/professional/complete-profile`,
          payload,
          { withCredentials: true }
        );
        dispatch(setCurrentUserData(result.data));
      } catch (err) {
        console.log(err);
        toast.error(
          err.response?.data?.message || "Unable to save your profile right now."
        );
      } finally {
        setLoading(false);
      }
      resetForm();
    },
  });

  if (isProfileComplete && ChargesDefined) {
    navigate("/");
    return null;
  }

  return (
    <div className="bg-light min-vh-100 py-3 py-md-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-xl-9">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="p-4 p-md-5 text-white bg-primary">
                <div className="d-flex align-items-start gap-3">
                  <div className="bg-white bg-opacity-25 rounded-3 p-3 flex-shrink-0">
                    <FaUserEdit size={24} />
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                      <span className="badge rounded-pill bg-white text-primary px-3 py-2">
                        Professional setup
                      </span>
                      <span className="small opacity-75">
                        Help customers understand your work
                      </span>
                    </div>
                    <h2 className="h3 fw-bold mb-2">Complete your profile</h2>
                    <p className="mb-0 opacity-75">
                      Add your experience, skills and pricing so customers can
                      confidently choose you.
                    </p>
                  </div>
                </div>
              </div>

              <div className="card-body p-3 p-md-5">
                {!isProfileComplete && (
                  <form onSubmit={formik.handleSubmit}>
                    <div className="mb-4">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <MdDescription className="text-primary" size={22} />
                        <h5 className="fw-bold mb-0">About your work</h5>
                      </div>
                      <p className="text-muted small mb-3">
                        Write a short introduction about your experience, work
                        quality and the type of customers you help.
                      </p>
                      <textarea
                        rows="5"
                        maxLength={500}
                        className={`form-control form-control-lg rounded-3 ${
                          formik.touched.description && formik.errors.description
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Example: I have 7 years of experience in residential electrical work..."
                        {...formik.getFieldProps("description")}
                      />
                      <div className="d-flex justify-content-between mt-2">
                        <div className="invalid-feedback d-block">
                          {formik.touched.description && formik.errors.description}
                        </div>
                        <small className="text-muted ms-auto">
                          {formik.values.description.length}/500
                        </small>
                      </div>
                    </div>

                    {availableSkills.length > 0 && (
                      <div className="mb-4">
                        <div className="d-flex align-items-start gap-2 mb-3">
                          <FaTools className="text-primary mt-1" size={19} />
                          <div>
                            <h5 className="fw-bold mb-1">Choose your skills</h5>
                            <p className="text-muted small mb-0">
                              Select only the work you are confident and available
                              to provide.
                            </p>
                          </div>
                        </div>

                        <div className="row g-2 g-md-3">
                          {availableSkills.map((skill) => {
                            const selected = selectedSkills.includes(skill._id);
                            return (
                              <div className="col-12 col-sm-6" key={skill._id}>
                                <button
                                  type="button"
                                  onClick={() => handleSkillChange(skill._id)}
                                  className={`w-100 text-start border rounded-3 p-3 bg-white d-flex align-items-center gap-3 ${
                                    selected
                                      ? "border-primary shadow-sm"
                                      : "border-light-subtle"
                                  }`}
                                  style={{
                                    transition: "all .2s ease",
                                    minHeight: "68px",
                                  }}
                                >
                                  <span
                                    className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 ${
                                      selected
                                        ? "bg-primary text-white"
                                        : "bg-light text-primary"
                                    }`}
                                    style={{ width: 40, height: 40 }}
                                  >
                                    {selected ? (
                                      <FaCheckCircle />
                                    ) : (
                                      <FaTools />
                                    )}
                                  </span>
                                  <span className="flex-grow-1">
                                    <span className="d-block fw-semibold text-dark">
                                      {skill.name}
                                    </span>
                                    <small className="text-muted">
                                      {selected ? "Selected" : "Tap to select"}
                                    </small>
                                  </span>
                                  {selected && (
                                    <FaCheckCircle className="text-primary flex-shrink-0" />
                                  )}
                                </button>
                              </div>
                            );
                          })}
                        </div>

                        <div className="alert alert-light border rounded-3 mt-3 mb-0 py-2 px-3 small">
                          <FaInfoCircle className="text-primary me-2" />
                          Selecting relevant skills helps customers find the right
                          professional for their work.
                        </div>
                      </div>
                    )}

                    {isSpecialized && (
                      <div className="border rounded-4 p-3 p-md-4 mb-4 bg-light">
                        <div className="d-flex align-items-start gap-3 mb-3">
                          <div className="bg-primary-subtle text-primary rounded-3 p-2">
                            <FaRupeeSign size={20} />
                          </div>
                          <div>
                            <h5 className="fw-bold mb-1">Visiting charge</h5>
                            <p className="text-muted small mb-0">
                              Set what you charge when a customer books an
                              inspection or visit.
                            </p>
                          </div>
                        </div>
                        <div className="input-group input-group-lg">
                          <span className="input-group-text bg-white border-end-0">
                            <FaRupeeSign className="text-muted" />
                          </span>
                          <input
                            type="number"
                            min="0"
                            className="form-control border-start-0 rounded-end-3"
                            placeholder="Enter visiting charge"
                            value={visitingCharge}
                            onChange={(e) => setVisitingCharge(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    )}

                    {isSpecialized && selectedSkills.length > 0 && (
                      <div className="mb-4">
                        <div className="d-flex align-items-start gap-2 mb-3">
                          <MdPriceCheck className="text-primary mt-1" size={24} />
                          <div>
                            <h5 className="fw-bold mb-1">Set your task prices</h5>
                            <p className="text-muted small mb-0">
                              Add the starting price customers will see for each
                              selected task.
                            </p>
                          </div>
                        </div>

                        <div className="row g-3">
                          {availableSkills
                            .filter((skill) => selectedSkills.includes(skill._id))
                            .map((skill) => (
                              <div className="col-12 col-md-6" key={skill._id}>
                                <div className="border rounded-3 p-3 h-100 bg-white shadow-sm">
                                  <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
                                    <div>
                                      <span className="fw-semibold text-dark d-block">
                                        {skill.name}
                                      </span>
                                      <small className="text-muted">
                                        Customer-facing task price
                                      </small>
                                    </div>
                                    <FaCheckCircle className="text-success" />
                                  </div>
                                  <div className="input-group">
                                    <span className="input-group-text bg-light">
                                      <FaRupeeSign className="text-muted" />
                                    </span>
                                    <input
                                      type="number"
                                      min="0"
                                      className="form-control"
                                      placeholder="Enter price"
                                      value={taskPrices[skill._id] ?? ""}
                                      onChange={(event) =>
                                        setTaskPrices((current) => ({
                                          ...current,
                                          [skill._id]: event.target.value,
                                        }))
                                      }
                                      required
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    <div className="border-top pt-4 mt-4">
                      <div className="d-flex align-items-start gap-2 mb-3">
                        <FaShieldAlt className="text-success mt-1" />
                        <small className="text-muted">
                          Keep your information accurate. Customers use these
                          details to decide whether your service matches their
                          needs.
                        </small>
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary btn-lg w-100 rounded-3 fw-semibold py-3 d-flex align-items-center justify-content-center gap-2"
                      >
                        {loading ? (
                          <ClipLoader size={20} color="#fff" />
                        ) : (
                          <>
                            Save profile
                            <FaArrowRight />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {!ChargesDefined && (
                  <div className="mt-4 pt-2 border-top">
                    <div className="d-flex align-items-start gap-2 mb-3">
                      <FaInfoCircle className="text-primary mt-1" />
                      <div>
                        <h5 className="fw-bold mb-1">A few more details</h5>
                        <p className="text-muted small mb-0">
                          Complete the remaining service-specific information to
                          finish your professional profile.
                        </p>
                      </div>
                    </div>
                    <DynamicForm form={form} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
