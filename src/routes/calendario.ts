import { Router } from 'express';
import {
  getAllCalendarios,
  getCalendarioById,
  createCalendario,
  updateCalendario,
  deleteCalendario
} from '../controllers/calendarioController';
import { uploadCalendarios, saveCalendarioFile } from '../middleware/uploadMiddleware';

// Middleware de seguridad
import { authenticateToken } from '../middleware/auth';
import { validateId, handleValidationErrors } from '../middleware/validation';
import { body } from 'express-validator';

const router = Router();

// Validación para calendario
const validateCalendario = [
  body('titulo')
    .trim()
    .notEmpty()
    .withMessage('El título es requerido')
    .isLength({ min: 1, max: 255 })
    .withMessage('El título debe tener entre 1 y 255 caracteres'),
  body('descripcion')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('La descripción no puede exceder 1000 caracteres')
];

// Rutas públicas (solo lectura)
router.get('/', getAllCalendarios);
router.get('/:id', validateId, handleValidationErrors, getCalendarioById);

// Rutas protegidas (requieren autenticación)
router.post('/', authenticateToken, uploadCalendarios.single('archivo'), saveCalendarioFile, validateCalendario, handleValidationErrors, createCalendario);
router.put('/:id', authenticateToken, validateId, uploadCalendarios.single('archivo'), saveCalendarioFile, validateCalendario, handleValidationErrors, updateCalendario);
router.delete('/:id', authenticateToken, validateId, handleValidationErrors, deleteCalendario);

export default router;