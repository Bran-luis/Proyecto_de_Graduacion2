import React from 'react';
import { useNavigate } from 'react-router-dom';

function NavbarUsuario() {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  // Obtener usuario desde localStorage
  const usuario = JSON.parse(localStorage.getItem('user'));
  const email = usuario?.email;

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm px-3">
      <div className="container-fluid">
        <a className="navbar-brand d-flex align-items-center gap-2" href="#">
          <i className="bi bi-ticket-perforated-fill fs-4 text-primary"></i>
          <span className="fw-bold">Sistema de Tickets</span>
        </a>

        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-outline-primary d-flex align-items-center gap-2">
            <i className="bi bi-bell-fill"></i>
            <span>Notificaciones</span>
          </button>

          <div className="dropdown">
            <button
              className="btn p-0 border-0 bg-transparent dropdown-toggle"
              type="button"
              id="dropdownUserMenu"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/6073/6073873.png"
                alt="avatar"
                className="rounded-circle"
                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
              />
            </button>

            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownUserMenu">
              <li className="px-3 py-2">
                <small className="text-muted">Hola,</small><br />
                <strong>{usuario?.nombre}</strong><br />
                <small className="text-muted">{usuario?.email}</small>
              </li>

              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item" onClick={() => navigate('/mi-cuenta')}>
                  <i className="bi bi-gear me-2"></i>Mi Cuenta
                </button>
              </li>

              <li><a className="dropdown-item" href="#"><i className="bi bi-question-circle me-2"></i>Ayuda & Soporte</a></li>
              <li>
                <button className="dropdown-item text-danger" onClick={cerrarSesion}>
                  <i className="bi bi-box-arrow-right me-2"></i>Cerrar sesión
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavbarUsuario;
