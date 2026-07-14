
import sequelize from '../src/config/database';
import SolicitudesConstanciasKardex from '../src/models/Solicitud_Constancia';

async function fixTable() {
  try {
    console.log('Intentando conectar a la base de datos...');
    await sequelize.authenticate();
    console.log('Conexión exitosa.');

    console.log('Eliminando tabla solicitudes_constancias_kardex si existe...');
    await SolicitudesConstanciasKardex.drop();
    console.log('Tabla eliminada.');

    console.log('Sincronizando modelo (creando tabla nueva)...');
    await SolicitudesConstanciasKardex.sync({ force: true });
    console.log('Tabla creada exitosamente sin índices excesivos.');

    process.exit(0);
  } catch (error) {
    console.error('Error al arreglar la tabla:', error);
    process.exit(1);
  }
}

fixTable();
