import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';

// Configuración de Winston para logs de seguridad
const securityLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'uttecam-api-security' },
  transports: [
    // Logs de seguridad en archivo rotativo
    new DailyRotateFile({
      filename: 'logs/security-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
      level: 'info'
    }),
    
    // Logs de errores críticos
    new DailyRotateFile({
      filename: 'logs/security-error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
      level: 'error'
    })
  ]
});

// En desarrollo, también mostrar en consola
if (process.env.NODE_ENV !== 'production') {
  securityLogger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Logger general para requests HTTP
const httpLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'uttecam-api-http' },
  transports: [
    new DailyRotateFile({
      filename: 'logs/access-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d'
    })
  ]
});

// Middleware para logging de eventos de seguridad
export const logSecurityEvent = (
  event: string,
  level: 'info' | 'warn' | 'error' = 'info',
  metadata: any = {}
) => {
  securityLogger.log(level, event, {
    timestamp: new Date().toISOString(),
    ...metadata
  });
};

// Middleware para logging de intentos de autenticación
export const logAuthAttempt = (req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send;
  
  res.send = function(data) {
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    const endpoint = req.originalUrl;
    
    if (endpoint.includes('/auth/') || endpoint.includes('/login')) {
      const isSuccess = res.statusCode < 400;
      
      logSecurityEvent(
        isSuccess ? 'Authentication Success' : 'Authentication Failed',
        isSuccess ? 'info' : 'warn',
        {
          ip,
          userAgent,
          endpoint,
          statusCode: res.statusCode,
          method: req.method,
          body: req.body ? Object.keys(req.body) : undefined // Solo las claves, no los valores
        }
      );
    }
    
    return originalSend.call(this, data);
  };
  
  next();
};

// Middleware para logging de operaciones críticas
export const logCriticalOperation = (operation: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      const ip = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('User-Agent');
      const user = req.user ? req.user.username : 'anonymous';
      
      logSecurityEvent(
        `Critical Operation: ${operation}`,
        'info',
        {
          operation,
          user,
          ip,
          userAgent,
          endpoint: req.originalUrl,
          method: req.method,
          statusCode: res.statusCode,
          resourceId: req.params.id
        }
      );
      
      return originalSend.call(this, data);
    };
    
    next();
  };
};

// Middleware para logging de intentos de acceso no autorizado
export const logUnauthorizedAccess = (req: Request, res: Response, next: NextFunction) => {
  const originalStatus = res.status;
  
  res.status = function(code) {
    if (code === 401 || code === 403) {
      const ip = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('User-Agent');
      const user = req.user ? req.user.username : 'anonymous';
      
      logSecurityEvent(
        'Unauthorized Access Attempt',
        'warn',
        {
          statusCode: code,
          user,
          ip,
          userAgent,
          endpoint: req.originalUrl,
          method: req.method,
          headers: {
            authorization: req.headers.authorization ? 'present' : 'missing',
            contentType: req.headers['content-type']
          }
        }
      );
    }
    
    return originalStatus.call(this, code);
  };
  
  next();
};

// Middleware para logging de uploads de archivos
export const logFileUpload = (req: Request, res: Response, next: NextFunction) => {
  if (req.file || req.files) {
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    const user = req.user ? req.user.username : 'anonymous';
    
    logSecurityEvent(
      'File Upload',
      'info',
      {
        user,
        ip,
        userAgent,
        endpoint: req.originalUrl,
        fileName: req.file ? req.file.originalname : 'multiple',
        fileSize: req.file ? req.file.size : 'unknown',
        mimeType: req.file ? req.file.mimetype : 'unknown'
      }
    );
  }
  
  next();
};

// Middleware para detectar patrones de ataque
export const detectAttackPatterns = (req: Request, res: Response, next: NextFunction) => {
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /vbscript:/i,
    /onload=/i,
    /onerror=/i,
    /union.*select/i,
    /drop.*table/i,
    /insert.*into/i,
    /update.*set/i,
    /delete.*from/i,
    /'.*or.*'.*='/i,
    /\.\.\//i,
    /%2e%2e%2f/i,
    /etc\/passwd/i,
    /windows\/system32/i
  ];
  
  const requestData = JSON.stringify({
    url: req.originalUrl,
    query: req.query,
    body: req.body,
    headers: req.headers
  });
  
  const detectedPatterns = suspiciousPatterns.filter(pattern => 
    pattern.test(requestData)
  );
  
  if (detectedPatterns.length > 0) {
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    
    logSecurityEvent(
      'Potential Attack Detected',
      'error',
      {
        ip,
        userAgent,
        endpoint: req.originalUrl,
        method: req.method,
        attackPatterns: detectedPatterns.length,
        requestData: process.env.NODE_ENV === 'development' ? requestData : 'redacted'
      }
    );
    
    // En producción, podríamos bloquear la request
    if (process.env.NODE_ENV === 'production') {
      return res.status(400).json({
        error: 'Request bloqueada',
        message: 'Patrón de ataque detectado'
      });
    }
  }
  
  next();
};

// Morgan middleware personalizado para logs HTTP
export const httpLogging = morgan('combined', {
  stream: {
    write: (message: string) => {
      httpLogger.info(message.trim());
    }
  }
});

// Función para obtener estadísticas de logs
export const getSecurityStats = async () => {
  try {
    // En una implementación real, esto leería de los archivos de log
    // Por ahora retornamos datos de ejemplo
    return {
      lastHour: {
        authAttempts: 45,
        failedAuth: 3,
        suspiciousActivity: 1,
        fileUploads: 12
      },
      last24Hours: {
        authAttempts: 1200,
        failedAuth: 25,
        suspiciousActivity: 8,
        fileUploads: 150
      }
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logSecurityEvent('Error getting security stats', 'error', { error: errorMessage });
    return null;
  }
};

export { securityLogger, httpLogger };