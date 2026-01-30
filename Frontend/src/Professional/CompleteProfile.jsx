
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { server_url } from "../App";
import { useDispatch } from "react-redux";
import { setCurrentUserData } from "../redux/user.slice";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaUserEdit, FaMoneyBillWave, FaClock, FaCalendarDay, FaFileContract, FaTools } from "react-icons/fa";
import { MdDescription } from "react-icons/md";
import { useSelector } from "react-redux"; 

export default function CompleteProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const {currentUserData} = useSelector(state=> state.user);
  const availableSkills = currentUserData?.user?.profession?.skills || [];
  
  const [selectedSkills, setSelectedSkills] = useState([]);

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
      pricingType: "multiple",
      hourly: "",
      daily: "",
      skills: selectedSkills, 
      contractMin: "",
      contractMax: "",
      amountDesc: "",
    },
    validationSchema: Yup.object({
      description: Yup.string()
        .min(20, "Description must be at least 20 characters.")
        .required("Description is required."),
      hourly: Yup.number().nullable().min(0),
      daily: Yup.number().nullable().min(0),
      contractMin: Yup.number().nullable().min(0),
      contractMax: Yup.number()
        .nullable()
        .min(0)
        .when("contractMin", (contractMin, schema) =>
          contractMin
            ? schema.min(contractMin, "Max must be ≥ Min")
            : schema
        ),
    }),
    onSubmit: async (values, { resetForm }) => {
      const payload = {
        description: values.description,
        amountDesc: values.amountDesc,
        pricingType: values.pricingType,
        skills: selectedSkills,  
        hourly: values.hourly ? { amount: Number(values.hourly) } : undefined,
        daily: values.daily ? { amount: Number(values.daily) } : undefined,
        contract:
          values.contractMin || values.contractMax
            ? {
                minPrice: Number(values.contractMin),
                maxPrice: Number(values.contractMax),
              }
            : undefined,
      };

      try {
        setLoading(true);
        const result = await axios.post(
          `${server_url}/api/user/professional/complete-profile`,
          payload,
          { withCredentials: true }
        );
        dispatch(setCurrentUserData(result.data));
        navigate("/");
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
      resetForm();
    },
  });

  return (
    <div className="container py-4">
  <div className="row justify-content-center">
    <div className="col-lg-7 col-md-9">

      <div className="card border-0 shadow-lg rounded-4 overflow-hidden">

        {/* ===== Header ===== */}
        <div
          className="p-4 text-white"
          style={{
            background: "linear-gradient(135deg, #0d6efd, #6ea8fe)",
          }}
        >
          <div className="d-flex align-items-center gap-3">
            <IoMdArrowRoundBack
              role="button"
              size={24}
              onClick={() => navigate("/")}
            />
            <div>
              <h4 className="mb-0 fw-bold">
                <FaUserEdit className="me-2" />
                Complete Your Profile
              </h4>
              <small className="opacity-75">
                Provide details to attract more customers
              </small>
            </div>
          </div>
        </div>

        {/* ===== Body ===== */}
        <div className="card-body p-4 bg-light">

          <form onSubmit={formik.handleSubmit}>

            {/* DESCRIPTION */}
            <div className="mb-3">
              <label className="form-label fw-semibold text-primary">
                <MdDescription className="me-2" />
                Tell customers about you
              </label>
              <textarea
                rows="4"
                className={`form-control rounded-3 ${
                  formik.touched.description && formik.errors.description
                    ? "is-invalid"
                    : ""
                }`}
                {...formik.getFieldProps("description")}
              />
              <div className="invalid-feedback">
                {formik.errors.description}
              </div>
            </div>

            {availableSkills.length > 0 && (
  <div className="mb-4">
    <label className="form-label fw-semibold text-primary">
      <FaTools className="me-2" />
      Select Your Skills
    </label>

    <div className="row">
      {availableSkills.map((skill) => (
        <div className="col-md-6 mb-2" key={skill._id}>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id={`skill-${skill._id}`}
              checked={selectedSkills.includes(skill._id)}
              onChange={() => handleSkillChange(skill._id)}
            />
            <label
              className="form-check-label fw-semibold"
              htmlFor={`skill-${skill._id}`}
            >
              {skill.name}
            </label>
          </div>
        </div>
      ))}
    </div>

    {selectedSkills.length === 0 && (
      <small className="text-muted">
        Please select at least one skill to improve your profile visibility.
      </small>
    )}
  </div>
)}

            {/* PRICING TYPE */}
            <div className="mb-3">
              <label className="form-label fw-semibold text-primary">
                <FaMoneyBillWave className="me-2" />
                Pricing Method
              </label>
              <select
                className="form-select rounded-3"
                {...formik.getFieldProps("pricingType")}
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="contract">Contract</option>
                <option value="multiple">Multiple</option>
              </select>
            </div>

            {/* HOURLY */}
            {(formik.values.pricingType === "hourly" ||
              formik.values.pricingType === "multiple") && (
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  <FaClock className="me-2 text-success" />
                  Hourly Rate (₹)
                </label>
                <input
                  type="number"
                  className="form-control rounded-3"
                  {...formik.getFieldProps("hourly")}
                />
                {formik.touched.hourly && formik.errors.hourly && (
                  <small className="text-danger">
                    {formik.errors.hourly}
                  </small>
                )}
              </div>
            )}

            {/* DAILY */}
            {(formik.values.pricingType === "daily" ||
              formik.values.pricingType === "multiple") && (
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  <FaCalendarDay className="me-2 text-primary" />
                  Daily Rate (₹)
                </label>
                <input
                  type="number"
                  className="form-control rounded-3"
                  {...formik.getFieldProps("daily")}
                />
              </div>
            )}

            {/* CONTRACT */}
            {(formik.values.pricingType === "contract" ||
              formik.values.pricingType === "multiple") && (
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  <FaFileContract className="me-2 text-warning" />
                  Contract Rate (₹)
                </label>
                <div className="row g-2">
                  <div className="col">
                    <input
                      type="number"
                      className="form-control rounded-3"
                      placeholder="Min"
                      {...formik.getFieldProps("contractMin")}
                    />
                  </div>
                  <div className="col">
                    <input
                      type="number"
                      className="form-control rounded-3"
                      placeholder="Max"
                      {...formik.getFieldProps("contractMax")}
                    />
                  </div>
                </div>
                {(formik.errors.contractMin ||
                  formik.errors.contractMax) && (
                  <small className="text-danger">
                    {formik.errors.contractMin ||
                      formik.errors.contractMax}
                  </small>
                )}
              </div>
            )}

            {/* AMOUNT DESC */}
            <div className="mb-4">
              <label className="form-label fw-semibold text-primary">
                <MdDescription className="me-2" />
                About your pricing
              </label>
              <textarea
                rows="3"
                className="form-control rounded-3"
                {...formik.getFieldProps("amountDesc")}
              />
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-100 rounded-pill py-2 fw-semibold"
            >
              {loading ? <ClipLoader size={20} /> : "Save Profile"}
            </button>

          </form>
        </div>
      </div>
    </div>
  </div>
</div>

  );
}
