const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Users } = require('../models/init-models')(require('../config/database'));
const { generarToken } = require('../utils/jwt');

//Inicar sesion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('🔐 Login request received:', { email, password });

  try {
    const usuario = await Users.findOne({ where: { email } });

    if (!usuario) {
      console.log('❌ Usuario no encontrado');
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      console.log('❌ Contraseña incorrecta');
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    const token = generarToken(usuario);
    res.json({
      mensaje: 'Login exitoso',
      usuario: {
        id: usuario.id,
        nombre: usuario.name,
        email: usuario.email,
        role: usuario.role
      },
      token
    });

  } catch (error) {
    console.error('🔥 Error en servidor:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});



module.exports = router;