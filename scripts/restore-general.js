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

async function restoreGeneral() {
  try {
    console.log('Intentando restaurar categoría General...');
    
    // Verificar si existe
    const [exists] = await sequelize.query("SELECT * FROM servicio_social_tipos WHERE Nombre = 'General'");
    if (exists.length > 0) {
      console.log('La categoría General ya existe.');
      return;
    }

    // Crear
    await sequelize.query("INSERT INTO servicio_social_tipos (Nombre) VALUES ('General')");
    console.log('Categoría General creada exitosamente.');

  } catch (error) {
    console.error('Error al crear General:', error);
  } finally {
    await sequelize.close();
  }
}

restoreGeneral();
