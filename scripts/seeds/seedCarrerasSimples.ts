import { CarreraSimple } from '../../src/models/CarreraSimple';

/**
 * Seed inicial de carreras disponibles en UTTECAM
 */
export const seedCarrerasSimples = async (): Promise<void> => {
  try {
    console.log('🌱 Iniciando seed de carreras simples...');

    const carrerasIniciales = [
      // TSU
      { nombre: 'TSU en Desarrollo de Software', tipo: 'TSU' as const, activo: true },
      { nombre: 'TSU en Mecatrónica', tipo: 'TSU' as const, activo: true },
      { nombre: 'TSU en Energías Renovables', tipo: 'TSU' as const, activo: true },
      { nombre: 'TSU en Procesos Industriales', tipo: 'TSU' as const, activo: true },
      { nombre: 'TSU en Tecnologías de la Información', tipo: 'TSU' as const, activo: true },

      // Ingenierías
      { nombre: 'Ingeniería en Desarrollo de Software', tipo: 'INGENIERIA' as const, activo: true },
      { nombre: 'Ingeniería en Mecatrónica', tipo: 'INGENIERIA' as const, activo: true },
      { nombre: 'Ingeniería en Energías Renovables', tipo: 'INGENIERIA' as const, activo: true },
      { nombre: 'Ingeniería en Procesos Industriales', tipo: 'INGENIERIA' as const, activo: true },
      { nombre: 'Ingeniería en Tecnologías de la Información', tipo: 'INGENIERIA' as const, activo: true },
    ];

    let creadas = 0;
    let existentes = 0;

    for (const carrera of carrerasIniciales) {
      const existe = await CarreraSimple.findOne({ where: { nombre: carrera.nombre } });

      if (!existe) {
        await CarreraSimple.create(carrera);
        creadas++;
        console.log(`  ✅ Creada: ${carrera.nombre}`);
      } else {
        existentes++;
        console.log(`  ⏭️  Ya existe: ${carrera.nombre}`);
      }
    }

    console.log(`\n✅ Seed completado:`);
    console.log(`   - ${creadas} carreras creadas`);
    console.log(`   - ${existentes} carreras ya existían`);
    console.log(`   - Total: ${carrerasIniciales.length} carreras\n`);

  } catch (error) {
    console.error('❌ Error en seedCarrerasSimples:', error);
    throw error;
  }
};
