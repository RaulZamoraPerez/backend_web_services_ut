/**
 * Script para poblar las áreas de documentos en la base de datos
 * Ejecutar con: npm run seed:areas
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

// Definir modelo Area
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

const AREAS = [
  { ID_Area: 1, Nombre: 'Finanzas' },
  { ID_Area: 2, Nombre: 'Recursos Humanos' },
  { ID_Area: 3, Nombre: 'Gestión Ambiental' },
  { ID_Area: 4, Nombre: 'Información de Estadía' },
  { ID_Area: 5, Nombre: 'Gestión de Calidad' },
  { ID_Area: 6, Nombre: 'Coordinación de Género' },
];

async function seedAreas() {
  try {
    console.log('🌱 Poblando áreas...\n');

    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conectado a la base de datos\n');

    let creadas = 0;
    let existentes = 0;

    for (const areaData of AREAS) {
      try {
        const [area, created] = await Area.findOrCreate({
          where: { ID_Area: areaData.ID_Area },
          defaults: areaData
        });

        if (created) {
          console.log(`✅ Creada: ${area.Nombre} (ID: ${area.ID_Area})`);
          creadas++;
        } else {
          console.log(`⚠️  Ya existe: ${area.Nombre} (ID: ${area.ID_Area})`);
          existentes++;
        }
      } catch (error) {
        console.error(`❌ Error con "${areaData.Nombre}": ${error.message}`);
      }
    }

    console.log('\n📊 Resumen:');
    console.log(`   Creadas: ${creadas}`);
    console.log(`   Ya existían: ${existentes}`);
    console.log(`   Total: ${AREAS.length}\n`);

    console.log('✨ Proceso completado\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Ejecutar
seedAreas()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });