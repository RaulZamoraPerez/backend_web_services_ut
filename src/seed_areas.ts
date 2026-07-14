import Area from './models/Area';
import sequelize from './config/database';

const AREAS_TO_SEED = [
  { ID_Area: 1, Nombre: 'Finanzas' },
  { ID_Area: 2, Nombre: 'Recursos Humanos' },
  { ID_Area: 3, Nombre: 'Gestión Ambiental' },
  { ID_Area: 4, Nombre: 'Información y Estadística' },
  { ID_Area: 5, Nombre: 'Gestión de Calidad' },
  { ID_Area: 6, Nombre: 'Coordinación de Género' },
  { ID_Area: 7, Nombre: 'Programa Institucional de Tutorías (PIT)' },
  { ID_Area: 8, Nombre: 'Servicio Social' },
  { ID_Area: 9, Nombre: 'Gacetas' },
  { ID_Area: 10, Nombre: 'Promoción Institucional' },
  { ID_Area: 11, Nombre: 'Vinculación' },
];

async function seedAreas() {
  try {
    await sequelize.authenticate();
    console.log('Conexión establecida.');
    
    // Sincronizar por si acaso
    await Area.sync();

    for (const areaData of AREAS_TO_SEED) {
      // Usar findOrCreate para evitar errores si ya existe o el nombre ya existe
      const [area, created] = await Area.findOrCreate({
        where: { ID_Area: areaData.ID_Area },
        defaults: areaData
      });
      
      if (created) {
        console.log(`Creada área: ${areaData.Nombre} con ID: ${areaData.ID_Area}`);
      } else {
        // Actualizar el nombre si cambió
        if (area.Nombre !== areaData.Nombre) {
          try {
            await area.update({ Nombre: areaData.Nombre });
            console.log(`Actualizada área ID: ${areaData.ID_Area} a ${areaData.Nombre}`);
          } catch (e: any) {
            console.log(`No se pudo actualizar el área ID ${areaData.ID_Area} porque posiblemente el nombre ya exista en otro ID.`);
          }
        } else {
          console.log(`Área ya existe: ${areaData.Nombre} (ID: ${areaData.ID_Area})`);
        }
      }
    }

    console.log('Seed completado exitosamente.');
    process.exit(0);
  } catch (error) {
    console.error('Error al hacer seed:', error);
    process.exit(1);
  }
}

seedAreas();
