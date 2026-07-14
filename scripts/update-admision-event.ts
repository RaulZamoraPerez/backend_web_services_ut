import Evento from '../src/models/Evento';
import sequelize from '../src/config/database';

async function updateAdmisionEvent() {
  try {
    console.log('🔄 Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conexión establecida');

    const titulo = 'Proceso de Admisión 2025';
    const nuevaFecha = new Date('2026-02-08T12:00:00');
    const nuevaDescripcion = 'Proceso de admisión para el ciclo escolar 2025. Regístrate ahora y forma parte de la familia UTTECAM.';

    const evento = await Evento.findOne({ where: { titulo } });

    if (evento) {
      evento.fecha_evento = nuevaFecha;
      evento.descripcion = nuevaDescripcion;
      await evento.save();
      console.log(`✅ Evento actualizado: ${evento.titulo}`);
      console.log(`📅 Nueva fecha: ${evento.fecha_evento}`);
    } else {
      console.log(`⚠️ No se encontró el evento con título: ${titulo}`);
      // Create it if it doesn't exist
      await Evento.create({
        titulo,
        descripcion: nuevaDescripcion,
        fecha_evento: nuevaFecha,
        activo: true
      });
      console.log(`✅ Evento creado: ${titulo}`);
    }

  } catch (error) {
    console.error('❌ Error al actualizar el evento:', error);
  } finally {
    await sequelize.close();
  }
}

updateAdmisionEvent();
