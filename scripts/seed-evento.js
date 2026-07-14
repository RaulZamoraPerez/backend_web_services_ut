import Evento from '../src/models/Evento';
import sequelize from '../src/config/database';

async function seedEvento() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a base de datos exitosa');

    // Crear fecha futura (ejemplo: 15 días desde hoy)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 15);

    const eventoData = {
      titulo: 'Inicio de Ciclo Escolar 2025',
      descripcion: 'Celebración del inicio del nuevo ciclo escolar en la Universidad Tecnológica de Tecámac. Un evento especial para dar la bienvenida a nuestros nuevos estudiantes.',
      fecha_evento: futureDate,
      activo: true
    };

    const evento = await Evento.create(eventoData);

    console.log('🎉 Evento creado exitosamente:');
    console.log(`📅 Título: ${evento.titulo}`);
    console.log(`📆 Fecha: ${evento.fecha_evento}`);
    console.log(`📝 Descripción: ${evento.descripcion}`);
    console.log(`✅ Activo: ${evento.activo ? 'Sí' : 'No'}`);

    console.log('\n⏰ El countdown ahora debería aparecer en la página de inicio de UTTECAM');

  } catch (error) {
    console.error('❌ Error creando evento:', error);
  } finally {
    process.exit(0);
  }
}

seedEvento();