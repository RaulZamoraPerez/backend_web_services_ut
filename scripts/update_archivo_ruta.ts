import sequelize from '../src/config/database';
import Archivos from '../src/models/Archivos';

(async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected');

    const idToEdit = Number(process.argv[2] || 17);
    const newRuta = process.argv[3] || '/public/ExtensionUniversitaria/DifusionyDivulgacion/PromocionInstitucional/INGRESO_UTTECAM_2025.jpg';

    const archivo = await Archivos.findByPk(idToEdit);
    if (!archivo) {
      console.error('Archivo not found, ID:', idToEdit);
      process.exit(1);
    }

    console.log('Before update:', { ID: archivo.ID, Nombre: archivo.Nombre, Ruta_Documento: archivo.Ruta_Documento });
    await archivo.update({ Ruta_Documento: newRuta });
    console.log('After update:', { ID: archivo.ID, Nombre: archivo.Nombre, Ruta_Documento: archivo.Ruta_Documento });
    process.exit(0);
  } catch (err) {
    console.error('Error', err);
    process.exit(1);
  }
})();
