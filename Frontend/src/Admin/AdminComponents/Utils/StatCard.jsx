import React from 'react'

const StatCard = ({ title, value, icon, color }) => (
    <div className="col-xl-3 col-lg-4 col-md-6">
    <div className={`card border-0 shadow-lg rounded-4 h-100`}>
      <div className="card-body d-flex align-items-center gap-3">
        <div
          className={`rounded-circle d-flex align-items-center justify-content-center bg-${color} text-white`}
          style={{ width: 56, height: 56, fontSize: 22 }}
        >
          {icon}
        </div>
        <div>
          <h6 className="mb-1 text-muted">{title}</h6>
          <h4 className="fw-bold mb-0">{value}</h4>
        </div>
      </div>
    </div>
  </div>

);

export default StatCard
