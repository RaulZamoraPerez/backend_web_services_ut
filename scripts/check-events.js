import Evento from '../src/models/Evento';
import sequelize from '../src/config/database';

async function checkEvents() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a base de datos exitosa');

    const events = await Evento.findAll();
    console.log('📅 Eventos encontrados:', events.length);

    if (events.length === 0) {
      console.log('❌ No hay eventos en la base de datos');
      console.log('💡 Necesitas crear al menos un evento para que aparezca el countdown');
    } else {
      events.forEach((e, index) => {
        console.log(`${index + 1}. ${e.titulo}`);
        console.log(`   Fecha: ${e.fecha_evento}`);
        console.log(`   Descripción: ${e.descripcion || 'Sin descripción'}`);
        console.log(`   Activo: ${e.activo ? '✅' : '❌'}`);
        console.log('');
      });
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

checkEvents();