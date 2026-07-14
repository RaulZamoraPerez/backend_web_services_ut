import { Router } from 'express';
import * as sitemapController from '../controllers/sitemapController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Rutas públicas
router.get('/', sitemapController.getSitemap);

// Rutas privadas (administración)
router.get('/admin', authenticateToken, sitemapController.getAdminSitemap);
router.post('/', authenticateToken, sitemapController.createCategory);
router.put('/:id', authenticateToken, sitemapController.updateCategory);
router.delete('/:id', authenticateToken, sitemapController.deleteCategory);

export default router;
