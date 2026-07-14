import PracticasEstadiasBanner from '../src/models/PracticasEstadiasBanner';
import sequelize from '../src/config/database';
import fs from 'fs';
import path from 'path';

async function seedPracticasEstadias() {
  try {
    console.log('🔄 Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conexión establecida');

    // Sincronizar modelo
    await PracticasEstadiasBanner.sync();
    console.log('✅ Modelo PracticasEstadiasBanner sincronizado');

    // Copiar la imagen estática desde el repositorio frontend si existe
    const sourceImagePath = path.join(
      __dirname,
      '../../../UTTECAM/UTTECAM/public/vinculacion/Practicas y estadias/Prácticas y estadías UTTECAM-01.jpg'
    );
    const destDir = path.join(__dirname, '../uploads/practicas-estadias-banner');
    const destFileName = 'Practicas_y_estadias_UTTECAM_01.jpg';
    const destImagePath = path.join(destDir, destFileName);

    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
      console.log('📁 Directorio uploads/practicas-estadias-banner creado');
    }

    if (fs.existsSync(sourceImagePath)) {
      fs.copyFileSync(sourceImagePath, destImagePath);
      console.log(`🖼️ Imagen copiada exitosamente a: ${destImagePath}`);
    } else {
      console.log(`⚠️ Advertencia: No se encontró la imagen origen en: ${sourceImagePath}`);
      // Crear un archivo de prueba en caso de que no exista para evitar fallos catastróficos
      if (!fs.existsSync(destImagePath)) {
        fs.writeFileSync(destImagePath, 'placeholder');
        console.log(`📝 Creado archivo placeholder en: ${destImagePath}`);
      }
    }

    // Eliminar registros existentes
    await PracticasEstadiasBanner.destroy({ where: {} });
    console.log('🗑️ Banners de prácticas existentes eliminados');

    // Crear banner inicial
    const banner = await PracticasEstadiasBanner.create({
      titulo: 'Prácticas y Estadías',
      descripcion: 'Las prácticas y estadías son una oportunidad para aplicar tus conocimientos en el entorno profesional y fortalecer tu desarrollo académico.',
      imagen: `practicas-estadias-banner/${destFileName}`,
      activo: true,
    });

    console.log(`\n✅ Banner inicial creado con éxito:`);
    console.log(`   ID: ${banner.id}`);
    console.log(`   Título: ${banner.titulo}`);
    console.log(`   Imagen: ${banner.imagen}`);

  } catch (error) {
    console.error('❌ Error al poblar el banner de prácticas y estadías:', error);
    throw error;
  } finally {
    await sequelize.close();
    console.log('\n🔌 Conexión cerrada');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedPracticasEstadias()
    .then(() => {
      console.log('✅ Seeding completado con éxito');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error fatal en seeder:', error);
      process.exit(1);
    });
}

export default seedPracticasEstadias;
