const express = require('express');
const router = express.Router();
const { Users, Tickets } = require('../models/init-models')(require('../config/database'));
const { verificarToken } = require('../utils/jwt'); // Asegúrate que este middleware exista y funcione correctamente

// 🔐 Ruta protegida para el resumen del dashboard del administrador
router.get('/dashboard/resumen', verificarToken, async (req, res) => {
  try {
    // Verificar que solo admin acceda
    if (req.usuario.role !== 'admin') {
      return res.status(403).json({ mensaje: 'No autorizado' });
    }

    // Contar tickets por estado y total de usuarios
    const ticketsPendientes = await Tickets.count({ where: { status_id: 1 } }); // asumiendo 1 = pendiente
    const ticketsCerrados = await Tickets.count({ where: { status_id: 3 } });   // asumiendo 3 = cerrado
    const totalUsuarios = await Users.count();

    res.json({
      ticketsPendientes,
      ticketsCerrados,
      totalUsuarios
    });

  } catch (error) {
    console.error('🔥 Error en resumen del dashboard:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

module.exports = router;
