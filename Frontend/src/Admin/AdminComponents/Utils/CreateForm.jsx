import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import {
  FaPlus,
  FaTrash,
  FaWpforms,
  FaLayerGroup
} from "react-icons/fa";
import { server_url } from "../../../App";
import FieldAdvancedSettings from "./FieldAdvancedSettings";
import FieldBasicSettings from "./FieldBasicSettings";

/* =========================
   CREATE FORM (CONTROLLER SAFE)
   ========================= */
const CreateForm = () => {
  const [loading, setLoading] = useState(false);

  /* ===== FORM STATE ===== */
  const [form, setForm] = useState({
    key: "",
    purpose: "",
    title: "",
    description: "",
    target: {
      entity: "",     // professional | service | user | booking
      entityId: null
    },
    sections: []
  });

  /* =========================
     FORM HANDLERS
     ========================= */
  const updateForm = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  /* =========================
     SECTION HANDLERS
     ========================= */
  const addSection = () => {
    setForm({
      ...form,
      sections: [
        ...form.sections,
        {
          sectionId: `section_${Date.now()}`,
          title: "",
          description: "",
          order: form.sections.length,
          fields: []
        }
      ]
    });
  };

  const updateSection = (index, key, value) => {
    const sections = [...form.sections];
    sections[index][key] = value;
    setForm({ ...form, sections });
  };

  const removeSection = (index) => {
    const sections = [...form.sections];
    sections.splice(index, 1);
    setForm({ ...form, sections });
  };

  /* =========================
     FIELD HANDLERS
     ========================= */
  const addField = (sectionIndex) => {
    const sections = [...form.sections];

    sections[sectionIndex].fields.push({
      fieldId: `field_${Date.now()}`,
      label: "",
      helperText: "",
      type: "text",
      required: false,

      options: [],

      validation: {
        min: null,
        max: null,
        regex: ""
      },

      ui: {
        placeholder: "",
        unit: "",
        order: sections[sectionIndex].fields.length
      },

      visibilityScope: ["professional"],

      editable: {
        afterSubmit: false
      },

      summary: {
        showToCustomer: false,
        showToProfessional: false,
        template: "",
        whenTrue: "",
        whenFalse: "",
        group: "details"
      }
    });

    setForm({ ...form, sections });
  };

  const updateField = (sIdx, fIdx, key, value) => {
    const sections = [...form.sections];

    if (key === null) {
      sections[sIdx].fields[fIdx] = value;
    } else {
      sections[sIdx].fields[fIdx][key] = value;
    }

    setForm({ ...form, sections });
  };

  const removeField = (sIdx, fIdx) => {
    const sections = [...form.sections];
    sections[sIdx].fields.splice(fIdx, 1);
    setForm({ ...form, sections });
  };

  /* =========================
     SUBMIT (STRICT VALIDATION)
     ========================= */
  const handleSubmit = async () => {
    if (!form.key || !form.title || !form.purpose) {
      toast.error("Form key, title and purpose are required");
      return;
    }

    if (!form.target.entity) {
      toast.error("Form target (who should see this form) is required");
      return;
    }

    if (form.sections.length === 0) {
      toast.error("Add at least one section");
      return;
    }

    const invalidField = form.sections.some((sec) =>
      sec.fields.some((f) => !f.label || !f.type)
    );

    if (invalidField) {
      toast.error("Every field must have a label and type");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${server_url}/api/admin/forms`,
        form,
        { withCredentials: true }
      );

      toast.success("Form created successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create form");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UI
     ========================= */
  return (
    <div className="container py-3">
      <div className="card shadow-lg rounded-4 border-0">
        <div className="card-body border-bottom">
          <h5 className="fw-bold">
            <FaWpforms className="me-2 text-primary" />
            Create Dynamic Form
          </h5>
        </div>

        <div className="card-body">
          {/* ===== FORM INFO ===== */}
          <h6 className="fw-semibold mb-3">Form Details</h6>

          <input
            className="form-control mb-2"
            placeholder="Form Key (electrician_pricing_v1)"
            value={form.key}
            onChange={(e) => updateForm("key", e.target.value)}
          />

          <input
            className="form-control mb-2"
            placeholder="Form Title"
            value={form.title}
            onChange={(e) => updateForm("title", e.target.value)}
          />

          <select
            className="form-select mb-2"
            value={form.purpose}
            onChange={(e) => updateForm("purpose", e.target.value)}
          >
            <option value="">Select purpose</option>
            <option value="pricing">Pricing</option>
            <option value="onboarding">Onboarding</option>
            <option value="kyc">KYC</option>
            <option value="profile">Profile</option>
            <option value="survey">Survey</option>
            <option value="settings">Settings</option>
          </select>

          <select
            className="form-select mb-3"
            value={form.target.entity}
            onChange={(e) =>
              setForm({
                ...form,
                target: { ...form.target, entity: e.target.value }
              })
            }
          >
            <option value="">Who should fill this form?</option>
            <option value="professional">Professional</option>
            <option value="service">Service</option>
            <option value="user">User</option>
            <option value="booking">Booking</option>
          </select>

          <textarea
            className="form-control mb-4"
            placeholder="Form Description"
            value={form.description}
            onChange={(e) => updateForm("description", e.target.value)}
          />

          {/* ===== SECTIONS ===== */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="fw-semibold">
              <FaLayerGroup className="me-2" />
              Sections
            </h6>
            <button className="btn btn-sm btn-success" onClick={addSection}>
              <FaPlus /> Add Section
            </button>
          </div>

          {form.sections.map((section, sIdx) => (
            <div key={section.sectionId} className="border rounded-3 p-3 mb-3">
              <div className="d-flex justify-content-between">
                <input
                  className="form-control me-2"
                  placeholder="Section Title"
                  value={section.title}
                  onChange={(e) =>
                    updateSection(sIdx, "title", e.target.value)
                  }
                />
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => removeSection(sIdx)}
                >
                  <FaTrash />
                </button>
              </div>

              <textarea
                className="form-control mt-2"
                placeholder="Section Description"
                value={section.description}
                onChange={(e) =>
                  updateSection(sIdx, "description", e.target.value)
                }
              />

              {/* ===== FIELDS ===== */}
              <div className="mt-3">
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => addField(sIdx)}
                >
                  <FaPlus /> Add Field
                </button>

                {section.fields.map((field, fIdx) => (
                  <div key={field.fieldId} className="mt-3">
                    <FieldBasicSettings
                      field={field}
                      onChange={(updatedField) =>
                        updateField(sIdx, fIdx, null, updatedField)
                      }
                      onRemove={() => {
                        if (window.confirm("Remove this field?")) {
                          removeField(sIdx, fIdx);
                        }
                      }}
                    />

                    <FieldAdvancedSettings
                      field={field}
                      onChange={(updatedField) =>
                        updateField(sIdx, fIdx, null, updatedField)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* ===== SUBMIT ===== */}
          <button
            className="btn btn-primary w-100 mt-4"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} /> : "Create Form"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateForm;
