import React, { useState } from "react";

const DynamicForm = ({ form }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  /* =========================
     UPDATE VALUE
     ========================= */
  const updateValue = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field.fieldId]: value
    }));
  };

  const getDefaultValue = (type) => {
  if (type === "checkbox") return [];
  if (type === "table") return [];
  return "";
};
  /* =========================
     VALIDATION
     ========================= */
  const validate = () => {
    const newErrors = {};

    form.sections.forEach((section) => {
      section.fields.forEach((field) => {
        const value =
          formData[field.fieldId] ?? getDefaultValue(field.type);

        if (field.required) {
          if (
            value === "" ||
            value === null ||
            (Array.isArray(value) && value.length === 0)
          ) {
            newErrors[field.fieldId] = "Required field";
          }
        }

        if (field.validation?.regex && value) {
          const regex = new RegExp(field.validation.regex);
          if (!regex.test(value)) {
            newErrors[field.fieldId] = "Invalid format";
          }
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* =========================
     SUBMIT
     ========================= */
  const handleSubmit = () => {
    if (!validate()) return;

    const payload = {
      formId: form._id,
      responses: formData
    };

    console.log("FINAL PAYLOAD", payload);
    alert("Form submitted (check console)");
  };

  /* =========================
     TABLE HANDLER
     ========================= */
  const updateTable = (field, index, key, value) => {
    const rows = [...(formData[field.fieldId] || [])];
    rows[index] = { ...rows[index], [key]: value };
    updateValue(field, rows);
  };

  const addTableRow = (field) => {
    const rows = [...(formData[field.fieldId] || [])];
    rows.push({ label: "", charge: "" });
    updateValue(field, rows);
  };

  const removeTableRow = (field, index) => {
    const rows = [...(formData[field.fieldId] || [])];
    rows.splice(index, 1);
    updateValue(field, rows);
  };

  /* =========================
     FIELD RENDERER
     ========================= */
  const renderField = (field) => {
    const value =
      formData[field.fieldId] ?? getDefaultValue(field.type);

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

      case "date":
        return (
          <input
            type="date"
            className="form-control"
            value={value}
            onChange={(e) => updateValue(field, e.target.value)}
          />
        );

      case "radio":
        return field.options.map((opt) => (
          <div key={opt._id} className="form-check">
            <input
              type="radio"
              className="form-check-input"
              checked={value === opt.value}
              onChange={() => updateValue(field, opt.value)}
            />
            <label className="form-check-label">
              {opt.label}
            </label>
          </div>
        ));

      case "checkbox":
        return field.options.map((opt) => (
          <div key={opt._id} className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              checked={value.includes(opt.value)}
              onChange={(e) => {
                const updated = e.target.checked
                  ? [...value, opt.value]
                  : value.filter((v) => v !== opt.value);
                updateValue(field, updated);
              }}
            />
            <label className="form-check-label">
              {opt.label}
            </label>
          </div>
        ));

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

      case "yesno":
        return (
          <select
            className="form-select"
            value={value}
            onChange={(e) => updateValue(field, e.target.value)}
          >
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        );

      case "file":
        return (
          <input
            type="file"
            className="form-control"
            onChange={(e) =>
              updateValue(field, e.target.files[0])
            }
          />
        );

      /* =========================
         TABLE (LABEL + CHARGE)
         ========================= */
      case "table":
        return (
          <>
            <table className="table table-bordered mt-2">
              <thead>
                <tr>
                  <th>Work / Label</th>
                  <th>Charge</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {value.map((row, idx) => (
                  <tr key={idx}>
                    <td>
                      <input
                        className="form-control"
                        value={row.label}
                        onChange={(e) =>
                          updateTable(
                            field,
                            idx,
                            "label",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={row.charge}
                        onChange={(e) =>
                          updateTable(
                            field,
                            idx,
                            "charge",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() =>
                          removeTableRow(field, idx)
                        }
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => addTableRow(field)}
            >
              + Add Row
            </button>
          </>
        );

      default:
        return <div>Unsupported field</div>;
    }
  };

  /* =========================
     UI
     ========================= */
  return (
    <div className="card p-4 shadow rounded-4">
      <h4 className="fw-bold">{form.title}</h4>
      <p className="text-muted">{form.description}</p>

      {form.sections
        .sort((a, b) => a.order - b.order)
        .map((section) => (
          <div key={section.sectionId} className="mb-4">
            <h5>{section.title}</h5>
            <p className="text-muted small">
              {section.description}
            </p>

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
      >
        Submit
      </button>
    </div>
  );
};

export default DynamicForm;
