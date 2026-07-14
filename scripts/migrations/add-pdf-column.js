#!/usr/bin/env node

/**
 * Migration: Add pdf column to servicios_tecnologicos table
 */

const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

// Cargar configuración
const envPath = path.join(__dirname, '..', '..', '.env');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
  console.log(`📋 Configuración cargada desde: ${envPath}`);
}

// Configuración de base de datos
const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT || 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'uttecam',
  logging: console.log
});

async function migrate() {
  try {
    console.log('🔄 Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conectado');

    console.log('🔄 Verificando si la columna pdf existe...');
    
    // Verificar si la columna ya existe
    const [results] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = '${process.env.DB_NAME}' 
      AND TABLE_NAME = 'servicios_tecnologicos' 
      AND COLUMN_NAME = 'pdf'
    `);

    if (results.length > 0) {
      console.log('✅ La columna pdf ya existe');
      return;
    }

    console.log('🔄 Agregando columna pdf...');
    await sequelize.query(`
      ALTER TABLE servicios_tecnologicos 
      ADD COLUMN pdf VARCHAR(500) NULL AFTER imagen
    `);
    
    console.log('✅ Columna pdf agregada correctamente');

  } catch (error) {
    console.error('❌ Error en la migración:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

migrate()
  .then(() => {
    console.log('✨ Migración completada');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });
