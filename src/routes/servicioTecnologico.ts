import { Router } from 'express';
import * as servicioController from '../controllers/servicioTecnologicoController';
import { getTitulo, updateTitulo } from '../controllers/ServiciosTecnologicosTituloController';
import { uploadServiciosTecnologicos, saveServiciosTecnologicosFiles } from '../middleware/uploadMiddleware';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Rutas públicas
router.get('/', servicioController.getServiciosPublic);
router.get('/titulo', getTitulo);

// Rutas protegidas (requieren autenticación)
router.get('/admin/all', authenticateToken, servicioController.getAllServicios);
router.put('/titulo', authenticateToken, updateTitulo);
router.get('/:id', authenticateToken, servicioController.getServicioById);

router.post(
  '/',
  authenticateToken,
  uploadServiciosTecnologicos,
  saveServiciosTecnologicosFiles,
  servicioController.createServicio
);

router.put(
  '/:id',
  authenticateToken,
  uploadServiciosTecnologicos,
  saveServiciosTecnologicosFiles,
  servicioController.updateServicio
);

router.delete(
  '/:id',
  authenticateToken,
  servicioController.deleteServicio
);

export default router;
