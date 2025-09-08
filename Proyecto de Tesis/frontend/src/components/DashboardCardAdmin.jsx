import React from 'react';

function DashboardCard({ title, value, color, icon }) {
  return (
    <div className="col-md-4">
      <div className={`bg-white p-3 rounded shadow-sm border-start border-4 border-${color}`}>
        <div className="d-flex align-items-center">
          <div className={`me-3 fs-2 text-${color}`}>{icon}</div>
          <div>
            <h6 className="text-muted mb-1">{title}</h6>
            <h3 className="fw-bold">{value}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard;