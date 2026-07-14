import { Router } from 'express';
import { getDocuments, uploadDocument, updateDocument, deleteDocument } from '../controllers/servicioSocialController';
import { uploadEstadias, validateUploadedEstadia } from '../middleware/uploadMiddleware';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Reusing uploadEstadias middleware as it likely handles PDF uploads to a general or specific folder.
// If a specific folder is needed, we might need to create a new multer config, but usually 'uploads/documentos' is fine.
// Assuming uploadEstadias saves to 'uploads/documentos' or similar which is appropriate for this too.

// Public routes
router.get('/', getDocuments);

// Protected routes
router.post('/', authenticateToken, requireAdmin, uploadEstadias.single('archivo'), validateUploadedEstadia, uploadDocument);
router.put('/:id', authenticateToken, requireAdmin, updateDocument);
router.delete('/:id', authenticateToken, requireAdmin, deleteDocument);

export default router;
