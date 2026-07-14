import { Router } from 'express';
import {
    getComites,
    createComite,
    updateComite,
    deleteComite,
    addDocumento,
    updateDocumento,
    deleteDocumento,
    getComiteBySlug,
    createCategory,
    updateCategory,
    deleteCategory
} from '../controllers/comiteController';
import { uploadDocumentos } from '../middleware/uploadMiddleware';

const router = Router();

// Comites CRUD
router.get('/', getComites);
router.get('/:slug', getComiteBySlug);
router.post('/', createComite);
router.put('/:id', updateComite);
router.delete('/:id', deleteComite);

// Category Routes
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Document Management
router.post('/documentos', uploadDocumentos.single('archivo'), addDocumento);
router.put('/documentos/:id', uploadDocumentos.single('archivo'), updateDocumento);
router.delete('/documentos/:id', deleteDocumento);


export default router;
