import helmet from 'helmet';
import { Request, Response, NextFunction } from 'express';

// Configuración completa de headers de seguridad
export const securityHeaders = helmet({
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'", "http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    },
  },
  
  // Cross Origin Embedder Policy
  crossOriginEmbedderPolicy: false, // Para permitir uploads
  
  // DNS Prefetch Control
  dnsPrefetchControl: { allow: false },
  
  // Frameguard - previene clickjacking
  frameguard: { action: 'deny' },
  
  // Hide X-Powered-By header
  hidePoweredBy: true,
  
  // HTTP Strict Transport Security
  hsts: {
    maxAge: 31536000, // 1 año
    includeSubDomains: true,
    preload: true
  },
  
  // IE No Open
  ieNoOpen: true,
  
  // No Sniff
  noSniff: true,
  
  // Origin Agent Cluster
  originAgentCluster: true,
  
  // Permissions Policy
  permittedCrossDomainPolicies: false,
  
  // Referrer Policy
  referrerPolicy: { policy: ["no-referrer", "same-origin"] },
  
  // X-XSS-Protection
  xssFilter: true,
});

// Middleware personalizado para headers adicionales de seguridad
export const additionalSecurityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Prevenir MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Prevenir clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Política de referrer
  res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');
  
  // Feature Policy / Permissions Policy
  res.setHeader('Permissions-Policy', 
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );
  
  // Cache Control para endpoints sensibles
  if (req.path.includes('/admin') || req.path.includes('/auth')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  
  // Cross-Origin Resource Policy - Permitir cross-origin para archivos estáticos
  if (req.path.startsWith('/uploads')) {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  } else {
    res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  }
  
  // Cross-Origin Opener Policy
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  
  next();
};

// Middleware para validar Content-Type en requests con body
export const validateContentType = (req: Request, res: Response, next: NextFunction) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.get('Content-Type');
    
    // Permitir multipart/form-data para uploads
    if (contentType?.startsWith('multipart/form-data')) {
      return next();
    }
    
    // Requerir application/json para otros casos
    if (!contentType?.startsWith('application/json')) {
      return res.status(400).json({
        error: 'Content-Type inválido',
        message: 'Se requiere application/json o multipart/form-data',
        received: contentType || 'none'
      });
    }
  }
  
  next();
};