import React from "react";
import { FaTrash, FaPlus } from "react-icons/fa";

const OPTION_TYPES = ["select", "radio", "checkbox"];

const FieldBasicSettings = ({ field, onChange, onRemove }) => {
  const update = (key, value) => {
    onChange({
      ...field,
      [key]: value
    });
  };

  const updateUI = (key, value) => {
    update("ui", {
      ...field.ui,
      [key]: value
    });
  };

  const updateOption = (idx, key, value) => {
    const options = [...(field.options || [])];
    options[idx][key] = value;
    update("options", options);
  };

  const addOption = () => {
    update("options", [
      ...(field.options || []),
      { label: "", value: "" }
    ]);
  };

  const removeOption = (idx) => {
    const options = [...field.options];
    options.splice(idx, 1);
    update("options", options);
  };

  const handleTypeChange = (type) => {
    const cleanField = {
      ...field,
      type
    };

    // cleanup options if not required
    if (!OPTION_TYPES.includes(type)) {
      cleanField.options = [];
    }

    onChange(cleanField);
  };

  return (
    <div className="border rounded-3 p-3 bg-light">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <strong>
          Field: {field.label || "Untitled"}{" "}
          <span className="text-muted">
            ({field.type})
          </span>
        </strong>
        <button
          className="btn btn-sm btn-danger"
          onClick={onRemove}
        >
          <FaTrash />
        </button>
      </div>

      {/* LABEL */}
      <input
        className="form-control mb-2"
        placeholder="Field Label (e.g. Visiting Fee)"
        value={field.label}
        onChange={(e) => update("label", e.target.value)}
      />

      {/* HELPER TEXT */}
      <input
        className="form-control mb-2"
        placeholder="Helper text (optional)"
        value={field.helperText || ""}
        onChange={(e) =>
          update("helperText", e.target.value)
        }
      />

      {/* TYPE */}
      <select
        className="form-select mb-2"
        value={field.type}
        onChange={(e) => handleTypeChange(e.target.value)}
      >
        <option value="text">Text</option>
        <option value="number">Number</option>
        <option value="textarea">Textarea</option>
        <option value="yesno">Yes / No</option>
        <option value="select">Select</option>
        <option value="checkbox">Checkbox</option>
        <option value="radio">Radio</option>
        <option value="table">Table</option>
        <option value="file">File</option>
        <option value="date">Date</option>
      </select>

      {/* PLACEHOLDER */}
      {["text", "number", "textarea"].includes(field.type) && (
        <input
          className="form-control mb-2"
          placeholder="Placeholder (optional)"
          value={field.ui?.placeholder || ""}
          onChange={(e) =>
            updateUI("placeholder", e.target.value)
          }
        />
      )}

      {/* UNIT */}
      {field.type === "number" && (
        <input
          className="form-control mb-2"
          placeholder="Unit (₹, per hour, per sq ft)"
          value={field.ui?.unit || ""}
          onChange={(e) =>
            updateUI("unit", e.target.value)
          }
        />
      )}

      {/* OPTIONS */}
      {OPTION_TYPES.includes(field.type) && (
        <div className="mb-2">
          <label className="fw-semibold">
            Options
          </label>

          {(field.options || []).map((opt, idx) => (
            <div
              key={idx}
              className="d-flex gap-2 mt-1"
            >
              <input
                className="form-control"
                placeholder="Label"
                value={opt.label}
                onChange={(e) =>
                  updateOption(
                    idx,
                    "label",
                    e.target.value
                  )
                }
              />
              <input
                className="form-control"
                placeholder="Value"
                value={opt.value}
                onChange={(e) =>
                  updateOption(
                    idx,
                    "value",
                    e.target.value
                  )
                }
              />
              <button
                className="btn btn-danger btn-sm"
                onClick={() => removeOption(idx)}
              >
                <FaTrash />
              </button>
            </div>
          ))}

          <button
            className="btn btn-outline-primary btn-sm mt-2"
            onClick={addOption}
          >
            <FaPlus /> Add Option
          </button>
        </div>
      )}

      {/* REQUIRED */}
      <div className="form-check mt-2">
        <input
          className="form-check-input"
          type="checkbox"
          checked={field.required}
          onChange={(e) =>
            update("required", e.target.checked)
          }
        />
        <label className="form-check-label">
          Required
        </label>
      </div>
    </div>
  );
};

export default FieldBasicSettings;
