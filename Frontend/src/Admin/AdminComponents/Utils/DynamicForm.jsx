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
  FaUpload
} from "react-icons/fa";
import { server_url } from "../../../App";
import { useDispatch } from "react-redux";
import { setCurrentUserData } from "../../../redux/user.slice";
import { toast } from "react-toastify";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const DynamicForm = ({ form }) => {
  const [formData, setFormData] = useState({});
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
      responses: formData
    };

     try {
      setLoading(true)
    const { data } = await axios.post(
      `${server_url}/api/user/save-form-response`,
      payload,
      {
        withCredentials: true
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
     ICON BY FIELD TYPE
     ========================= */
  const fieldIcon = (type) => {
    switch (type) {
      case "text":
      case "textarea":
        return <FaFont className="me-2 text-primary" />;
      case "number":
        return <FaHashtag className="me-2 text-primary" />;
      case "checkbox":
        return <FaCheckSquare className="me-2 text-primary" />;
      case "radio":
        return <FaDotCircle className="me-2 text-primary" />;
      case "select":
      case "yesno":
        return <FaListUl className="me-2 text-primary" />;
      case "date":
        return <FaCalendarAlt className="me-2 text-primary" />;
      case "table":
        return <FaTable className="me-2 text-primary" />;
      default:
        return null;
    }
  };

  /* =========================
     FIELD RENDERER (LOGIC SAME)
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
            className="form-control rounded-3"
            placeholder={field.ui?.placeholder || ""}
            value={value}
            onChange={(e) => updateValue(field, e.target.value)}
          />
        );

      case "textarea":
        return (
          <textarea
            className="form-control rounded-3"
            rows={3}
            placeholder={field.ui?.placeholder || ""}
            value={value}
            onChange={(e) => updateValue(field, e.target.value)}
          />
        );

      case "date":
        return (
          <input
            type="date"
            className="form-control rounded-3"
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
      className="form-select rounded-3"
      value={value}
      onChange={(e) => updateValue(field, e.target.value)}
    >
      <option value="">Select</option>
      {field.options?.map((opt) => (
        <option key={opt._id} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );

case "yesno":
  return (
    <div className="d-flex gap-4 mt-1">
      <div className="form-check">
        <input
          className="form-check-input"
          type="radio"
          name={field.fieldId}
          checked={value === "yes"}
          onChange={() => updateValue(field, "yes")}
        />
        <label className="form-check-label fw-semibold">
          Yes
        </label>
      </div>

      <div className="form-check">
        <input
          className="form-check-input"
          type="radio"
          name={field.fieldId}
          checked={value === "no"}
          onChange={() => updateValue(field, "no")}
        />
        <label className="form-check-label fw-semibold">
          No
        </label>
      </div>
    </div>
  );

      case "table":
        return (
          <>
            <table className="table table-bordered table-hover align-middle mt-2">
              <thead className="table-light">
                <tr>
                  <th>Work / Label</th>
                  <th>Charge</th>
                  <th width="60"></th>
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
                        className="btn btn-sm btn-outline-danger"
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
  return form && (
    <div className="container my-4">
      <div className="card border-0 shadow-lg rounded-4 overflow-hidden">

        {/* HEADER */}
        <div
          className="p-4 text-white"
          style={{
           background: "linear-gradient(135deg, #0d6efd, #6ea8fe)",
          }}
        >
          <h4 className="fw-bold mb-1">{form?.title}</h4>
          <p className="mb-0 opacity-75">{form?.description}</p>
        </div>

        {/* BODY */}
        <div className="card-body bg-light">
          {form.sections
            .sort((a, b) => a.order - b.order)
            .map((section) => (
              <div
                key={section.sectionId}
                className="card mb-4 border-0 shadow-sm rounded-4"
              >
                <div
                  className="p-3 text-white rounded-top-4"
                  style={{
                    background: "linear-gradient(135deg, #0d6efd, #6ea8fe)",                  }}
                >
                  <h6 className="fw-bold mb-0">
                    {section.title}
                  </h6>
                  <small className="opacity-75">
                    {section.description}
                  </small>
                </div>

                <div className="card-body bg-white">
                  {section.fields
                    .sort((a, b) => a.ui.order - b.ui.order)
                    .map((field) => (
                      <div key={field.fieldId} className="mb-4">
                        <label className="fw-semibold d-flex align-items-center mb-1">
                          {fieldIcon(field.type)}
                          {field.label}
                          {field.required && (
                            <span className="text-danger ms-1">*</span>
                          )}
                        </label>

                        {renderField(field)}

                        {errors[field.fieldId] && (
                          <div className="text-danger small mt-1">
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
        <div className="p-3 bg-white border-top">
          <button
            className="btn btn-primary btn-lg w-100 rounded-pill fw-semibold d-flex align-items-center justify-content-center gap-2"
            onClick={handleSubmit}
            disabled={loading}
          >
            <FaPaperPlane />
            Submit Form
          </button>
        </div>
      </div>
    </div>
  );
};

export default DynamicForm;
