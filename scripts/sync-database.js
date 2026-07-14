#!/usr/bin/env node

/**
 * Script para sincronizar la base de datos en producción
 * Ejecutar con: npm run db:sync
 */

const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const fs = require('fs');

// Detectar si estamos en producción o desarrollo
const isProduction = process.env.NODE_ENV === 'production';

// Cargar configuración desde diferentes ubicaciones posibles
const envPaths = [
  path.join(__dirname, '..', '.env'),
  path.join(__dirname, '..', '..', '.env'),
  path.join(process.cwd(), '.env')
];

let envLoaded = false;
for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
    console.log(`📋 Configuración cargada desde: ${envPath}`);
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  console.log('⚠️  Archivo .env no encontrado, usando variables de entorno del sistema');
}

// Verificar configuración crítica
const requiredEnvVars = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
const missingVars = requiredEnvVars.filter(varName => process.env[varName] === undefined);

if (missingVars.length > 0) {
  console.error('❌ Variables de entorno faltantes:', missingVars.join(', '));
  console.error('💡 Configurar archivo .env con las credenciales de base de datos');
  process.exit(1);
}

// Configuración de base de datos
const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT || 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'uttecam',
  logging: isProduction ? false : console.log,
  dialectOptions: {
    connectTimeout: 60000,
    acquireTimeout: 60000,
    timeout: 60000,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Definir modelos básicos (simplificados para sincronización)
const Area = sequelize.define('Area', {
  ID_Area: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  Nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'area', // Nombre correcto de la tabla (singular)
  timestamps: false
});

const Texto = sequelize.define('Texto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  contenido: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'textos',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const ServicioTecnologico = sequelize.define('ServicioTecnologico', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  titulo: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  imagen: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  pdf: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  orden: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  fecha_actualizacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'servicios_tecnologicos',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion',
});

const MiembroSNII = sequelize.define('MiembroSNII', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  titulo: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  pdf: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  orden: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  fecha_actualizacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'miembros_snii',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion',
});

const ProductoInvestigacion = sequelize.define('ProductoInvestigacion', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  titulo: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  pdf: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  carpeta: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  orden: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  fecha_actualizacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'productos_investigacion',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion',
});

// Función para sincronizar la base de datos
async function syncDatabase(force = false) {
  try {
    console.log('🔄 Conectando a la base de datos...');

    // Probar conexión
    await sequelize.authenticate();
    console.log('✅ Conectado a la base de datos');

    console.log('🔄 Sincronizando modelos...');

    if (force) {
      // Deshabilitar restricciones de clave foránea para force sync
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    }

    // Sincronizar modelos
    await sequelize.sync({ force });

    if (force) {
      // Rehabilitar restricciones de clave foránea
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
      console.log('🔄 Base de datos reiniciada');

      // Insertar datos iniciales
      await seedDatabase();
    } else {
      console.log('✅ Modelos sincronizados con la base de datos');
    }

  } catch (error) {
    console.error('❌ Error al sincronizar la base de datos:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Función para insertar datos iniciales
async function seedDatabase() {
  try {
    const textosIniciales = [
      {
        contenido: 'Bienvenido a la Universidad Tecnológica de Tecamachalco'
      },
      {
        contenido: 'La UTTECAM se compromete con la excelencia académica'
      },
      {
        contenido: 'Ofrecemos carreras técnicas y de ingeniería de vanguardia'
      }
    ];

    await Texto.bulkCreate(textosIniciales);
    console.log('🌱 Datos iniciales de textos insertados');

  } catch (error) {
    console.error('❌ Error al insertar datos iniciales:', error);
  }
}

// Obtener argumentos de línea de comandos
const args = process.argv.slice(2);
const force = args.includes('--force') || args.includes('-f');

console.log(`🚀 Sincronizando base de datos${force ? ' (FORCE MODE)' : ''}...`);
console.log('⚠️  Si usas --force, se eliminarán todos los datos existentes');

syncDatabase(force)
  .then(() => {
    console.log('✨ Sincronización completada');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });