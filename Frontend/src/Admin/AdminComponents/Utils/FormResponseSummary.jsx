import React from "react";
import {
  FaClipboardList,
  FaCheckCircle
} from "react-icons/fa";

/* =========================
   FORM RESPONSE SUMMARY
   ========================= */
const FormResponseSummary = ({ summary = [] }) => {
  if (!summary.length) {
    return (
      <div className="alert alert-warning">
        No summary available
      </div>
    );
  }

  /* ===== GROUP SUMMARY BY SECTION ===== */
  const grouped = summary.reduce((acc, item) => {
    if (!acc[item.group]) {
      acc[item.group] = [];
    }
    acc[item.group].push(item);
    return acc;
  }, {});

  return (
    <div className="container my-4">
      <div className="card border-0 shadow-lg rounded-4">
        {/* BODY */}
        <div className="card-body bg-light">
          {Object.entries(grouped).map(
            ([groupTitle, items]) => (
              <div
                key={groupTitle}
                className="card mb-4 border-0 shadow-sm rounded-4"
              >
                <div
  className="section-header"
>
  <div className="d-flex align-items-center">
    <div className="section-icon">
      <FaClipboardList />
    </div>

    <div>
      <h6 className="mb-0 fw-bold text-light">
        {groupTitle}
      </h6>
      <small className="text-light opacity-75">
        Review Information
      </small>
    </div>
  </div>
</div>


                <div className="card-body bg-white p-4">

  {items.map((item, idx) => {

    const values =
      typeof item.value === "string"
        ? item.value.split(",").map(v => v.trim())
        : [item.value];

    return (
      <div
        key={idx}
        className="summary-row"
      >
        <div className="summary-label">
          <FaCheckCircle className="text-success me-2" />
          {item.label}
        </div>

        <div className="summary-value">

          {values.length > 1 ? (
            <div className="charge-container">

              {values.map((value, i) => (
                <span
                  key={i}
                  className="charge-pill"
                >
                  {value}
                </span>
              ))}

            </div>
          ) : (
            <span className="single-value">
              {item.value}
            </span>
          )}

        </div>
      </div>
    );
  })}
</div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default FormResponseSummary;
