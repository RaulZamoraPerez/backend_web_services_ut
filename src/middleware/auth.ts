import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';

// Extender Request para incluir usuario
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
        role: string;
      };
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Interfaz para el payload del JWT
interface JWTPayload {
  id: number;
  username: string;
  role: string;
}

// Generar token JWT
export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET);
};

// Verificar token JWT
export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

// Middleware de autenticación
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({
      error: 'Token de acceso requerido',
      message: 'Debe proporcionar un token válido en el header Authorization'
    });
  }

  const decoded = verifyToken(token);
  
  if (!decoded) {
    return res.status(403).json({
      error: 'Token inválido',
      message: 'El token proporcionado no es válido o ha expirado'
    });
  }

  req.user = decoded;
  next();
};

// Middleware de autorización por roles
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Usuario no autenticado',
        message: 'Debe estar autenticado para acceder a este recurso'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Permisos insuficientes',
        message: `Se requiere uno de los siguientes roles: ${roles.join(', ')}`,
        userRole: req.user.role
      });
    }

    next();
  };
};

// Middleware para verificar si es admin
export const requireAdmin = requireRole(['admin']);

// Middleware para verificar si es admin o editor
export const requireEditor = requireRole(['admin', 'editor']);

// Hash de contraseña
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12; // Aumentado para mayor seguridad
  return await bcrypt.hash(password, saltRounds);
};

// Verificar contraseña
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

// Middleware opcional de autenticación (no requiere token)
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      req.user = decoded;
    }
  }

  next();
};

// Middleware para verificar propiedad del recurso
export const requireOwnership = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Usuario no autenticado',
      message: 'Debe estar autenticado para acceder a este recurso'
    });
  }

  // Los admins pueden acceder a todo
  if (req.user.role === 'admin') {
    return next();
  }

  // Para otros roles, verificar si el recurso les pertenece
  // Esto se puede personalizar según el modelo de datos
  const resourceUserId = req.params.userId || req.body.userId;
  
  if (resourceUserId && parseInt(resourceUserId) !== req.user.id) {
    return res.status(403).json({
      error: 'Acceso denegado',
      message: 'Solo puedes acceder a tus propios recursos'
    });
  }

  next();
};