import sequelize from '../src/config/database';
import Area from '../src/models/Area';
import Categorias from '../src/models/Categorias';

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    const areas = [
      { ID_Area: 9, Nombre: 'Gacetas' },
      { ID_Area: 10, Nombre: 'Promoción Institucional' }
    ];

    for (const a of areas) {
      const [area, created] = await Area.findOrCreate({
        where: { ID_Area: a.ID_Area },
        defaults: a
      });

      if (created) console.log(`✅ Area created: ${a.Nombre}`);
      else {
        console.log(`⚠️ Area already exists: ${a.Nombre}`);
        if (area.Nombre !== a.Nombre) {
          await area.update({ Nombre: a.Nombre });
          console.log(`🔄 Area name updated to: ${a.Nombre}`);
        }
      }
    }

    // Create a default category for each area
    const defaultCategories = [
      { Nombre: 'Gacetas', ID_Area: 9 },
      { Nombre: 'Promoción Institucional', ID_Area: 10 }
    ];

    for (const c of defaultCategories) {
      const [cat, created] = await Categorias.findOrCreate({
        where: { Nombre: c.Nombre, ID_Area: c.ID_Area },
        defaults: c
      });

      if (created) console.log(`✅ Categoria creada: ${c.Nombre} (Area ${c.ID_Area})`);
      else console.log(`⚠️ Categoria ya existe: ${c.Nombre} (Area ${c.ID_Area})`);
    }

    console.log('✅ Extension document areas and categories seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding extension document areas:', error);
    process.exit(1);
  }
};

seed();