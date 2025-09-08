const express = require('express');
const router = express.Router();
const { Tickets } = require('../models/init-models')(require('../config/database'));
const { Users, Categories, Priorities, Statuses } = require('../models/init-models')(require('../config/database'));
const verificarToken = require('../middlewares/verificarToken');

// Crear nuevo ticket (rol cliente)
router.post('/tickets', verificarToken, async (req, res) => {
  const { title, description, category_id, priority_id } = req.body;

  if (!title || !category_id || !priority_id) {
    return res.status(400).json({ mensaje: 'Título, categoría y prioridad son obligatorios' });
  }

  try {
    const nuevoTicket = await Tickets.create({
      title,
      description,
      user_id: req.usuario.id, // el cliente que crea el ticket
      category_id,
      priority_id,
      status_id: 1 // puedes asumir que "1" es el estado "Abierto"
    });

    res.status(201).json({
      mensaje: 'Ticket creado correctamente',
      ticket: nuevoTicket
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear el ticket' });
  }
});


// Obtener lista de tickets (según rol)
router.get('/tickets', verificarToken, async (req, res) => {
  try {
    const filtros = {};

    // Si el usuario es cliente, solo ve sus tickets
    if (req.usuario.role === 'client') {
      filtros.user_id = req.usuario.id;
    }

    const tickets = await Tickets.findAll({
      where: filtros,
      include: [
        { model: Users, as: 'creator', attributes: ['id', 'name', 'email'] },   // quien lo creó
        { model: Users, as: 'assignee', attributes: ['id', 'name', 'email'] },  // a quién está asignado
        { model: Categories, as: 'category', attributes: ['id', 'name'] },
        { model: Priorities, as: 'priority', attributes: ['id', 'name', 'level'] },
        { model: Statuses, as: 'status', attributes: ['id', 'name'] }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({ tickets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener tickets' });
  }
});

// Tickets agrupados por prioridad (admin)
router.get('/tickets-por-prioridad', verificarToken, async (req, res) => {
  try {
    // Solo los admins pueden acceder a esto
    if (req.usuario.role !== 'admin') {
      return res.status(403).json({ mensaje: 'No autorizado' });
    }

    const resultados = await Tickets.findAll({
      attributes: [
        'priority_id',
        [require('sequelize').fn('COUNT', '*'), 'total']
      ],
      group: ['priority_id'],
      include: [
        {
          model: Priorities,
          as: 'priority',
          attributes: ['name']
        }
      ]
    });

    // Mapear para enviar prioridad por nombre
    const conteo = resultados.map((r) => ({
      prioridad: r.priority.name,
      total: r.dataValues.total
    }));

    res.json(conteo); // Ejemplo: [{ prioridad: 'Alta', total: 5 }, ...]
  } catch (error) {
    console.error('Error al agrupar tickets por prioridad:', error);
    res.status(500).json({ mensaje: 'Error al obtener conteo por prioridad' });
  }
});

// Actualizar estado de un ticket (soporte)
router.put('/:id/estado', verificarToken, async (req, res) => {
  const { estado_id } = req.body;

  if (!estado_id) return res.status(400).json({ mensaje: 'Estado requerido' });

  try {
    const ticket = await Tickets.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ mensaje: 'Ticket no encontrado' });

    ticket.status_id = estado_id;
    await ticket.save();

    res.json({ mensaje: 'Estado actualizado', ticket });
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

// Obtener tickets asignados al usuario (solo para soporte)
router.get('/asignados', verificarToken, async (req, res) => {
  try {
    if (req.usuario.role !== 'agent') {
      return res.status(403).json({ mensaje: 'No autorizado' });
    }

    const tickets = await Tickets.findAll({
      where: { assigned_to: req.usuario.id }, // <== AQUÍ
      include: [
        { model: Users, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: Categories, as: 'category', attributes: ['id', 'name'] },
        { model: Priorities, as: 'priority', attributes: ['id', 'name', 'level'] },
        { model: Statuses, as: 'status', attributes: ['id', 'name'] }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({ tickets });
  } catch (error) {
    console.error('Error al obtener tickets asignados:', error);
    res.status(500).json({ mensaje: 'Error al obtener tickets asignados' });
  }
});

// Obtener categorías disponibles
router.get('/tickets/categorias', verificarToken, async (req, res) => {
  try {
    const categorias = await Categories.findAll({ attributes: ['id', 'name'] });
    res.json(categorias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener categorías' });
  }
});

// Obtener prioridades disponibles
router.get('/tickets/prioridades', verificarToken, async (req, res) => {
  try {
    const prioridades = await Priorities.findAll({ attributes: ['id', 'name', 'level'] });
    res.json(prioridades);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener prioridades' });
  }
});
// Asignar técnico a un ticket (rol cliente o admin)
router.put('/tickets/:id/asignar', verificarToken, async (req, res) => {
  const { tecnico_id } = req.body;

  if (!tecnico_id) return res.status(400).json({ mensaje: 'ID del técnico es obligatorio' });

  try {
    const ticket = await Tickets.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ mensaje: 'Ticket no encontrado' });

    // Validación para clientes: solo pueden modificar sus propios tickets
    if (req.usuario.role === 'client' && ticket.user_id !== req.usuario.id) {
      return res.status(403).json({ mensaje: 'No autorizado para modificar este ticket' });
    }

    ticket.assigned_to = tecnico_id;
    await ticket.save();

    res.json({ mensaje: 'Técnico asignado correctamente', ticket });
  } catch (error) {
    console.error('Error al asignar técnico:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});


module.exports = router;