import { Router } from 'express';
import {
  getFooterConfig,
  updateFooterConfig,
  listPatrocinadores,
  createPatrocinador,
  updatePatrocinador,
  deletePatrocinador
} from '../controllers/footerController';
import { authenticateToken } from '../middleware/auth';
import { uploadPatrocinador, savePatrocinadorFile } from '../middleware/uploadMiddleware';

const router = Router();

// --- RUTAS DE FOOTER CONFIG ---
router.get('/config', getFooterConfig);
router.put('/config', authenticateToken, updateFooterConfig);

// --- RUTAS DE PATROCINADORES ---
router.get('/patrocinadores', listPatrocinadores);
router.post('/patrocinadores', authenticateToken, uploadPatrocinador, savePatrocinadorFile, createPatrocinador);
router.put('/patrocinadores/:id', authenticateToken, uploadPatrocinador, savePatrocinadorFile, updatePatrocinador);
router.delete('/patrocinadores/:id', authenticateToken, deletePatrocinador);

export default router;
