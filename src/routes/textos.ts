import { Router } from 'express';
import {
  listarTextos,
  obtenerTexto,
  crearTexto,
  actualizarTexto,
  eliminarTexto,
  estadisticasTextos
} from '../controllers/textoController';

// Middleware de seguridad
import { authenticateToken } from '../middleware/auth';
import { validateTexto, validateId, handleValidationErrors } from '../middleware/validation';

const router = Router();

// Rutas públicas (solo lectura)
router.get('/', listarTextos);
router.get('/stats', estadisticasTextos);
router.get('/:id', obtenerTexto);

// Rutas protegidas (requieren autenticación)
router.post('/', authenticateToken, validateTexto, handleValidationErrors, crearTexto);
router.put('/:id', authenticateToken, validateId, validateTexto, handleValidationErrors, actualizarTexto);
router.delete('/:id', authenticateToken, validateId, handleValidationErrors, eliminarTexto);

export default router;