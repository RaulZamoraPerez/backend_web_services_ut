import { Router } from 'express';
import {
  getAllResources,
  createResource,
  deleteResource,
  updateResource
} from '../controllers/seminarioCafeController';
import { authenticateToken } from '../middleware/auth';
import { uploadSeminarioCafe, saveSeminarioCafeFiles } from '../middleware/uploadMiddleware';

const router = Router();

// Rutas públicas
router.get('/', getAllResources);

// Rutas protegidas
router.post('/', authenticateToken, uploadSeminarioCafe, saveSeminarioCafeFiles, createResource);
router.put('/:id', authenticateToken, updateResource);
router.delete('/:id', authenticateToken, deleteResource);

export default router;
