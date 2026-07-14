/**
 * Script para poblar el contenido de la sección "Nosotros" en la nueva estructura simplificada
 * Ejecutar con: node scripts/seed-nosotros-content.js
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

// Definir modelo simplificado
const NosotrosContent = sequelize.define('NosotrosContent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  politicaIntegral: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {}
  },
  objetivoIntegral: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: ''
  },
  vision: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {}
  },
  mision: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {}
  },
  valores: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {}
  },
  noDiscriminacion: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  }
}, {
  tableName: 'nosotros_content',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion'
});

// Datos iniciales según la nueva estructura simplificada
const CONTENIDO_INICIAL = {
  politicaIntegral: {
    imageSrc: 'nosotros/general_1761952210799_4116c822a4a1655d910cbc50c09c95a3.png',
    title: 'Política Integral',
    description: 'Somos una institución comprometida en la formación de profesionistas con responsabilidad social, sentido humano y ético, que en conjunto con la comunidad universitaria, contribuyen al desarrollo sustentable a través de establecimiento de objetivos integrales, actualización e innovación de los programas educativos, gestión de la propiedad intelectual y la mejora continua del Sistema de Gestión Integral, considerando el desarrollo educativo, científico y técnico, cumpliendo el marco legal aplicable, considerando las necesidades y expectativas de las partes interesadas, atendiendo los criterios ambientales de manera que se pueda controlar y prevenir la contaminación derivada de nuestros procesos y servicios para la preservación del medio ambiente.'
  },
  objetivoIntegral: 'Formar integralmente profesionistas competentes socialmente responsables, creativos, emprendedores e innovadores, comprometidos con el cuidado del medio ambiente y la sustentabilidad, a través del proceso enseñanza-aprendizaje, conducido por una planta docente con sentido humano, perfil profesional, experiencia y capacitación adecuada para la realización de su labor educativa.',
  vision: {
    imageSrc: 'nosotros/vision_1759772754247.png',
    title: 'Visión',
    description: 'En el año 2027 ser una institución de excelencia, reconocida Nacional e Internacionalmente por su eficiencia, eficacia, pertinencia, equidad, inclusión, vinculación y cuerpos académicos consolidados y comprometidos con las expectativas de los aprendientes y de la sociedad, al brindar educación de calidad y profesionistas con alto sentido humano, competitivos e integrados en el ámbito productivo'
  },
  mision: {
    imageSrc: 'nosotros/general_1761952064258_e361d82abad6d8113e2ec6074b4ef15a.png',
    title: 'Misión',
    description: 'Somos una Institución de Educación Superior comprometida con la excelencia, transparencia y rendición de cuentas, que brinda servicios educativos, científicos y tecnológicos con calidad, equidad, inclusión, responsabilidad social y sentido humano para contribuir al bienestar y desarrollo integral regional, estatal y nacional, cumpliendo los requerimientos de las partes interesadas, mediante un modelo formativo integral.'
  },
  valores: {
    imageSrc: 'nosotros/general_1761952189846_0697273e3d61620d3c56851a66ecec60.png',
    title: 'Valores',
    description: [
      'Austeridad',
      'Honestidad',
      'Empatía',
      'Generosidad',
      'Respeto',
      'Tolerancia',
      'Igualdad',
      'Equidad',
      'Justicia',
      'Fraternidad',
      'Compromiso',
      'Bien Común'
    ]
  },
  noDiscriminacion: [
    [
      'Apariencia Física',
      'Cultura',
      'Discapacidad',
      'Idioma'
    ],
    [
      'Estado civil',
      'Religión',
      'Sexo',
      'Embarazo'
    ],
    [
      'Opiniones',
      'Origen étnico o nacional',
      'Género',
      'Edad'
    ]
  ]
};

async function seedNosotrosContent() {
  try {
    console.log('🌱 Poblando contenido simplificado de la sección "Nosotros"...\n');

    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conectado a la base de datos\n');

    // Eliminar contenido existente si hay
    console.log('🗑️  Eliminando contenido existente...');
    await NosotrosContent.destroy({ where: {} });
    console.log('✅ Contenido anterior eliminado\n');

    // Crear contenido inicial
    console.log('📝 Creando contenido institucional...');
    const content = await NosotrosContent.create(CONTENIDO_INICIAL);

    console.log('✅ Contenido creado exitosamente');
    console.log('📊 Detalles del contenido creado:');
    console.log(`   - ID: ${content.id}`);
    console.log(`   - Política Integral: ${content.politicaIntegral.title}`);
    console.log(`   - Objetivo Integral: ${content.objetivoIntegral.substring(0, 50)}...`);
    console.log(`   - Visión: ${content.vision.title}`);
    console.log(`   - Misión: ${content.mision.title}`);
    console.log(`   - Valores: ${content.valores.description.length} valores`);
    console.log(`   - No Discriminación: ${content.noDiscriminacion.length} categorías\n`);

    console.log('✨ Proceso completado exitosamente\n');
    console.log('🔗 API Endpoints disponibles:');
    console.log('   GET  /api/nosotros/content - Obtener todo el contenido');
    console.log('   PUT  /api/nosotros/content - Actualizar todo el contenido');
    console.log('   PATCH /api/nosotros/content/:section - Actualizar sección específica\n');

  } catch (error) {
    console.error('❌ Error general:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Ejecutar
seedNosotrosContent()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });