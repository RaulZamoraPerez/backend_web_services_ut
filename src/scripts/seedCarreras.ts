import { STAFF_MEMBERS } from '../config/emailRouting';
import { CarreraSimple } from '../models/CarreraSimple';
import { PersonalCarrera } from '../models/PersonalCarrera';
import sequelize from '../config/database';

async function seed() {
  try {
    console.log("Iniciando sincronización...");
    await sequelize.authenticate();
    
    let carrerasAgregadas = 0;
    let personalAgregado = 0;

    // Obtener todas las carreras únicas de STAFF_MEMBERS
    const carrerasUnicas = new Map<string, { nombre: string, tipo: string }>();
    
    for (const staff of STAFF_MEMBERS) {
      for (const c of staff.carreras) {
        // Mapear el área a un enum válido
        let tipo = 'TSU';
        if (c.area === 'LIC') tipo = 'LICENCIATURA';
        if (c.area === 'ING') tipo = 'INGENIERIA';
        
        carrerasUnicas.set(c.nombre, { nombre: c.nombre, tipo });
      }
    }

    // 1. Insertar Carreras Simples
    for (const carrera of carrerasUnicas.values()) {
      const existe = await CarreraSimple.findOne({ where: { nombre: carrera.nombre } });
      if (!existe) {
        await CarreraSimple.create({
          nombre: carrera.nombre,
          tipo: carrera.tipo as any,
          activo: true
        });
        carrerasAgregadas++;
      }
    }

    // 2. Insertar Personal
    for (const staff of STAFF_MEMBERS) {
      const existe = await PersonalCarrera.findOne({ where: { correo: staff.email } });
      if (!existe) {
        await PersonalCarrera.create({
          nombre: staff.nombre,
          correo: staff.email,
          carreras: staff.carreras.map((c: any) => c.nombre), // Array de nombres
          activo: true
        });
        personalAgregado++;
      }
    }

    console.log(`¡Éxito! Se agregaron ${carrerasAgregadas} carreras y ${personalAgregado} miembros del personal.`);
    process.exit(0);
  } catch (error) {
    console.error("Error en el seeder:", error);
    process.exit(1);
  }
}

seed();
