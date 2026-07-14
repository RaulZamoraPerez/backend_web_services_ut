import ExtensionSection from '../../src/models/ExtensionSection';
import ExtensionItem from '../../src/models/ExtensionItem';
import ExtensionDocument from '../../src/models/ExtensionDocument';
import sequelize from '../../src/config/database';

const seedExtensionUniversitaria = async () => {
  try {
    console.log('🌱 Seeding Extension Universitaria...');

    // 1. Sections
    const sections = [
      {
        slug: 'talleres-culturales',
        title: 'Talleres Culturales',
        description: 'Desarrolla tu creatividad y talento artístico en nuestros talleres especializados',
        banner_url: '/uploads/Actividades Culturales y Deportivas/Culturales/BANNER DEPORTIVOS CULTURALES_UTTECAM.jpg'
      },
      {
        slug: 'talleres-deportivos',
        title: 'Talleres Deportivos',
        description: 'Fortalece tu cuerpo y mente a través del deporte y la actividad física',
        banner_url: '/uploads/Actividades Culturales y Deportivas/Deportivas/BANNER DEPORTIVOS_UTTECAM 1-01.jpg'
      },
      {
        slug: 'servicio-medico',
        title: 'Servicio Médico',
        description: 'Atención médica y primeros auxilios para la comunidad universitaria',
        banner_url: '/uploads/ExtensionUniversitaria/ServicioMedico/SERVICIO MÉDICO.jpg'
      },
      {
        slug: 'ferias-profesoigraficas',
        title: 'Ferias Profesoigráficas',
        description: 'Conoce las oportunidades de empleo y prácticas empresariales en nuestras ferias profesoigráficas.',
        banner_url: '/uploads/ExtensionUniversitaria/DifusionyDivulgacion/Ferias/BANNER_FERIAS.jpg'
      },
      {
        slug: 'visitas-guiadas',
        title: 'Visitas Guiadas',
        description: 'Visitas guiadas para estudiantes y públicos interesados en conocer la infraestructura y proyectos de UTTECAM.',
        banner_url: '/uploads/ExtensionUniversitaria/DifusionyDivulgacion/Visitas/BANNER_VISITAS.jpg'
      }
    ];

    for (const sectionData of sections) {
      const [section] = await ExtensionSection.findOrCreate({
        where: { slug: sectionData.slug },
        defaults: sectionData
      });
      
      // Update if exists to ensure latest data
      await section.update(sectionData);
      console.log(`✅ Section synced: ${section.title}`);

      // Add items for Servicio Medico
      if (section.slug === 'servicio-medico') {
        const services = [
          { title: 'Atención de primeros auxilios', icon: 'HeartPulse' },
          { title: 'Orientación médica básica', icon: 'HeartPulse' },
          { title: 'Control de signos vitales', icon: 'HeartPulse' },
          { title: 'Apoyo en situaciones de emergencia', icon: 'HeartPulse' },
          { title: 'Promoción de la salud y prevención', icon: 'HeartPulse' }
        ];

        // Clear existing items to avoid duplicates on re-seed
        await ExtensionItem.destroy({ where: { section_id: section.id } });

        for (const service of services) {
          await ExtensionItem.create({
            section_id: section.id,
            title: service.title,
            icon: service.icon
          });
        }
        console.log(`   ✅ Added ${services.length} services to Servicio Médico`);
      }
    }

    // 2. Documents (Promocion)
    const promocionDocs = [
      { title: "Ingreso UTTECAM 2025", file_url: "ExtensionUniversitaria/DifusionyDivulgacion/PromocionInstitucional/INGRESO_UTTECAM_2025.jpg" },
      { title: "Oferta Educativa UTTECAM 2025", file_url: "ExtensionUniversitaria/DifusionyDivulgacion/PromocionInstitucional/OFERTA_EDUCATIVA_UTTECAM_2025_DIGITAL.pdf" },
      { title: "QR WhatsApp UTTECAM", file_url: "ExtensionUniversitaria/DifusionyDivulgacion/PromocionInstitucional/QR_WHATSAPP_UTTECAM.png" },
      { title: "Tabloide Becas", file_url: "ExtensionUniversitaria/DifusionyDivulgacion/PromocionInstitucional/TABLOIDE_BECAS.pdf" },
    ];

    // Clear existing promocion docs
    await ExtensionDocument.destroy({ where: { category: 'promocion' } });

    for (const doc of promocionDocs) {
      const ext = doc.file_url.split('.').pop().toLowerCase();
      const isImage = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext);
      const mime = isImage ? `image/${ext === 'jpg' ? 'jpeg' : ext}` : (ext === 'pdf' ? 'application/pdf' : 'application/octet-stream');
      const media_type = isImage ? 'image' : 'document';
      await ExtensionDocument.create({
        category: 'promocion',
        title: doc.title,
        file_url: doc.file_url,
        mime_type: mime,
        media_type
      });
    }
    console.log(`✅ Added ${promocionDocs.length} Promocion documents`);

    // 3. Documents (Gacetas)
    const gacetaDocs = [
      { title: "Gaceta final Abril 2025", file_url: "ExtensionUniversitaria/Prensa y difusion/Gacetas/Gaceta final mes de Abril 2025.pdf" },
      { title: "Gaceta Mayo 2025", file_url: "ExtensionUniversitaria/Prensa y difusion/Gacetas/Gaceta mes de Mayo 2025.pdf" },
      { title: "Gaceta Junio 2025", file_url: "ExtensionUniversitaria/Prensa y difusion/Gacetas/Gaceta mes de Junio 2025.pdf" },
      { title: "Gaceta Agosto 2025", file_url: "ExtensionUniversitaria/Prensa y difusion/Gacetas/Gaceta mes de agosto 2025.pdf" },
      { title: "Gaceta Septiembre 2025", file_url: "ExtensionUniversitaria/Prensa y difusion/Gacetas/Gaceta mes de septiembre 2025.pdf" },
      { title: "Gaceta Agosto 2024", file_url: "ExtensionUniversitaria/Prensa y difusion/Gacetas/Gaceta_Agosto_2024.pdf" },
      { title: "Gaceta Julio 2024", file_url: "ExtensionUniversitaria/Prensa y difusion/Gacetas/Gaceta_Julio_2024.pdf" },
      { title: "Gaceta Junio 2024", file_url: "ExtensionUniversitaria/Prensa y difusion/Gacetas/Gaceta_Junio_2024.pdf" },
      { title: "Gaceta Abril 2024", file_url: "ExtensionUniversitaria/Prensa y difusion/Gacetas/Gaceta_Abril_2024.pdf" },
      { title: "Gaceta Marzo 2024", file_url: "ExtensionUniversitaria/Prensa y difusion/Gacetas/Gaceta_Marzo_2024.pdf" },
      { title: "Gaceta Febrero 2024", file_url: "ExtensionUniversitaria/Prensa y difusion/Gacetas/Gaceta_Febrero_2024.pdf" },
      { title: "Gaceta Enero 2024", file_url: "ExtensionUniversitaria/Prensa y difusion/Gacetas/Gaceta_Enero_2024.pdf" },
      { title: "Gaceta Abril 2025", file_url: "ExtensionUniversitaria/Prensa y difusion/Gacetas/Gaceta_Abril_2025.pdf" }
    ];

    // Clear existing gaceta docs
    await ExtensionDocument.destroy({ where: { category: 'gaceta' } });

    for (const doc of gacetaDocs) {
      const ext = doc.file_url.split('.').pop().toLowerCase();
      const mime = ext === 'pdf' ? 'application/pdf' : 'application/octet-stream';
      await ExtensionDocument.create({
        category: 'gaceta',
        title: doc.title,
        file_url: doc.file_url,
        mime_type: mime,
        media_type: 'document'
      });
    }
    console.log(`✅ Added ${gacetaDocs.length} Gaceta documents`);

    console.log('✨ Extension Universitaria seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding Extension Universitaria:', error);
    process.exit(1);
  }
};

seedExtensionUniversitaria();
