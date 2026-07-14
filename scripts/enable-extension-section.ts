import sequelize from '../src/config/database';
import ExtensionSection from '../src/models/ExtensionSection';

async function enableSection(slug: string) {
  try {
    await sequelize.authenticate();
    const section = await ExtensionSection.findOne({ where: { slug } });
    if (!section) {
      console.error('Sección no encontrada:', slug);
      process.exit(1);
    }
    await section.update({ is_enabled: true });
    console.log('Sección habilitada:', slug);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

if (require.main === module) {
  const slug = process.argv[2];
  if (!slug) {
    console.error('Uso: node enable-extension-section.js <slug>');
    process.exit(1);
  }
  enableSection(slug);
}

export default enableSection;
