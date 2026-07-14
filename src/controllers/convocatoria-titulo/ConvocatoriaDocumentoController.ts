import { Request, Response } from "express";
import { ConvocatoriaDocumentoService } from "./ConvocatoriaDocumentoService";
import { CustomError } from "../../errors/CustomErrors";
import path from "path";
import fs from "fs";
import { UploadedFile } from "express-fileupload";

export class ConvocatoriaDocumentoController {

  private service = new ConvocatoriaDocumentoService();
  private uploadDir = path.join(__dirname, '../../../uploads/convocatoria-titulo');

  /**
   * POST - Subir documento
   */
  create = async (req: Request, res: Response) => {
    try {
      const { titulo } = req.body;

      const files = req.files as { [fieldname: string]: UploadedFile } | undefined;

      if (!files || !files.attachment) {
        throw CustomError.badRequest("El archivo PDF es requerido.");
      }

      const archivo = files.attachment;

      // Validar que sea PDF
      const extension = path.extname(archivo.name).toLowerCase();
      if (extension !== '.pdf') {
        throw CustomError.badRequest("Solo se permiten archivos PDF.");
      }

      // Validar tamaño (máximo 10MB)
      const maxSize = 10 * 1024 * 1024;
      if (archivo.size > maxSize) {
        throw CustomError.badRequest("El archivo no debe superar los 10MB.");
      }

      // Crear directorio si no existe
      if (!fs.existsSync(this.uploadDir)) {
        fs.mkdirSync(this.uploadDir, { recursive: true });
      }

      // Generar nombre único
      const timestamp = Date.now();
      const nombreArchivo = `${timestamp}-${archivo.name.replace(/\s+/g, '_')}`;
      const rutaArchivo = path.join(this.uploadDir, nombreArchivo);

      // Mover archivo
      await archivo.mv(rutaArchivo);

      // Guardar en BD
      const archivoPath = `/uploads/convocatoria-titulo/${nombreArchivo}`;
      const resultado = await this.service.create({
        titulo,
        archivoPath
      });

      return res.status(201).json({
        message: "Documento subido exitosamente",
        data: resultado
      });

    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          error: error.message
        });
      }

      console.error("Error en create:", error);
      return res.status(500).json({
        error: "Error interno del servidor"
      });
    }
  }

  /**
   * GET - Obtener todos los documentos
   */
  getAll = async (req: Request, res: Response) => {
    try {
      const resultado = await this.service.getAll();

      return res.status(200).json({
        total: resultado.length,
        documentos: resultado
      });

    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          error: error.message
        });
      }

      console.error("Error en getAll:", error);
      return res.status(500).json({
        error: "Error interno del servidor"
      });
    }
  }

  /**
   * DELETE - Eliminar documento por ID
   */
  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const resultado = await this.service.delete(id);

      return res.status(200).json(resultado);

    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          error: error.message
        });
      }

      console.error("Error en delete:", error);
      return res.status(500).json({
        error: "Error interno del servidor"
      });
    }
  }

  /**
   * PUT - Actualizar título de documento
   */
  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { titulo } = req.body;
      const resultado = await this.service.update(id, titulo);

      return res.status(200).json({
        message: "Documento actualizado exitosamente",
        data: resultado
      });

    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          error: error.message
        });
      }

      console.error("Error en update:", error);
      return res.status(500).json({
        error: "Error interno del servidor"
      });
    }
  }

  /**
   * DELETE - Eliminar todos los documentos
   */
  deleteAll = async (req: Request, res: Response) => {
    try {
      const resultado = await this.service.deleteAll();

      return res.status(200).json(resultado);

    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          error: error.message
        });
      }

      console.error("Error en deleteAll:", error);
      return res.status(500).json({
        error: "Error interno del servidor"
      });
    }
  }

  /**
   * GET - Descargar/visualizar documento por ID
   */
  download = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const documento = await this.service.findDocumentById(id);

      const filePath = path.join(this.uploadDir, path.basename(documento.archivoPath));

      // Verificar que el archivo existe
      if (!fs.existsSync(filePath)) {
        throw CustomError.notFound("El archivo no existe en el servidor.");
      }

      // Configurar headers para PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(documento.titulo)}.pdf"`);

      // Quitar X-Frame-Options para permitir incrustar en un iframe
      try { res.removeHeader('X-Frame-Options'); } catch (e) { /* ignore */ }

      // Permitir que orígenes específicos incrusten el PDF (igual que en los archivos estáticos de app.ts)
      const allowedFrameAncestors = [
        "'self'",
        'https://www.uttecam.edu.mx',
        'https://uttecam.edu.mx',
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175'
      ];
      res.setHeader('Content-Security-Policy', `frame-ancestors ${allowedFrameAncestors.join(' ')};`);

      // Enviar archivo
      return res.sendFile(filePath);

    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          error: error.message
        });
      }

      console.error("Error en download:", error);
      return res.status(500).json({
        error: "Error interno del servidor"
      });
    }
  }
}
