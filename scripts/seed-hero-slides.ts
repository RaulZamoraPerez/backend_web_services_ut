import HeroSlide from '../src/models/HeroSlide';
import sequelize from '../src/config/database';

async function seedHeroSlides() {
  try {
    console.log('🔄 Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conexión establecida');

    // Sincronizar modelo
    await HeroSlide.sync();
    console.log('✅ Modelo HeroSlide sincronizado');

    // Eliminar slides existentes
    await HeroSlide.destroy({ where: {} });
    console.log('🗑️  Slides existentes eliminados');

    // Crear slides con los recursos disponibles
    const slides = [
      {
        titulo: 'Video Institucional UTTECAM',
        tipo: 'video' as const,
        archivo: '/uploads/hero-slides/UTTECAM.mp4',
        orden: 1,
        activo: true,
      },
      {
        titulo: 'Campus Universitario',
        tipo: 'imagen' as const,
        archivo: '/uploads/hero-slides/hero1.jpg',
        orden: 2,
        activo: true,
      },
      {
        titulo: 'Instalaciones',
        tipo: 'imagen' as const,
        archivo: '/uploads/hero-slides/hero2.jpg',
        orden: 3,
        activo: true,
      },
    ];

    console.log('📝 Creando hero slides...');
    for (const slide of slides) {
      const created = await HeroSlide.create(slide);
      console.log(`  ✅ Slide creado: ${created.titulo} (${created.tipo})`);
    }

    console.log('\n✅ Hero slides poblados exitosamente!');
    console.log(`📊 Total de slides: ${slides.length}`);
    
    // Mostrar resumen
    const allSlides = await HeroSlide.findAll({ order: [['orden', 'ASC']] });
    console.log('\n📋 Slides en la base de datos:');
    allSlides.forEach((slide) => {
      console.log(`  ${slide.orden}. ${slide.titulo} - ${slide.tipo} - ${slide.activo ? '✅ Activo' : '❌ Inactivo'}`);
    });

  } catch (error) {
    console.error('❌ Error al poblar hero slides:', error);
    throw error;
  } finally {
    await sequelize.close();
    console.log('\n🔌 Conexión cerrada');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedHeroSlides()
    .then(() => {
      console.log('✅ Proceso completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error fatal:', error);
      process.exit(1);
    });
}

export default seedHeroSlides;
