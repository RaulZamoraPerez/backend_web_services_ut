import { Router } from 'express';
import {
  getRelojDigital,
  getAllRelojesDigitales,
  createRelojDigital,
  updateRelojDigital,
  deleteRelojDigital,
} from '../controllers/relojDigitalController';

const router = Router();

// Rutas para reloj digital
router.get('/activo', getRelojDigital);
router.get('/', getAllRelojesDigitales);
router.post('/', createRelojDigital);
router.put('/:id', updateRelojDigital);
router.delete('/:id', deleteRelojDigital);

export default router;