import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';

// Rate limiter general para la API
export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000, // límite de 100 requests por IP cada 15 minutos
  message: {
    error: 'Demasiadas peticiones desde esta IP',
    message: 'Intenta de nuevo en 15 minutos',
    retryAfter: '15 minutos'
  },
  standardHeaders: true, // Retorna rate limit info en headers `RateLimit-*`
  legacyHeaders: false, // Desactiva headers `X-RateLimit-*`
  handler: (req, res) => {
    res.status(429).json({
      error: 'Rate limit excedido',
      message: 'Demasiadas peticiones desde esta IP',
      retryAfter: '15 minutos'
    });
  }
});

// Rate limiter más estricto para operaciones de escritura
export const strictRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10, // límite de 10 requests por IP cada minuto
  message: {
    error: 'Demasiadas operaciones de escritura',
    message: 'Límite: 10 operaciones por minuto',
    retryAfter: '1 minuto'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiter para endpoints de autenticación
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // solo 5 intentos de login por IP cada 15 minutos
  message: {
    error: 'Demasiados intentos de autenticación',
    message: 'Máximo 5 intentos cada 15 minutos',
    retryAfter: '15 minutos'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // No contar requests exitosos
});

// Slow down middleware - ralentiza requests progresivamente
export const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutos
  delayAfter: 50, // permitir 50 requests sin delay
  delayMs: () => 500, // añadir 500ms de delay por request después del límite
  maxDelayMs: 20000, // delay máximo de 20 segundos
  message: {
    error: 'Ralentización aplicada',
    message: 'Demasiadas peticiones - velocidad reducida'
  },
  validate: { delayMs: false } // Deshabilitar advertencia de delayMs
});

// Rate limiter para uploads de archivos
export const uploadRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 20, // máximo 20 uploads por hora
  message: {
    error: 'Límite de uploads excedido',
    message: 'Máximo 20 archivos por hora',
    retryAfter: '1 hora'
  },
  standardHeaders: true,
  legacyHeaders: false
});