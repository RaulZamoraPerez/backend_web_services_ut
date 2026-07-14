require('ts-node/register');
const sequelize = require('../../src/config/database').default;

async function crearTablaTiposEstadia() {
  try {
    console.log('🔄 Creando tabla tipos_estadia...');

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS tipos_estadia (
        ID INT AUTO_INCREMENT PRIMARY KEY,
        Nombre VARCHAR(100) NOT NULL UNIQUE,
        Descripcion TEXT,
        Orden INT NOT NULL DEFAULT 0,
        Activo BOOLEAN NOT NULL DEFAULT TRUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_orden (Orden),
        INDEX idx_activo (Activo)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log('✅ Tabla tipos_estadia creada correctamente');

    // Insertar tipos por defecto
    console.log('🔄 Insertando tipos por defecto...');
    
    await sequelize.query(`
      INSERT IGNORE INTO tipos_estadia (Nombre, Descripcion, Orden, Activo) VALUES
      ('Vinculación', 'Documentos relacionados con vinculación empresarial', 1, TRUE),
      ('Prácticas', 'Documentos de prácticas profesionales', 2, TRUE),
      ('Estadías', 'Documentos de estadías profesionales', 3, TRUE),
      ('Servicio Social', 'Documentos relacionados con servicio social', 4, TRUE);
    `);

    console.log('✅ Tipos por defecto insertados');
    console.log('✨ Migración completada exitosamente');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error en la migración:', error);
    process.exit(1);
  }
}

crearTablaTiposEstadia();
