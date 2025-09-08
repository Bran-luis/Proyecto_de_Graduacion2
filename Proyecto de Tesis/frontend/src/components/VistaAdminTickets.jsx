import React, { useEffect, useState } from 'react';
import axios from 'axios';

function VistaAdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('http://localhost:5000/api/tickets', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setTickets(res.data.tickets))
      .catch(err => console.error('Error al obtener tickets', err));

    axios.get('http://localhost:5000/api/tecnicos', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setTecnicos(res.data))
      .catch(err => console.error('Error al obtener técnicos', err));
  }, []);

  const asignarTecnico = async (ticketId, tecnicoId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/tickets/${ticketId}/asignar`, {
        tecnico_id: tecnicoId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTickets(prev => prev.map(t =>
        t.id === ticketId ? { ...t, assigned_to: tecnicoId } : t
      ));
      setMensaje('✅ Técnico asignado correctamente');
    } catch (error) {
      console.error('Error al asignar técnico', error);
      setMensaje('❌ Error al asignar técnico');
    }
  };

  const cambiarEstado = async (ticketId, estadoId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/tickets/${ticketId}/estado`, {
        estado_id: estadoId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTickets(prev => prev.map(t =>
        t.id === ticketId ? { ...t, status_id: estadoId } : t
      ));
      setMensaje('✅ Estado actualizado');
    } catch (error) {
      console.error('Error al cambiar estado', error);
      setMensaje('❌ Error al cambiar estado');
    }
  };

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-4">Gestión de Tickets</h3>

      {mensaje && <div className="alert alert-info">{mensaje}</div>}

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Estado</th>
              <th>Prioridad</th>
              <th>Asignado a</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(ticket => (
              <tr key={ticket.id}>
                <td>#{ticket.id}</td>
                <td>{ticket.title}</td>
                <td>{ticket.status?.name}</td>
                <td>{ticket.priority?.name}</td>
                <td>{ticket.assignee?.name || 'Sin asignar'}</td>
                <td>{new Date(ticket.created_at).toLocaleDateString()}</td>
                <td>
                  <select
                    className="form-select form-select-sm mb-1"
                    value={ticket.assigned_to || ''}
                    onChange={(e) => asignarTecnico(ticket.id, e.target.value)}
                  >
                    <option value="">Asignar técnico</option>
                    {tecnicos.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>

                  {/* <select
                    className="form-select form-select-sm"
                    onChange={(e) => cambiarEstado(ticket.id, e.target.value)}
                    defaultValue={ticket.status?.id}
                  >
                    <option value="1">Abierto</option>
                    <option value="2">En Proceso</option>
                    <option value="3">Resuelto</option>
                  </select> */}
                </td>
              </tr>
            ))}
            {tickets.length === 0 && (
              <tr><td colSpan="7" className="text-center text-muted">No hay tickets registrados</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VistaAdminTickets;