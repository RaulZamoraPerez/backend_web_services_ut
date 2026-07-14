import express from 'express';
import {
  getCarreras,
  getAllCarreras,
  getCarrerasByNivel,
  getCarreraById,
  createCarrera,
  updateCarrera,
  deleteCarrera,
  updateOrder,
  getCarreraConfig,
  updateCarreraConfig,
} from '../controllers/carreraController';
import { authenticateToken } from '../middleware/authMiddleware';
import { uploadCarrera, saveCarreraFiles } from '../middleware/uploadMiddleware';

// Debug middleware: log number of form fields received to help diagnose "Too many fields" errors
function logFormFieldCount(req: any, _res: any, next: any) {
  try {
    const fieldsCount = req.body ? Object.keys(req.body).length : 0;
    console.log(`[UPLOAD] /api/carreras form field count: ${fieldsCount}`);
  } catch (e) {
    console.warn('[UPLOAD] Could not count form fields:', e);
  }
  return next();
}

const router = express.Router();

// Rutas públicas
router.get('/', getCarreras);
router.get('/nivel/:nivel', getCarrerasByNivel);
router.get('/config', getCarreraConfig);
router.get('/:id', getCarreraById);

// Rutas protegidas (requieren autenticación)
router.put('/config', authenticateToken, updateCarreraConfig);
router.get('/admin/all', authenticateToken, getAllCarreras);
router.put('/order', authenticateToken, updateOrder); // Nueva ruta para ordenar
router.post('/', authenticateToken, uploadCarrera, logFormFieldCount, saveCarreraFiles, createCarrera);
router.put('/:id', authenticateToken, uploadCarrera, logFormFieldCount, saveCarreraFiles, updateCarrera);
router.delete('/:id', authenticateToken, deleteCarrera);

export default router;
