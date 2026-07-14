import { Router } from 'express';
import * as controller from '../controllers/servicioTecnologicoRealizadoController';
import { uploadServiciosTecnologicosRealizados, saveServiciosTecnologicosRealizadosFiles } from '../middleware/uploadMiddleware';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Rutas públicas
router.get('/', controller.getServiciosRealizadosPublic);

// Rutas protegidas (requieren autenticación)
router.get('/admin/all', authenticateToken, controller.getAllServiciosRealizados);
router.get('/:id', authenticateToken, controller.getServicioRealizadoById);

router.post(
  '/',
  authenticateToken,
  uploadServiciosTecnologicosRealizados,
  saveServiciosTecnologicosRealizadosFiles,
  controller.createServicioRealizado
);

router.put(
  '/:id',
  authenticateToken,
  uploadServiciosTecnologicosRealizados,
  saveServiciosTecnologicosRealizadosFiles,
  controller.updateServicioRealizado
);

router.delete(
  '/:id',
  authenticateToken,
  controller.deleteServicioRealizado
);

export default router;
