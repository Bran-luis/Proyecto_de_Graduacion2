const jwt = require('jsonwebtoken');

const generarToken = (usuario) => {
  return jwt.sign(
    { id: usuario.id, role: usuario.role, email: usuario.email },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );
};

const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ mensaje: 'Token no proporcionado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ mensaje: 'Token inválido o expirado' });
  }
};

module.exports = { generarToken, verificarToken };