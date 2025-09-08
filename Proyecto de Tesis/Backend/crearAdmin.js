const bcrypt = require('bcrypt');
const sequelize = require('./config/database');
const { Users } = require('./models/init-models')(sequelize);

async function crearAdmin() {
  try {
    await sequelize.sync(); // Asegura que la tabla exista

    const hashedPassword = await bcrypt.hash('admin1234', 10);

    const admin = await Users.create({
      email: 'admin@empresa.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('✅ Admin creado:', admin.toJSON());
    process.exit();
  } catch (error) {
    console.error('❌ Error al crear el admin:', error);
    process.exit(1);
  }
}

crearAdmin();
