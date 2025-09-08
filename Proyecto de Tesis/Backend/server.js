require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/database');

//DECLARAR EL PUERTO A USAR EN CASO NO LO TRAIGA
const PORT = process.env.PORT || 3000;

//CONEXION A LA BASE DE DATOS
sequelize.authenticate()
  .then(() => {
    //QUITAR EL CONSOLE LOG
    console.log(' Conectado a la base de datos');
    return sequelize.sync();
  })
  .then(() => {
    app.listen(PORT, () => {
        //QUITAR EL CONSOLE LOG
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);

    });
  })
  .catch(err => {
    //QUITAR EL CONSOLE LOG
    console.error('❌ Error al conectar la base de datos:', err);
  });