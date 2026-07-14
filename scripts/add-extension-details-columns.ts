import sequelize from '../src/config/database';

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida');

    const columnsToAdd = [
      { name: 'schedule', type: 'TEXT', after: 'is_enabled' },
      { name: 'location', type: 'TEXT', after: 'schedule' },
      { name: 'contact_info', type: 'TEXT', after: 'location' },
      { name: 'requirements', type: 'TEXT', after: 'contact_info' },
      { name: 'registration_info', type: 'TEXT', after: 'requirements' }
    ];

    for (const col of columnsToAdd) {
      try {
        // Check if column exists
        const [results] = await sequelize.query(`SHOW COLUMNS FROM extension_sections LIKE '${col.name}'`);
        if (Array.isArray(results) && results.length > 0) {
          console.log(`ℹ️ La columna '${col.name}' ya existe.`);
        } else {
          const query = `ALTER TABLE extension_sections ADD COLUMN ${col.name} ${col.type} AFTER ${col.after}`;
          console.log(`Ejecutando: ${query}`);
          await sequelize.query(query);
          console.log(`✅ Columna '${col.name}' agregada.`);
        }
      } catch (error) {
        console.error(`❌ Error al agregar columna '${col.name}':`, error);
      }
    }

    console.log('✅ Migración completada.');
    process.exit(0);
  } catch (err: any) {
    console.error('❌ Error general:', err);
    process.exit(1);
  }
})();
