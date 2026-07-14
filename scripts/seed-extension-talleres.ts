import ExtensionSection from '../src/models/ExtensionSection';
import ExtensionItem from '../src/models/ExtensionItem';
import sequelize from '../src/config/database';

const seedExtensionTalleres = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a base de datos establecida');

    const sections = [
      {
        slug: 'talleres-culturales',
        title: 'Talleres Culturales',
        description: 'Desarrolla tu creatividad y talento artístico en nuestros talleres especializados',
        banner_url: '/public/Actividades Culturales y Deportivas/Culturales/BANNER DEPORTIVOS CULTURALES_UTTECAM.jpg'
      },
      {
        slug: 'talleres-deportivos',
        title: 'Talleres Deportivos',
        description: 'Fomenta tu salud y espíritu competitivo en nuestros talleres deportivos',
        banner_url: '/public/Actividades Culturales y Deportivas/Deportivas/BANNER DEPORTIVOS_UTTECAM 1-01.jpg'
      },
      {
        slug: 'servicio-medico',
        title: 'Servicio Médico',
        description: 'Atención médica y primeros auxilios para la comunidad universitaria',
        banner_url: '/public/ExtensionUniversitaria/ServicioMedico/SERVICIO MÉDICO.jpg'
      },
      {
        slug: 'ferias-profesiograficas',
        title: 'Ferias Profesiográficas',
        description: 'Conoce las oportunidades de empleo y prácticas empresariales',
        banner_url: '/public/ExtensionUniversitaria/DifusionyDivulgacion/Ferias/BANNER_FERIAS.jpg'
      },
      {
        slug: 'visitas-guiadas',
        title: 'Visitas Guiadas',
        description: 'Visitas guiadas para conocer la infraestructura y proyectos de UTTECAM',
        banner_url: '/public/ExtensionUniversitaria/DifusionyDivulgacion/Visitas/BANNER_VISITAS.jpg'
      }
    ];

    for (const sectionData of sections) {
      const [section, created] = await ExtensionSection.findOrCreate({
        where: { slug: sectionData.slug },
        defaults: sectionData
      });

      if (created) {
        console.log(`✅ Sección creada: ${sectionData.title}`);
        // By default, enable the seeded sections so they appear in UTTECAM
        await section.update({ is_enabled: true });
      } else {
        console.log(`ℹ️ Sección ya existe: ${sectionData.title}`);
        // Update banner if it's different (optional, but good for fixing broken paths)
        if (section.banner_url !== sectionData.banner_url) {
             await section.update({ banner_url: sectionData.banner_url });
             console.log(`🔄 Banner actualizado para: ${sectionData.title}`);
        }
        // Ensure the section is enabled on seeding
        if (section.is_enabled !== true) {
            await section.update({ is_enabled: true });
            console.log(`🔄 Sección habilitada: ${sectionData.title}`);
        }
      }

      // Create some sample items (if none exist)
      const sampleItemsMap: any = {
        'talleres-culturales': [
          { title: 'Taller de Dibujo', content: 'Clases semanales de dibujo artístico' },
          { title: 'Taller de Teatro', content: 'Sesiones prácticas y obra final' }
        ],
        'talleres-deportivos': [
          { title: 'Fútbol', content: 'Entrenamientos y torneos internos' },
          { title: 'Atletismo', content: 'Programa de acondicionamiento y pruebas' }
        ],
        'servicio-medico': [
          { title: 'Atención general', content: 'Servicios básicos y primeros auxilios' },
          { title: 'Campañas de salud', content: 'Jornadas preventivas y consultas' }
        ],
        'ferias-profesiograficas': [
          { title: 'Próxima Feria', content: 'Regístrate y conoce empresas participantes' }
        ],
        'visitas-guiadas': [
          { title: 'Visita al Laboratorio', content: 'Conoce las instalaciones de investigación' }
        ]
      };

      const items = sampleItemsMap[section.slug] || [];
      const existingItems = await ExtensionItem.findAll({ where: { section_id: section.id } });
      if (existingItems.length === 0) {
        for (const it of items) {
          await ExtensionItem.create({ section_id: section.id, title: it.title, content: it.content });
          console.log(`🆕 Item creado: ${it.title} en sección ${sectionData.title}`);
        }
      } else {
        console.log(`ℹ️ La sección ${sectionData.title} ya tiene ${existingItems.length} items`);
      }
    }

    console.log('✅ Proceso de seed completado');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en el seed:', error);
    process.exit(1);
  }
};

seedExtensionTalleres();
