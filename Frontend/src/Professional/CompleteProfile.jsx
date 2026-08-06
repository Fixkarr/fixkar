
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { server_url } from "../App";
import { useDispatch } from "react-redux";
import { setCurrentUserData } from "../redux/user.slice";
import { useNavigate } from "react-router-dom";
import { FaUserEdit , FaTools } from "react-icons/fa";
import { MdDescription } from "react-icons/md";
import { useSelector } from "react-redux"; 
import DynamicForm from "../Admin/AdminComponents/Utils/DynamicForm";
import useGetForm from "../hooks/useGetForm";

export default function CompleteProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const {currentUserData} = useSelector(state=> state.user);
  const availableSkills = currentUserData?.user?.profession?.skills || [];
  const serviceId = currentUserData?.user?.profession._id;
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [visitingCharge, setVisitingCharge] = useState("");
  const [taskPrices, setTaskPrices] = useState({});
  const isSpecialized = currentUserData?.user?.profession?.serviceType === "specialized";
 
  const isProfileComplete = currentUserData?.user?.description 
   const ChargesDefined = currentUserData?.user?.isChargesDefined

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

  visitingCharge: isSpecialized
    ? Number(visitingCharge)
    : null,

  taskPricing: isSpecialized
    ? selectedSkills.map((skill) => ({
        skill,
        price: Number(taskPrices[skill]),
      }))
    : [],
};

     if (
  isSpecialized &&
  (!Number.isFinite(Number(visitingCharge)) ||
    Number(visitingCharge) < 0)
) {
  toast.error("Please define a valid visiting charge");
  return;
}

      if (isSpecialized && selectedSkills.some((skill) => !Number.isFinite(Number(taskPrices[skill])) || Number(taskPrices[skill]) < 0)) {
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
      } finally {
        setLoading(false);
      }
      resetForm();
    },
  });

  return (!isProfileComplete || !ChargesDefined) ? (
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

          {!isProfileComplete && <form onSubmit={formik.handleSubmit}>

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
            {isSpecialized && (
  <div className="mb-4">
    <label className="form-label fw-semibold text-primary">
      Visiting Charge (₹)
    </label>

    <input
      type="number"
      min="0"
      className="form-control"
      value={visitingCharge}
      onChange={(e) => setVisitingCharge(e.target.value)}
      required
    />

    <small className="text-muted">
      Customer ko inspection booking ke saath ye visiting charge dikhaya jayega.
    </small>
  </div>
)}

              {isSpecialized && selectedSkills.length > 0 && (
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-body">
                    <h6 className="fw-semibold">Set your task prices</h6>
                    <small className="text-muted d-block mb-3">Admin ne tasks banaye hain; unki price aap define karenge.</small>
                    {availableSkills.filter((skill) => selectedSkills.includes(skill._id)).map((skill) => (
                      <div className="row align-items-center mb-2" key={skill._id}>
                        <label className="col-7 col-form-label">{skill.name}</label>
                        <div className="col-5"><input type="number" min="0" className="form-control" placeholder="Price"
                          value={taskPrices[skill._id] ?? ""}
                          onChange={(event) => setTaskPrices((current) => ({ ...current, [skill._id]: event.target.value }))} required /></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-100 rounded-pill py-2 fw-semibold"
            >
              {loading ? <ClipLoader size={20} /> : "Save Profile"}
            </button>

          </form>}
              {!ChargesDefined && <div className="container mt-2">
                <DynamicForm form={form}/>
              </div>}
        </div>
      </div>
    </div>
  </div>
</div>

  ) : navigate('/');
}
