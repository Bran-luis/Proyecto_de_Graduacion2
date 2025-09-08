import React from 'react';

function SidebarUsuario({ activeView, onChangeView }) {
  const menuItems = [
    { key: 'dashboard', label: 'Panel Principal', icon: 'bi bi-grid' },
    { key: 'tickets', label: 'Mis Tickets', icon: 'bi bi-ticket-perforated' },
    { key: 'new', label: 'Nuevo Ticket', icon: 'bi bi-plus-circle' },
    { key: 'technicians', label: 'Técnicos', icon: 'bi bi-people' },
    //{ key: 'reports', label: 'Reportes', icon: 'bi bi-bar-chart' },
  ];

  return (
    <div className="d-flex flex-column bg-white border-end shadow-sm" style={{ width: '250px', height: '100vh' }}>
      {/* Botón Crear Ticket arriba */}
      <div className="p-3">
        <button
          className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
          onClick={() => onChangeView('new')}
        >
          <i className="bi bi-plus"></i> Crear Ticket
        </button>
      </div>

      {/* Menú lateral */}
      <nav className="flex-grow-1 px-2">
        {menuItems.map((item) => (
          <button
            key={item.key}
            className={`btn w-100 text-start d-flex align-items-center gap-2 my-1 ${
              activeView === item.key ? 'btn-primary text-white' : 'btn-light'
            }`}
            onClick={() => onChangeView(item.key)}
          >
            <i className={item.icon}></i> {item.label}
          </button>
        ))}
      </nav>

      {/* Pie de ayuda */}
      <div className="p-3 border-top">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-headphones text-muted"></i>
          <div>
            <p className="mb-0 fw-semibold">Centro de Ayuda</p>
            <small className="text-muted">¿Necesitas ayuda?</small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SidebarUsuario;