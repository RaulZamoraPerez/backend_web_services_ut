import ExtensionSection from '../models/ExtensionSection';

const DEFAULT_SECTIONS = [
  { slug: 'talleres-culturales',     title: 'Talleres Culturales',     description: 'Desarrolla tu creatividad y talento artístico en nuestros talleres especializados' },
  { slug: 'talleres-deportivos',     title: 'Talleres Deportivos',     description: 'Fortalece tu cuerpo y mente a través del deporte y la actividad física' },
  { slug: 'ferias-profesiograficas', title: 'Ferias Profesiográficas', description: 'Conoce las opciones educativas y profesionales disponibles' },
  { slug: 'visitas-guiadas',         title: 'Visitas Guiadas',         description: 'Descubre nuestra universidad a través de visitas guiadas' },
  { slug: 'servicio-medico',         title: 'Servicio Médico',         description: 'Atención médica y de salud preventiva para toda la comunidad universitaria' },
];

export const ensureExtensionSections = async () => {
  for (const section of DEFAULT_SECTIONS) {
    const existing = await ExtensionSection.findOne({ where: { slug: section.slug } });
    if (!existing) {
      await ExtensionSection.create({
        slug: section.slug,
        title: section.title,
        description: section.description,
        is_enabled: true,
      });
      console.log(`✅ Sección creada: ${section.slug}`);
    }
  }
};
