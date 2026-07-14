const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  }
);

async function dropTable() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    await sequelize.query("DROP TABLE IF EXISTS servicio_social_tipos");
    console.log('Table dropped.');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

dropTable();
