import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'mysql',
  logging: false // Establece en true si quieres ver las consultas SQL en la consola
});

try {
  await sequelize.authenticate();
  console.log('Conexión establecida correctamente.');
} catch (error) {
  console.error('No se pudo conectar a la base de datos:', error);
}

export default sequelize;
