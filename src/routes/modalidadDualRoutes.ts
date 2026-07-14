import { Router } from 'express';
import { getConfig, updateConfig } from '../controllers/modalidadDualController';
import { authenticateToken } from '../middleware/auth';
import { uploadModalidadDual, saveModalidadDualFile } from '../middleware/uploadMiddleware';

const router = Router();

router.get('/', getConfig);
router.put('/', authenticateToken, uploadModalidadDual, saveModalidadDualFile, updateConfig);

export default router;
