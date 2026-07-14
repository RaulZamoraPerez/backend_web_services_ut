import { Request, Response, NextFunction } from "express";
import { OpcionReinscripcionService } from "./OpcionReinscripcionService";
import { SeccionReinscripcionService } from "./SeccionReinscripcionService";
import { UploadedFile } from "express-fileupload";
import path from "path";
import fs from "fs";

const opcionReinscripcionService = new OpcionReinscripcionService();
const seccionReinscripcionService = new SeccionReinscripcionService();
const UPLOAD_DIR = "uploads/opciones_reinscripcion";

export class OpcionReinscripcionController {

  /**
   * POST - Crear o actualizar opción de reinscripción (card)
   */
  async createOrUpdate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.body.id || undefined;
      const { titulo, subtitulo, activo } = req.body;

      // El archivo ya fue validado por el middleware validateFileUpload
      const files = req.files as any;
      const archivo = files.archivo as UploadedFile;

      // Crear directorio si no existe
      const uploadPath = path.join(process.cwd(), UPLOAD_DIR);
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      // Generar nombre único para el archivo
      const timestamp = Date.now();
      const ext = path.extname(archivo.name);
      const baseName = path.basename(archivo.name, ext)
        .replace(/[^a-zA-Z0-9]/g, '_')
        .substring(0, 50);
      const fileName = `${baseName}_${timestamp}${ext}`;
      const filePath = path.join(uploadPath, fileName);

      // Guardar archivo
      await archivo.mv(filePath);

      // Ruta relativa para guardar en BD
      const relativePath = `${UPLOAD_DIR}/${fileName}`;

      // Crear o actualizar en BD
      const result = await opcionReinscripcionService.createOrUpdate(id, {
        titulo,
        subtitulo,
        archivoPath: relativePath,
        activo: activo === 'true' || activo === true
      });

      res.status(id ? 200 : 201).json(result);

    } catch (error) {
      next(error);
    }
  }

  /**
   * GET - Obtener todas las opciones
   */
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const soloActivas = req.query.activas === 'true';
      const result = await opcionReinscripcionService.getAll(soloActivas);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET - Obtener opción por ID
   */
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const result = await opcionReinscripcionService.getById(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET - Descargar archivo
   */
  async downloadFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      // Obtener solo la ruta del archivo
      const archivoPath = await opcionReinscripcionService.getFilePath(id);
      const filePath = path.join(process.cwd(), archivoPath);

      if (!fs.existsSync(filePath)) {
        res.status(404).json({
          error: "Archivo no encontrado."
        });
        return;
      }

      res.download(filePath, path.basename(archivoPath));

    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE - Eliminar opción
   */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const result = await opcionReinscripcionService.delete(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST - Crear o actualizar sección (título y subtítulo principal)
   */
  async createOrUpdateSeccion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { titulo, subtitulo, periodo, fechas, sistema } = req.body;
      let instructivoPath: string | undefined = undefined;

      // Si se subió un archivo para el instructivo
      const files = req.files as any;
      if (files && files.instructivo) {
        const file = files.instructivo as UploadedFile;
        
        // Crear directorio si no existe
        const uploadPath = path.join(process.cwd(), UPLOAD_DIR);
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }

        const timestamp = Date.now();
        const ext = path.extname(file.name);
        const baseName = path.basename(file.name, ext)
          .replace(/[^a-zA-Z0-9]/g, '_')
          .substring(0, 50);
        const fileName = `instructivo_${baseName}_${timestamp}${ext}`;
        const filePath = path.join(uploadPath, fileName);

        await file.mv(filePath);
        instructivoPath = `${UPLOAD_DIR}/${fileName}`;
      }

      const result = await seccionReinscripcionService.createOrUpdate({
        titulo,
        subtitulo,
        periodo,
        fechas,
        sistema,
        instructivoPath
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET - Descargar archivo del instructivo de la sección
   */
  async downloadInstructivo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const seccion = await seccionReinscripcionService.get();
      if (!seccion || !seccion.instructivoPath) {
        res.status(404).json({ error: "Archivo del instructivo no encontrado." });
        return;
      }

      const filePath = path.join(process.cwd(), seccion.instructivoPath);

      if (!fs.existsSync(filePath)) {
        res.status(404).json({
          error: "Archivo no encontrado en el servidor."
        });
        return;
      }

      res.download(filePath, path.basename(seccion.instructivoPath));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET - Obtener sección
   */
  async getSeccion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await seccionReinscripcionService.get();
      if (!result) {
        res.status(404).json({ error: "No se ha configurado la sección de reinscripción." });
        return;
      }
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH - Cambiar estado activo de una opción
   */
  async toggleActivo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { activo } = req.body;
      const result = await opcionReinscripcionService.toggleActivo(id, activo);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
