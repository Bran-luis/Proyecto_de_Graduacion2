import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AgregarUsuario from './pages/AgregarUsuarioAdmin';
import Usuarios from './pages/ListaUsuariosAdmin';
import EditarUsuario from './pages/EditarUsuarioAdmin';
import AdminLayout from './components/AdminLayout';
import VistaSoporteKanban from './components/VistaSoporte';
import VistaUsuarioDashboard from './components/VistaUsuarioDashboard';
import MiCuentaUsuario from './components/MiCuentaUsuario';
import VistaAdminTickets from './components/VistaAdminTickets';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/soporte" element={<VistaSoporteKanban />} />
        <Route path="/usuario" element={<VistaUsuarioDashboard />} />
        <Route path="/mi-cuenta" element={<MiCuentaUsuario />} />

        {/* Vistas del Admin con Sidebar */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/usuarios" element={<AdminLayout><Usuarios /></AdminLayout>} />
        <Route path="/admin/usuarios/agregar" element={<AdminLayout><AgregarUsuario /></AdminLayout>} />
        <Route path="/admin/usuarios/editar/:id" element={<AdminLayout><EditarUsuario /></AdminLayout>} />
        <Route path="/admin/tickets" element={<AdminLayout><VistaAdminTickets /></AdminLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
