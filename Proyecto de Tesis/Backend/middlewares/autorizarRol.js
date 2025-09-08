const autorizarRol = (rolPermitido) => {
  return (req, res, next) => {
    if (req.usuario?.role !== rolPermitido) {
      return res.status(403).json({ mensaje: 'Acceso denegado: Rol no autorizado' });
    }
    next();
  };
};

module.exports = autorizarRol;
