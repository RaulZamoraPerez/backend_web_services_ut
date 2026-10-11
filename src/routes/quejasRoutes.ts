import { Router } from 'express';
import {
  getQuejasConfig,
  updateQuejasConfig,
  submitQueja,
  getQuejasList,
  updateQuejaStatus,
  deleteQueja,
} from '../controllers/quejasController';
import { uploadQuejaEvidencia, uploadQuejaAvisoPdf, handleQuejaUploadError } from '../middleware/uploadMiddleware';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Configuración del correo receptor y buzón
router.get('/config', getQuejasConfig);
router.put(
  '/config',
  authenticateToken,
  uploadQuejaAvisoPdf.single('aviso_privacidad_pdf'),
  handleQuejaUploadError,
  updateQuejasConfig
);

// Envío público de queja o sugerencia con archivo adjunto
router.post(
  '/',
  uploadQuejaEvidencia.single('evidencia'),
  handleQuejaUploadError,
  submitQueja
);

// Gestión en el panel administrativo del Dashboard
router.get('/list', authenticateToken, getQuejasList);
router.put('/:id', authenticateToken, updateQuejaStatus);
router.delete('/:id', authenticateToken, deleteQueja);

export default router;
