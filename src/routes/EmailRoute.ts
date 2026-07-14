import { NextFunction, Router, Request, Response } from "express";
import { EmailService } from "../controllers/email-service";
import { UploadController } from "../controllers/upload/UploadController";
import { UploadService } from "../controllers/upload/UploadService";
import fileUpload, { Options, UploadedFile } from "express-fileupload";
import { body, validationResult } from "express-validator";



export default class EmailRoute {
  constructor() {

  }



  static get routes(): Router {
    const router = Router();
    const emailService = EmailService.forTramites();
    const uploadService = new UploadService();
    const controller = new UploadController(uploadService, emailService);

    const uploadOptions: Options = {
      useTempFiles: true,
      tempFileDir: "./temp_uploads",  // carpeta temporal dentro del proyecto
      limits: { fileSize: 5 * 1024 * 1024 },  // máximo 5 MB
      abortOnLimit: false,  // aborta la subida si se excede el límite
      safeFileNames: true,         // sanitiza nombres peligrosos
      preserveExtension: true,     // conserva la extensión original
      createParentPath: true       // crea la ruta si no existe
    }

    // Limpiar todos los archivos temporales de express-fileupload
    const cleanupUploadedFiles = async (req: Request) => {
      const files = (req as any).files as Record<string, UploadedFile | UploadedFile[]> | undefined;
      if (!files) return;
      const list: UploadedFile[] = Object.values(files).flatMap(f => Array.isArray(f) ? f : [f]) as any;
      for (const f of list) {
        const tmp = (f as any).tempFilePath as string | undefined;
        if (tmp) {
          try { await uploadService.deleteFile(tmp); } catch { }
        }
      }
    };

    const validate = async (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        await cleanupUploadedFiles(req);
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    };

    router.post('/single',

      fileUpload(uploadOptions),

      body('nombre')
        .isString().withMessage('El nombre debe ser una cadena de texto.')
        .trim()
        .isLength({ min: 3, max: 50 }).withMessage('El nombre debe tener al menos 3 caracteres.')
        .notEmpty().withMessage('El nombre no puede estar vacío.'),
      body('matricula')
        .trim()
        .isString().withMessage('La matrícula debe ser una cadena de texto.')
        .notEmpty().withMessage('La matrícula no puede estar vacía.')
        .isLength({ min: 8, max: 8 }).withMessage('La matrícula debe tener 8 caracteres.'),
      body('email')
        .trim()
        .isEmail().withMessage('El email debe ser una dirección de correo válida.')
        .notEmpty().withMessage('El email no puede estar vacío.'),
      body('telefono')
        .trim()
        .isString().withMessage('El teléfono debe ser una cadena de texto.')
        .notEmpty().withMessage('El teléfono no puede estar vacío.')
        .isLength({ min: 10, max: 10 }).withMessage('El teléfono debe tener 10 caracteres.'),
      body('carrera')
        .trim()
        .isString().withMessage('La carrera debe ser una cadena de texto.')
        .notEmpty().withMessage('La carrera no puede estar vacía.'),
      body('titulo-formulario')
        .trim()
        .isString().withMessage('El título del formulario debe ser una cadena de texto.')
        .notEmpty().withMessage('El título del formulario no puede estar vacío.'),
      body('nivel')
        .optional({ nullable: true })
        .trim()
        .isString().withMessage('El nivel debe ser una cadena de texto.')
        .notEmpty().withMessage('El nivel no puede estar vacío.'),
      body('entrega')
        .optional({ nullable: true })
        .trim()
        .isString().withMessage('La entrega debe ser una cadena de texto.')
        .notEmpty().withMessage('La entrega no puede estar vacía.'),
      body('documentos-solicitados')
        .optional({ nullable: true })
        .trim()
        .isString().withMessage('Los documentos solicitados deben ser una cadena de texto.')
        .notEmpty().withMessage('Los documentos solicitados no pueden estar vacíos.'),
      body('referencia')
        .optional({ nullable: true })
        .trim()
        .isString().withMessage('La referencia debe ser una cadena de texto.')
        .isLength({ min: 20, max: 20 }).withMessage('La referencia debe tener 20 caracteres.')
        .notEmpty().withMessage('La referencia no puede estar vacía.'),
      body('numero-seguro')
        .optional({ nullable: true })
        .trim()
        .isString().withMessage('El número de seguro debe ser una cadena de texto.')
        .isLength({ min: 11, max: 11 }).withMessage('El número de seguro debe tener 11 caracteres.')
        .notEmpty().withMessage('El número de seguro no puede estar vacío.'),
      body('attachment')
        .optional({ nullable: true })
        .notEmpty().withMessage('El archivo adjunto es obligatorio.'),
      body('comentarios')
        .optional({ nullable: true })
        .trim()
        .isString().withMessage('Los comentarios deben ser una cadena de texto.')
        .isLength({ max: 300 }).withMessage('Los comentarios no pueden exceder los 300 caracteres.'),
      validate,
      controller.saveTempFile.bind(controller),
    )
    return router;
  }
}