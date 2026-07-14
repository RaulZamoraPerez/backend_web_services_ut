import { Router } from 'express';

import * as controller from '../../controllers/normatividadController';

import { authenticateToken } from '../../middleware/auth';
import { uploadNormatividad, validateUploadedNormatividad, validateUploadedNormatividadOptional } from '../../middleware/normatividadUpload';

const router = Router();

// Public
router.get('/', controller.getAll);

// Protected - categories
router.post('/categories', authenticateToken, controller.createCategory);
router.put('/categories/:id', authenticateToken, controller.updateCategory);
router.delete('/categories/:id', authenticateToken, controller.deleteCategory);

// Protected - documents
router.post('/categories/:categoriaId/documents', authenticateToken, controller.createDocument);
// Upload a document file and create the DB record
router.post('/categories/:categoriaId/documents/upload', authenticateToken, uploadNormatividad.single('archivo'), validateUploadedNormatividad, controller.createDocument);

// Update document (metadata and/or file)
router.put('/documents/:id', authenticateToken, uploadNormatividad.single('archivo'), validateUploadedNormatividadOptional, controller.updateDocument);

router.delete('/documents/:id', authenticateToken, controller.deleteDocument);

export default router;
