import sequelize from '../src/config/database';
import Area from '../src/models/Area';

/**
 * Script para asegurar que el área PIT existe en la base de datos
 * Ejecutar con: npx ts-node scripts/ensure-pit-area.ts
 */

async function ensurePITArea() {
  try {
    console.log('🔍 Verificando área PIT...\n');
    
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida\n');
    
    // Verificar si el área PIT (ID: 7) ya existe
    const areaExistente = await Area.findOne({ where: { ID_Area: 7 } });
    
    if (areaExistente) {
      console.log('✓ El área PIT ya existe:');
      console.log(`  ID: ${areaExistente.ID_Area}`);
      console.log(`  Nombre: ${areaExistente.Nombre}\n`);
    } else {
      console.log('📝 Creando área PIT...');
      
      // Crear el área PIT
      const nuevaArea = await Area.create({
        ID_Area: 7,
        Nombre: 'PIT'
      });
      
      console.log('✅ Área PIT creada exitosamente:');
      console.log(`  ID: ${nuevaArea.ID_Area}`);
      console.log(`  Nombre: ${nuevaArea.Nombre}\n`);
    }
    
    // Listar todas las áreas para verificación
    console.log('📋 Áreas disponibles en el sistema:');
    const todasLasAreas = await Area.findAll({ order: [['ID_Area', 'ASC']] });
    todasLasAreas.forEach(area => {
      console.log(`  ${area.ID_Area}. ${area.Nombre}`);
    });
    
    console.log('\n🎉 ¡Proceso completado exitosamente!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

ensurePITArea();
