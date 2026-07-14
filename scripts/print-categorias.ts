import sequelize from '../src/config/database';
import { Categorias, Area } from '../src/models/associations';

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connected');

    const cats = await Categorias.findAll({ include: [{ model: Area, as: 'area' }], order: [['ID_Categorias','ASC']] });
    cats.forEach(c => {
      const { ID_Categorias, Nombre, ID_Area }: any = c;
      console.log(`Categoria ${ID_Categorias} - ${Nombre} (Area ${ID_Area})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();