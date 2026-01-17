import React, { useEffect, useState } from "react";
import axios from "axios";
import { server_url } from "../App";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { FaTools, FaSave } from "react-icons/fa";

const UpdateSkills = ({ professional }) => {
  const [allSkills, setAllSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [loading, setLoading] = useState(false);

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

      await axios.post(
        `${server_url}/api/user/professional/update-skills`,
        { selectedSkills },
        { withCredentials: true }
      );

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

      {/* HEADER */}
      <div
        className="d-flex align-items-center gap-2 mb-3 p-2 rounded-3"
        style={{
          background:
            "linear-gradient(135deg, #0d6efd, #6ea8fe)",
        }}
      >
        <FaTools className="text-white" />
        <h6 className="fw-semibold mb-0 text-white">
          Update Your Skills
        </h6>
      </div>

      {/* SKILLS */}
      {allSkills.length > 0 ? (
        <div className="row">
          {allSkills.map((skill) => (
            <div key={skill._id} className="col-md-6 mb-2">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`skill-${skill._id}`}
                  checked={selectedSkills.includes(skill._id)}
                  onChange={() => toggleSkill(skill._id)}
                />
                <label
                  htmlFor={`skill-${skill._id}`}
                  className="form-check-label fw-semibold"
                >
                  {skill.name}
                </label>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-warning small">
          No skills available under this profession.
        </div>
      )}

      {/* ACTION */}
      <div className="mt-4 text-end">
        <button
          className="btn btn-primary rounded-pill px-4"
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
