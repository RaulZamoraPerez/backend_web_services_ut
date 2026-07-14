import { Router, Request, Response, NextFunction } from "express";
import { body, param, query } from "express-validator";
import { OpcionReinscripcionController } from "../controllers/opciones-reinscripcion/OpcionReinscripcionController";
import { handleValidationErrors } from "../middleware/validation";
import { authenticateToken } from "../middleware/auth";
import fileUpload from "express-fileupload";

const router = Router();
const controller = new OpcionReinscripcionController();

/**
 * Middleware para validar que se reciba el archivo PDF
 */
const validateFileUpload = (req: Request, res: Response, next: NextFunction) => {
  const files = req.files as any;

  if (!files || !files.archivo) {
    res.status(400).json({
      error: "El archivo PDF es requerido."
    });
    return;
  }

  // Validar que sea PDF
  const archivo = files.archivo;
  const allowedMimeTypes = ['application/pdf'];

  if (!allowedMimeTypes.includes(archivo.mimetype)) {
    res.status(400).json({
      error: "El archivo debe ser un PDF válido."
    });
    return;
  }

  // Validar tamaño (10MB)
  const maxSize = 10 * 1024 * 1024;
  if (archivo.size > maxSize) {
    res.status(400).json({
      error: "El archivo no puede superar los 10MB."
    });
    return;
  }

  next();
};

/**
 * Validaciones
 */
const validateCreateOrUpdate = [
  body("titulo")
    .trim()
    .notEmpty().withMessage("El título es requerido.")
    .isLength({ max: 300 }).withMessage("El título no puede exceder 300 caracteres."),

  body("subtitulo")
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage("El subtítulo no puede exceder 500 caracteres."),

  body("activo")
    .optional()
    .isBoolean().withMessage("El campo activo debe ser booleano."),

  body("id")
    .optional()
    .trim()
    .notEmpty().withMessage("El ID no puede estar vacío si se proporciona."),

  handleValidationErrors
];

const validateSeccion = [
  body("titulo")
    .trim()
    .notEmpty().withMessage("El título es requerido.")
    .isLength({ max: 300 }).withMessage("El título no puede exceder 300 caracteres."),

  body("subtitulo")
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage("El subtítulo no puede exceder 500 caracteres."),

  body("periodo")
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage("El periodo no puede exceder 300 caracteres."),

  body("fechas")
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage("Las fechas no pueden exceder 300 caracteres."),

  body("sistema")
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage("El sistema no puede exceder 300 caracteres."),

  handleValidationErrors
];

const validateId = [
  param("id")
    .trim()
    .notEmpty().withMessage("El ID es requerido."),

  handleValidationErrors
];

const validateQueryActivas = [
  query("activas")
    .optional()
    .isIn(['true', 'false'])
    .withMessage("El parámetro activas debe ser 'true' o 'false'."),

  handleValidationErrors
];

const validateToggleActivo = [
  param("id")
    .trim()
    .notEmpty().withMessage("El ID es requerido."),

  body("activo")
    .isBoolean().withMessage("El campo activo debe ser booleano."),

  handleValidationErrors
];

/**
 * Rutas
 */

// === RUTAS PARA LA SECCIÓN (Título y Subtítulo principal) ===

// POST - Crear o actualizar sección (protegida con fileUpload para el instructivo)
router.post("/seccion",
  authenticateToken,
  fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    abortOnLimit: true,
    preserveExtension: 4,
  }),
  validateSeccion,
  controller.createOrUpdateSeccion.bind(controller)
);

// GET - Obtener sección (pública)
router.get("/seccion", controller.getSeccion.bind(controller));

// GET - Descargar archivo del instructivo de la sección (pública)
// Debe ir ANTES de /:id para evitar conflictos
router.get("/seccion/instructivo", controller.downloadInstructivo.bind(controller));

// === RUTAS PARA LAS OPCIONES (Cards) ===

// POST - Crear o actualizar opción/card (protegida)
// Orden: autenticación → fileUpload → validar archivo → validar campos → controller
router.post("/",
  authenticateToken,
  fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    abortOnLimit: true,
    preserveExtension: 4,
  }),
  validateFileUpload,
  validateCreateOrUpdate,
  controller.createOrUpdate.bind(controller)
);

// GET - Obtener todas las opciones/cards (pública)
// Query: ?activas=true (opcional)
router.get("/", validateQueryActivas, controller.getAll.bind(controller));

// GET - Obtener opción por ID (pública)
router.get("/:id", validateId, controller.getById.bind(controller));

// GET - Descargar archivo de opción (pública)
router.get("/:id/download", validateId, controller.downloadFile.bind(controller));

// PATCH - Cambiar estado activo de una opción (protegida)
router.patch("/:id/toggle-activo", authenticateToken, validateToggleActivo, controller.toggleActivo.bind(controller));

// DELETE - Eliminar opción/card (protegida)
router.delete("/:id", authenticateToken, validateId, controller.delete.bind(controller));

export default router;
