import { Router } from 'express';
import {
  getAllSolicitudes,
  getSolicitudById,
  getSolicitudByMatricula,
  crearSolicitud,
  actualizarEstadoSolicitud,
  eliminarSolicitud,
  getEstadisticasSolicitudes,
  buscarSolicitudes
} from '../controllers/solicitudConstanciaController';

// Middleware de seguridad
import { authenticateToken, requireAdmin, requireEditor } from '../middleware/auth';
import { validateId, handleValidationErrors } from '../middleware/validation';
import { authRateLimit, apiRateLimit } from '../middleware/rateLimiter';
import { logCriticalOperation } from '../middleware/logging';
import { body, query, param } from 'express-validator';

const router = Router();

// ============= VALIDACIONES =============

// Validación para crear solicitud
const validateSolicitudCreacion = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 255 })
    .withMessage('El nombre debe tener entre 2 y 255 caracteres')
    .matches(/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios'),

  body('matricula')
    .trim()
    .notEmpty()
    .withMessage('La matrícula es requerida')
    .isLength({ min: 8, max: 8 })
    .withMessage('La matrícula debe tener exactamente 8 caracteres')
    .isAlphanumeric()
    .withMessage('La matrícula solo puede contener letras y números'),

  body('correo')
    .trim()
    .notEmpty()
    .withMessage('El correo es requerido')
    .isEmail()
    .withMessage('Debe ser un correo electrónico válido')
    .normalizeEmail(),

  body('telefono')
    .trim()
    .notEmpty()
    .withMessage('El teléfono es requerido')
    .isLength({ min: 10, max: 10 })
    .withMessage('El teléfono debe tener exactamente 10 dígitos')
    .isNumeric()
    .withMessage('El teléfono solo puede contener números'),

  body('carrera')
    .trim()
    .notEmpty()
    .withMessage('La carrera es requerida')
    .isLength({ min: 3, max: 255 })
    .withMessage('La carrera debe tener entre 3 y 255 caracteres'),

  body('nivel')
    .notEmpty()
    .withMessage('El nivel es requerido')
    .isIn(['TSU', 'LIC'])
    .withMessage('El nivel debe ser TSU o LIC'),

  body('tipo_entrega')
    .notEmpty()
    .withMessage('El tipo de entrega es requerido')
    .isIn(['presencial', 'electronico'])
    .withMessage('El tipo de entrega debe ser presencial o electronico'),

  body('documentos_solicitados')
    .isArray({ min: 1 })
    .withMessage('Debe seleccionar al menos un documento')
    .custom((value) => {
      const validDocs = ['Constancia de Estudios', 'Constancia de trámite de título', 'Kardex'];
      const invalidDocs = value.filter((doc: string) => !validDocs.includes(doc));
      if (invalidDocs.length > 0) {
        throw new Error(`Documentos no válidos: ${invalidDocs.join(', ')}`);
      }
      return true;
    }),

  body('observaciones')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Las observaciones no pueden exceder 1000 caracteres'),

  handleValidationErrors
];

// Validación para actualizar estado
const validateActualizacionEstado = [
  body('estado')
    .optional()
    .isIn(['pendiente', 'en_proceso', 'completado', 'cancelado'])
    .withMessage('El estado debe ser: pendiente, en_proceso, completado o cancelado'),

  body('observaciones')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Las observaciones no pueden exceder 1000 caracteres'),

  body('fecha_entrega')
    .optional()
    .isISO8601()
    .withMessage('La fecha de entrega debe tener formato válido (YYYY-MM-DD)')
    .toDate(),

  handleValidationErrors
];

// Validación para búsqueda
const validateBusqueda = [
  query('termino')
    .notEmpty()
    .withMessage('El término de búsqueda es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El término debe tener entre 2 y 100 caracteres'),

  query('campo')
    .optional()
    .isIn(['nombre', 'matricula', 'correo', 'carrera', 'todos'])
    .withMessage('Campo de búsqueda no válido'),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número entero mayor a 0'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un número entre 1 y 100'),

  handleValidationErrors
];

// Validación para consulta por matrícula
const validateMatricula = [
  param('matricula')
    .trim()
    .isLength({ min: 8, max: 8 })
    .withMessage('La matrícula debe tener exactamente 8 caracteres')
    .isAlphanumeric()
    .withMessage('La matrícula solo puede contener letras y números'),

  handleValidationErrors
];

// Validación para filtros de consulta
const validateFiltros = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número entero mayor a 0'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un número entre 1 y 100'),

  query('estado')
    .optional()
    .isIn(['pendiente', 'en_proceso', 'completado', 'cancelado'])
    .withMessage('Estado no válido'),

  query('nivel')
    .optional()
    .isIn(['TSU', 'LIC'])
    .withMessage('Nivel no válido'),

  query('tipo_entrega')
    .optional()
    .isIn(['presencial', 'electronico'])
    .withMessage('Tipo de entrega no válido'),

  query('fecha_desde')
    .optional()
    .isISO8601()
    .withMessage('La fecha desde debe tener formato válido (YYYY-MM-DD)')
    .toDate(),

  query('fecha_hasta')
    .optional()
    .isISO8601()
    .withMessage('La fecha hasta debe tener formato válido (YYYY-MM-DD)')
    .toDate(),

  handleValidationErrors
];

// ============= RUTAS PÚBLICAS =============

// Crear nueva solicitud (público con rate limit)
router.post('/',
  apiRateLimit,
  logCriticalOperation('Solicitud de Constancia'),
  validateSolicitudCreacion,
  crearSolicitud
);

// Consultar solicitudes por matrícula (público con rate limit)
router.get('/matricula/:matricula',
  apiRateLimit,
  validateMatricula,
  getSolicitudByMatricula
);

// ============= RUTAS PROTEGIDAS (ADMIN/EDITOR) =============

// Obtener todas las solicitudes con filtros (requiere autenticación)
router.get('/',
  authenticateToken,
  requireEditor,
  validateFiltros,
  getAllSolicitudes
);

// Buscar solicitudes (requiere autenticación)
router.get('/buscar',
  authenticateToken,
  requireEditor,
  validateBusqueda,
  buscarSolicitudes
);

// Obtener estadísticas (requiere autenticación)
router.get('/estadisticas',
  authenticateToken,
  requireEditor,
  getEstadisticasSolicitudes
);

// Obtener solicitud por ID (requiere autenticación)
router.get('/:id',
  authenticateToken,
  requireEditor,
  validateId,
  handleValidationErrors,
  getSolicitudById
);

// Actualizar estado de solicitud (requiere autenticación de editor)
router.put('/:id/estado',
  authenticateToken,
  requireEditor,
  authRateLimit,
  logCriticalOperation('Actualización Estado Solicitud'),
  validateId,
  validateActualizacionEstado,
  actualizarEstadoSolicitud
);

// ============= RUTAS PROTEGIDAS (SOLO ADMIN) =============

// Eliminar solicitud (solo administradores)
router.delete('/:id',
  authenticateToken,
  requireAdmin,
  authRateLimit,
  logCriticalOperation('Eliminación de Solicitud'),
  validateId,
  handleValidationErrors,
  eliminarSolicitud
);

export default router;