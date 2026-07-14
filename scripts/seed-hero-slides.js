import HeroSlide from '../src/models/HeroSlide';

const heroSlidesData = [
  {
    titulo: 'Bienvenidos a UTTECAM',
    archivo: '/uploads/hero-slides/uttecam-campus.jpg',
    tipo: 'imagen',
    orden: 1,
    activo: true,
  },
  {
    titulo: 'Carreras Tecnológicas',
    archivo: '/uploads/hero-slides/carreras-tecnologicas.jpg',
    tipo: 'imagen',
    orden: 2,
    activo: true,
  },
  {
    titulo: 'Instalaciones Modernas',
    archivo: '/uploads/hero-slides/instalaciones.jpg',
    tipo: 'imagen',
    orden: 3,
    activo: true,
  },
  {
    titulo: 'Investigación e Innovación',
    archivo: '/uploads/hero-slides/investigacion.jpg',
    tipo: 'imagen',
    orden: 4,
    activo: true,
  }
];

export const seedHeroSlides = async () => {
  try {
    console.log('🌱 Poblando datos de Hero Slides...');

    for (const slide of heroSlidesData) {
      await HeroSlide.create(slide);
      console.log(`✅ Hero Slide creado: ${slide.titulo}`);
    }

    console.log('🎉 Hero Slides poblados exitosamente');
  } catch (error) {
    console.error('❌ Error poblando Hero Slides:', error);
    throw error;
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  seedHeroSlides()
    .then(() => {
      console.log('✅ Script completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en el script:', error);
      process.exit(1);
    });
}