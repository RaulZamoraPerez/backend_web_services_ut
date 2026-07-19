import { Router } from 'express';
import {
  register,
  login,
  getProfile,
  changePassword,
  listUsers,
  updateUser,
  deleteUser,
  confirmAccount,
  forgotPassword,
  resetPassword
} from '../controllers/authController';
import {
  authenticateToken,
  requireAdmin,
  requireEditor
} from '../middleware/auth';
import {
  authRateLimit,
  strictRateLimit,
  registerRateLimit
} from '../middleware/rateLimiter';
import {
  logAuthAttempt,
  logCriticalOperation
} from '../middleware/logging';
import {
  validateId,
  handleValidationErrors
} from '../middleware/validation';
import { body } from 'express-validator';

const router = Router();

// Validaciones para registro
const validateRegister = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('El nombre de usuario debe tener entre 3 y 50 caracteres')
    .isAlphanumeric()
    .withMessage('El nombre de usuario solo puede contener letras y números'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Debe ser un email válido')
    .isLength({ max: 150 })
    .withMessage('El email no puede exceder 150 caracteres')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).*$/)
    .withMessage('La contraseña debe contener al menos: 1 minúscula, 1 mayúscula, 1 número y 1 carácter especial'),
  
  body('role')
    .optional()
    .isIn(['admin', 'editor', 'viewer', 'admin_pro', 'admin pro', 'servicios_escolares', 'servicios escolares', 'normal'])
    .withMessage('El rol no es válido'),
  
  handleValidationErrors
];

// Validaciones para login
const validateLogin = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('El nombre de usuario o email es requerido'),
  
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida'),
  
  handleValidationErrors
];

// Validaciones para cambio de contraseña
const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('La contraseña actual es requerida'),
  
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('La nueva contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).*$/)
    .withMessage('La nueva contraseña debe contener al menos: 1 minúscula, 1 mayúscula, 1 número y 1 carácter especial'),
  
  handleValidationErrors
];

// Validaciones para actualización de usuario
const validateUserUpdate = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('El nombre de usuario debe tener entre 3 y 50 caracteres')
    .isAlphanumeric()
    .withMessage('El nombre de usuario solo puede contener letras y números'),
  
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),
  
  body('role')
    .optional()
    .isIn(['admin', 'editor', 'viewer', 'admin_pro', 'admin pro', 'servicios_escolares', 'servicios escolares', 'normal'])
    .withMessage('El rol no es válido'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive debe ser true o false'),
  
  handleValidationErrors
];

const validateConfirmAccount = [
  body('token')
    .notEmpty()
    .withMessage('El token es requerido'),
  handleValidationErrors
];

const validateForgotPassword = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),
  handleValidationErrors
];

const validateResetPassword = [
  body('token')
    .notEmpty()
    .withMessage('El token es requerido'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('La nueva contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).*$/)
    .withMessage('La nueva contraseña debe contener al menos: 1 minúscula, 1 mayúscula, 1 número y 1 carácter especial'),
  handleValidationErrors
];

// Rutas públicas
router.post('/register', 
  registerRateLimit,
  logAuthAttempt,
  logCriticalOperation('User Registration'),
  validateRegister,
  register
);

router.post('/login',
  authRateLimit,
  logAuthAttempt,
  validateLogin,
  login
);

router.post('/confirm-account',
  authRateLimit,
  validateConfirmAccount,
  confirmAccount
);

router.post('/forgot-password',
  authRateLimit,
  validateForgotPassword,
  forgotPassword
);

router.post('/reset-password',
  authRateLimit,
  validateResetPassword,
  resetPassword
);

// Rutas protegidas
router.get('/profile',
  authenticateToken,
  getProfile
);

router.post('/change-password',
  authenticateToken,
  strictRateLimit,
  logCriticalOperation('Password Change'),
  validatePasswordChange,
  changePassword
);

// Rutas de administración (solo admins)
router.get('/users',
  authenticateToken,
  requireAdmin,
  listUsers
);

router.put('/users/:id',
  authenticateToken,
  requireAdmin,
  strictRateLimit,
  logCriticalOperation('User Update'),
  validateId,
  validateUserUpdate,
  updateUser
);

router.delete('/users/:id',
  authenticateToken,
  requireAdmin,
  strictRateLimit,
  logCriticalOperation('User Deletion'),
  validateId,
  deleteUser
);

export default router;