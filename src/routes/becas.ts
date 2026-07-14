import { Router } from 'express';
import * as becasController from '../controllers/becasController';
import { authenticateToken } from '../middleware/authMiddleware';
import { uploadBecas, validateUploadedDocument, uploadBanner } from '../middleware/uploadMiddleware';

const router = Router();

// ============================================
// SECTIONS ROUTES
// ============================================

// Public routes
router.get('/sections', becasController.getAllSections);
router.get('/sections/:id', becasController.getSection);

// Protected routes (require authentication)
router.post('/sections', authenticateToken, becasController.createSection);
router.put('/sections/reorder', authenticateToken, becasController.reorderSections);
router.put('/sections/:id', authenticateToken, becasController.updateSection);
router.delete('/sections/:id', authenticateToken, becasController.deleteSection);

// ============================================
// DOCUMENTS ROUTES (OBSOLETE)
// ============================================

// Upload banner image (protected)
router.post(
    '/upload-image',
    authenticateToken,
    uploadBanner,
    becasController.uploadBannerImage
);

// Upload generic file (PDF/Image) for banner
router.post(
    '/upload-file',
    authenticateToken,
    uploadBanner,
    becasController.uploadBannerImage
);

export default router;
