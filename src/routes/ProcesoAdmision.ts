import { NextFunction, Router, Request, Response } from "express";
import { ServiciosEscolaresController } from "../controllers/procesoAdmision/ServiciosEscolaresController";
import { body, validationResult } from "express-validator";
import fileUpload, { Options } from "express-fileupload";


export class ProcesoAdmisionRoute {

  static get routes() {
    const router = Router();
    const controller = new ServiciosEscolaresController();

    // Opciones para el middleware de subida de archivos
    const uploadOptions: Options = {
      useTempFiles: true,
      tempFileDir: "./temp_uploads",
      limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
      abortOnLimit: true,
      responseOnLimit: "El archivo excede el límite de 10 MB.",
      safeFileNames: true,
      preserveExtension: 4, // Preservar hasta 4 caracteres de extensión (.jpeg, .png)
      createParentPath: true
    };

    // Middleware para validar express-validator
    const validate = (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    };

    // Middleware para validar que se envíen archivos
    const validateFiles = (req: Request, res: Response, next: NextFunction) => {
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
          error: "No se enviaron archivos."
        });
      }
      next();
    };


    router.post('/proceso-admision',
      // 1. Parsear multipart/form-data
      fileUpload(uploadOptions),

      // 2. Validar campos del body
      body('titulo')
        .notEmpty().withMessage('El título es requerido.')
        .isString().withMessage('El título debe ser una cadena de texto.')
        .isLength({ min: 2, max: 150 }).withMessage('El título debe tener entre 2 y 150 caracteres.'),
      body('subtitulo')
        .notEmpty().withMessage('El subtítulo es requerido.')
        .isString().withMessage('El subtítulo debe ser una cadena de texto.')
        .isLength({ min: 2, max: 500 }).withMessage('El subtítulo debe tener entre 2 y 500 caracteres.'),
      body('pasos')
        .optional()
        .isString().withMessage('Los pasos deben enviarse como un string JSON.'),

      // 3. Validar errores de campos
      validate,

      // 4. Validar que se envíen archivos
      validateFiles,

      // 5. Controller
      controller.procesoAdmision
    );

    // GET - Obtener el último proceso de admisión
    router.get('/proceso-admision', controller.getProcesoAdmision);

    // PUT - Actualizar un proceso de admisión por ID
    router.put('/proceso-admision/:id',
      fileUpload(uploadOptions),

      body('titulo')
        .optional()
        .isString().withMessage('El título debe ser una cadena de texto.')
        .isLength({ min: 2, max: 150 }).withMessage('El título debe tener entre 2 y 150 caracteres.'),
      body('subtitulo')
        .optional()
        .isString().withMessage('El subtítulo debe ser una cadena de texto.')
        .isLength({ min: 2, max: 500 }).withMessage('El subtítulo debe tener entre 2 y 500 caracteres.'),
      body('pasos')
        .optional()
        .isString().withMessage('Los pasos deben enviarse como un string JSON.'),

      validate,
      controller.updateProcesoAdmision
    );

    // DELETE - Eliminar un proceso de admisión por ID
    router.delete('/proceso-admision/:id', controller.deleteProcesoAdmision);

    // ======================================
    // BANNER GLOBAL DE ADMISIÓN
    // ======================================
    
    router.get('/admision-banner', controller.getBanner);

    router.put('/admision-banner',
      fileUpload(uploadOptions),
      body('titulo').optional().isString(),
      body('subtitulo').optional().isString(),
      body('contactoLabel').optional().isString(),
      body('contactoDepartamento').optional().isString(),
      body('contactoTelefono').optional().isString(),
      validate,
      controller.updateBanner
    );

    // ======================================
    // ADMISIÓN A MAESTRÍA
    // ======================================

    router.post('/proceso-admision-maestria',
      fileUpload(uploadOptions),
      body('titulo')
        .notEmpty().withMessage('El título es requerido.')
        .isString().withMessage('El título debe ser una cadena de texto.')
        .isLength({ min: 2, max: 150 }).withMessage('El título debe tener entre 2 y 150 caracteres.'),
      body('subtitulo')
        .notEmpty().withMessage('El subtítulo es requerido.')
        .isString().withMessage('El subtítulo debe ser una cadena de texto.')
        .isLength({ min: 2, max: 500 }).withMessage('El subtítulo debe tener entre 2 y 500 caracteres.'),
      body('pasos')
        .optional()
        .isString().withMessage('Los pasos deben enviarse como un string JSON.'),
      validate,
      validateFiles,
      controller.procesoAdmisionMaestria
    );

    router.get('/proceso-admision-maestria', controller.getProcesoAdmisionMaestria);

    router.put('/proceso-admision-maestria/:id',
      fileUpload(uploadOptions),
      body('titulo')
        .optional()
        .isString().withMessage('El título debe ser una cadena de texto.')
        .isLength({ min: 2, max: 150 }).withMessage('El título debe tener entre 2 y 150 caracteres.'),
      body('subtitulo')
        .optional()
        .isString().withMessage('El subtítulo debe ser una cadena de texto.')
        .isLength({ min: 2, max: 500 }).withMessage('El subtítulo debe tener entre 2 y 500 caracteres.'),
      body('pasos')
        .optional()
        .isString().withMessage('Los pasos deben enviarse como un string JSON.'),
      validate,
      controller.updateProcesoAdmisionMaestria
    );

    router.delete('/proceso-admision-maestria/:id', controller.deleteProcesoAdmisionMaestria);

    router.get('/admision-banner-maestria', controller.getBannerMaestria);

    router.put('/admision-banner-maestria',
      fileUpload(uploadOptions),
      body('titulo').optional().isString(),
      body('subtitulo').optional().isString(),
      body('contactoLabel').optional().isString(),
      body('contactoDepartamento').optional().isString(),
      body('contactoTelefono').optional().isString(),
      validate,
      controller.updateBannerMaestria
    );

    return router;
  }
}