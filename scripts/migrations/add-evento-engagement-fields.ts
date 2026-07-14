
import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const sequelize = new Sequelize(
  process.env.DB_NAME || 'uttecam_page',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: console.log,
  }
);

async function migrate() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida.');

    const queryInterface = sequelize.getQueryInterface();
    const tableInfo = await queryInterface.describeTable('eventos');

    if (!tableInfo.imagen_fondo_url) {
      await queryInterface.addColumn('eventos', 'imagen_fondo_url', {
        type: DataTypes.STRING,
        allowNull: true,
      });
      console.log('Columna imagen_fondo_url agregada.');
    }

    if (!tableInfo.texto_boton) {
      await queryInterface.addColumn('eventos', 'texto_boton', {
        type: DataTypes.STRING,
        allowNull: true,
      });
      console.log('Columna texto_boton agregada.');
    }

    if (!tableInfo.url_boton) {
      await queryInterface.addColumn('eventos', 'url_boton', {
        type: DataTypes.STRING,
        allowNull: true,
      });
      console.log('Columna url_boton agregada.');
    }

    console.log('Migración completada exitosamente.');
  } catch (error) {
    console.error('Error durante la migración:', error);
  } finally {
    await sequelize.close();
  }
}

migrate();
