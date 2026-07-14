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

async function deleteAllCategories() {
  try {
    console.log('Iniciando eliminación TOTAL de categorías de Servicio Social...');

    // 1. Eliminar todas las categorías INCLUYENDO 'General'
    console.log('Eliminando todas las categorías...');
    const [resultsTypes] = await sequelize.query(
      "DELETE FROM servicio_social_tipos"
    );
    console.log(`Categorías eliminadas: ${resultsTypes.affectedRows || 'OK'}`);

    // Nota: Los documentos se quedarán con Tipo='General' (o lo que tuvieran), 
    // pero la categoría ya no existirá en la tabla de tipos.
    
    console.log('Limpieza completada con éxito.');
  } catch (error) {
    console.error('Error durante la limpieza:', error);
  } finally {
    await sequelize.close();
  }
}

deleteAllCategories();
