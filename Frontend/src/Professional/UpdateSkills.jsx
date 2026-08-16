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

              {!isSpecialized && skill.bookingType === "fixed" && (
                <small className={isSelected ? "opacity-75" : "text-success"}>Admin price: ₹{skill.fixedPrice}</small>
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

  {isSpecialized && selectedSkills.length > 0 && (
    <div className="mt-4 card border-0 bg-light">
      <div className="card-body">
        <h6 className="fw-semibold">Your specialised task prices</h6>
        <small className="text-muted d-block mb-3">Customers will see these prices before booking.</small>
        {allSkills.filter((skill) => selectedSkills.includes(skill._id)).map((skill) => (
          <div className="row align-items-center mb-2" key={skill._id}>
            <label className="col-7 col-form-label">{skill.name}</label>
            <div className="col-5"><input type="number" min="0" className="form-control"
              value={taskPrices[skill._id] ?? ""}
              onChange={(event) => setTaskPrices((current) => ({ ...current, [skill._id]: event.target.value }))}
              placeholder="Price" /></div>
          </div>
        ))}
      </div>
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
