import sequelize from '../src/config/database';
import Archivos from '../src/models/Archivos';

(async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected');
    const filename = process.argv[2] || 'INGRESO_UTTECAM_2025';
    const archivos = await Archivos.findAll({
      where: sequelize.where(sequelize.fn('LOWER', sequelize.col('Ruta_Documento')), 'LIKE', `%${String(filename).toLowerCase()}%`)
    },
    );
    console.log('Found', archivos.length, 'rows');
    archivos.forEach((a: any) => console.log({ ID: a.ID, Nombre: a.Nombre, Ruta_Documento: a.Ruta_Documento, ID_Categorias: a.ID_Categorias }));
    process.exit(0);
  } catch (err) {
    console.error('Error', err);
    process.exit(1);
  }
})();
