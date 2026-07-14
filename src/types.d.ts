import { Request } from 'express';

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