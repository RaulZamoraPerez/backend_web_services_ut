const { default: sequelize, connectDatabase } = require('../src/config/database');
const VideoInstitucional = require('../src/models/VideoInstitucional');
const RelojDigital = require('../src/models/RelojDigital');

async function runMigration() {
  try {
    console.log('🚀 Iniciando migración de contenido de página de inicio...');

    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a base de datos establecida');

    // Sincronizar modelos (crear tablas)
    await VideoInstitucional.sync({ alter: true });
    console.log('✅ Tabla videos_institucionales creada/actualizada');

    await RelojDigital.sync({ alter: true });
    console.log('✅ Tabla relojes_digitales creada/actualizada');

    // Insertar datos de ejemplo
    const videoExistente = await VideoInstitucional.findOne();
    if (!videoExistente) {
      await VideoInstitucional.create({
        titulo: 'Bienvenidos a la UTTECAM',
        descripcion: 'Video institucional de presentación de la Universidad Tecnológica del Estado de Campeche',
        urlVideo: 'https://example.com/video-institucional.mp4',
        thumbnailUrl: 'https://example.com/thumbnail.jpg',
        duracion: 180,
        activo: true,
        mostrarControles: true,
        autoplay: false,
        loop: false,
        volumen: 50
      });
      console.log('📝 Datos de ejemplo del video institucional insertados');
    }

    const relojExistente = await RelojDigital.findOne();
    if (!relojExistente) {
      await RelojDigital.create({
        zonaHoraria: 'America/Mexico_City',
        formato24Horas: true,
        mostrarFecha: true,
        mostrarDiaSemana: true,
        activo: true,
        estilo: 'digital'
      });
      console.log('📝 Datos de ejemplo del reloj digital insertados');
    }

    console.log('✅ Migración completada exitosamente');

  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Ejecutar la migración
runMigration();