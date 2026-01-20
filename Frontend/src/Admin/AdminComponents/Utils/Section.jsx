import { FaChevronRight } from "react-icons/fa";

const Section = ({ title, icon, children }) => {
  return (
    <div
      className="card border-0 rounded-4 mb-4 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #f8f9ff, #eef2ff)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
        transition: "all 0.3s ease",
      }}
    >
      {/* Header */}
      <div
        className="d-flex align-items-center justify-content-between px-4 py-3"
        style={{
          background: "linear-gradient(135deg, #6366f1, #4f46e5)",
          color: "#fff",
        }}
      >
        <div className="d-flex align-items-center gap-3">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: 42,
              height: 42,
              background: "rgba(255,255,255,0.2)",
              fontSize: 20,
            }}
          >
            {icon}
          </div>

          <h6 className="mb-0 fw-semibold">{title}</h6>
        </div>

        <FaChevronRight className="opacity-75" />
      </div>

      {/* Body */}
      <div className="card-body px-4 py-4">
        <div className="row g-4">{children}</div>
      </div>
    </div>
  );
};

export default Section;
