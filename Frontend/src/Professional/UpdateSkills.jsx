import React, { useEffect, useState } from "react";
import axios from "axios";
import { server_url } from "../App";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { FaTools, FaSave } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setCurrentUserData } from "../redux/user.slice";

const UpdateSkills = ({ professional }) => {
  const [allSkills, setAllSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [visitingCharge, setVisitingCharge] = useState(0);
  const [taskPrices, setTaskPrices] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()
  const isSpecialized = professional?.profession?.serviceType === "specialized";

  console.log("SERVICE TYPE:", professional?.profession?.serviceType);
console.log("IS SPECIALIZED:", isSpecialized);
console.log("VISITING CHARGE:", professional?.visitingCharge);
console.log("TASK PRICING:", professional?.taskPricing);

  /* ✅ Init skills from props */
  useEffect(() => {
    if (!professional) return;

    // profession ke andar wali skills
    const professionSkills =
      professional?.profession?.skills || [];

    setAllSkills(professionSkills);

    // already selected skills (ids)
    const alreadySelected =
      professional?.selectedSkills?.map((s) => s._id) || [];

    setSelectedSkills(alreadySelected);
   if (isSpecialized) {
  setVisitingCharge(professional?.visitingCharge ?? 0);
}
    setTaskPrices(
      Object.fromEntries((professional?.taskPricing || []).map((rate) => [rate.skill?._id || rate.skill, rate.price]))
    );
  }, [professional]);

  /* 🔁 Toggle skill */
  const toggleSkill = (skillId) => {
  setSelectedSkills((prev) => {
    const isAlreadySelected = prev.includes(skillId);

    if (isAlreadySelected) {
      setTaskPrices((current) => {
        const updated = { ...current };
        delete updated[skillId];
        return updated;
      });

      return prev.filter((id) => id !== skillId);
    }

    setTaskPrices((current) => ({
      ...current,
      [skillId]: current[skillId] ?? "",
    }));

    return [...prev, skillId];
  });
};
  /* 🚀 Submit */
  const handleSubmit = async () => {
    if (selectedSkills.length === 0) {
      toast.warning("Please select at least one skill");
      return;
    }

    try {
      setLoading(true);
     const taskPricing = isSpecialized
  ? selectedSkills.map((skill) => ({
      skill,
      price: Number(taskPrices[skill]),
    }))
  : [];

if (
  isSpecialized &&
  (
    !Number.isFinite(Number(visitingCharge)) ||
    Number(visitingCharge) < 0
  )
) {
  toast.warning("Enter a valid visiting charge");
  return;
}

if (
  isSpecialized &&
  taskPricing.some(
    (rate) => !Number.isFinite(rate.price) || rate.price < 0
  )
) {
  toast.warning("Set a valid price for every selected task");
  return;
}
      const result = await axios.post(
        `${server_url}/api/user/professional/update-skills`,
        {
  selectedSkills,

  visitingCharge: isSpecialized
    ? Number(visitingCharge)
    : null,

  taskPricing,
},
        { withCredentials: true }
      );
       dispatch(setCurrentUserData(result.data));
      toast.success("Skills updated successfully");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "failed to update skills"
      );
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
 <div className="p-3">

 {isSpecialized && (
  <div className="mb-4">
    <label className="form-label fw-semibold">
      Visiting Charge (₹)
    </label>

    <input
      type="number"
      min="0"
      className="form-control"
      value={visitingCharge}
      onChange={(e) => setVisitingCharge(e.target.value)}
    />

    <small className="text-muted">
      This charge will be added during direct hire and specialised bookings.
    </small>
  </div>
)}

  {/* ===== HEADER ===== */}
  <div
    className="d-flex align-items-center gap-2 mb-3 px-3 py-2 rounded-4 shadow-sm"
    style={{
      background: "linear-gradient(135deg, #0d6efd, #6ea8fe)",
    }}
  >
    <FaTools className="text-white" />
    <h6 className="fw-semibold mb-0 text-white">
      Update Your Skills
    </h6>
  </div>

  {/* ===== SKILLS GRID ===== */}
  {allSkills.length > 0 ? (
    <div className="row g-2">
      {allSkills.map((skill) => {
        const isSelected = selectedSkills.includes(skill._id);
        const currentPrice = taskPrices[skill._id];
        return (
          <div key={skill._id} className="col-6 col-md-4">
            <div
              role="button"
              onClick={() => toggleSkill(skill._id)}
              className={`card border-0 rounded-4 shadow-sm text-center px-2 py-3 h-100`}
              style={{
                cursor: "pointer",
                transition: "all 0.25s ease",
                background: isSelected
                  ? "linear-gradient(135deg, #0d6efd, #6ea8fe)"
                  : "#f8f9fa",
                color: isSelected ? "#fff" : "#212529",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-4px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              <FaTools
                className={`mb-2 ${
                  isSelected ? "text-white" : "text-primary"
                }`}
                size={18}
              />

              <div
                className="fw-semibold"
                style={{ fontSize: "0.85rem" }}
              >
                {skill.name}
              </div>

            {/* PRICE */}
{isSpecialized ? (
  isSelected ? (
    <div
      className="mt-2"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="text-start mb-1"
        style={{
          fontSize: "0.7rem",
          opacity: 0.8,
        }}
      >
        Your price
      </div>

      <div className="input-group input-group-sm">
        <span className="input-group-text">₹</span>

        <input
          type="number"
          min="0"
          className="form-control"
          value={currentPrice ?? ""}
          placeholder="Enter price"
          onChange={(e) =>
            setTaskPrices((current) => ({
              ...current,
              [skill._id]: e.target.value,
            }))
          }
        />
      </div>
    </div>
  ) : (
    currentPrice !== undefined &&
    currentPrice !== null &&
    currentPrice !== "" && (
      <div
        className="mt-2"
        style={{
          fontSize: "0.78rem",
          color: "#198754",
          fontWeight: 600,
        }}
      >
        ₹{currentPrice}
      </div>
    )
  )
) : (
  skill.bookingType === "fixed" && (
    <div
      className={`mt-2 fw-semibold ${
        isSelected ? "text-white" : "text-success"
      }`}
      style={{ fontSize: "0.78rem" }}
    >
      ₹{skill.fixedPrice}
      <span
        className="fw-normal ms-1"
        style={{ fontSize: "0.68rem", opacity: 0.8 }}
      >
        fixed price
      </span>
    </div>
  )
)}

              {/* Selected indicator */}
              {isSelected && (
                <small className="opacity-75">
                  ✓ Selected
                </small>
              )}
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <div className="alert alert-warning small">
      No skills available under this profession.
    </div>
  )}


  {/* ===== ACTION ===== */}
  <div className="mt-4 text-end">
    <button
      className="btn btn-primary rounded-pill px-4 fw-semibold"
      onClick={handleSubmit}
      disabled={loading}
    >
      {loading ? (
        <ClipLoader size={18} color="#fff" />
      ) : (
        <>
          <FaSave className="me-2" />
          Save Skills
        </>
      )}
    </button>
  </div>
</div>

  );
};

export default UpdateSkills;
