const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
  }
);

async function checkTables() {
  try {
    // Verificar tabla directorios
    const [directorios] = await sequelize.query("SHOW TABLES LIKE 'directorios'");
    console.log('✅ Tabla directorios:', directorios.length > 0 ? 'EXISTE' : '❌ NO EXISTE');
    
    // Verificar tabla organigrama
    const [organigrama] = await sequelize.query("SHOW TABLES LIKE 'organigrama'");
    console.log('✅ Tabla organigrama:', organigrama.length > 0 ? 'EXISTE' : '❌ NO EXISTE');
    
    // Contar registros en directorios
    if (directorios.length > 0) {
      const [countDir] = await sequelize.query("SELECT COUNT(*) as count FROM directorios");
      console.log('  └─ Registros en directorios:', countDir[0].count);
    }
    
    // Contar registros en organigrama
    if (organigrama.length > 0) {
      const [countOrg] = await sequelize.query("SELECT COUNT(*) as count FROM organigrama");
      console.log('  └─ Registros en organigrama:', countOrg[0].count);
    }
    
    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkTables();
