import React, { useEffect, useState } from 'react';
import Sidebar from '../components/sidebarAdmin';
import DashboardCard from '../components/DashboardCardAdmin';
import RecentActivity from '../components/RecentActivityAdmin';
import axios from 'axios';

function AdminDashboard() {
    const [resumen, setResumen] = useState({
        ticketsPendientes: 0,
        ticketsCerrados: 0,
        totalUsuarios: 0,
    });

    useEffect(() => {
        axios.get('http://localhost:5000/api/admin/dashboard/resumen', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => setResumen(res.data))
            .catch(err => console.error(err));

    }, []);

    const [ticketsPorPrioridad, setTicketsPorPrioridad] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/tickets/tickets-por-prioridad', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => setTicketsPorPrioridad(res.data))
            .catch(err => console.error(err));

    }, []);


    return (
        <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f5f7fb' }}>
            <Sidebar />
            <div className="flex-grow-1 p-4">
                <h2 className="mb-4 fw-bold">Panel de Administración</h2>
                <div className="row g-4 mb-4">
                    <DashboardCard title="Tickets pendientes" value={resumen.ticketsPendientes} color="danger" icon="🕒" />
                    <DashboardCard title="Tickets cerrados" value={resumen.ticketsCerrados} color="success" icon="✅" />
                    <DashboardCard title="Usuarios registrados" value={resumen.totalUsuarios} color="primary" icon="👥" />
                </div>
                <div className="row g-3 mb-4">
                    {ticketsPorPrioridad.map((item, index) => (
                        <div className="col-md-4" key={index}>
                            <div className="bg-white border-start border-4 rounded p-3 shadow-sm"
                                style={{ borderColor: item.prioridad === 'Alta' ? '#dc3545' : item.prioridad === 'Media' ? '#ffc107' : '#0d6efd' }}>
                                <h6 className="text-muted mb-1">Prioridad: {item.prioridad}</h6>
                                <h4 className="fw-bold">{item.total} tickets</h4>
                            </div>
                        </div>
                    ))}
                </div>

                <RecentActivity />
            </div>
        </div>
    );
}

export default AdminDashboard;
