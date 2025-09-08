const SequelizeAuto = require('sequelize-auto');
require('dotenv').config();

const auto = new SequelizeAuto(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    directory: './models',
    caseModel: 'p',
    caseFile: 'c',
    additional: {
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      paranoid: true
    }
  }
);

auto.run()
  .then(() => {
    console.log('✅ Modelos generados con éxito en /models');
  })
  .catch((err) => {
    console.error('❌ Error al generar modelos:', err);
  });