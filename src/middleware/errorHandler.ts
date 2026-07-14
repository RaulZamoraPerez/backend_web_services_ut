import { Request, Response, NextFunction } from 'express';
import type multer from 'multer';

export function notFound(req: Request, res: Response) {
  res.status(404).json({ error: 'Ruta no encontrada' });
}

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  console.error('[ERROR]', err);
  // Multer specific handling
  if (err && (err as multer.MulterError)?.code) {
    const mErr = err as multer.MulterError;
    if (mErr.code === 'LIMIT_FILE_SIZE') {
      const maxMb = process.env.HERO_SLIDE_MAX_FILE_SIZE_MB || '200';
      return res.status(413).json({ error: 'File too large', message: `El archivo supera el tamaño máximo permitido de ${maxMb}MB`, code: mErr.code });
    }
    if (mErr.code === 'LIMIT_FIELD_COUNT') {
      const fieldCount = (req as any)._fieldCount;
      const extra = process.env.NODE_ENV !== 'production' && typeof fieldCount === 'number' ? { receivedFields: fieldCount } : undefined;
      return res.status(400).json({ error: 'Too many form fields', message: 'Reduce the number of form fields or increase the server limit', ...extra });
    }
    if (mErr.code === 'LIMIT_FIELD_VALUE') {
      const fieldname = (mErr as any).field;
      const fieldCount = (req as any)._fieldCount;
      const extra = process.env.NODE_ENV !== 'production' ? { receivedFields: fieldCount, field: fieldname } : undefined;
      return res.status(400).json({ error: 'Field value too long', message: `Field '${fieldname}' value exceeds the server limit (increase fieldSize or reduce content)`, ...extra });
    }
    // Generic multer error
    return res.status(400).json({ error: 'File upload error', message: mErr.message, code: mErr.code });
  }
  
  // Error de conexión a la base de datos
  if (err.code === 'ECONNREFUSED' || err.code === 'ER_ACCESS_DENIED_ERROR' || err.errno) {
    return res.status(503).json({ 
      error: 'Servicio no disponible',
      mensaje: 'Error de conexión a la base de datos. Verifica la configuración.',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
  
  // Error genérico
  res.status(500).json({ 
    error: 'Error interno del servidor',
    detalle: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
}