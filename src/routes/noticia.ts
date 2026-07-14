import { Router } from 'express';
import * as noticiaController from '../controllers/noticiaController';
import { uploadNoticias, saveNoticiaFile } from '../middleware/uploadMiddleware';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Rutas públicas
router.get('/', noticiaController.getNoticias);
router.get('/config', noticiaController.getNoticiaConfig);

// Rutas protegidas (requieren autenticación)
router.put('/config', authenticateToken, noticiaController.updateNoticiaConfig);
router.post(
  '/',
  authenticateToken,
  uploadNoticias,
  saveNoticiaFile,
  noticiaController.createNoticia
);

router.put(
  '/:id',
  authenticateToken,
  uploadNoticias,
  saveNoticiaFile,
  noticiaController.updateNoticia
);

router.delete(
  '/:id',
  authenticateToken,
  noticiaController.deleteNoticia
);

export default router;
