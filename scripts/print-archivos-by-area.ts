import sequelize from '../src/config/database';
import { Area, Categorias, Archivos } from '../src/models/associations';

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connected');

    const areaId = 9; // Gacetas

    const archivos = await Archivos.findAll({
      include: [{ model: Categorias, as: 'categoria', where: { ID_Area: areaId }, include: [{ model: Area, as: 'area' }] }],
      order: [['ID', 'DESC']]
    });

    console.log(`Archivos en area ${areaId}: ${archivos.length}`);
    archivos.forEach(a => {
      const { ID, Nombre, Ruta_Documento, ID_Categorias }: any = a;
      console.log(`ID: ${ID} Nombre: ${Nombre} Ruta: ${Ruta_Documento} ID_Categorias: ${ID_Categorias}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();