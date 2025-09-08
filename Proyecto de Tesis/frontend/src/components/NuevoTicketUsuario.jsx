import React, { useEffect, useState } from 'react';
import axios from 'axios';

function NuevoTicketUsuario({ onTicketCreado }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [priorityId, setPriorityId] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [prioridades, setPrioridades] = useState([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('http://localhost:5000/api/tickets/categorias', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setCategorias(res.data))
      .catch(err => console.error('Error al cargar categorías', err));

    axios.get('http://localhost:5000/api/tickets/prioridades', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setPrioridades(res.data))
      .catch(err => console.error('Error al cargar prioridades', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !categoryId || !priorityId) {
      setMensaje('Completa los campos requeridos.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/tickets', {
        title,
        description,
        category_id: categoryId,
        priority_id: priorityId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMensaje('✅ Ticket creado exitosamente');
      setTitle('');
      setDescription('');
      setCategoryId('');
      setPriorityId('');

      if (onTicketCreado) onTicketCreado(); // para refrescar la vista si es necesario
    } catch (error) {
      console.error(error);
      setMensaje('❌ Error al crear el ticket');
    }
  };

  return (
    <div className="container">
      <h4 className="mb-4 fw-bold">Crear Nuevo Ticket</h4>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Título del Ticket *</label>
          <input type="text" className="form-control" placeholder="Ej: No puedo acceder a mi correo"
            value={title} onChange={e => setTitle(e.target.value)} />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Categoría *</label>
            <select className="form-select" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
              <option value="">Seleccione...</option>
              {categorias.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Prioridad *</label>
            <select className="form-select" value={priorityId} onChange={e => setPriorityId(e.target.value)}>
              <option value="">Seleccione...</option>
              {prioridades.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción del Problema</label>
          <textarea className="form-control" rows="4"
            placeholder="Describa el problema con el mayor detalle posible"
            value={description} onChange={e => setDescription(e.target.value)}></textarea>
        </div>

        {mensaje && <div className="alert alert-info">{mensaje}</div>}

        <div className="d-flex justify-content-end">
          <button type="reset" className="btn btn-light me-2">Cancelar</button>
          <button type="submit" className="btn btn-primary">Crear Ticket</button>
        </div>
      </form>
    </div>
  );
}

export default NuevoTicketUsuario;