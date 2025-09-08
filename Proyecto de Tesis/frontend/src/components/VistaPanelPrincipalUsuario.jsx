import React, { useEffect, useState } from 'react';
import axios from 'axios';

function VistaPanelPrincipalUsuario() {
    const [tickets, setTickets] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [tecnicos, setTecnicos] = useState([]);

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

    const contarPorEstado = (estadoNombre) =>
        tickets.filter(t => t.status?.name.toLowerCase() === estadoNombre.toLowerCase()).length;

    return (
        <div className="container">
            <h3 className="fw-bold mb-4">Panel Principal</h3>

            {/* Resumen */}
            <div className="row mb-4">
                <div className="col-md-3"><div className="card p-3 text-center"><h4>{tickets.length}</h4><p>Tickets Totales</p></div></div>
                <div className="col-md-3"><div className="card p-3 text-center"><h4>{contarPorEstado('En Proceso')}</h4><p>En Progreso</p></div></div>
                <div className="col-md-3"><div className="card p-3 text-center"><h4>{contarPorEstado('Resuelto')}</h4><p>Resueltos</p></div></div>
                <div className="col-md-3"><div className="card p-3 text-center"><h4>{contarPorEstado('Abierto')}</h4><p>Pendientes</p></div></div>
            </div>

            {/* Tickets Recientes */}
            <h5 className="fw-bold mb-2">Tickets Recientes</h5>
            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr><th>ID</th><th>Título</th><th>Estado</th><th>Prioridad</th><th>Fecha</th></tr>
                    </thead>
                    <tbody>
                        {tickets.slice(0, 5).map(ticket => (
                            <tr key={ticket.id}>
                                <td>#{ticket.id}</td>
                                <td>{ticket.title}</td>
                                <td><span className="badge bg-secondary">{ticket.status?.name}</span></td>
                                <td><span className="badge bg-info text-dark">{ticket.priority?.name}</span></td>
                                <td>{new Date(ticket.created_at).toLocaleDateString()}</td>
                                <td>{ticket.assignee?.name || 'Sin asignar'}</td>
                            </tr>

                        ))}
                    </tbody>
                </table>
            </div>

            {/* Técnicos */}
            {/* <h5 className="fw-bold mt-4">Técnicos Disponibles</h5>
            <ul className="list-group">
                {tecnicos.map(t => (
                    <li key={t.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <span><i className="bi bi-person-badge-fill me-2"></i>{t.name}</span>
                        <span className="text-muted">{t.email}</span>
                    </li>
                ))}
            </ul> */}
        </div>
    );
}

export default VistaPanelPrincipalUsuario;