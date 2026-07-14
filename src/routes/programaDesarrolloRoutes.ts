import { Router } from 'express';
import { uploadDocumentos, validateUploadedDocument, validateUploadedDocumentOptional } from '../middleware/uploadMiddleware';
import {
    getProgramas,
    getProgramaById,
    createPrograma,
    updatePrograma,
    deletePrograma,
    createCategory,
    updateCategory,
    deleteCategory
} from '../controllers/programaDesarrolloController';

const router = Router();

router.get('/', getProgramas);

// Category Routes
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

router.get('/:id', getProgramaById);
router.post('/', uploadDocumentos.single('archivo'), validateUploadedDocument, createPrograma);
router.put('/:id', uploadDocumentos.single('archivo'), validateUploadedDocumentOptional, updatePrograma);
router.delete('/:id', deletePrograma);


export default router;
