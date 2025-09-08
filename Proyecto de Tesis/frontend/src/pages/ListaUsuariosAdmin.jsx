import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/usuarios', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setUsuarios(res.data.usuarios);
      } catch (error) {
        console.error('Error al obtener usuarios', error);
      }
    };

    fetchUsuarios();
  }, []);

  const eliminarUsuario = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      // Actualiza la lista local eliminando el usuario
      setUsuarios(usuarios.filter(u => u.id !== id));
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      alert('No se pudo eliminar el usuario');
    }
  };

  const editarUsuario = (id) => {
    navigate(`/admin/usuarios/editar/${id}`);
  };

  return (
    <div className="flex-grow-1 p-4">
      <h3>Usuarios registrados</h3>
      <button
        className="btn btn-success mb-3"
        onClick={() => navigate('/admin/usuarios/agregar')}
      >
        ➕ Agregar usuario
      </button>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.name}</td>
              <td>{usuario.email}</td>
              <td>{usuario.role}</td>
              <td>{new Date(usuario.created_at).toLocaleDateString()}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => editarUsuario(usuario.id)}
                >
                  📝 Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => eliminarUsuario(usuario.id)}
                >
                  🗑️ Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListaUsuarios;