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
                <div
                  className="p-3 text-white rounded-top-4"
                  style={{
                    background:
                      "linear-gradient(135deg, #198754, #20c997)"
                  }}
                >
                  <h6 className="fw-bold mb-0">
                    {groupTitle}
                  </h6>
                </div>

                {/* GROUP CONTENT */}
                <div className="card-body bg-white">
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
