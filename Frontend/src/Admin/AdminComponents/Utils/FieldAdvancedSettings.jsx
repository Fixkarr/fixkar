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

  const updateSummary = (key, value) => {
    update("summary", {
      ...field.summary,
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
              Summary Display
            </label>

            <div className="form-check mt-2">
              <input
                className="form-check-input"
                type="checkbox"
                checked={field.summary?.showToCustomer}
                onChange={(e) =>
                  updateSummary("showToCustomer", e.target.checked)
                }
              />
              <label className="form-check-label">
                Show to Customer
              </label>
            </div>

            <div className="form-check mt-1">
              <input
                className="form-check-input"
                type="checkbox"
                checked={field.summary?.showToProfessional}
                onChange={(e) =>
                  updateSummary("showToProfessional", e.target.checked)
                }
              />
              <label className="form-check-label">
                Show to Professional
              </label>
            </div>

            {(field.summary?.showToCustomer ||
              field.summary?.showToProfessional) && (
              <>
                {field.type !== "yesno" && (
                  <input
                    className="form-control mt-2"
                    placeholder="Template (e.g. Visiting fee: ₹{{value}})"
                    value={field.summary.template || ""}
                    onChange={(e) =>
                      updateSummary("template", e.target.value)
                    }
                  />
                )}

                {field.type === "yesno" && (
                  <div className="row g-2 mt-2">
                    <div className="col">
                      <input
                        className="form-control"
                        placeholder="When YES"
                        value={field.summary.whenTrue || ""}
                        onChange={(e) =>
                          updateSummary("whenTrue", e.target.value)
                        }
                      />
                    </div>
                    <div className="col">
                      <input
                        className="form-control"
                        placeholder="When NO"
                        value={field.summary.whenFalse || ""}
                        onChange={(e) =>
                          updateSummary("whenFalse", e.target.value)
                        }
                      />
                    </div>
                  </div>
                )}

                <select
                  className="form-select mt-2"
                  value={field.summary.group || "details"}
                  onChange={(e) =>
                    updateSummary("group", e.target.value)
                  }
                >
                  <option value="primary">Primary</option>
                  <option value="details">Details</option>
                  <option value="terms">Terms</option>
                  <option value="extras">Extras</option>
                </select>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldAdvancedSettings;
