import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getTipos,
  createTipo,
  updateTipo,
  deleteTipo
} from '../controllers/miembroSniiTipoController';

const router = Router();

router.get('/', getTipos);
router.post('/', authenticateToken, createTipo);
router.put('/:id', authenticateToken, updateTipo);
router.delete('/:id', authenticateToken, deleteTipo);

export default router;
