import sequelize from '../../src/config/database';
import ExtensionSection from '../../src/models/ExtensionSection';
import ExtensionItem from '../../src/models/ExtensionItem';
import '../..//src/models/associations';

(async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected');
    const section = await ExtensionSection.findOne({ where: { slug: 'talleres-culturales' }, include: [{ model: ExtensionItem, as: 'items' }] });
    console.log('Section: ', JSON.stringify(section, null, 2));
  } catch (err: any) {
    console.error('Error during check:', err);
  } finally {
    await sequelize.close();
  }
})();
