require('ts-node/register');
const sequelize = require('../../src/config/database').default;

async function limpiarTiposEstadia() {
  try {
    console.log('🔄 Eliminando tipos de estadía existentes...');

    await sequelize.query(`DELETE FROM tipos_estadia;`);

    console.log('✅ Tipos eliminados correctamente');
    console.log('✨ La tabla tipos_estadia está ahora vacía');
    console.log('💡 Usa el Dashboard para crear nuevos tipos según sea necesario');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al limpiar tipos:', error);
    process.exit(1);
  }
}

limpiarTiposEstadia();
