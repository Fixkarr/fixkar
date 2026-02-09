import React from "react";
import { FaTrash } from "react-icons/fa";

const FieldBasicSettings = ({ field, onChange, onRemove }) => {
  const update = (key, value) => {
    onChange({
      ...field,
      [key]: value
    });
  };

  return (
    <div className="border rounded-3 p-3 bg-light">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <strong>Field</strong>
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

      {/* TYPE */}
      <select
        className="form-select mb-2"
        value={field.type}
        onChange={(e) => update("type", e.target.value)}
      >
        <option value="text">Text</option>
        <option value="number">Number</option>
        <option value="textarea">Textarea</option>
        <option value="yesno">Yes / No</option>
        <option value="select">Select</option>
        <option value="checkbox">Checkbox</option>
        <option value="radio">Radio</option>
        <option value="table">Table</option>
      </select>

      {/* REQUIRED */}
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          checked={field.required}
          onChange={(e) => update("required", e.target.checked)}
        />
        <label className="form-check-label">
          Required
        </label>
      </div>
    </div>
  );
};

export default FieldBasicSettings;
