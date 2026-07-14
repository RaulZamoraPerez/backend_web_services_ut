import { Router } from 'express';
import * as heroSlideController from '../controllers/heroSlideController';
import { uploadHeroSlides, saveHeroSlideFile } from '../middleware/uploadMiddleware';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Rutas públicas
router.get('/', heroSlideController.getHeroSlides);

// Rutas protegidas (requieren autenticación)
router.post(
  '/',
  authenticateToken,
  uploadHeroSlides,
  saveHeroSlideFile,
  heroSlideController.createHeroSlide
);

router.put(
  '/:id',
  authenticateToken,
  uploadHeroSlides,
  saveHeroSlideFile,
  heroSlideController.updateHeroSlide
);

router.delete(
  '/:id',
  authenticateToken,
  heroSlideController.deleteHeroSlide
);

export default router;
