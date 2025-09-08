const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Users } = require('../models/init-models')(require('../config/database'));
const verificarToken = require('../middlewares/verificarToken');
const autorizarRol = require('../middlewares/autorizarRol');

// Registrar nuevo usuario
router.post('/usuarios', verificarToken, autorizarRol('admin'), async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  try {
    // Verifica si el email ya existe incluyendo eliminados
    const existente = await Users.findOne({ where: { email }, paranoid: false });

    if (existente) {
      if (existente.deleted_at) {
        // Restaurar el usuario eliminado
        await existente.restore();
        existente.name = name;
        existente.password = await bcrypt.hash(password, 10);
        existente.role = role;
        await existente.save();
        return res.status(200).json({ mensaje: 'Usuario restaurado y actualizado', usuario: existente });
      } else {
        return res.status(409).json({ mensaje: 'El correo ya está registrado' });
      }
    }

    // Crear nuevo usuario
    const hash = await bcrypt.hash(password, 10);
    const nuevoUsuario = await Users.create({
      name,
      email,
      password: hash,
      role
    });

    res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      usuario: {
        id: nuevoUsuario.id,
        name: nuevoUsuario.name,
        email: nuevoUsuario.email,
        role: nuevoUsuario.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al registrar usuario' });
  }
});

// Obtener todos los usuarios (solo admin)
router.get('/usuarios', verificarToken, autorizarRol('admin'), async (req, res) => {
  try {
    const usuarios = await Users.findAll({
      attributes: ['id', 'name', 'email', 'role', 'created_at'],
      where: { deleted_at: null }
    });

    res.json({ usuarios });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener usuarios' });
  }
});

// Obtener un usuario por ID
router.get('/usuarios/:id', verificarToken, autorizarRol('admin'), async (req, res) => {
  try {
    const usuario = await Users.findOne({
      attributes: ['id', 'name', 'email', 'role'],
      where: { id: req.params.id, deleted_at: null }
    });

    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    res.json({ usuario });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar usuario' });
  }
});

// Editar usuario (nombre, email, rol)
router.put('/usuarios/:id', verificarToken, autorizarRol('admin'), async (req, res) => {
  const { name, email, role } = req.body;

  try {
    const usuario = await Users.findOne({ where: { id: req.params.id, deleted_at: null } });
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    usuario.name = name || usuario.name;
    usuario.email = email || usuario.email;
    usuario.role = role || usuario.role;

    await usuario.save();
    res.json({ mensaje: 'Usuario actualizado correctamente', usuario });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar usuario' });
  }
});

// Eliminar usuario (soft delete)
router.delete('/usuarios/:id', verificarToken, autorizarRol('admin'), async (req, res) => {
  try {
    const usuario = await Users.findOne({ where: { id: req.params.id, deleted_at: null } });
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    await usuario.destroy(); // Soft delete por paranoid: true
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar usuario' });
  }
});

// Cambiar contraseña (admin puede cambiar la de otros, usuario solo la suya)
router.put('/usuarios/:id/password', verificarToken, async (req, res) => {
  const { nuevaPassword } = req.body;
  const userId = parseInt(req.params.id);
  const requesterId = req.usuario.id;
  const requesterRol = req.usuario.role;

  if (!nuevaPassword || nuevaPassword.trim().length < 4) {
    return res.status(400).json({
      mensaje: 'La nueva contraseña es obligatoria y debe tener al menos 4 caracteres',
    });
  }

  // Solo permitir si el usuario es admin o si está modificando su propia cuenta
  if (requesterRol !== 'admin' && requesterId !== userId) {
    return res.status(403).json({ mensaje: 'Acceso denegado: Rol no autorizado' });
  }

  try {
    const usuario = await Users.findOne({
      where: { id: userId, deleted_at: null },
    });
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    const hash = await bcrypt.hash(nuevaPassword, 10);
    usuario.password = hash;
    await usuario.save();

    res.json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar contraseña' });
  }
});


// Obtener técnicos con tickets en proceso
router.get('/tecnicos', verificarToken, async (req, res) => {
  try {
    const [results, metadata] = await require('../config/database').query(`
      SELECT u.id, u.name, u.email,
        COUNT(t.id) AS tickets_activos_en_proceso
      FROM users u
      LEFT JOIN tickets t ON u.id = t.assigned_to AND t.status_id = 2
      WHERE u.role = 'agent' AND u.deleted_at IS NULL
      GROUP BY u.id
    `);

    // Agregar el campo estado dinámico
    const tecnicosConEstado = results.map(t => ({
      ...t,
      estado: t.tickets_activos_en_proceso > 0 ? 'ocupado' : 'disponible'
    }));

    res.json(tecnicosConEstado);
  } catch (error) {
    console.error('Error al obtener técnicos:', error);
    res.status(500).json({ mensaje: 'Error al obtener técnicos' });
  }
});


module.exports = router;