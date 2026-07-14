import Evento from '../src/models/Evento';
import Anuncio from '../src/models/Anuncio';
import sequelize from '../src/config/database';

async function seedEventosYAnuncios() {
  try {
    console.log('🔄 Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conexión establecida');

    // Sincronizar modelos
    await Evento.sync();
    await Anuncio.sync();
    console.log('✅ Modelos sincronizados');

    // Eliminar datos existentes
    await Evento.destroy({ where: {} });
    await Anuncio.destroy({ where: {} });
    console.log('🗑️  Datos existentes eliminados');

    // Crear evento de ejemplo
    console.log('\n📅 Creando evento...');
    // Fecha específica: 8 de febrero de 2026
    const fechaEvento = new Date('2026-02-08T12:00:00');
    
    const evento = await Evento.create({
      titulo: 'Proceso de Admisión 2025',
      descripcion: 'Proceso de admisión para el ciclo escolar 2025. Regístrate ahora y forma parte de la familia UTTECAM.',
      fecha_evento: fechaEvento,
      activo: true,
    });
    console.log(`  ✅ Evento creado: ${evento.titulo}`);

    // Crear un evento inactivo de ejemplo (pasado) para pruebas
    const eventoInactivo = await Evento.create({
      titulo: 'Evento histórico - Archivos',
      descripcion: 'Evento pasado y marcado como inactivo para pruebas de visualización.',
      fecha_evento: new Date('2024-06-01T10:00:00'),
      activo: false,
    });
    console.log(`  ✅ Evento inactivo creado: ${eventoInactivo.titulo}`);

    // Crear anuncio de ejemplo
    console.log('\n📢 Creando anuncio...');
    const fechaInicio = new Date();
    const fechaFin = new Date();
    fechaFin.setDate(fechaFin.getDate() + 30); // Activo por 30 días
    
    const anuncio = await Anuncio.create({
      titulo: '¡Bienvenidos al ciclo 2025!',
      imagen: '/uploads/anuncios/welcome-2025.jpg',
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      activo: true,
    });
    console.log(`  ✅ Anuncio creado: ${anuncio.titulo}`);

    console.log('\n✅ Eventos y anuncios poblados exitosamente!');
    
    // Mostrar resumen
    const allEventos = await Evento.findAll();
    const allAnuncios = await Anuncio.findAll();
    
    console.log('\n📋 Resumen:');
    console.log(`  Eventos: ${allEventos.length}`);
    console.log(`  Anuncios: ${allAnuncios.length}`);

    allEventos.forEach((e) => {
      console.log(`  📅 ${e.titulo} - ${e.activo ? '✅ Activo' : '❌ Inactivo'}`);
    });

    allAnuncios.forEach((a) => {
      console.log(`  📢 ${a.titulo} - ${a.activo ? '✅ Activo' : '❌ Inactivo'}`);
    });

  } catch (error) {
    console.error('❌ Error al poblar eventos y anuncios:', error);
    throw error;
  } finally {
    await sequelize.close();
    console.log('\n🔌 Conexión cerrada');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedEventosYAnuncios()
    .then(() => {
      console.log('✅ Proceso completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error fatal:', error);
      process.exit(1);
    });
}

export default seedEventosYAnuncios;
