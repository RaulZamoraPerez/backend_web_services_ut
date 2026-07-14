import { Router } from 'express';
import * as anuncioController from '../controllers/anuncioController';
import { uploadAnuncios, saveAnuncioFile } from '../middleware/uploadMiddleware';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Rutas públicas
router.get('/', anuncioController.getAnuncios);
router.get('/activo', anuncioController.getAnuncioActivo);

// Rutas protegidas (requieren autenticación)
router.post(
  '/',
  authenticateToken,
  uploadAnuncios,
  saveAnuncioFile,
  anuncioController.createAnuncio
);

router.put(
  '/:id',
  authenticateToken,
  uploadAnuncios,
  saveAnuncioFile,
  anuncioController.updateAnuncio
);

router.delete(
  '/:id',
  authenticateToken,
  anuncioController.deleteAnuncio
);

export default router;
