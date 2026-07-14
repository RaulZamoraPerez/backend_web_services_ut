import sequelize from '../../src/config/database';

async function addEventoTemaColor() {
  try {
    console.log('Agregando columnas tema y color a la tabla eventos...');
    
    // Verificar si las columnas ya existen
    const [columns]: any = await sequelize.query(`
      SHOW COLUMNS FROM eventos LIKE 'tema';
    `);
    
    if (columns.length === 0) {
      await sequelize.query(`
        ALTER TABLE eventos 
        ADD COLUMN tema VARCHAR(100) DEFAULT 'general';
      `);
      console.log('✅ Columna tema agregada');
    } else {
      console.log('ℹ️  Columna tema ya existe');
    }
    
    const [colorColumns]: any = await sequelize.query(`
      SHOW COLUMNS FROM eventos LIKE 'color';
    `);
    
    if (colorColumns.length === 0) {
      await sequelize.query(`
        ALTER TABLE eventos 
        ADD COLUMN color VARCHAR(50) DEFAULT '#FFD700';
      `);
      console.log('✅ Columna color agregada');
    } else {
      console.log('ℹ️  Columna color ya existe');
    }
    
    // Actualizar eventos existentes sin tema/color
    await sequelize.query(`
      UPDATE eventos 
      SET tema = 'general'
      WHERE tema IS NULL;
    `);
    
    await sequelize.query(`
      UPDATE eventos 
      SET color = '#FFD700'
      WHERE color IS NULL;
    `);
    
    console.log('✅ Eventos existentes actualizados');
    
  } catch (error) {
    console.error('❌ Error al agregar columnas:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

addEventoTemaColor();
