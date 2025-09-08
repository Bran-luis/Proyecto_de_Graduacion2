import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function SidebarAdmin() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { key: '/admin', label: 'Panel', icon: 'bi bi-bar-chart' },
    { key: '/admin/usuarios', label: 'Usuarios', icon: 'bi bi-people' },
    { key: '/admin/tickets', label: 'Tickets', icon: 'bi bi-card-checklist' },
    { key: '/admin/historial', label: 'Historial', icon: 'bi bi-clock-history' },
    { key: '/admin/estadisticas', label: 'Estadísticas', icon: 'bi bi-graph-up' },
  ];

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="d-flex flex-column bg-white border-end shadow-sm" style={{ width: '250px', height: '100vh' }}>
      {/* Logo y botón principal */}
      <div className="p-3">
        <h5 className="fw-bold text-center text-primary">🎫 MiTickets</h5>
      </div>

      {/* Menú de navegación */}
      <nav className="flex-grow-1 px-2">
        {menuItems.map((item) => (
          <button
            key={item.key}
            className={`btn w-100 text-start d-flex align-items-center gap-2 my-1 ${
              location.pathname === item.key ? 'btn-primary text-white' : 'btn-light'
            }`}
            onClick={() => navigate(item.key)}
          >
            <i className={item.icon}></i> {item.label}
          </button>
        ))}
      </nav>

      {/* Botón de cerrar sesión */}
      <div className="p-3 border-top">
        <button className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2" onClick={cerrarSesion}>
          <i className="bi bi-box-arrow-right"></i> Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default SidebarAdmin;