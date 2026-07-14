import { Router } from "express";
import { body, param, query } from "express-validator";
import { CarreraSimpleController } from "../controllers/carreras-simples/CarreraSimpleController";
import { handleValidationErrors } from "../middleware/validation";
import { authenticateToken } from "../middleware/auth";

const router = Router();
const controller = new CarreraSimpleController();

/**
 * Validaciones
 */
const validateCreate = [
  body("nombre")
    .trim()
    .notEmpty().withMessage("El nombre de la carrera es requerido.")
    .isLength({ max: 200 }).withMessage("El nombre no puede exceder 200 caracteres."),

  body("tipo")
    .notEmpty().withMessage("El tipo de carrera es requerido.")
    .isIn(['TSU', 'INGENIERIA', 'LICENCIATURA', 'MAESTRIA', 'DOCTORADO', 'OTRO'])
    .withMessage("El tipo debe ser: TSU, INGENIERIA, LICENCIATURA, MAESTRIA, DOCTORADO u OTRO."),

  body("activo")
    .optional()
    .isBoolean().withMessage("El campo activo debe ser booleano."),

  handleValidationErrors
];

const validateUpdate = [
  param("id")
    .trim()
    .notEmpty().withMessage("El ID es requerido."),

  body("nombre")
    .optional()
    .trim()
    .notEmpty().withMessage("El nombre no puede estar vacío.")
    .isLength({ max: 200 }).withMessage("El nombre no puede exceder 200 caracteres."),

  body("tipo")
    .optional()
    .isIn(['TSU', 'INGENIERIA', 'LICENCIATURA', 'MAESTRIA', 'DOCTORADO', 'OTRO'])
    .withMessage("El tipo debe ser: TSU, INGENIERIA, LICENCIATURA, MAESTRIA, DOCTORADO u OTRO."),

  body("activo")
    .optional()
    .isBoolean().withMessage("El campo activo debe ser booleano."),

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

/**
 * Rutas
 */

// POST - Crear carrera (protegida)
router.post("/", authenticateToken, validateCreate, controller.create.bind(controller));

// GET - Obtener todas las carreras (pública)
// Query: ?activas=true (opcional)
router.get("/", validateQueryActivas, controller.getAll.bind(controller));

// GET - Obtener carreras agrupadas por tipo (pública)
// Query: ?activas=true (opcional)
router.get("/grouped", validateQueryActivas, controller.getAllGrouped.bind(controller));

// GET - Obtener solo nombres de carreras (pública)
// Query: ?activas=true (opcional, default: true)
router.get("/nombres", validateQueryActivas, controller.getNombres.bind(controller));

// GET - Obtener carrera por ID (pública)
router.get("/:id", validateId, controller.getById.bind(controller));

// PUT - Actualizar carrera (protegida)
router.put("/:id", authenticateToken, validateUpdate, controller.update.bind(controller));

// DELETE - Eliminar carrera (protegida)
router.delete("/:id", authenticateToken, validateId, controller.delete.bind(controller));

export default router;
