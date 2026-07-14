import { Request, Response } from 'express';
import fileUpload from 'express-fileupload';
import { ProcesoAdmisionService } from './ProcesoAdmisionService';
import { AdmisionBannerService } from './AdmisionBannerService';
import { CustomError } from '../../errors/CustomErrors';


export class ServiciosEscolaresController {

  private procesoAdmisionService: ProcesoAdmisionService;
  private admisionBannerService: AdmisionBannerService;

  constructor() {
    this.procesoAdmisionService = new ProcesoAdmisionService();
    this.admisionBannerService = new AdmisionBannerService();
  }

  procesoAdmision = async (req: Request, res: Response) => {
    try {
      const { titulo, subtitulo } = req.body;
      let pasos = [];
      if (req.body.pasos) {
        try {
          pasos = JSON.parse(req.body.pasos);
        } catch (e) {
          pasos = [];
        }
      }
      const attachment = (req.files as any).attachment as fileUpload.UploadedFile;

      const resultado = await this.procesoAdmisionService.create({
        titulo,
        subtitulo,
        attachment,
        pasos
      });

      return res.status(201).json({
        message: "Proceso de admisión registrado exitosamente",
        data: resultado
      });

    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          error: error.message
        });
      }

      console.error("Error en procesoAdmision:", error);
      return res.status(500).json({
        error: "Error interno del servidor"
      });
    }
  }

  getProcesoAdmision = async (req: Request, res: Response) => {
    try {
      const dataArray = await this.procesoAdmisionService.getAll();
      
      const responseArray = dataArray.map(data => ({
        id: data.id,
        titulo: data.titulo,
        subtitulo: data.subtitulo,
        pasos: data.pasos,
        archivo: {
          nombre: data.archivoNombre,
          mimeType: data.archivoMimeType,
          base64: data.archivoBuffer.toString('base64')
        }
      }));

      return res.status(200).json(responseArray);
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Error interno del servidor al obtener el proceso de admisión.' });
    }
  };

  deleteProcesoAdmision = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const resultado = await this.procesoAdmisionService.delete(id);

      return res.status(200).json(resultado);

    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          error: error.message
        });
      }

      console.error("Error en deleteProcesoAdmision:", error);
      return res.status(500).json({
        error: "Error interno del servidor"
      });
    }
  }

  updateProcesoAdmision = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { titulo, subtitulo } = req.body;
      let pasos;
      if (req.body.pasos) {
        try {
          pasos = JSON.parse(req.body.pasos);
        } catch (e) {
          pasos = undefined;
        }
      }
      const attachment = (req.files as any)?.attachment as fileUpload.UploadedFile | undefined;

      const resultado = await this.procesoAdmisionService.update(id, {
        titulo,
        subtitulo,
        attachment,
        pasos
      });

      return res.status(200).json({
        message: "Proceso de admisión actualizado exitosamente",
        data: resultado
      });

    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          error: error.message
        });
      }

      console.error("Error en updateProcesoAdmision:", error);
      return res.status(500).json({
        error: "Error interno del servidor"
      });
    }
  }

  getBanner = async (req: Request, res: Response) => {
    try {
      const data = await this.admisionBannerService.get('GENERAL');
      if (!data.id) return res.status(200).json(null);
      
      return res.status(200).json({
        id: data.id,
        titulo: data.titulo,
        subtitulo: data.subtitulo,
        contactoLabel: data.contactoLabel,
        contactoDepartamento: data.contactoDepartamento,
        contactoTelefono: data.contactoTelefono,
        archivo: data.archivoBuffer ? {
          nombre: data.archivoNombre,
          mimeType: data.archivoMimeType,
          base64: data.archivoBuffer.toString('base64')
        } : undefined
      });
    } catch (error) {
      return res.status(500).json({ error: 'Error al obtener banner.' });
    }
  };

  updateBanner = async (req: Request, res: Response) => {
    try {
      const { titulo, subtitulo, contactoLabel, contactoDepartamento, contactoTelefono } = req.body;
      const attachment = (req.files as any)?.attachment as fileUpload.UploadedFile | undefined;
      
      const resultado = await this.admisionBannerService.update({ 
        titulo, 
        subtitulo, 
        contactoLabel, 
        contactoDepartamento, 
        contactoTelefono, 
        attachment 
      }, 'GENERAL');
      return res.status(200).json(resultado);
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Error al actualizar banner.' });
    }
  };

  // ======================================
  // MAESTRÍA CONTROLLER METHODS
  // ======================================

  procesoAdmisionMaestria = async (req: Request, res: Response) => {
    try {
      const { titulo, subtitulo } = req.body;
      let pasos = [];
      if (req.body.pasos) {
        try {
          pasos = JSON.parse(req.body.pasos);
        } catch (e) {
          pasos = [];
        }
      }
      const attachment = (req.files as any).attachment as fileUpload.UploadedFile;

      const resultado = await this.procesoAdmisionService.create({
        titulo,
        subtitulo,
        attachment,
        pasos
      }, 'MAESTRIA');

      return res.status(201).json({
        message: "Proceso de admisión de maestría registrado exitosamente",
        data: resultado
      });

    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          error: error.message
        });
      }

      console.error("Error en procesoAdmisionMaestria:", error);
      return res.status(500).json({
        error: "Error interno del servidor"
      });
    }
  }

  getProcesoAdmisionMaestria = async (req: Request, res: Response) => {
    try {
      const dataArray = await this.procesoAdmisionService.getAll('MAESTRIA');
      
      const responseArray = dataArray.map(data => ({
        id: data.id,
        titulo: data.titulo,
        subtitulo: data.subtitulo,
        pasos: data.pasos,
        archivo: {
          nombre: data.archivoNombre,
          mimeType: data.archivoMimeType,
          base64: data.archivoBuffer.toString('base64')
        }
      }));

      return res.status(200).json(responseArray);
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Error interno del servidor al obtener el proceso de admisión de maestría.' });
    }
  };

  deleteProcesoAdmisionMaestria = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const resultado = await this.procesoAdmisionService.delete(id);
      return res.status(200).json(resultado);
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          error: error.message
        });
      }

      console.error("Error en deleteProcesoAdmisionMaestria:", error);
      return res.status(500).json({
        error: "Error interno del servidor"
      });
    }
  }

  updateProcesoAdmisionMaestria = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { titulo, subtitulo } = req.body;
      let pasos;
      if (req.body.pasos) {
        try {
          pasos = JSON.parse(req.body.pasos);
        } catch (e) {
          pasos = undefined;
        }
      }
      const attachment = (req.files as any)?.attachment as fileUpload.UploadedFile | undefined;

      const resultado = await this.procesoAdmisionService.update(id, {
        titulo,
        subtitulo,
        attachment,
        pasos
      });

      return res.status(200).json({
        message: "Proceso de admisión de maestría actualizado exitosamente",
        data: resultado
      });

    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          error: error.message
        });
      }

      console.error("Error en updateProcesoAdmisionMaestria:", error);
      return res.status(500).json({
        error: "Error interno del servidor"
      });
    }
  }

  getBannerMaestria = async (req: Request, res: Response) => {
    try {
      const data = await this.admisionBannerService.get('MAESTRIA');
      if (!data.id) return res.status(200).json(null);
      
      return res.status(200).json({
        id: data.id,
        titulo: data.titulo,
        subtitulo: data.subtitulo,
        contactoLabel: data.contactoLabel,
        contactoDepartamento: data.contactoDepartamento,
        contactoTelefono: data.contactoTelefono,
        archivo: data.archivoBuffer ? {
          nombre: data.archivoNombre,
          mimeType: data.archivoMimeType,
          base64: data.archivoBuffer.toString('base64')
        } : undefined
      });
    } catch (error) {
      return res.status(500).json({ error: 'Error al obtener banner de maestría.' });
    }
  };

  updateBannerMaestria = async (req: Request, res: Response) => {
    try {
      const { titulo, subtitulo, contactoLabel, contactoDepartamento, contactoTelefono } = req.body;
      const attachment = (req.files as any)?.attachment as fileUpload.UploadedFile | undefined;
      
      const resultado = await this.admisionBannerService.update({ 
        titulo, 
        subtitulo, 
        contactoLabel, 
        contactoDepartamento, 
        contactoTelefono, 
        attachment 
      }, 'MAESTRIA');
      return res.status(200).json(resultado);
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Error al actualizar banner de maestría.' });
    }
  };
}