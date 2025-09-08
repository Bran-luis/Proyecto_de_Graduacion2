import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MiCuentaUsuario() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('user'));

  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [mensaje, setMensaje] = useState('');

  const cambiarPassword = async () => {
    if (nuevaPassword.length < 4) {
      setMensaje('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    if (nuevaPassword !== confirmacion) {
      setMensaje('Las contraseñas no coinciden.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/usuarios/${usuario.id}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nuevaPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje('✅ Contraseña actualizada correctamente');
        setNuevaPassword('');
        setConfirmacion('');
      } else {
        setMensaje('❌ ' + data.mensaje);
      }
    } catch (error) {
      setMensaje('❌ Error al cambiar la contraseña');
      console.error(error);
    }
  };

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-3">Mi Cuenta</h3>

      <div className="card p-4 mb-4">
        <p><strong>Nombre:</strong> {usuario?.nombre}</p>
        <p><strong>Correo electrónico:</strong> {usuario?.email}</p>
      </div>

      <div className="card p-4 mb-4">
        <h5 className="mb-3">Cambiar contraseña</h5>
        <div className="mb-3">
          <label className="form-label">Nueva contraseña</label>
          <input
            type="password"
            className="form-control"
            value={nuevaPassword}
            onChange={(e) => setNuevaPassword(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Confirmar contraseña</label>
          <input
            type="password"
            className="form-control"
            value={confirmacion}
            onChange={(e) => setConfirmacion(e.target.value)}
          />
        </div>
        {mensaje && <div className="alert alert-info">{mensaje}</div>}
        <button className="btn btn-primary" onClick={cambiarPassword}>Actualizar Contraseña</button>
      </div>

      <button className="btn btn-secondary" onClick={() => navigate('/usuario')}>
        <i className="bi bi-arrow-left me-2"></i> Volver al panel
      </button>
    </div>
  );
}

export default MiCuentaUsuario;
