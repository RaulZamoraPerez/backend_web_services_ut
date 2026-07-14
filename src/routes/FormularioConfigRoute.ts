import { Router } from "express";
import { FormularioConfigController } from "../controllers/formularios-config/FormularioConfigController";
import { body, param } from "express-validator";
import { handleValidationErrors } from "../middleware/validation";

export class FormularioConfigRoute {

  static get routes() {
    const router = Router();
    const controller = new FormularioConfigController();

    // ==================== INFO PRINCIPAL ====================

    // POST - Crear información principal
    router.post('/:tipo/info',
      param('tipo')
        .notEmpty().withMessage('El tipo de formulario es requerido.')
        .isLength({ min: 3, max: 50 }).withMessage('El tipo debe tener entre 3 y 50 caracteres.'),
      body('titulo')
        .notEmpty().withMessage('El título es requerido.')
        .isLength({ min: 5, max: 200 }).withMessage('El título debe tener entre 5 y 200 caracteres.'),
      body('subtitulo')
        .notEmpty().withMessage('El subtítulo es requerido.')
        .isLength({ min: 5, max: 300 }).withMessage('El subtítulo debe tener entre 5 y 300 caracteres.'),
      body('descripcion')
        .optional()
        .isString().withMessage('La descripción debe ser una cadena de texto.'),
      body('tiempoEntrega')
        .notEmpty().withMessage('El tiempo de entrega es requerido.')
        .isLength({ min: 1, max: 100 }).withMessage('El tiempo de entrega debe tener entre 1 y 100 caracteres.'),
      body('costo')
        .optional()
        .isString().withMessage('El costo debe ser una cadena de texto.'),
      handleValidationErrors,
      controller.createInfo
    );

    // GET - Obtener información principal
    router.get('/:tipo/info',
      param('tipo').notEmpty().withMessage('El tipo de formulario es requerido.'),
      handleValidationErrors,
      controller.getInfo
    );

    // PUT - Actualizar información principal
    router.put('/:tipo/info',
      param('tipo').notEmpty().withMessage('El tipo de formulario es requerido.'),
      body('titulo')
        .optional()
        .isLength({ min: 5, max: 200 }).withMessage('El título debe tener entre 5 y 200 caracteres.'),
      body('subtitulo')
        .optional()
        .isLength({ min: 5, max: 300 }).withMessage('El subtítulo debe tener entre 5 y 300 caracteres.'),
      body('descripcion')
        .optional()
        .isString().withMessage('La descripción debe ser una cadena de texto.'),
      body('tiempoEntrega')
        .optional()
        .isLength({ min: 1, max: 100 }).withMessage('El tiempo de entrega debe tener entre 1 y 100 caracteres.'),
      body('costo')
        .optional()
        .isString().withMessage('El costo debe ser una cadena de texto.'),
      handleValidationErrors,
      controller.updateInfo
    );

    // DELETE - Eliminar configuración completa
    router.delete('/:tipo/info',
      param('tipo').notEmpty().withMessage('El tipo de formulario es requerido.'),
      handleValidationErrors,
      controller.deleteInfo
    );

    // ==================== REQUISITOS ====================

    // POST - Agregar requisito
    router.post('/:tipo/requisitos',
      param('tipo').notEmpty().withMessage('El tipo de formulario es requerido.'),
      body('item')
        .notEmpty().withMessage('El requisito es requerido.')
        .isString().withMessage('El requisito debe ser una cadena de texto.')
        .isLength({ min: 3, max: 500 }).withMessage('El requisito debe tener entre 3 y 500 caracteres.'),
      handleValidationErrors,
      controller.addRequisito
    );

    // GET - Obtener requisitos
    router.get('/:tipo/requisitos',
      param('tipo').notEmpty().withMessage('El tipo de formulario es requerido.'),
      handleValidationErrors,
      controller.getRequisitos
    );

    // PUT - Actualizar requisito por índice
    router.put('/:tipo/requisitos/:index',
      param('tipo').notEmpty().withMessage('El tipo de formulario es requerido.'),
      param('index').isInt({ min: 0 }).withMessage('El índice debe ser un número entero positivo.'),
      body('item')
        .notEmpty().withMessage('El requisito es requerido.')
        .isString().withMessage('El requisito debe ser una cadena de texto.')
        .isLength({ min: 3, max: 500 }).withMessage('El requisito debe tener entre 3 y 500 caracteres.'),
      handleValidationErrors,
      controller.updateRequisito
    );

    // DELETE - Eliminar requisito por índice
    router.delete('/:tipo/requisitos/:index',
      param('tipo').notEmpty().withMessage('El tipo de formulario es requerido.'),
      param('index').isInt({ min: 0 }).withMessage('El índice debe ser un número entero positivo.'),
      handleValidationErrors,
      controller.deleteRequisito
    );

    // ==================== PASOS ====================

    // POST - Agregar paso
    router.post('/:tipo/pasos',
      param('tipo').notEmpty().withMessage('El tipo de formulario es requerido.'),
      body('item')
        .notEmpty().withMessage('El paso es requerido.')
        .isString().withMessage('El paso debe ser una cadena de texto.')
        .isLength({ min: 3, max: 500 }).withMessage('El paso debe tener entre 3 y 500 caracteres.'),
      handleValidationErrors,
      controller.addPaso
    );

    // GET - Obtener pasos
    router.get('/:tipo/pasos',
      param('tipo').notEmpty().withMessage('El tipo de formulario es requerido.'),
      handleValidationErrors,
      controller.getPasos
    );

    // PUT - Actualizar paso por índice
    router.put('/:tipo/pasos/:index',
      param('tipo').notEmpty().withMessage('El tipo de formulario es requerido.'),
      param('index').isInt({ min: 0 }).withMessage('El índice debe ser un número entero positivo.'),
      body('item')
        .notEmpty().withMessage('El paso es requerido.')
        .isString().withMessage('El paso debe ser una cadena de texto.')
        .isLength({ min: 3, max: 500 }).withMessage('El paso debe tener entre 3 y 500 caracteres.'),
      handleValidationErrors,
      controller.updatePaso
    );

    // DELETE - Eliminar paso por índice
    router.delete('/:tipo/pasos/:index',
      param('tipo').notEmpty().withMessage('El tipo de formulario es requerido.'),
      param('index').isInt({ min: 0 }).withMessage('El índice debe ser un número entero positivo.'),
      handleValidationErrors,
      controller.deletePaso
    );

    // ==================== DOCUMENTOS ====================

    // POST - Agregar documento
    router.post('/:tipo/documentos',
      param('tipo').notEmpty().withMessage('El tipo de formulario es requerido.'),
      body('item')
        .notEmpty().withMessage('El documento es requerido.')
        .isString().withMessage('El documento debe ser una cadena de texto.')
        .isLength({ min: 3, max: 500 }).withMessage('El documento debe tener entre 3 y 500 caracteres.'),
      handleValidationErrors,
      controller.addDocumento
    );

    // GET - Obtener documentos
    router.get('/:tipo/documentos',
      param('tipo').notEmpty().withMessage('El tipo de formulario es requerido.'),
      handleValidationErrors,
      controller.getDocumentos
    );

    // PUT - Actualizar documento por índice
    router.put('/:tipo/documentos/:index',
      param('tipo').notEmpty().withMessage('El tipo de formulario es requerido.'),
      param('index').isInt({ min: 0 }).withMessage('El índice debe ser un número entero positivo.'),
      body('item')
        .notEmpty().withMessage('El documento es requerido.')
        .isString().withMessage('El documento debe ser una cadena de texto.')
        .isLength({ min: 3, max: 500 }).withMessage('El documento debe tener entre 3 y 500 caracteres.'),
      handleValidationErrors,
      controller.updateDocumento
    );

    // DELETE - Eliminar documento por índice
    router.delete('/:tipo/documentos/:index',
      param('tipo').notEmpty().withMessage('El tipo de formulario es requerido.'),
      param('index').isInt({ min: 0 }).withMessage('El índice debe ser un número entero positivo.'),
      handleValidationErrors,
      controller.deleteDocumento
    );

    return router;
  }
}
