import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { jwtDecode } from 'jwt-decode';

const columnasIniciales = {
    '1': { nombre: 'Abierto', color: 'bg-light', tickets: [] },
    '2': { nombre: 'En Proceso', color: 'bg-warning-subtle', tickets: [] },
    '3': { nombre: 'Resuelto', color: 'bg-success-subtle', tickets: [] }
};

function VistaSoporteKanban() {
    const [columnasEstado, setColumnasEstado] = useState({});
    const [prioridadSeleccionada, setPrioridadSeleccionada] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('');
    const [filtroTexto, setFiltroTexto] = useState('');
    const [modalAbierto, setModalAbierto] = useState(false);
    const [ticketSeleccionado, setTicketSeleccionado] = useState(null);
    const [usuario, setUsuario] = useState(null);

    const [ticketsOriginales, setTicketsOriginales] = useState([]);

    useEffect(() => {
        const obtenerTickets = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const decoded = jwtDecode(token);
                    setUsuario(decoded);
                }

                const res = await axios.get('http://localhost:5000/api/tickets/asignados', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setTicketsOriginales(res.data.tickets);
                agruparPorEstado(res.data.tickets);
            } catch (err) {
                console.error('Error al obtener tickets:', err);
            }
        };

        obtenerTickets();
    }, []);

    const agruparPorEstado = (tickets) => {
        const agrupados = JSON.parse(JSON.stringify(columnasIniciales));
        tickets.forEach(ticket => {
            const statusId = ticket.status_id?.toString();
            if (agrupados[statusId]) {
                agrupados[statusId].tickets.push(ticket);
            }
        });
        setColumnasEstado(agrupados);
    };

    const getColorPrioridad = (nivel) => {
        switch (nivel) {
            case 'Alta': return 'bg-danger';
            case 'Media': return 'bg-warning text-dark';
            case 'Baja': return 'bg-success';
            default: return 'bg-secondary';
        }
    };

    const limpiarFiltros = () => {
        setPrioridadSeleccionada('');
        setFiltroEstado('');
        setFiltroTexto('');
        agruparPorEstado(ticketsOriginales);
    };

    const asignarmeTicket = async (ticketId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/tickets/${ticketId}/asignar`, {
                agente_id: usuario.id
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            window.location.reload();
        } catch (error) {
            console.error('Error al asignar ticket:', error);
        }
    };

    const onDragEnd = async (result) => {
        const { source, destination, draggableId } = result;
        if (!destination || source.droppableId === destination.droppableId) return;

        const sourceId = source.droppableId;
        const destId = destination.droppableId;

        const ticket = columnasEstado[sourceId].tickets.find(t => t.id.toString() === draggableId);
        const nuevaOrigen = Array.from(columnasEstado[sourceId].tickets);
        const nuevaDestino = Array.from(columnasEstado[destId].tickets);
        nuevaOrigen.splice(source.index, 1);
        nuevaDestino.splice(destination.index, 0, ticket);

        setColumnasEstado({
            ...columnasEstado,
            [sourceId]: { ...columnasEstado[sourceId], tickets: nuevaOrigen },
            [destId]: { ...columnasEstado[destId], tickets: nuevaDestino }
        });

        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/tickets/${ticket.id}/estado`, {
                estado_id: parseInt(destId)
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Actualiza el status_id localmente
            ticket.status_id = parseInt(destId);

            // Reemplaza el ticket actualizado en ticketsOriginales
            const nuevosTickets = ticketsOriginales.map(t =>
                t.id === ticket.id ? { ...t, status_id: parseInt(destId) } : t
            );
            setTicketsOriginales(nuevosTickets);
        } catch (error) {
            console.error('Error al actualizar estado en backend:', error);
        }

    };

    const ticketsFiltrados = ticketsOriginales.filter(ticket => {
        const matchPrioridad = !prioridadSeleccionada || ticket.priority?.name === prioridadSeleccionada;
        const matchEstado = !filtroEstado || ticket.status_id?.toString() === filtroEstado;
        const matchTexto = !filtroTexto ||
            ticket.title.toLowerCase().includes(filtroTexto.toLowerCase()) ||
            ticket.description?.toLowerCase().includes(filtroTexto.toLowerCase());
        return matchPrioridad && matchEstado && matchTexto;
    });

    useEffect(() => {
        agruparPorEstado(ticketsFiltrados);
    }, [prioridadSeleccionada, filtroEstado, filtroTexto]);

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h3 className="mb-0">📋 Tickets asignados</h3>
                    {usuario && <small className="text-muted">👨‍💼 Soporte: {usuario.name || usuario.email}</small>}
                </div>
                <div className="d-flex gap-2">
                    <select className="form-select" value={prioridadSeleccionada} onChange={(e) => setPrioridadSeleccionada(e.target.value)}>
                        <option value="">Todas las prioridades</option>
                        <option value="Alta">Alta</option>
                        <option value="Media">Media</option>
                        <option value="Baja">Baja</option>
                    </select>
                    <select className="form-select" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                        <option value="">Todos los estados</option>
                        <option value="1">Abierto</option>
                        <option value="2">En Proceso</option>
                        <option value="3">Resuelto</option>
                    </select>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar..."
                        value={filtroTexto}
                        onChange={(e) => setFiltroTexto(e.target.value)}
                    />
                    <button className="btn btn-outline-secondary btn-sm" onClick={limpiarFiltros}>Limpiar</button>
                </div>
                <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => {
                        localStorage.removeItem('token');
                        window.location.href = '/login';
                    }}
                >
                    🔒 Cerrar sesión
                </button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="row">
                    {Object.entries(columnasEstado).map(([estadoId, columna]) => (
                        <div key={estadoId} className="col-md-4 mb-3">
                            <h5 className="text-center">{columna.nombre}</h5>
                            <Droppable droppableId={estadoId}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`p-2 rounded shadow-sm ${columna.color}`}
                                        style={{ minHeight: '300px', transition: 'all 0.2s ease' }}
                                    >
                                        {columna.tickets.map((ticket, index) => (
                                            <Draggable
                                                draggableId={ticket.id.toString()}
                                                index={index}
                                                key={ticket.id}
                                            >
                                                {(provided) => (
                                                    <div
                                                        className="card mb-3 border-0 shadow-sm"
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        onClick={() => {
                                                            setTicketSeleccionado(ticket);
                                                            setModalAbierto(true);
                                                        }}
                                                    >
                                                        <div className="card-body">
                                                            <h6 className="fw-bold mb-1">{ticket.title}</h6>
                                                            <p className="mb-2 small text-muted">{ticket.description}</p>
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <span className="badge bg-secondary">👤 {ticket.creator?.name}</span>
                                                                <span className={`badge ${getColorPrioridad(ticket.priority?.name)}`}>{ticket.priority?.name}</span>
                                                            </div>
                                                            {!ticket.assigned_to && usuario && (
                                                                <button
                                                                    className="btn btn-sm btn-outline-primary mt-2"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        asignarmeTicket(ticket.id);
                                                                    }}
                                                                >📌 Asignarme</button>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>

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
                                <p><strong>Cliente:</strong> {ticketSeleccionado.creator?.name}</p>
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
        </div>
    );
}

export default VistaSoporteKanban;