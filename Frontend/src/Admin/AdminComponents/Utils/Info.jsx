const Info = ({ label, value, icon }) => {
  return (
    <div className="col-md-6">
      <div
        className="p-3 rounded-4 h-100"
        style={{
          background: "#fff",
          boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
          transition: "all 0.25s ease",
        }}
      >
        <div className="d-flex align-items-center gap-2 text-muted small mb-1">
          <span className="text-primary fs-6">{icon}</span>
          <span className="fw-medium">{label}</span>
        </div>

        <div className="fw-semibold fs-6 text-dark">
          {value ?? <span className="text-muted">N/A</span>}
        </div>
      </div>
    </div>
  );
};

export default Info;
