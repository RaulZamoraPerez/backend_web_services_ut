import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Middleware para manejar errores de validación
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.type === 'field' ? (error as any).path : 'unknown',
      message: error.msg,
      value: error.type === 'field' ? (error as any).value : undefined
    }));

    return res.status(400).json({
      error: 'Error de validación',
      message: 'Los datos enviados no son válidos',
      details: formattedErrors
    });
  }
  
  next();
};

// Validaciones para textos
export const validateTexto = [
  body('contenido')
    .trim()
    .notEmpty()
    .withMessage('El contenido es requerido')
    .isLength({ min: 1, max: 5000 })
    .withMessage('El contenido debe tener entre 1 y 5000 caracteres')
    .escape(), // Escapar caracteres HTML para prevenir XSS
  handleValidationErrors
];

// Validaciones para directorios
export const validateDirectorio = [
  body('titulo')
    .trim()
    .notEmpty()
    .withMessage('El título es requerido')
    .isLength({ min: 1, max: 150 })
    .withMessage('El título debe tener entre 1 y 150 caracteres')
    .escape(),
  
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 1, max: 150 })
    .withMessage('El nombre debe tener entre 1 y 150 caracteres')
    .escape(),
  
  body('telefono')
    .optional()
    .trim()
    .matches(/^[0-9+\-\s()]*$/)
    .withMessage('El teléfono solo puede contener números y símbolos telefónicos')
    .isLength({ max: 20 })
    .withMessage('El teléfono no puede exceder 20 caracteres'),
  
  body('extension')
    .optional()
    .trim()
    .isNumeric()
    .withMessage('La extensión debe ser numérica')
    .isLength({ max: 10 })
    .withMessage('La extensión no puede exceder 10 dígitos'),
  
  body('correo')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Debe ser un correo electrónico válido')
    .isLength({ max: 150 })
    .withMessage('El correo no puede exceder 150 caracteres')
    .normalizeEmail(), // Normalizar email
  
  handleValidationErrors
];

// Validaciones para contenido nosotros
export const validateNosotros = [
  body('tipo')
    .trim()
    .notEmpty()
    .withMessage('El tipo es requerido')
    .isLength({ min: 1, max: 50 })
    .withMessage('El tipo debe tener entre 1 y 50 caracteres')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('El tipo solo puede contener letras, números, guiones y guiones bajos')
    .escape(),
  
  body('titulo')
    .trim()
    .notEmpty()
    .withMessage('El título es requerido')
    .isLength({ min: 1, max: 200 })
    .withMessage('El título debe tener entre 1 y 200 caracteres')
    .escape(),
  
  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 10000 })
    .withMessage('La descripción no puede exceder 10000 caracteres')
    .escape(),
  
  body('lista')
    .optional()
    .custom((value) => {
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            return true;
          }
        } catch (error) {
          throw new Error('La lista debe ser un JSON válido');
        }
      }
      return true;
    }),
  
  handleValidationErrors
];

// Validaciones para parámetros ID
export const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID debe ser un número entero positivo')
    .toInt(),
  handleValidationErrors
];

// Validaciones para tipo en nosotros
export const validateTipo = [
  param('tipo')
    .trim()
    .notEmpty()
    .withMessage('El tipo es requerido')
    .isLength({ min: 1, max: 50 })
    .withMessage('El tipo debe tener entre 1 y 50 caracteres')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('El tipo solo puede contener letras, números, guiones y guiones bajos')
    .escape(),
  handleValidationErrors
];

// Validaciones para paginación
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número entero positivo')
    .toInt(),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser entre 1 y 100')
    .toInt(),
  
  query('search')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('La búsqueda no puede exceder 200 caracteres')
    .escape(),
  
  handleValidationErrors
];

// Sanitizador general para prevenir ataques
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Limpiar recursivamente todos los strings en el body
  const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
      return obj.trim();
    }
    
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }
    
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          sanitized[key] = sanitizeObject(obj[key]);
        }
      }
      return sanitized;
    }
    
    return obj;
  };
  
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  
  next();
};