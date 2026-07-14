import { Router } from "express";
import { body, param } from "express-validator";
import { PersonalCarreraController } from "../controllers/personal-carreras/PersonalCarreraController";
import { handleValidationErrors } from "../middleware/validation";
import { authenticateToken } from "../middleware/auth";

const router = Router();
const controller = new PersonalCarreraController();

/**
 * Validaciones
 */
const validateCreate = [
  body("nombre")
    .trim()
    .notEmpty().withMessage("El nombre es requerido.")
    .isLength({ max: 200 }).withMessage("El nombre no puede exceder 200 caracteres."),

  body("correo")
    .trim()
    .notEmpty().withMessage("El correo es requerido.")
    .isEmail().withMessage("El correo debe ser válido.")
    .isLength({ max: 200 }).withMessage("El correo no puede exceder 200 caracteres."),

  body("carreras")
    .isArray({ min: 1 }).withMessage("Debe asignar al menos una carrera.")
    .custom((carreras) => {
      if (!carreras.every((c: any) => typeof c === 'string' && c.trim() !== '')) {
        throw new Error("Todas las carreras deben ser texto válido.");
      }
      return true;
    }),

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

  body("correo")
    .optional()
    .trim()
    .notEmpty().withMessage("El correo no puede estar vacío.")
    .isEmail().withMessage("El correo debe ser válido.")
    .isLength({ max: 200 }).withMessage("El correo no puede exceder 200 caracteres."),

  body("carreras")
    .optional()
    .isArray({ min: 1 }).withMessage("Debe asignar al menos una carrera.")
    .custom((carreras) => {
      if (!carreras.every((c: any) => typeof c === 'string' && c.trim() !== '')) {
        throw new Error("Todas las carreras deben ser texto válido.");
      }
      return true;
    }),

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

/**
 * Rutas
 */
// POST - Crear personal (protegida)
router.post("/", authenticateToken, validateCreate, controller.create.bind(controller));

// GET - Obtener todo el personal (pública)
router.get("/", controller.getAll.bind(controller));

// GET - Obtener personal por ID (pública)
router.get("/:id", validateId, controller.getById.bind(controller));

// PUT - Actualizar personal (protegida)
router.put("/:id", authenticateToken, validateUpdate, controller.update.bind(controller));

// DELETE - Eliminar personal (protegida)
router.delete("/:id", authenticateToken, validateId, controller.delete.bind(controller));

export default router;
