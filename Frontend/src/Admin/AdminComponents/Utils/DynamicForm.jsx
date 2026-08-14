import axios from "axios";
import {
  FaPaperPlane,
  FaFont,
  FaHashtag,
  FaListUl,
  FaCheckSquare,
  FaDotCircle,
  FaCalendarAlt,
  FaTable,
  FaUpload,
  FaPlus,
  FaTrash,
  FaInfoCircle,
  FaRupeeSign,
  FaLightbulb,
  FaCheckCircle,
} from "react-icons/fa";
import { server_url } from "../../../App";
import { useDispatch } from "react-redux";
import { setCurrentUserData } from "../../../redux/user.slice";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DynamicForm = ({ form, initialValues }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues);
    }
  }, [initialValues]);

  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /* =========================
     UPDATE VALUE
     ========================= */
  const updateValue = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field.fieldId]: value,
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

        if (
          field.required &&
          (value === "" ||
            value === null ||
            (Array.isArray(value) && value.length === 0))
        ) {
          newErrors[field.fieldId] = "Required field";
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
  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      formId: form._id,
      responses: formData,
    };

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${server_url}/api/user/save-form-response`,
        payload,
        {
          withCredentials: true,
        }
      );

      dispatch(setCurrentUserData(data));
      toast.success(data?.message);
      setLoading(false);
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message || "Form submission failed"
      );

      setLoading(false);
    }
  };

  /* =========================
     TABLE HANDLERS
     ========================= */
  const updateTable = (field, index, key, value) => {
    const rows = [...(formData[field.fieldId] || [])];

    rows[index] = {
      ...rows[index],
      [key]: value,
    };

    updateValue(field, rows);
  };

  const addTableRow = (field) => {
    const rows = [...(formData[field.fieldId] || [])];

    rows.push({
      label: "",
      charge: "",
    });

    updateValue(field, rows);
  };

  const removeTableRow = (field, index) => {
    const rows = [...(formData[field.fieldId] || [])];

    rows.splice(index, 1);

    updateValue(field, rows);
  };

  /* =========================
     ICON BY FIELD TYPE
     ========================= */
  const fieldIcon = (type) => {
    switch (type) {
      case "text":
      case "textarea":
        return <FaFont />;

      case "number":
        return <FaHashtag />;

      case "checkbox":
        return <FaCheckSquare />;

      case "radio":
        return <FaDotCircle />;

      case "select":
      case "yesno":
        return <FaListUl />;

      case "date":
        return <FaCalendarAlt />;

      case "table":
        return <FaTable />;

      default:
        return null;
    }
  };

  /* =========================
     FIELD RENDERER
     ========================= */
  const renderField = (field) => {
    const value =
      formData[field.fieldId] ?? getDefaultValue(field.type);

    switch (field.type) {
      /* =========================
         TEXT / NUMBER
         ========================= */
      case "text":
      case "number":
        return (
          <div className="position-relative">
            <input
              type={field.type}
              className={`form-control form-control-lg rounded-3 ${
                errors[field.fieldId] ? "is-invalid" : ""
              }`}
              placeholder={field.ui?.placeholder || ""}
              value={value}
              onChange={(e) =>
                updateValue(field, e.target.value)
              }
            />
          </div>
        );

      /* =========================
         TEXTAREA
         ========================= */
      case "textarea":
        return (
          <textarea
            className={`form-control form-control-lg rounded-3 ${
              errors[field.fieldId] ? "is-invalid" : ""
            }`}
            rows={4}
            placeholder={
              field.ui?.placeholder ||
              "Write your answer here..."
            }
            value={value}
            onChange={(e) =>
              updateValue(field, e.target.value)
            }
          />
        );

      /* =========================
         DATE
         ========================= */
      case "date":
        return (
          <input
            type="date"
            className={`form-control form-control-lg rounded-3 ${
              errors[field.fieldId] ? "is-invalid" : ""
            }`}
            value={value}
            onChange={(e) =>
              updateValue(field, e.target.value)
            }
          />
        );

      /* =========================
         RADIO
         ========================= */
      case "radio":
        return (
          <div className="row g-2">
            {field.options?.map((opt) => {
              const selected = value === opt.value;

              return (
                <div
                  className="col-12 col-sm-6"
                  key={opt._id}
                >
                  <label
                    className={`d-flex align-items-center gap-3 border rounded-3 p-3 h-100 ${
                      selected
                        ? "border-primary bg-primary bg-opacity-10"
                        : "border-light-subtle bg-white"
                    }`}
                    style={{
                      cursor: "pointer",
                      transition: "all .2s ease",
                    }}
                  >
                    <input
                      type="radio"
                      className="form-check-input mt-0"
                      checked={selected}
                      onChange={() =>
                        updateValue(field, opt.value)
                      }
                    />

                    <span
                      className={`fw-semibold ${
                        selected
                          ? "text-primary"
                          : "text-dark"
                      }`}
                    >
                      {opt.label}
                    </span>

                    {selected && (
                      <FaCheckCircle className="text-primary ms-auto" />
                    )}
                  </label>
                </div>
              );
            })}
          </div>
        );

      /* =========================
         CHECKBOX
         ========================= */
      case "checkbox":
        return (
          <div className="row g-2">
            {field.options?.map((opt) => {
              const selected = value.includes(opt.value);

              return (
                <div
                  className="col-12 col-sm-6"
                  key={opt._id}
                >
                  <label
                    className={`d-flex align-items-center gap-3 border rounded-3 p-3 h-100 ${
                      selected
                        ? "border-primary bg-primary bg-opacity-10"
                        : "border-light-subtle bg-white"
                    }`}
                    style={{
                      cursor: "pointer",
                      transition: "all .2s ease",
                    }}
                  >
                    <input
                      type="checkbox"
                      className="form-check-input mt-0"
                      checked={selected}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...value, opt.value]
                          : value.filter(
                              (v) => v !== opt.value
                            );

                        updateValue(field, updated);
                      }}
                    />

                    <span
                      className={`fw-semibold ${
                        selected
                          ? "text-primary"
                          : "text-dark"
                      }`}
                    >
                      {opt.label}
                    </span>

                    {selected && (
                      <FaCheckCircle className="text-primary ms-auto" />
                    )}
                  </label>
                </div>
              );
            })}
          </div>
        );

      /* =========================
         SELECT
         ========================= */
      case "select":
        return (
          <select
            className={`form-select form-select-lg rounded-3 ${
              errors[field.fieldId] ? "is-invalid" : ""
            }`}
            value={value}
            onChange={(e) =>
              updateValue(field, e.target.value)
            }
          >
            <option value="">Select an option</option>

            {field.options?.map((opt) => (
              <option
                key={opt._id}
                value={opt.value}
              >
                {opt.label}
              </option>
            ))}
          </select>
        );

      /* =========================
         YES / NO
         ========================= */
      case "yesno":
        return (
          <div className="row g-2">
            {[
              {
                value: "yes",
                label: "Yes",
              },
              {
                value: "no",
                label: "No",
              },
            ].map((option) => {
              const selected = value === option.value;

              return (
                <div
                  className="col-6"
                  key={option.value}
                >
                  <label
                    className={`d-flex align-items-center justify-content-center gap-2 border rounded-3 p-3 ${
                      selected
                        ? "border-primary bg-primary bg-opacity-10"
                        : "border-light-subtle"
                    }`}
                    style={{
                      cursor: "pointer",
                      transition: "all .2s ease",
                    }}
                  >
                    <input
                      className="form-check-input mt-0"
                      type="radio"
                      name={field.fieldId}
                      checked={selected}
                      onChange={() =>
                        updateValue(
                          field,
                          option.value
                        )
                      }
                    />

                    <span
                      className={`fw-semibold ${
                        selected
                          ? "text-primary"
                          : "text-dark"
                      }`}
                    >
                      {option.label}
                    </span>
                  </label>
                </div>
              );
            })}
          </div>
        );

      /* =========================
         WORK / CHARGE TABLE
         ========================= */
      case "table":
        return (
          <div>
            {/* Instructions */}
            <div className="rounded-3 border bg-light p-3 mb-3">
              <div className="d-flex align-items-start gap-3">
                <div
                  className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: 38,
                    height: 38,
                  }}
                >
                  <FaInfoCircle size={16} />
                </div>

                <div>
                  <h6 className="fw-bold mb-1">
                    How to define your charges
                  </h6>

                  <p className="text-muted small mb-2">
                    Left side mein <strong>work ka naam</strong>{" "}
                    likhein aur right side mein uska{" "}
                    <strong>charge</strong> define karein.
                  </p>

                  <div className="bg-white border rounded-3 p-2 small">
                    <FaLightbulb className="text-warning me-2" />

                    <strong>Example:</strong>{" "}
                    House wiring (per feet)
                    <span className="mx-2 text-muted">→</span>
                    <span className="fw-bold text-primary">
                      ₹20
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Header */}
            <div className="d-none d-md-block">
              <div className="row g-2 mb-2 px-1">
                <div className="col-md-6">
                  <small className="text-muted fw-semibold">
                    WORK / SERVICE
                  </small>
                </div>

                <div className="col-md-4">
                  <small className="text-muted fw-semibold">
                    CHARGE
                  </small>
                </div>

                <div className="col-md-2"></div>
              </div>
            </div>

            {/* Rows */}
            <div className="d-flex flex-column gap-2">
              {value.map((row, idx) => (
                <div
                  key={idx}
                  className="border rounded-3 p-2 p-md-3 bg-white shadow-sm"
                >
                  <div className="row g-2 align-items-center">
                    {/* Work */}
                    <div className="col-12 col-md-6">
                      <label className="d-md-none small text-muted fw-semibold mb-1">
                        WORK / SERVICE
                      </label>

                      <input
                        type="text"
                        className="form-control rounded-3"
                        placeholder="e.g. House wiring (per feet)"
                        value={row.label || ""}
                        onChange={(e) =>
                          updateTable(
                            field,
                            idx,
                            "label",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    {/* Charge */}
                    <div className="col-10 col-md-4">
                      <label className="d-md-none small text-muted fw-semibold mb-1">
                        CHARGE
                      </label>

                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <FaRupeeSign className="text-muted" />
                        </span>

                        <input
                          type="number"
                          min="0"
                          className="form-control rounded-end-3"
                          placeholder="e.g. 20"
                          value={row.charge || ""}
                          onChange={(e) =>
                            updateTable(
                              field,
                              idx,
                              "charge",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>

                    {/* Delete */}
                    <div className="col-2 col-md-2 d-flex justify-content-end">
                      <button
                        type="button"
                        className="btn btn-outline-danger rounded-3 d-flex align-items-center justify-content-center"
                        style={{
                          width: 44,
                          height: 44,
                        }}
                        title="Remove work"
                        onClick={() =>
                          removeTableRow(field, idx)
                        }
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {value.length === 0 && (
              <div className="text-center border border-dashed rounded-3 p-4 mt-2 bg-light">
                <FaTable
                  className="text-muted mb-2"
                  size={24}
                />

                <p className="fw-semibold mb-1">
                  No work added yet
                </p>

                <small className="text-muted">
                  Add the services or types of work you
                  provide with their charges.
                </small>
              </div>
            )}

            {/* Add Row */}
            <button
              type="button"
              className="btn btn-outline-primary rounded-3 fw-semibold mt-3 d-flex align-items-center gap-2"
              onClick={() => addTableRow(field)}
            >
              <FaPlus size={13} />
              Add Work
            </button>
          </div>
        );

      default:
        return (
          <div className="alert alert-warning rounded-3">
            Unsupported field
          </div>
        );
    }
  };

  /* =========================
     UI
     ========================= */
  return (
    form && (
      <div className="container-fluid px-0 py-3 py-md-4">
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          {/* HEADER */}
          <div className="bg-primary text-white p-4 p-md-5">
            <div className="d-flex align-items-start gap-3">
              <div
                className="bg-white bg-opacity-25 rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                style={{
                  width: 48,
                  height: 48,
                }}
              >
                <FaUpload size={20} />
              </div>

              <div>
                <h4 className="fw-bold mb-2">
                  {form?.title}
                </h4>

                <p className="mb-0 opacity-75">
                  {form?.description}
                </p>
              </div>
            </div>
          </div>

          {/* BODY */}
          <div className="bg-light p-3 p-md-4">
            {form.sections
              .sort((a, b) => a.order - b.order)
              .map((section) => (
                <div
                  key={section.sectionId}
                  className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden"
                >
                  {/* Section Header */}
                  <div className="bg-white border-bottom p-3 p-md-4">
                    <h5 className="fw-bold mb-1">
                      {section.title}
                    </h5>

                    {section.description && (
                      <p className="text-muted small mb-0">
                        {section.description}
                      </p>
                    )}
                  </div>

                  {/* Fields */}
                  <div className="card-body bg-white p-3 p-md-4">
                    {section.fields
                      .sort(
                        (a, b) =>
                          a.ui.order - b.ui.order
                      )
                      .map((field) => (
                        <div
                          key={field.fieldId}
                          className="mb-4"
                        >
                          {/* Field Label */}
                          <div className="d-flex align-items-start gap-2 mb-2">
                            <div
                              className="bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                              style={{
                                width: 36,
                                height: 36,
                              }}
                            >
                              {fieldIcon(field.type)}
                            </div>

                            <div className="flex-grow-1">
                              <label className="fw-bold text-dark mb-1 d-block">
                                {field.label}

                                {field.required && (
                                  <span className="text-danger ms-1">
                                    *
                                  </span>
                                )}
                              </label>

                              {field.ui?.helpText && (
                                <small className="text-muted d-block">
                                  {field.ui.helpText}
                                </small>
                              )}
                            </div>
                          </div>

                          {/* Field */}
                          {renderField(field)}

                          {/* Error */}
                          {errors[field.fieldId] && (
                            <div className="text-danger small fw-semibold mt-2">
                              {errors[field.fieldId]}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
          </div>

          {/* FOOTER */}
          <div className="bg-white border-top p-3 p-md-4">
            <button
              type="button"
              className="btn btn-primary btn-lg w-100 rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-2 py-3"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Saving...
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  Save & Continue
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default DynamicForm;