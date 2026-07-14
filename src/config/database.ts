import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME || 'uttecam',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  dialect: 'mysql',
  logging: false, // Deshabilitar logs SQL para limpiar la consola
  dialectOptions: {
    // Nota: mysql2 no acepta la opción `maxAllowedPacket` aquí y la marcará
    // como inválida. Si necesitas aumentar `max_allowed_packet`, hazlo en el
    // servidor MySQL o ejecuta una consulta `SET GLOBAL max_allowed_packet=...`
    // tras conectarte. Mantener solo opciones soportadas por el driver:
    connectTimeout: 10000, // 10 segundos de timeout para conexión
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
    evict: 5000, // Verificar conexiones cada 5 segundos
    maxUses: 1000, // Reciclar conexiones después de 1000 usos
  },
  retry: {
    max: 3,
    match: [
      /ETIMEDOUT/,
      /ECONNRESET/,
      /ENOTFOUND/,
      /ENETUNREACH/,
      /EAI_AGAIN/,
    ],
  },
  timezone: '-06:00', // Ajustar según tu zona horaria
});

// Función para probar la conexión con reintentos
export const connectDatabase = async (retries: number = 3): Promise<void> => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await sequelize.authenticate();
      console.log('✅ Conexión a base de datos establecida correctamente');
      return;
    } catch (error: any) {
      lastError = error;
      console.error(`❌ Intento ${attempt}/${retries} falló al conectar a la base de datos:`, {
        message: error.message,
        code: error.code || error.original?.code,
        errno: error.errno || error.original?.errno,
      });
      
      if (attempt < retries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        console.log(`⏳ Reintentando en ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  // Si todos los intentos fallan, lanzar el último error
  throw new Error(`No se pudo conectar a la base de datos después de ${retries} intentos: ${lastError.message}`);
};

// Manejador de errores de conexión perdida
// Algunos adaptadores de pool no exponen un EventEmitter con 'on'.
// Protegemos la consulta para evitar excepciones en tiempo de ejecución en entornos
// donde la implementación del pool no tenga el método 'on'.
try {
  const pool: any = (sequelize as any).connectionManager?.pool;
  if (pool && typeof pool.on === 'function') {
    pool.on('error', (err: Error) => {
      console.error('⚠️ Error en el pool de conexiones:', {
        message: err.message,
        name: err.name,
        timestamp: new Date().toISOString(),
      });
    });
  } else {
    // En algunos drivers (por ejemplo en ciertas versiones de mysql2), el pool
    // no expone 'on' y registrar el manejador no es posible. Informamos con
    // un mensaje de depuración para facilitar troubleshooting.
    console.debug('ℹ️ El pool de conexiones no expone el método "on" — saltando manejador de eventos');
  }
} catch (err) {
  // Para evitar que la aplicación falle por un error en la detección del pool,
  // capturamos cualquier excepción y la registramos.
  console.warn('⚠️ No fue posible registrar manejador de eventos en el pool de conexiones:', (err as Error).message || err);
}

export default sequelize;