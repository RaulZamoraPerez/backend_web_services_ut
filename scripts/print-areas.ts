import sequelize from '../src/config/database';
import { Area, Categorias } from '../src/models/associations';

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos OK');

    const areas = await Area.findAll({
      include: [{ model: Categorias, as: 'categorias', required: false }],
      order: [['ID_Area', 'ASC']]
    });

    console.log('--- Areas found:', areas.length);
    areas.forEach(a => {
      const { ID_Area, Nombre }: any = a;
      const cats: any = (a as any).categorias || [];
      console.log(`Area ${ID_Area} - ${Nombre} (${cats.length} categorias)`);
      cats.forEach((c: any) => console.log(`  > Categoria ${c.ID_Categorias} - ${c.Nombre}`));
    });

    process.exit(0);
  } catch (error) {
    console.error('Error reading DB', error);
    process.exit(1);
  }
})();
