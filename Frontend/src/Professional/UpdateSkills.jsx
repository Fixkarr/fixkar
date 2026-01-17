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
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()

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
  }, [professional]);

  /* 🔁 Toggle skill */
  const toggleSkill = (skillId) => {
    setSelectedSkills((prev) =>
      prev.includes(skillId)
        ? prev.filter((id) => id !== skillId)
        : [...prev, skillId]
    );
  };

  /* 🚀 Submit */
  const handleSubmit = async () => {
    if (selectedSkills.length === 0) {
      toast.warning("Please select at least one skill");
      return;
    }

    try {
      setLoading(true);

      const result = await axios.post(
        `${server_url}/api/user/professional/update-skills`,
        { selectedSkills },
        { withCredentials: true }
      );
       dispatch(setCurrentUserData(result.data));
      toast.success("Skills updated successfully");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update skills"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
 <div className="p-3">

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
