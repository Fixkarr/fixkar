import React from 'react'

const StatCard = ({ title, value, icon, color }) => (
     <div className="col-12 col-sm-6 col-lg-4 col-xxl-2">
    <div
      className="position-relative overflow-hidden rounded-4 p-4 h-100"
      style={{
        width : "fit-content",
        background: color,
        boxShadow: "0 10px 30px rgba(37,99,235,0.35)",
      }}
    >
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <p className="text-white-50 mb-2 small fw-semibold">
           {title}
          </p>
          <h2 className="fw-bold mb-0">{value}</h2>
        </div>

        <div
          className="d-flex align-items-center justify-content-center rounded-4"
          style={{
            width: "55px",
            height: "55px",
            background: "rgba(255,255,255,0.18)",
            fontSize: "22px",
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  </div>


);

export default StatCard
