import { Router, Request, Response } from 'express';
import os from 'os';
import { QueryTypes } from 'sequelize';
import sequelize from '../config/database';

const router = Router();

// Health check básico (rápido)
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check detallado
router.get('/health/detailed', async (req: Request, res: Response) => {
  const healthcheck = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    service: {
      name: 'uttecam-api',
      version: process.env.npm_package_version || '2.0.0-secure'
    },
    system: {
      platform: os.platform(),
      arch: os.arch(),
      nodeVersion: process.version,
      cpus: os.cpus().length,
      memory: {
        total: Math.round(os.totalmem() / 1024 / 1024),
        free: Math.round(os.freemem() / 1024 / 1024),
        used: Math.round((os.totalmem() - os.freemem()) / 1024 / 1024),
        usagePercent: Math.round(((os.totalmem() - os.freemem()) / os.totalmem()) * 100)
      },
      process: {
        memoryUsage: {
          rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
          heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
          heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          external: Math.round(process.memoryUsage().external / 1024 / 1024)
        },
        cpuUsage: process.cpuUsage()
      }
    },
    checks: {
      database: { status: 'unknown', responseTime: 0 } as any,
      filesystem: { status: 'unknown', writable: false } as any
    }
  };

  // Check de base de datos
  try {
    const startTime = Date.now();
    await sequelize.query('SELECT 1', { type: QueryTypes.SELECT });
    const responseTime = Date.now() - startTime;
    
    healthcheck.checks.database = {
      status: 'ok',
      responseTime
    };
  } catch (error) {
    healthcheck.status = 'degraded';
    healthcheck.checks.database = {
      status: 'error',
      responseTime: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }

  // Check de filesystem
  try {
    const fs = require('fs');
    const testFile = './logs/.healthcheck';
    
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
    
    healthcheck.checks.filesystem = {
      status: 'ok',
      writable: true
    };
  } catch (error) {
    healthcheck.status = 'degraded';
    healthcheck.checks.filesystem = {
      status: 'error',
      writable: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }

  // Determinar código de respuesta
  const statusCode = healthcheck.status === 'ok' ? 200 : 503;
  
  res.status(statusCode).json(healthcheck);
});

// Readiness probe (para Kubernetes/Docker)
router.get('/ready', async (req: Request, res: Response) => {
  try {
    // Verificar que la base de datos esté lista
    await sequelize.query('SELECT 1', { type: QueryTypes.SELECT });
    
    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Liveness probe (para Kubernetes/Docker)
router.get('/live', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString()
  });
});

// Metrics endpoint (Prometheus compatible)
router.get('/metrics', (req: Request, res: Response) => {
  const metrics = `# HELP uttecam_api_uptime_seconds Application uptime in seconds
# TYPE uttecam_api_uptime_seconds gauge
uttecam_api_uptime_seconds ${process.uptime()}

# HELP uttecam_api_memory_usage_bytes Memory usage in bytes
# TYPE uttecam_api_memory_usage_bytes gauge
uttecam_api_memory_usage_bytes{type="rss"} ${process.memoryUsage().rss}
uttecam_api_memory_usage_bytes{type="heap_total"} ${process.memoryUsage().heapTotal}
uttecam_api_memory_usage_bytes{type="heap_used"} ${process.memoryUsage().heapUsed}
uttecam_api_memory_usage_bytes{type="external"} ${process.memoryUsage().external}

# HELP uttecam_api_cpu_usage_microseconds CPU usage in microseconds
# TYPE uttecam_api_cpu_usage_microseconds counter
uttecam_api_cpu_usage_microseconds{type="user"} ${process.cpuUsage().user}
uttecam_api_cpu_usage_microseconds{type="system"} ${process.cpuUsage().system}

# HELP uttecam_api_system_memory_bytes System memory in bytes
# TYPE uttecam_api_system_memory_bytes gauge
uttecam_api_system_memory_bytes{type="total"} ${os.totalmem()}
uttecam_api_system_memory_bytes{type="free"} ${os.freemem()}
`;

  res.set('Content-Type', 'text/plain');
  res.send(metrics);
});

export default router;
