import { Router } from 'express';
import {
  getVideoInstitucional,
  getAllVideosInstitucionales,
  createVideoInstitucional,
  updateVideoInstitucional,
  deleteVideoInstitucional,
} from '../controllers/videoInstitucionalController';

const router = Router();

// Rutas para video institucional
router.get('/activo', getVideoInstitucional);
router.get('/', getAllVideosInstitucionales);
router.post('/', createVideoInstitucional);
router.put('/:id', updateVideoInstitucional);
router.delete('/:id', deleteVideoInstitucional);

export default router;