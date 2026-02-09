import React, { useState } from "react";
import { FaChevronDown, FaChevronUp, FaListAlt } from "react-icons/fa";

const FieldAdvancedSettings = ({ field, onChange }) => {
  const [open, setOpen] = useState(false);

  const update = (key, value) => {
    onChange({
      ...field,
      [key]: value
    });
  };

  return (
    <div className="mt-3 border rounded-3 bg-white">
      {/* HEADER */}
      <div
        className="d-flex justify-content-between align-items-center p-2"
        style={{ cursor: "pointer" }}
        onClick={() => setOpen(!open)}
      >
        <span className="fw-semibold text-primary">
          Advanced Settings
        </span>
        {open ? <FaChevronUp /> : <FaChevronDown />}
      </div>

      {open && (
        <div className="p-3 border-top">

          {/* ===== VALIDATION ===== */}
          <div className="mb-3">
            <label className="fw-semibold">Validation</label>

            <div className="row g-2">
              <div className="col">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Min"
                  value={field.validation?.min ?? ""}
                  onChange={(e) =>
                    update("validation", {
                      ...field.validation,
                      min: e.target.value || null
                    })
                  }
                />
              </div>
              <div className="col">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Max"
                  value={field.validation?.max ?? ""}
                  onChange={(e) =>
                    update("validation", {
                      ...field.validation,
                      max: e.target.value || null
                    })
                  }
                />
              </div>
            </div>

            <input
              className="form-control mt-2"
              placeholder="Regex (optional)"
              value={field.validation?.regex || ""}
              onChange={(e) =>
                update("validation", {
                  ...field.validation,
                  regex: e.target.value
                })
              }
            />
          </div>

          {/* ===== EDITABLE ===== */}
          <div className="mb-3">
            <label className="fw-semibold">
              Editable After Submit
            </label>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                checked={field.editable?.afterSubmit}
                onChange={(e) =>
                  update("editable", {
                    ...field.editable,
                    afterSubmit: e.target.checked
                  })
                }
              />
            </div>
          </div>

          {/* ===== SUMMARY ===== */}
          <div className="border-top pt-3">
            <label className="fw-semibold">
              <FaListAlt className="me-2" />
              Summary (Required)
            </label>

            <input
              className="form-control mt-2"
              placeholder="e.g. Visiting fee will be charged as per distance"
              value={field.summary || ""}
              onChange={(e) =>
                update("summary", e.target.value)
              }
            />
          </div>

        </div>
      )}
    </div>
  );
};

export default FieldAdvancedSettings;
