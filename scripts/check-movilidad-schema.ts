const sequelize = require('../src/config/database').default;

async function checkSchema() {
  try {
    await sequelize.authenticate();
    console.log('Conexión establecida.');

    const [results, metadata] = await sequelize.query("DESCRIBE movilidad_internacionals");
    console.log('Schema de movilidad_internacionals:', results);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

checkSchema();
