import Area from '../src/models/Area';
import sequelize from '../src/config/database';

const seedVinculacionAreas = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a base de datos establecida');

    const areas = [
      { ID_Area: 7, Nombre: 'Vinculación' },
      { ID_Area: 8, Nombre: 'Servicio Social' }
    ];

    for (const area of areas) {
      const [instance, created] = await Area.findOrCreate({
        where: { ID_Area: area.ID_Area },
        defaults: area
      });

      if (created) {
        console.log(`✅ Área creada: ${area.Nombre}`);
      } else {
        console.log(`ℹ️ Área ya existe: ${area.Nombre}`);
        // Update name if needed
        if (instance.Nombre !== area.Nombre) {
            await instance.update({ Nombre: area.Nombre });
            console.log(`🔄 Área actualizada: ${area.Nombre}`);
        }
      }
    }

    console.log('✅ Proceso de seed completado');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en el seed:', error);
    process.exit(1);
  }
};

seedVinculacionAreas();
