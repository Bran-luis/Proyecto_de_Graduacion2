import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditarUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', role: 'client' });
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/usuarios/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm(res.data.usuario);
      } catch (error) {
        console.error('Error al cargar usuario:', error);
        setMensaje('No se pudo cargar el usuario');
      }
    };

    obtenerUsuario();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/usuarios/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMensaje('Usuario actualizado correctamente');
      // Redirigir luego de 1.5 segundos
      setTimeout(() => navigate('/admin/usuarios'), 1500);
    } catch (error) {
      console.error(error);
      setMensaje('Error al actualizar usuario');
    }
  };

  return (
    <div className="container mt-4">
      <h3>Editar usuario</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="form-label">Nombre</label>
          <input name="name" className="form-control" value={form.name} onChange={handleChange} required />
        </div>
        <div className="mb-2">
          <label className="form-label">Correo electrónico</label>
          <input name="email" type="email" className="form-control" value={form.email} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Rol</label>
          <select name="role" className="form-select" value={form.role} onChange={handleChange}>
            <option value="client">Cliente</option>
            <option value="agent">Soporte</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Guardar cambios</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/admin/usuarios')}>Volver</button>
      </form>
      {mensaje && <div className="alert alert-info mt-3">{mensaje}</div>}
    </div>
  );
}

export default EditarUsuario;