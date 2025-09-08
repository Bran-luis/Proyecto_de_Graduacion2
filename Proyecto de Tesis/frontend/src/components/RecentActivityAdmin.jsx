import React from 'react';

const mockData = [
  { time: '10:45 AM', desc: 'Ticket #123 creado por Juan.' },
  { time: '11:10 AM', desc: 'Ticket #122 asignado a soporte.' },
  { time: '12:30 PM', desc: 'Usuario Ana cerró ticket #119.' },
];

function RecentActivity() {
  return (
    <div className="bg-white p-3 rounded shadow-sm">
      <h5 className="mb-3">Actividades recientes</h5>
      <ul className="list-unstyled">
        {mockData.map((item, index) => (
          <li key={index} className="mb-2">z
            <span className="text-muted small">{item.time} - </span>
            {item.desc}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecentActivity;