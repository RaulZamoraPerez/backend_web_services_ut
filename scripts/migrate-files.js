#!/usr/bin/env node

/**
 * Script para migrar archivos existentes a la nueva estructura por categorías
 * Ejecutar con: npm run migrate:files
 */

const fs = require('fs');
const path = require('path');

// Función para migrar archivos existentes
async function migrateFiles() {
  const baseDir = path.join(__dirname, '..', 'uploads', 'documentos');

  console.log('🔄 Iniciando migración de archivos...\n');

  // Verificar que existe la carpeta base
  if (!fs.existsSync(baseDir)) {
    console.log('✅ No hay archivos para migrar (carpeta no existe)');
    return;
  }

  // Leer archivos en la carpeta base
  const files = fs.readdirSync(baseDir)
    .filter(file => file !== '.gitignore' && fs.statSync(path.join(baseDir, file)).isFile());

  if (files.length === 0) {
    console.log('✅ No hay archivos para migrar');
    return;
  }

  console.log(`📁 Encontrados ${files.length} archivos para migrar\n`);

  // Crear carpeta para archivos sin categoría
  const sinCategoriaDir = path.join(baseDir, 'sin_categoria');
  if (!fs.existsSync(sinCategoriaDir)) {
    fs.mkdirSync(sinCategoriaDir, { recursive: true });
  }

  // Mover archivos a carpeta sin_categoria
  for (const file of files) {
    const oldPath = path.join(baseDir, file);
    const newPath = path.join(sinCategoriaDir, file);

    try {
      fs.renameSync(oldPath, newPath);
      console.log(`✅ Movido: ${file} → sin_categoria/`);
    } catch (error) {
      console.error(`❌ Error moviendo ${file}:`, error.message);
    }
  }

  console.log('\n✨ Migración completada');
  console.log('💡 Los archivos existentes se movieron a "sin_categoria/"');
  console.log('💡 Los nuevos uploads se organizarán automáticamente por categoría');
}

// Ejecutar migración
migrateFiles().catch(error => {
  console.error('❌ Error en migración:', error);
  process.exit(1);
});