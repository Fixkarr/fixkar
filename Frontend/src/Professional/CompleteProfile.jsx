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
  FaSearch,
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

  const getSkillPricing = (skill) => {
    const hasFixedPrice =
      skill?.fixedPrice !== null &&
      skill?.fixedPrice !== undefined &&
      Number.isFinite(Number(skill.fixedPrice));

    if (hasFixedPrice) {
      return {
        label: `₹${Number(skill.fixedPrice).toLocaleString("en-IN")}`,
        className: "bg-success-subtle text-success border border-success-subtle",
        isFixed: true,
      };
    }

    return {
      label: "Inspection",
      className: "bg-warning-subtle text-warning-emphasis border border-warning-subtle",
      isFixed: false,
    };
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
     <div className="cp-page py-3 py-md-4">
      <div className="container">
        <div className="cp-shell">

          <div className="cp-card">

            {/* HEADER */}
            <div className="cp-header">
              <div className="d-flex align-items-center gap-3">

                <div className="cp-header-icon">
                  <FaUserEdit size={21} />
                </div>

                <div className="flex-grow-1 position-relative">

                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span className="cp-header-pill">
                      Professional setup
                    </span>
                  </div>

                  <div className="cp-header-title mb-1">
                    Complete your profile
                  </div>

                  <div className="cp-header-description">
                    Add your experience, skills and pricing so customers
                    can confidently choose you.
                  </div>

                </div>

              </div>
            </div>

            {/* BODY */}
            <div className="cp-body">

              {!isProfileComplete && (
                <form onSubmit={formik.handleSubmit}>

                  {/* DESCRIPTION */}
                  <div className="cp-section">

                    <div className="cp-section-head">
                      <div className="cp-section-title-wrap">

                        <div className="cp-section-icon">
                          <MdDescription size={17} />
                        </div>

                        <div>
                          <h5 className="cp-section-title">
                            About your work
                          </h5>

                          <p className="cp-section-subtitle">
                            Tell customers about your experience and work quality.
                          </p>
                        </div>

                      </div>
                    </div>

                    <textarea
                      rows="4"
                      maxLength={500}
                      className={`form-control cp-description ${
                        formik.touched.description &&
                        formik.errors.description
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder="Example: I have 7 years of experience in residential electrical work..."
                      {...formik.getFieldProps("description")}
                    />

                    <div className="d-flex justify-content-between mt-1">
                      <div className="invalid-feedback d-block">
                        {formik.touched.description &&
                          formik.errors.description}
                      </div>

                      <small className="cp-counter ms-auto">
                        {formik.values.description.length}/500
                      </small>
                    </div>

                  </div>

                  {/* SKILLS + INLINE PRICING */}
                  {availableSkills.length > 0 && (
                    <div className="cp-section">

                      <div className="cp-section-head">

                        <div className="cp-section-title-wrap">

                          <div className="cp-section-icon">
                            <FaTools size={15} />
                          </div>

                          <div>
                            <h5 className="cp-section-title">
                              Choose your skills
                            </h5>

                            <p className="cp-section-subtitle">
                              Select a task and set its price right here.
                            </p>
                          </div>

                        </div>

                        <span className="cp-count">
                          {selectedSkills.length} selected
                        </span>

                      </div>

                      <div className="cp-skills-grid">

                        {availableSkills.map((skill) => {

                          const selected =
                            selectedSkills.includes(skill._id);

                          const pricing =
                            getSkillPricing(skill);

                          return (
                            <div
                              key={skill._id}
                              className={`cp-skill ${
                                selected ? "selected" : ""
                              }`}
                              onClick={() =>
                                handleSkillChange(skill._id)
                              }
                            >

                              <div className="cp-skill-top">

                                <span className="cp-skill-check">
                                  {selected ? (
                                    <FaCheckCircle size={14} />
                                  ) : (
                                    <FaTools size={12} />
                                  )}
                                </span>

                                <span className="cp-skill-info">

                                  <span className="cp-skill-name">
                                    {skill.name}
                                  </span>

                                  <span className="cp-skill-type">

                                    <span
                                      className={`cp-price-badge ${pricing.className}`}
                                    >
                                      {pricing.isFixed ? (
                                        <FaRupeeSign />
                                      ) : (
                                        <FaSearch />
                                      )}

                                      {pricing.isFixed
                                        ? Number(
                                            skill.fixedPrice
                                          ).toLocaleString("en-IN")
                                        : "Inspection"}
                                    </span>

                                    {selected && (
                                      <span className="cp-selected-label">
                                        Selected
                                      </span>
                                    )}

                                  </span>

                                </span>

                              </div>

                              {/* INLINE PRICE ONLY FOR SPECIALIZED */}
                              {isSpecialized && selected && (
                                <div
                                  className="cp-inline-price"
                                  onClick={(e) =>
                                    e.stopPropagation()
                                  }
                                >
                                  <label className="cp-inline-price-label">
                                    Your customer-facing price
                                  </label>

                                  <div className="d-flex">

                                    <span className="cp-price-prefix">
                                      <FaRupeeSign />
                                    </span>

                                    <input
                                      type="number"
                                      min="0"
                                      className="form-control cp-price-input"
                                      placeholder="Enter price"
                                      value={
                                        taskPrices[skill._id] ?? ""
                                      }
                                      onChange={(event) =>
                                        setTaskPrices(
                                          (current) => ({
                                            ...current,
                                            [skill._id]:
                                              event.target.value,
                                          })
                                        )
                                      }
                                      required
                                    />

                                  </div>
                                </div>
                              )}

                            </div>
                          );
                        })}

                      </div>

                      <div className="cp-info">
                        <FaInfoCircle />

                        <span>
                          Fixed-price tasks already have a predefined price.
                          Inspection tasks are priced after diagnosis according
                          to the service flow.
                        </span>
                      </div>

                    </div>
                  )}

                  {/* VISITING CHARGE */}
                  {isSpecialized && (
                    <div className="cp-section">

                      <div className="cp-visiting">

                        <div className="cp-visiting-info">

                          <div className="cp-visiting-icon">
                            <FaRupeeSign size={15} />
                          </div>

                          <div>
                            <div className="cp-visiting-title">
                              Visiting charge
                            </div>

                            <div className="cp-visiting-description">
                              Amount charged for inspection or visit.
                            </div>
                          </div>

                        </div>

                        <div className="input-group cp-visiting-input">

                          <span className="input-group-text bg-white border-end-0">
                            <FaRupeeSign className="text-muted" />
                          </span>

                          <input
                            type="number"
                            min="0"
                            className="form-control border-start-0"
                            placeholder="Visiting charge"
                            value={visitingCharge}
                            onChange={(e) =>
                              setVisitingCharge(e.target.value)
                            }
                            required
                          />

                        </div>

                      </div>

                    </div>
                  )}

                  {/* SAVE */}
                  <div className="cp-save-area">

                    <div className="cp-security">
                      <FaShieldAlt />

                      <span>
                        Keep your information accurate. Customers use these
                        details to decide whether your service matches their needs.
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary cp-save w-100 d-flex align-items-center justify-content-center gap-2"
                    >
                      {loading ? (
                        <ClipLoader size={18} color="#fff" />
                      ) : (
                        <>
                          Save profile
                          <FaArrowRight size={13} />
                        </>
                      )}
                    </button>

                  </div>

                </form>
              )}

              {/* DYNAMIC FORM */}
              {!ChargesDefined && (
                <div className="cp-extra">

                  <div className="cp-section-head">

                    <div className="cp-section-title-wrap">

                      <div className="cp-section-icon">
                        <FaInfoCircle size={15} />
                      </div>

                      <div>
                        <h5 className="cp-section-title">
                          A few more details
                        </h5>

                        <p className="cp-section-subtitle">
                          Complete the remaining service-specific information.
                        </p>
                      </div>

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
  );
}
