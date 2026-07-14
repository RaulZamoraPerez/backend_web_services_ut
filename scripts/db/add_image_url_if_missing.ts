import sequelize from '../../src/config/database';

(async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected');
    const dbName = process.env.DB_NAME || 'uttecam_dev';
    const [results, metadata] = await sequelize.query(`
      SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = '${dbName}' AND TABLE_NAME = 'extension_items' AND COLUMN_NAME = 'image_url'
    `);
    const exists = (results as any[])[0].count > 0;
    if (exists) {
      console.log('Column image_url already exists');
    } else {
      console.log('Adding column image_url to extension_items...');
      await sequelize.query(`ALTER TABLE extension_items ADD COLUMN image_url VARCHAR(255) NULL;`);
      console.log('Column image_url added');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await sequelize.close();
  }
})();
