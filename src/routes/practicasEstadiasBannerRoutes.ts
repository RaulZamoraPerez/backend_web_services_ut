import { Router } from 'express';
import { getBanners, createBanner, updateBanner, deleteBanner } from '../controllers/practicasEstadiasBannerController';
import { getTitulo, updateTitulo } from '../controllers/PracticasEstadiasBannerTituloController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { uploadPracticasEstadiasImagen } from '../middleware/practicasEstadiasUpload';

const router = Router();

// Rutas públicas
router.get('/', getBanners);
router.get('/titulo', getTitulo);

// Rutas protegidas
router.put('/titulo', authenticateToken, requireAdmin, updateTitulo);
router.post('/', authenticateToken, requireAdmin, uploadPracticasEstadiasImagen, createBanner);
router.put('/:id', authenticateToken, requireAdmin, uploadPracticasEstadiasImagen, updateBanner);
router.delete('/:id', authenticateToken, requireAdmin, deleteBanner);

export default router;
