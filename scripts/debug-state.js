const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
  }
);

async function checkState() {
  try {
    console.log('--- Estado de la Base de Datos ---');
    
    const [tipos] = await sequelize.query("SELECT * FROM servicio_social_tipos");
    console.log('Categorías (servicio_social_tipos):', tipos);

    const [docs] = await sequelize.query("SELECT ID, Nombre, Tipo FROM servicio_social_documentos LIMIT 5");
    console.log('Documentos (servicio_social_documentos) [Muestra 5]:', docs);

    const [count] = await sequelize.query("SELECT COUNT(*) as count FROM servicio_social_documentos");
    console.log('Total Documentos:', count[0].count);

  } catch (error) {
    console.error('Error al consultar:', error);
  } finally {
    await sequelize.close();
  }
}

checkState();
