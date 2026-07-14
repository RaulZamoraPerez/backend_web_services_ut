import sequelize from '../src/config/database';
import fs from 'fs';
import path from 'path';

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida');

    const sqlFilePath = path.resolve(__dirname, '../sql/migration_add_is_enabled_extension_sections.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');

    // Split statements; mysql2 in Sequelize can execute multiple queries if allowed, but better to run one by one
    const statements = sql
      .split(/;\s*\n/g)
      .map(s => s.trim())
      .filter(Boolean);

    for (const stmt of statements) {
      console.log('Running:', stmt.substring(0, 120));
      await sequelize.query(stmt);
    }

    console.log('✅ Migration executed successfully');
    process.exit(0);
  } catch (err: any) {
    console.error('❌ Error executing migration:', err);
    process.exit(1);
  }
})();
