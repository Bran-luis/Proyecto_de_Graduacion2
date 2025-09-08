import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavbarUsuario from './NavbarUsuario';
import SidebarUsuario from './sidebarUsuario';
import VistaPanelPrincipalUsuario from './VistaPanelPrincipalUsuario';
import NuevoTicketUsuario from './NuevoTicketUsuario';
import VistaTecnicosUsuario from './VistaTecnicosUsuario';


function VistaUsuarioDashboard() {
  const [tickets, setTickets] = useState([]);
  const [ticketSeleccionado, setTicketSeleccionado] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [activeView, setActiveView] = useState('tickets'); // default

  const obtenerTickets = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/tickets', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(res.data.tickets);
    } catch (error) {
      console.error('Error al obtener tickets del usuario:', error);
    }
  };

  useEffect(() => {
    if (activeView === 'tickets') {
      obtenerTickets();
    }
  }, [activeView]);

  const getColorPrioridad = (nivel) => {
    switch (nivel) {
      case 'Alta': return 'badge rounded-pill bg-danger';
      case 'Media': return 'badge rounded-pill bg-warning text-dark';
      case 'Baja': return 'badge rounded-pill bg-success';
      default: return 'badge rounded-pill bg-secondary';
    }
  };

  return (
    <>
      <NavbarUsuario />

      <div className="d-flex" style={{ minHeight: '100vh' }}>
        <SidebarUsuario activeView={activeView} onChangeView={setActiveView} />

        <div className="flex-grow-1 p-4">
          {activeView === 'tickets' && (
            <>
              <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                <h3 className="mb-0 fw-bold text-primary">
                  <i className="bi bi-ticket-perforated me-2"></i> Mis Tickets
                </h3>
              </div>

              <div className="row">
                {tickets.length === 0 && (
                  <div className="text-center text-muted">No tienes tickets registrados aún.</div>
                )}
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="col-md-6 col-lg-4 mb-4">
                    <div
                      className="card h-100 border-0 shadow-sm"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setTicketSeleccionado(ticket);
                        setModalAbierto(true);
                      }}
                    >
                      <div className="card-body">
                        <h6 className="fw-bold mb-1 text-dark">{ticket.title}</h6>
                        <p className="mb-2 small text-muted">{ticket.description}</p>
                        <div className="d-flex justify-content-between align-items-center mt-3">
                          <span className={getColorPrioridad(ticket.priority?.name)}>{ticket.priority?.name}</span>
                          <span className="badge rounded-pill bg-info text-dark">{ticket.status?.name}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeView === 'new' && (
            <NuevoTicketUsuario onTicketCreado={() => setActiveView('tickets')} />
          )}
          {activeView === 'dashboard' && <VistaPanelPrincipalUsuario />}
          {activeView === 'technicians' && (
  <>
    <h3 className="mb-4 fw-bold text-primary">
      <i className="bi bi-people me-2"></i> Técnicos Disponibles
    </h3>
    <VistaTecnicosUsuario />
  </>
)}


          {/* Puedes agregar más vistas aquí, según activeView */}
        </div>
      </div>

      {modalAbierto && ticketSeleccionado && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{ticketSeleccionado.title}</h5>
                <button type="button" className="btn-close" onClick={() => setModalAbierto(false)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Descripción:</strong> {ticketSeleccionado.description}</p>
                <p><strong>Categoría:</strong> {ticketSeleccionado.category?.name}</p>
                <p><strong>Prioridad:</strong> {ticketSeleccionado.priority?.name}</p>
                <p><strong>Estado:</strong> {ticketSeleccionado.status?.name}</p>
                <p><small className="text-muted">Creado el: {new Date(ticketSeleccionado.created_at).toLocaleString()}</small></p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setModalAbierto(false)}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default VistaUsuarioDashboard;
