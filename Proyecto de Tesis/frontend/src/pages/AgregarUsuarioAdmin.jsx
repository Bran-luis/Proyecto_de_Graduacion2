import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function AgregarUsuario() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'client',
  });
  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/usuarios', form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setMensaje(res.data.mensaje);
      setForm({ name: '', email: '', password: '', role: 'client' });

      // Redirigir luego de 1.5 segundos
      setTimeout(() => navigate('/admin'), 1500);

    } catch (error) {
      setMensaje(error.response?.data?.mensaje || 'Error al registrar');
    }
  };

  return (
    <div className="container mt-4">
      <h3>Registrar nuevo usuario</h3>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-2">
          <label className="form-label">Nombre</label>
          <input name="name" className="form-control" value={form.name} onChange={handleChange} required />
        </div>
        <div className="mb-2">
          <label className="form-label">Correo electrónico</label>
          <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required />
        </div>
        <div className="mb-2">
          <label className="form-label">Contraseña</label>
          <input type="password" name="password" className="form-control" value={form.password} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Rol</label>
          <select name="role" className="form-select" value={form.role} onChange={handleChange}>
            <option value="client">Cliente</option>
            <option value="agent">Soporte</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Registrar</button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate('/admin/usuarios')}
        >
          Volver
        </button>
      </form>
      {mensaje && <div className="alert mt-3 alert-info">{mensaje}</div>}
    </div>
  );
}

export default AgregarUsuario;