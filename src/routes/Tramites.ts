import { Router } from "express";
import TramitesController from "../controllers/tramites/TramitesController";
import { body } from "express-validator";
import { handleValidationErrors } from "../middleware/validation";


export default class TramitesRoute {

  static get routes() {

    const router = Router();
    const controller = new TramitesController();

    // POST - Crear o actualizar vista de trámites
    router.post('/tramites',
      body('titulo')
        .isString().withMessage('El título debe ser una cadena de texto.')
        .notEmpty().withMessage('El título es requerido.')
        .isLength({ min: 5, max: 100 }).withMessage('El título debe tener entre 5 y 100 caracteres.'),
      body('subtitulo')
        .isString().withMessage('El subtítulo debe ser una cadena de texto.')
        .notEmpty().withMessage('El subtítulo es requerido.')
        .isLength({ min: 5, max: 500 }).withMessage('El subtítulo debe tener entre 5 y 500 caracteres.'),
      handleValidationErrors,
      controller.createTramite
    );

    // GET - Obtener vista de trámites
    router.get('/tramites', controller.getTramite);

    // PUT - Actualizar vista de trámites por ID
    router.put('/tramites/:id',
      body('titulo')
        .optional()
        .isString().withMessage('El título debe ser una cadena de texto.')
        .isLength({ min: 5, max: 100 }).withMessage('El título debe tener entre 5 y 100 caracteres.'),
      body('subtitulo')
        .optional()
        .isString().withMessage('El subtítulo debe ser una cadena de texto.')
        .isLength({ min: 5, max: 500 }).withMessage('El subtítulo debe tener entre 5 y 500 caracteres.'),
      handleValidationErrors,
      controller.updateTramite
    );

    // DELETE - Eliminar vista de trámites por ID
    router.delete('/tramites/:id', controller.deleteTramite);

    return router;
  }
}