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
                {/* GROUP HEADER */}
                {/* <div
                  className="p-3 text-white rounded-top-4"
                  style={{
                  background: "linear-gradient(135deg, #0d6efd, #6ea8fe)",
                  }}
                >
                  <h6 className="fw-bold mb-0">
                    {groupTitle}
                  </h6>
                </div> */}
                <div
  className="section-header"
>
  <div className="d-flex align-items-center">
    <div className="section-icon">
      <FaClipboardList />
    </div>

    <div>
      <h6 className="mb-0 fw-bold">
        {groupTitle}
      </h6>
      <small className="text-light opacity-75">
        Review Information
      </small>
    </div>
  </div>
</div>

                {/* GROUP CONTENT */}
                {/* <div className="card-body bg-white">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="d-flex justify-content-between align-items-start border-bottom py-2"
                    >
                      <div className="fw-semibold text-dark">
                        <FaCheckCircle className="me-2 text-success" />
                        {item.label}
                      </div>

                      <div className="text-muted text-end">
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div> */}

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
            <div className="d-flex flex-wrap gap-2 justify-content-end">

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
