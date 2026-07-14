import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import {
  listarTipos,
  obtenerTipo,
  crearTipo,
  actualizarTipo,
  eliminarTipo,
  reordenarTipos,
} from '../controllers/tipoEstadiaController';

const router = Router();

// Rutas públicas
router.get('/', listarTipos);
router.get('/:id', obtenerTipo);

// Rutas protegidas (requieren autenticación)
router.post('/', authenticateToken, requireAdmin, crearTipo);
router.put('/:id', authenticateToken, requireAdmin, actualizarTipo);
router.delete('/:id', authenticateToken, requireAdmin, eliminarTipo);
router.post('/reordenar', authenticateToken, requireAdmin, reordenarTipos);

export default router;
