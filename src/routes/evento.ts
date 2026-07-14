import { Router } from 'express';
import * as eventoController from '../controllers/eventoController';
import { authenticateToken } from '../middleware/authMiddleware';
import { uploadMiddleware, validateUploadedFile } from '../middleware/uploadMiddleware';

const router = Router();

// Rutas públicas
router.get('/', eventoController.getEventos);
router.get('/activo', eventoController.getEventoActivo);

// Rutas protegidas (requieren autenticación)
router.post(
  '/',
  authenticateToken,
  uploadMiddleware.single('imagen_fondo'),
  validateUploadedFile,
  eventoController.createEvento
);

router.put(
  '/:id',
  authenticateToken,
  uploadMiddleware.single('imagen_fondo'),
  validateUploadedFile,
  eventoController.updateEvento
);

router.delete(
  '/:id',
  authenticateToken,
  eventoController.deleteEvento
);

export default router;
