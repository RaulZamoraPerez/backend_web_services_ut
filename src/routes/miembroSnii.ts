import { Router } from 'express';
import { getAllMiembros, createMiembro, updateMiembro, deleteMiembro } from '../controllers/miembroSniiController';
import { uploadMiembrosSnii, saveMiembrosSniiFiles } from '../middleware/uploadMiddleware';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getAllMiembros);
router.post('/', authenticateToken, uploadMiembrosSnii, saveMiembrosSniiFiles, createMiembro);
router.put('/:id', authenticateToken, uploadMiembrosSnii, saveMiembrosSniiFiles, updateMiembro);
router.delete('/:id', authenticateToken, deleteMiembro);

export default router;
