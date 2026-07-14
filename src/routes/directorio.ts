import { Router } from 'express';
import {
  getAllDirectorios,
  getDirectorioById,
  createDirectorio,
  updateDirectorio,
  deleteDirectorio,
  updateOrder
} from '../controllers/directorioControler';
import { uploadDirectorios } from '../middleware/uploadMiddleware';

// Middleware de seguridad
import { authenticateToken } from '../middleware/auth';
import { validateDirectorio, validateId, handleValidationErrors } from '../middleware/validation';

const router = Router();

// Rutas públicas (solo lectura)
router.get('/', getAllDirectorios);
router.get('/:id', validateId, handleValidationErrors, getDirectorioById);

// Rutas protegidas (requieren autenticación)
router.put('/orden', authenticateToken, updateOrder);
router.post('/', authenticateToken, uploadDirectorios.single('imagen'), validateDirectorio, handleValidationErrors, createDirectorio);
router.put('/:id', authenticateToken, validateId, uploadDirectorios.single('imagen'), validateDirectorio, handleValidationErrors, updateDirectorio);
router.delete('/:id', authenticateToken, validateId, handleValidationErrors, deleteDirectorio);

// Ruta de sincronización para desarrollo (sin auth)
// TODO: Agregar autenticación en producción
if (process.env.NODE_ENV !== 'production') {
  router.post('/sync', uploadDirectorios.single('imagen'), createDirectorio);
}

export default router;