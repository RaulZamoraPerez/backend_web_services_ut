import { Router } from 'express';
import * as controller from '../controllers/practicasEstadiasBannerController';
import { uploadPracticasEstadiasBanner, validateUploadedFile } from '../middleware/uploadMiddleware';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Ruta pública (para que el sitio web público pueda acceder sin token)
router.get('/', controller.getBanners);

// Rutas protegidas (requieren autenticación por token)
router.post(
  '/',
  authenticateToken,
  uploadPracticasEstadiasBanner.single('imagen'),
  validateUploadedFile,
  controller.createBanner
);

router.put(
  '/:id',
  authenticateToken,
  uploadPracticasEstadiasBanner.single('imagen'),
  validateUploadedFile,
  controller.updateBanner
);

router.delete(
  '/:id',
  authenticateToken,
  controller.deleteBanner
);

export default router;
