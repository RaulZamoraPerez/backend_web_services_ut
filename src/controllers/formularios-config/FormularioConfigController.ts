import { Request, Response } from "express";
import { FormularioConfigService } from "./FormularioConfigService";
import { CustomError } from "../../errors/CustomErrors";
import { UploadedFile } from "express-fileupload";
import path from "path";
import fs from "fs";

export class FormularioConfigController {

  private service = new FormularioConfigService();

  // ==================== INFO PRINCIPAL ====================

  createInfo = async (req: Request, res: Response) => {
    try {
      const { tipo } = req.params;
      const resultado = await this.service.createInfo(tipo, req.body);

      return res.status(201).json({
        message: "Información principal creada exitosamente",
        data: resultado
      });
    } catch (error) {
      return this.handleError(res, error, "createInfo");
    }
  }

  getInfo = async (req: Request, res: Response) => {
    try {
      const { tipo } = req.params;
      const resultado = await this.service.getInfo(tipo);
      return res.status(200).json(resultado);
    } catch (error) {
      return this.handleError(res, error, "getInfo");
    }
  }

  updateInfo = async (req: Request, res: Response) => {
    try {
      const { tipo } = req.params;
      const resultado = await this.service.updateInfo(tipo, req.body);

      return res.status(200).json({
        message: "Información principal actualizada exitosamente",
        data: resultado
      });
    } catch (error) {
      return this.handleError(res, error, "updateInfo");
    }
  }

  deleteInfo = async (req: Request, res: Response) => {
    try {
      const { tipo } = req.params;
      const resultado = await this.service.deleteInfo(tipo);
      return res.status(200).json(resultado);
    } catch (error) {
      return this.handleError(res, error, "deleteInfo");
    }
  }

  // ==================== REQUISITOS ====================

  addRequisito = async (req: Request, res: Response) => {
    try {
      const { tipo } = req.params;
      const { item } = req.body;
      const resultado = await this.service.addRequisito(tipo, item);

      return res.status(201).json({
        message: "Requisito agregado exitosamente",
        data: resultado
      });
    } catch (error) {
      return this.handleError(res, error, "addRequisito");
    }
  }

  getRequisitos = async (req: Request, res: Response) => {
    try {
      const { tipo } = req.params;
      const resultado = await this.service.getRequisitos(tipo);
      return res.status(200).json(resultado);
    } catch (error) {
      return this.handleError(res, error, "getRequisitos");
    }
  }

  updateRequisito = async (req: Request, res: Response) => {
    try {
      const { tipo, index } = req.params;
      const { item } = req.body;
      const resultado = await this.service.updateRequisito(tipo, parseInt(index), item);

      return res.status(200).json({
        message: "Requisito actualizado exitosamente",
        data: resultado
      });
    } catch (error) {
      return this.handleError(res, error, "updateRequisito");
    }
  }

  deleteRequisito = async (req: Request, res: Response) => {
    try {
      const { tipo, index } = req.params;
      const resultado = await this.service.deleteRequisito(tipo, parseInt(index));
      return res.status(200).json(resultado);
    } catch (error) {
      return this.handleError(res, error, "deleteRequisito");
    }
  }

  // ==================== PASOS ====================

  addPaso = async (req: Request, res: Response) => {
    try {
      const { tipo } = req.params;
      const { item } = req.body;
      const resultado = await this.service.addPaso(tipo, item);

      return res.status(201).json({
        message: "Paso agregado exitosamente",
        data: resultado
      });
    } catch (error) {
      return this.handleError(res, error, "addPaso");
    }
  }

  getPasos = async (req: Request, res: Response) => {
    try {
      const { tipo } = req.params;
      const resultado = await this.service.getPasos(tipo);
      return res.status(200).json(resultado);
    } catch (error) {
      return this.handleError(res, error, "getPasos");
    }
  }

  updatePaso = async (req: Request, res: Response) => {
    try {
      const { tipo, index } = req.params;
      const { item } = req.body;
      const resultado = await this.service.updatePaso(tipo, parseInt(index), item);

      return res.status(200).json({
        message: "Paso actualizado exitosamente",
        data: resultado
      });
    } catch (error) {
      return this.handleError(res, error, "updatePaso");
    }
  }

  deletePaso = async (req: Request, res: Response) => {
    try {
      const { tipo, index } = req.params;
      const resultado = await this.service.deletePaso(tipo, parseInt(index));
      return res.status(200).json(resultado);
    } catch (error) {
      return this.handleError(res, error, "deletePaso");
    }
  }

  // ==================== DOCUMENTOS ====================

  addDocumento = async (req: Request, res: Response) => {
    try {
      const { tipo } = req.params;
      const { item } = req.body;
      const resultado = await this.service.addDocumento(tipo, item);

      return res.status(201).json({
        message: "Documento agregado exitosamente",
        data: resultado
      });
    } catch (error) {
      return this.handleError(res, error, "addDocumento");
    }
  }

  getDocumentos = async (req: Request, res: Response) => {
    try {
      const { tipo } = req.params;
      const resultado = await this.service.getDocumentos(tipo);
      return res.status(200).json(resultado);
    } catch (error) {
      return this.handleError(res, error, "getDocumentos");
    }
  }

  updateDocumento = async (req: Request, res: Response) => {
    try {
      const { tipo, index } = req.params;
      const { item } = req.body;
      const resultado = await this.service.updateDocumento(tipo, parseInt(index), item);

      return res.status(200).json({
        message: "Documento actualizado exitosamente",
        data: resultado
      });
    } catch (error) {
      return this.handleError(res, error, "updateDocumento");
    }
  }

  deleteDocumento = async (req: Request, res: Response) => {
    try {
      const { tipo, index } = req.params;
      const resultado = await this.service.deleteDocumento(tipo, parseInt(index));
      return res.status(200).json(resultado);
    } catch (error) {
      return this.handleError(res, error, "deleteDocumento");
    }
  }

  // ==================== RECURSOS ====================

  addRecurso = async (req: Request, res: Response) => {
    try {
      const { tipo } = req.params;
      const { nombre } = req.body;

      if (!nombre || nombre.trim() === '') {
        throw CustomError.badRequest("El nombre del recurso es requerido.");
      }

      const files = req.files as any;
      if (!files || !files.archivo) {
        throw CustomError.badRequest("El archivo es requerido.");
      }

      const archivo = files.archivo as UploadedFile;
      const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

      if (!allowedMimeTypes.includes(archivo.mimetype)) {
        throw CustomError.badRequest("El archivo debe ser un PDF o una imagen (JPEG/PNG/WEBP).");
      }

      // Crear directorio si no existe
      const UPLOAD_DIR = "uploads/tramites_recursos";
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

      const resultado = await this.service.addRecurso(tipo, nombre.trim(), relativePath);

      return res.status(201).json({
        message: "Recurso agregado exitosamente",
        data: resultado
      });
    } catch (error) {
      return this.handleError(res, error, "addRecurso");
    }
  }

  getRecursos = async (req: Request, res: Response) => {
    try {
      const { tipo } = req.params;
      const resultado = await this.service.getRecursos(tipo);

      // Formatear las URLs absolutas para la descarga
      const baseUrl = process.env.API_URL ? process.env.API_URL.replace(/\/$/, '') : '';
      const recursosConUrl = resultado.map(r => ({
        nombre: r.nombre,
        path: r.path,
        url: r.path.startsWith('/') ? `${baseUrl}${r.path}` : `${baseUrl}/${r.path}`
      }));

      return res.status(200).json(recursosConUrl);
    } catch (error) {
      return this.handleError(res, error, "getRecursos");
    }
  }

  deleteRecurso = async (req: Request, res: Response) => {
    try {
      const { tipo, index } = req.params;
      const resultado = await this.service.deleteRecurso(tipo, parseInt(index));
      return res.status(200).json({
        message: "Recurso eliminado exitosamente",
        data: resultado
      });
    } catch (error) {
      return this.handleError(res, error, "deleteRecurso");
    }
  }

  // ==================== ERROR HANDLER ====================

  private handleError(res: Response, error: unknown, method: string) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.error(`Error en FormularioConfigController.${method}:`, error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
