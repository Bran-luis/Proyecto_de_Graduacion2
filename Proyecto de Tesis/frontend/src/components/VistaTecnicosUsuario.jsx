import React, { useEffect, useState } from 'react';
import axios from 'axios';

function VistaTecnicosUsuario() {
    const [tecnicos, setTecnicos] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get('http://localhost:5000/api/tecnicos', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => setTecnicos(res.data))
            .catch(err => console.error('Error al cargar técnicos:', err));
    }, []);

    const tecnicosDisponibles = tecnicos.filter(t => t.estado === 'disponible');
    const calificacionPromedio = tecnicos.length
        ? (tecnicos.reduce((acc, t) => acc + (t.rating || 0), 0) / tecnicos.length).toFixed(1)
        : '0';

    return (
        <div className="container py-4">
            <h3 className="fw-bold mb-4">Técnicos Disponibles</h3>

            <div className="row mb-4">
                <div className="col-md-4">
                    <div className="card p-3 text-center">
                        <p className="text-muted mb-1">Técnicos Disponibles</p>
                        <h4>{tecnicosDisponibles.length}</h4>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card p-3 text-center">
                        <p className="text-muted mb-1">Tiempo Promedio</p>
                        <h4>2.5 horas</h4>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <strong>Lista de Técnicos</strong>
                </div>
                <div className="table-responsive">
                    <table className="table table-striped mb-0">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Estado</th>
                                <th>Tickets Activos</th>

                            </tr>
                        </thead>
                        <tbody>
                            {tecnicos.map(t => (
                                <tr key={t.id}>
                                    <td>{t.name}</td>
                                    <td>
                                        <span className={`badge bg-${t.estado === 'disponible' ? 'success' : 'warning text-dark'}`}>
                                            {t.estado.charAt(0).toUpperCase() + t.estado.slice(1)}
                                        </span>
                                    </td>
                                    <td>{t.tickets_activos_en_proceso}</td>
                                </tr>
                            ))}
                            {tecnicos.length === 0 && (
                                <tr><td colSpan="3" className="text-center text-muted">No hay técnicos disponibles</td></tr>
                            )}
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    );
}

export default VistaTecnicosUsuario;