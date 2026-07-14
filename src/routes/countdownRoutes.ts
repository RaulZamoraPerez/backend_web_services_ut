import { Router } from 'express';
import { getCountdown, updateCountdown, deleteCountdown } from '../controllers/countdownController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Endpoint público para obtener la cuenta regresiva activa
router.get('/', getCountdown);

// Endpoint protegido para actualizar la cuenta regresiva desde el dashboard
router.put('/', authenticateToken, updateCountdown);

// Endpoint protegido para eliminar la cuenta regresiva desde el dashboard
router.delete('/', authenticateToken, deleteCountdown);

export default router;
