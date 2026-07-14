import fs from 'fs';
import path from 'path';
import sequelize from '../../src/config/database';

const runMigration = async () => {
  try {
    const sqlPath = path.join(__dirname, '../../sql/extension_universitaria.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Split by semicolon to run multiple statements if needed, 
    // but sequelize.query might handle it depending on driver. 
    // Safer to split.
    const statements = sql.split(';').filter(stmt => stmt.trim() !== '');

    for (const statement of statements) {
      await sequelize.query(statement);
    }

    console.log('✅ Extension Universitaria migration applied successfully.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error applying migration:', error);
    process.exit(1);
  }
};

runMigration();
