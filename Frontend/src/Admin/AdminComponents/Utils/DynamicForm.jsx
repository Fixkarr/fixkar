import React, { useState } from "react";
import axios from "axios";

const DynamicForm = ({ form }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /* =========================
     HANDLE CHANGE
     ========================= */
  const updateValue = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field.fieldId]: value
    }));
  };

  /* =========================
     VALIDATION
     ========================= */
  const validate = () => {
    const newErrors = {};

    form.sections.forEach((section) => {
      section.fields.forEach((field) => {
        const value = formData[field.fieldId];

        if (field.required && !value) {
          newErrors[field.fieldId] = "This field is required";
        }

        if (field.validation?.regex && value) {
          const regex = new RegExp(field.validation.regex);
          if (!regex.test(value)) {
            newErrors[field.fieldId] = "Invalid format";
          }
        }

        if (field.validation?.min !== null && value < field.validation.min) {
          newErrors[field.fieldId] = `Minimum ${field.validation.min}`;
        }

        if (field.validation?.max !== null && value > field.validation.max) {
          newErrors[field.fieldId] = `Maximum ${field.validation.max}`;
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* =========================
     SUBMIT
     ========================= */
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const payload = {
        formId: form._id,
        responses: formData
      };

      console.log("SUBMIT PAYLOAD:", payload);

      // await axios.post("/api/form/submit", payload);

      alert("Form submitted successfully");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     FIELD RENDERER
     ========================= */
  const renderField = (field) => {
    const value = formData[field.fieldId] || "";

    switch (field.type) {
      case "text":
      case "number":
        return (
          <input
            type={field.type}
            className="form-control"
            placeholder={field.ui?.placeholder || ""}
            value={value}
            onChange={(e) => updateValue(field, e.target.value)}
          />
        );

      case "textarea":
        return (
          <textarea
            className="form-control"
            placeholder={field.ui?.placeholder || ""}
            value={value}
            onChange={(e) => updateValue(field, e.target.value)}
          />
        );

      case "select":
        return (
          <select
            className="form-select"
            value={value}
            onChange={(e) => updateValue(field, e.target.value)}
          >
            <option value="">Select</option>
            {field.options.map((opt) => (
              <option key={opt._id} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case "checkbox":
        return field.options.map((opt) => (
          <div key={opt._id} className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              checked={(value || []).includes(opt.value)}
              onChange={(e) => {
                const arr = value || [];
                updateValue(
                  field,
                  e.target.checked
                    ? [...arr, opt.value]
                    : arr.filter((v) => v !== opt.value)
                );
              }}
            />
            <label className="form-check-label">{opt.label}</label>
          </div>
        ));

      case "table":
        return (
          <textarea
            className="form-control"
            placeholder="Enter details line by line"
            value={value}
            onChange={(e) => updateValue(field, e.target.value)}
          />
        );

      default:
        return <div>Unsupported field</div>;
    }
  };

  /* =========================
     UI
     ========================= */
  return (
    <div className="card shadow rounded-4 p-4">
      <h4 className="fw-bold mb-2">{form.title}</h4>
      <p className="text-muted">{form.description}</p>

      {form.sections
        .sort((a, b) => a.order - b.order)
        .map((section) => (
          <div key={section.sectionId} className="mb-4">
            <h5 className="fw-semibold">{section.title}</h5>
            <p className="text-muted small">{section.description}</p>

            {section.fields
              .sort((a, b) => a.ui.order - b.ui.order)
              .map((field) => (
                <div key={field.fieldId} className="mb-3">
                  <label className="fw-semibold">
                    {field.label}
                    {field.required && (
                      <span className="text-danger"> *</span>
                    )}
                  </label>

                  {renderField(field)}

                  {field.ui?.unit && (
                    <small className="text-muted">
                      Unit: {field.ui.unit}
                    </small>
                  )}

                  {errors[field.fieldId] && (
                    <div className="text-danger small">
                      {errors[field.fieldId]}
                    </div>
                  )}
                </div>
              ))}
          </div>
        ))}

      <button
        className="btn btn-primary w-100"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
};

export default DynamicForm;
