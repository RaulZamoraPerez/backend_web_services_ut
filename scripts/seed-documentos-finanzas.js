/**
 * Script para poblar categorías y documentos de muestra para el área de Finanzas
 * Ejecutar con: node scripts/seed-documentos-finanzas.js
 */

const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const fs = require('fs');

// Cargar configuración
const envPath = path.join(__dirname, '..', '.env');
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
  logging: false,
  dialectOptions: {
    connectTimeout: 60000,
  }
});

// Definir modelos
const Area = sequelize.define('Area', {
  ID_Area: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'area',
  timestamps: false
});

const Categorias = sequelize.define('Categorias', {
  ID_Categorias: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  ID_Area: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'area',
      key: 'ID_Area'
    }
  }
}, {
  tableName: 'categorias',
  timestamps: false
});

const Archivos = sequelize.define('Archivos', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Nombre: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  Descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  Ruta_Documento: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  Fecha_Subida: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  ID_Categorias: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categorias',
      key: 'ID_Categorias'
    }
  }
}, {
  tableName: 'archivos',
  timestamps: false
});

// Datos de categorías para Finanzas
const CATEGORIAS_FINANZAS = [
  { Nombre: 'Estados Financieros', ID_Area: 1 },
  { Nombre: 'Presupuestos', ID_Area: 1 },
  { Nombre: 'Auditorías', ID_Area: 1 },
  { Nombre: 'Informes Trimestrales', ID_Area: 1 }
];

// Documentos de ejemplo (sin archivos físicos, solo para demostración)
const DOCUMENTOS_EJEMPLO = [
  {
    categoria: 'Estados Financieros',
    documentos: [
      {
        Nombre: 'Estado Financiero 2024',
        Descripcion: 'Estado financiero anual del ejercicio 2024',
        Ruta_Documento: '/uploads/documentos/estado-financiero-2024.pdf'
      },
      {
        Nombre: 'Balance General 2024',
        Descripcion: 'Balance general del primer semestre 2024',
        Ruta_Documento: '/uploads/documentos/balance-general-2024.pdf'
      }
    ]
  },
  {
    categoria: 'Presupuestos',
    documentos: [
      {
        Nombre: 'Presupuesto Anual 2024',
        Descripcion: 'Presupuesto aprobado para el ejercicio fiscal 2024',
        Ruta_Documento: '/uploads/documentos/presupuesto-2024.pdf'
      }
    ]
  },
  {
    categoria: 'Auditorías',
    documentos: [
      {
        Nombre: 'Informe de Auditoría Externa 2023',
        Descripcion: 'Resultados de la auditoría externa del ejercicio 2023',
        Ruta_Documento: '/uploads/documentos/auditoria-2023.pdf'
      }
    ]
  },
  {
    categoria: 'Informes Trimestrales',
    documentos: [
      {
        Nombre: 'Informe Q1 2024',
        Descripcion: 'Informe financiero del primer trimestre 2024',
        Ruta_Documento: '/uploads/documentos/informe-q1-2024.pdf'
      },
      {
        Nombre: 'Informe Q2 2024',
        Descripcion: 'Informe financiero del segundo trimestre 2024',
        Ruta_Documento: '/uploads/documentos/informe-q2-2024.pdf'
      }
    ]
  }
];

async function seedDocumentosFinanzas() {
  try {
    console.log('🌱 Poblando categorías y documentos de Finanzas...\n');

    await sequelize.authenticate();
    console.log('✅ Conectado a la base de datos\n');

    // Verificar que existe el área de Finanzas
    const areaFinanzas = await Area.findByPk(1);
    if (!areaFinanzas) {
      console.error('❌ No se encontró el área de Finanzas (ID: 1)');
      console.log('💡 Ejecuta primero: node scripts/seed-areas.js');
      process.exit(1);
    }

    console.log(`📁 Área encontrada: ${areaFinanzas.Nombre}\n`);

    // Crear categorías
    const categoriasCreadas = new Map();
    for (const catData of CATEGORIAS_FINANZAS) {
      const [categoria, created] = await Categorias.findOrCreate({
        where: { Nombre: catData.Nombre, ID_Area: catData.ID_Area },
        defaults: catData
      });

      categoriasCreadas.set(catData.Nombre, categoria.ID_Categorias);

      if (created) {
        console.log(`✅ Categoría creada: ${categoria.Nombre} (ID: ${categoria.ID_Categorias})`);
      } else {
        console.log(`⚠️  Categoría existente: ${categoria.Nombre} (ID: ${categoria.ID_Categorias})`);
      }
    }

    console.log('\n📄 Creando documentos de ejemplo...\n');

    // Crear documentos de ejemplo
    let totalDocumentos = 0;
    for (const grupoDoc of DOCUMENTOS_EJEMPLO) {
      const categoriaId = categoriasCreadas.get(grupoDoc.categoria);
      
      if (!categoriaId) {
        console.log(`⚠️  Categoría no encontrada: ${grupoDoc.categoria}`);
        continue;
      }

      for (const doc of grupoDoc.documentos) {
        const [archivo, created] = await Archivos.findOrCreate({
          where: { 
            Nombre: doc.Nombre,
            ID_Categorias: categoriaId
          },
          defaults: {
            ...doc,
            ID_Categorias: categoriaId,
            Fecha_Subida: new Date()
          }
        });

        if (created) {
          console.log(`   ✅ ${doc.Nombre}`);
          totalDocumentos++;
        } else {
          console.log(`   ⚠️  Ya existe: ${doc.Nombre}`);
        }
      }
    }

    console.log('\n📊 Resumen:');
    console.log(`   Categorías: ${CATEGORIAS_FINANZAS.length}`);
    console.log(`   Documentos creados: ${totalDocumentos}`);
    console.log('\n✨ Proceso completado');
    console.log('\n💡 Nota: Los documentos creados son de ejemplo.');
    console.log('   Para ver documentos reales, sube archivos desde el Dashboard.\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Ejecutar
seedDocumentosFinanzas()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
