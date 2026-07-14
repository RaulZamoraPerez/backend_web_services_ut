import { Router } from 'express';
import { getDocuments, uploadDocument, updateDocument, deleteDocument } from '../controllers/estadiaController';
import { uploadEstadias, validateUploadedEstadia } from '../middleware/uploadMiddleware';
import { authenticateToken, requireAdmin } from '../middleware/auth'; // Assuming these exist

const router = Router();

// Public routes
router.get('/', getDocuments);

// Protected routes
router.post('/', authenticateToken, requireAdmin, uploadEstadias.single('archivo'), validateUploadedEstadia, uploadDocument);
router.put('/:id', authenticateToken, requireAdmin, updateDocument);
router.delete('/:id', authenticateToken, requireAdmin, deleteDocument);

export default router;
