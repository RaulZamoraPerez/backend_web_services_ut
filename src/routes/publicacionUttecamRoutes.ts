import { Router } from 'express';
import {
  getPublicaciones,
  getPublicacionesAdmin,
  getPublicacionById,
  createPublicacion,
  updatePublicacion,
  deletePublicacion,
  incrementarVista,
  incrementarDescarga,
  calificarPublicacion,
  togglePermitirDescarga,
} from '../controllers/publicacionUttecamController';
import {
  uploadPublicacionesUttecam,
  savePublicacionesFiles,
} from '../middleware/uploadMiddleware';

const router = Router();

// Rutas públicas
router.get('/', getPublicaciones);
router.get('/admin', getPublicacionesAdmin);
router.get('/:id', getPublicacionById);
router.post('/:id/incrementar-vista', incrementarVista);
router.post('/:id/incrementar-descarga', incrementarDescarga);
router.post('/:id/calificar', calificarPublicacion);

// Rutas de administración
router.post('/', uploadPublicacionesUttecam, savePublicacionesFiles, createPublicacion);
router.put('/:id', uploadPublicacionesUttecam, savePublicacionesFiles, updatePublicacion);
router.patch('/:id/toggle-descarga', togglePermitirDescarga);
router.delete('/:id', deletePublicacion);

export default router;
