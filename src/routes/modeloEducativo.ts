import { Router } from 'express';
import { getModeloEducativo, updateModeloEducativo } from '../controllers/modeloEducativoController';
import { uploadBecaFile, validateUploadedFile } from '../middleware/uploadMiddleware';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', getModeloEducativo);
router.put('/:id', authenticateToken, uploadBecaFile('modelo-educativo'), updateModeloEducativo);

export default router;
