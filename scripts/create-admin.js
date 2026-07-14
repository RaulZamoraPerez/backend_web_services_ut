#!/usr/bin/env node

/**
 * Script para crear el primer usuario administrador
 * Este script solo debe ejecutarse una vez para configurar el primer admin
 * Maneja errores de producción y verifica configuración
 */

const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

// Detectar si estamos en producción o desarrollo
const isProduction = process.env.NODE_ENV === 'production';
const isInDistFolder = __dirname.includes('dist');

// Cargar configuración desde diferentes ubicaciones posibles
const envPaths = [
  path.join(__dirname, '..', '.env'),
  path.join(__dirname, '..', '..', '.env'),
  path.join(process.cwd(), '.env'),
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
const missingVars = requiredEnvVars.filter(
  (varName) => process.env[varName] === undefined,
);

if (missingVars.length > 0) {
  console.error('❌ Variables de entorno faltantes:', missingVars.join(', '));
  console.error('💡 Configurar archivo .env con las credenciales de base de datos');
  process.exit(1);
}

// Configuración de base de datos con manejo de errores mejorado
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
    idle: 10000,
  },
});

// Definir modelo User (simplificado)
const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'editor', 'viewer'),
      allowNull: false,
      defaultValue: 'viewer',
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    failed_login_attempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    locked_until: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'users',
    underscored: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const saltRounds = 12;
          user.password = await bcrypt.hash(user.password, saltRounds);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const saltRounds = 12;
          user.password = await bcrypt.hash(user.password, saltRounds);
        }
      },
    },
  },
);

const createAdminUser = async (isForced = false) => {
  try {
    console.log('🔧 Conectando a la base de datos...');
    console.log(`📍 Host: ${process.env.DB_HOST}`);
    console.log(`🗄️  Base de datos: ${process.env.DB_NAME}`);
    console.log(`👤 Usuario: ${process.env.DB_USER}`);

    // Conectar a la base de datos con timeout
    const connectionPromise = sequelize.authenticate();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout de conexión (30s)')), 30000),
    );

    await Promise.race([connectionPromise, timeoutPromise]);
    console.log('✅ Conexión a base de datos establecida');

    // Sincronizar modelos
    console.log('🔄 Sincronizando modelos...');
    await sequelize.sync();
    console.log('✅ Modelos sincronizados');

    // Verificar si ya existe un administrador
    console.log('🔍 Verificando administradores existentes...');
    const existingAdmin = await User.findOne({
      where: { role: 'admin' },
    });

    if (existingAdmin) {
      if (isForced) {
        console.log('⚠️  Eliminando administrador existente...');
        await existingAdmin.destroy();
        console.log('✅ Administrador existente eliminado');
      } else {
        console.log('⚠️  Ya existe un usuario administrador:');
        console.log(`   Username: ${existingAdmin.username}`);
        console.log(`   Email: ${existingAdmin.email}`);
        console.log(`   Creado: ${existingAdmin.created_at}`);
        console.log('');
        console.log('❌ No se creará un nuevo administrador');
        console.log('💡 Para crear otro admin, usar el endpoint /api/auth/register');
        return false;
      }
    }

    // Datos del usuario administrador
    const adminData = {
      username: 'admin',
      email: 'admin@uttecam.edu.mx',
      password: 'Admin123!@#', // Será hasheada automáticamente por el hook
      role: 'admin',
      is_active: true,
    };

    console.log('👤 Creando usuario administrador...');
    console.log(`   Username: ${adminData.username}`);
    console.log(`   Email: ${adminData.email}`);
    console.log(`   Role: ${adminData.role}`);

    // Crear el usuario administrador
    const adminUser = await User.create(adminData);

    console.log('');
    console.log('🎉 ¡Usuario administrador creado exitosamente!');
    console.log('');
    console.log('📋 Detalles del usuario:');
    console.log(`   ID: ${adminUser.id}`);
    console.log(`   Username: ${adminUser.username}`);
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Role: ${adminUser.role}`);
    console.log(`   Estado: ${adminUser.is_active ? 'Activo' : 'Inactivo'}`);
    console.log(`   Creado: ${adminUser.created_at}`);
    console.log('');
    console.log('🔑 Credenciales de acceso:');
    console.log(`   Username/Email: ${adminData.username} o ${adminData.email}`);
    console.log(`   Password: ${adminData.password}`);
    console.log('');
    console.log('⚠️  IMPORTANTE: Cambia la contraseña después del primer login');
    console.log('');
    console.log('🚀 Puedes hacer login en: POST /api/auth/login');
    console.log('   Body: { "username": "admin", "password": "Admin123!@#" }');

    return true;
  } catch (error) {
    console.error('❌ Error al crear usuario administrador:');
    console.error('');

    // Mostrar información detallada del error
    if (error.name === 'SequelizeConnectionError') {
      console.error('🔌 Error de conexión a la base de datos:');
      console.error(`   Mensaje: ${error.message}`);
      console.error('');
      console.error('💡 Verificar:');
      console.error('   ✓ Que el servidor MySQL esté corriendo');
      console.error('   ✓ Que las credenciales en .env sean correctas');
      console.error('   ✓ Que la base de datos exista');
      console.error('   ✓ Que el usuario tenga permisos');
    } else if (error.name === 'SequelizeValidationError') {
      console.error('📋 Errores de validación:');
      error.errors.forEach((err) => {
        console.error(`   - ${err.path}: ${err.message}`);
      });
    } else if (error.name === 'SequelizeUniqueConstraintError') {
      console.error('⚠️  El username o email ya existe en la base de datos');
      console.error('💡 Si necesitas resetear el admin, ejecuta:');
      console.error('   UPDATE users SET role="viewer" WHERE role="admin";');
    } else if (error.message.includes('Timeout')) {
      console.error('⏱️  Timeout de conexión a la base de datos');
      console.error('💡 Verificar que el servidor de BD esté respondiendo');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('🚫 Acceso denegado a la base de datos');
      console.error('💡 Verificar usuario y contraseña en .env');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('🗄️  Base de datos no encontrada');
      console.error('💡 Crear la base de datos primero:');
      console.error(`   CREATE DATABASE ${process.env.DB_NAME};`);
    } else {
      console.error(`   Tipo: ${error.name}`);
      console.error(`   Mensaje: ${error.message}`);
      if (error.code) console.error(`   Código: ${error.code}`);
    }

    console.error('');
    console.error('🔍 Configuración actual:');
    console.error(`   Host: ${process.env.DB_HOST}`);
    console.error(`   Puerto: ${process.env.DB_PORT}`);
    console.error(`   Base de datos: ${process.env.DB_NAME}`);
    console.error(`   Usuario: ${process.env.DB_USER}`);
    console.error(`   Entorno: ${process.env.NODE_ENV || 'development'}`);

    return false;
  } finally {
    // Cerrar conexión solo si se estableció
    try {
      await sequelize.close();
      console.log('🔌 Conexión a base de datos cerrada');
    } catch (closeError) {
      console.log('⚠️  Error al cerrar conexión:', closeError.message);
    }
  }
};

// Función principal con manejo de argumentos
const main = async () => {
  console.log('🚀 UTTECAM API - Creador de Usuario Administrador');
  console.log('===============================================');
  console.log('');

  // Verificar argumentos de línea de comandos
  const args = process.argv.slice(2);
  const isForced = args.includes('--force');
  const isSafe = args.includes('--safe');

  if (isSafe) {
    console.log('🛡️  Modo seguro activado - no saldrá con error si falla');
  }

  if (isForced) {
    console.log('⚠️  Modo forzado activado - eliminará admins existentes');
  }

  const success = await createAdminUser(isForced);

  if (!success && !isSafe) {
    console.log('');
    console.log('❌ Script finalizado con errores');
    process.exit(1);
  } else if (!success && isSafe) {
    console.log('');
    console.log('⚠️  Script finalizado (modo seguro - no hay error de salida)');
    process.exit(0);
  } else {
    console.log('');
    console.log('✅ Script completado exitosamente');
    process.exit(0);
  }
};

// Manejo de señales del sistema
process.on('SIGINT', async () => {
  console.log('\n🛑 Script interrumpido por el usuario');
  try {
    await sequelize.close();
  } catch (error) {
    // Ignorar errores al cerrar
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Script terminado por el sistema');
  try {
    await sequelize.close();
  } catch (error) {
    // Ignorar errores al cerrar
  }
  process.exit(0);
});

// Ejecutar script principal
main().catch(async (error) => {
  console.error('💥 Error fatal no capturado:', error.message);
  try {
    await sequelize.close();
  } catch (closeError) {
    // Ignorar errores al cerrar
  }
  process.exit(1);
});
