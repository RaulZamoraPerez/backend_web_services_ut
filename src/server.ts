import dotenv from 'dotenv';
import path from 'path';

// Cargar configuración de forma flexible (sirve tanto para desarrollo local, dist/ y raíz de cPanel)
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

import app from './app';
import { syncDatabase } from './config/syncDatabase';
import { ensureExtensionAreas } from './startup/ensureExtensionAreas';
import { ensureExtensionSections } from './startup/ensureExtensionSections';

import { ensureUploadFolders } from './startup/ensureUploadFolders';
import { scheduleTempUploadsCleanup, stopTempUploadsCleanup } from './helpers/deleteTempFiles';
import sequelize from './config/database';

const PORT = process.env.PORT || 3000;

let server: any = null;

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION:', reason);
});

process.on('exit', (code) => {
  console.log(`Process exiting with code: ${code}`);
});

// Graceful shutdown handler
const gracefulShutdown = async (signal: string) => {
  console.log(`\n🛑 ${signal} recibido - Iniciando cierre controlado...`);
  
  const shutdownTimeout = setTimeout(() => {
    console.error('⏰ Timeout en cierre - Forzando salida');
    process.exit(1);
  }, 10000); // 10 segundos máximo para cerrar

  try {
    // 1. Detener timer de limpieza
    stopTempUploadsCleanup();

    // 2. Cerrar servidor HTTP (deja de aceptar nuevas conexiones)
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server.close((err: Error | undefined) => {
          if (err) {
            console.error('❌ Error cerrando servidor HTTP:', err.message);
            reject(err);
          } else {
            console.log('✅ Servidor HTTP cerrado');
            resolve();
          }
        });
      });
    }

    // 3. Cerrar conexiones de base de datos
    await sequelize.close();
    console.log('✅ Conexiones de base de datos cerradas');

    // 4. Limpiar timeout y salir
    clearTimeout(shutdownTimeout);
    console.log('👋 Cierre controlado completado');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error en cierre controlado:', error.message);
    clearTimeout(shutdownTimeout);
    process.exit(1);
  }
};

// Registrar handlers de señales
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));


// Inicializar servidor
const startServer = async () => {
  try {
    // Asegurar estructura de carpetas primero
    ensureUploadFolders();

    // Iniciar servidor
    server = app.listen(PORT, () => {
      scheduleTempUploadsCleanup(24 * 60 * 60 * 1000, { olderThanMs: 15 * 60 * 1000, onlyTmpPrefix: true });
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`📡 API disponible en: http://localhost:${PORT}`);

      console.log(`📋 Endpoints: http://localhost:${PORT}/api/textos`);
      console.log(`📊 Estadísticas: http://localhost:${PORT}/api/textos/stats`);
    });

    console.log('🔔 Prioridad 1 establecida');

    // Luego intentar conectar la base de datos
    try {
      await syncDatabase(false); // Cambiar a true para reset completo
      console.log('✅ Sequelize configurado y base de datos sincronizada');
      try {
        await ensureExtensionAreas();
        await ensureExtensionSections();

      } catch (err) {
        console.warn('⚠️  Error al asegurar las areas de Extensión:', (err as Error).message || err);
      }
    } catch (dbError: any) {
      console.warn('⚠️  Advertencia: No se pudo conectar a la base de datos');
      console.warn('   Verifica tu configuración de MySQL y el archivo .env');
      console.warn('   Error:', dbError.message);
      console.warn('   💡 Para usar Sequelize necesitas:');
      console.warn('      1. MySQL corriendo');
      console.warn('      2. Base de datos "uttecam" creada');
      console.warn('      3. Archivo .env configurado');
      console.warn('   El servidor continuará ejecutándose...');
    }

  } catch (e: any) {
    console.error('❌ Error crítico al iniciar servidor:', e.message);
    process.exit(1);
  }
};

startServer();