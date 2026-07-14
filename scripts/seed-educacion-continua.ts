import EducacionContinuaCurso from '../src/models/EducacionContinuaCurso';
import EducacionContinuaInfo from '../src/models/EducacionContinuaInfo';
import EducacionContinuaVideo from '../src/models/EducacionContinuaVideo';
import sequelize from '../src/config/database';
import fs from 'fs';
import path from 'path';

async function seedEducacionContinua() {
  try {
    console.log('🔄 Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conexión establecida');

    // Sincronizar modelos
    await EducacionContinuaInfo.sync();
    await EducacionContinuaCurso.sync();
    await EducacionContinuaVideo.sync();
    console.log('✅ Modelos de Educación Continua sincronizados');

    const sourceDir = path.join(
      __dirname,
      '../../../UTTECAM/UTTECAM/public/vinculacion/eduacion continua/cursos'
    );
    const destDir = path.join(__dirname, '../uploads/educacion-continua');

    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
      console.log('📁 Directorio uploads/educacion-continua creado');
    }

    const defaultCourses = [
      {
        fileName: 'Imagen A.jpg',
        destName: 'Imagen_A.jpg',
        titulo: 'Curso Imagen A',
      },
      {
        fileName: 'Imagen C.jpg',
        destName: 'Imagen_C.jpg',
        titulo: 'Curso Imagen C',
      }
    ];

    for (const course of defaultCourses) {
      const sourcePath = path.join(sourceDir, course.fileName);
      const destPath = path.join(destDir, course.destName);

      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`🖼️ Imagen copiada: ${course.fileName} -> ${destPath}`);
      } else {
        console.log(`⚠️ Advertencia: No se encontró la imagen en: ${sourcePath}`);
        if (!fs.existsSync(destPath)) {
          fs.writeFileSync(destPath, 'placeholder');
          console.log(`📝 Creado archivo placeholder en: ${destPath}`);
        }
      }
    }

    // Eliminar registros existentes
    await EducacionContinuaInfo.destroy({ where: {} });
    await EducacionContinuaCurso.destroy({ where: {} });
    await EducacionContinuaVideo.destroy({ where: {} });
    console.log('🗑️ Datos previos de Educación Continua eliminados');

    // Crear información principal
    const info = await EducacionContinuaInfo.create({
      titulo_principal: 'Cursos de Educación Continua',
      descripcion_final: '¡Descubre nuestros cursos y potencia tu desarrollo profesional!'
    });
    console.log(`ℹ️ Info principal creada: "${info.titulo_principal}"`);

    // Crear cursos iniciales
    for (let i = 0; i < defaultCourses.length; i++) {
      const course = defaultCourses[i];
      const newCurso = await EducacionContinuaCurso.create({
        titulo: course.titulo,
        imagen: `educacion-continua/${course.destName}`,
        orden: i,
        activo: true
      });
      console.log(`✅ Curso creado: ID ${newCurso.id} - "${newCurso.titulo}"`);
    }

    // Crear videos iniciales
    const defaultVideos = [
      {
        titulo: "Curso Gratuito: Preparación de Currículum Vitae",
        descripcion: "Aprende a estructurar y destacar tu experiencia profesional con nuestro curso de Preparación de Currículum Vitae, impartido por el Mtro. Conde del área de Vinculación de la UTTECAM.",
        youtubeId: "S33CWUBwzd8"
      },
      {
        titulo: "Preparación de Currículum Vitae - Parte 2",
        descripcion: "Continúa aprendiendo los mejores consejos y estrategias para que tu currículum destaque ante los reclutadores y aumentes tus oportunidades laborales.",
        youtubeId: "YlbztfIoaNg"
      }
    ];

    for (let i = 0; i < defaultVideos.length; i++) {
      const video = defaultVideos[i];
      const newVideo = await EducacionContinuaVideo.create({
        titulo: video.titulo,
        descripcion: video.descripcion,
        youtubeId: video.youtubeId,
        orden: i,
        activo: true
      });
      console.log(`🎥 Video creado: ID ${newVideo.id} - "${newVideo.titulo}"`);
    }

  } catch (error) {
    console.error('❌ Error al poblar educación continua:', error);
    throw error;
  } finally {
    await sequelize.close();
    console.log('🔌 Conexión cerrada');
  }
}

if (require.main === module) {
  seedEducacionContinua()
    .then(() => {
      console.log('✅ Seeding de Educación Continua completado con éxito');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error fatal en seeder:', error);
      process.exit(1);
    });
}

export default seedEducacionContinua;
