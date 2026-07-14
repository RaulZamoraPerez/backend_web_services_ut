import { Request, Response } from "express";
import { TramitesVistaService } from "./TramitesVistaService";
import { CustomError } from "../../errors/CustomErrors";


export default class TramitesController {

  private tramitesVistaService = new TramitesVistaService();

  createTramite = async (req: Request, res: Response) => {
    try {
      const { titulo, subtitulo } = req.body;

      const resultado = await this.tramitesVistaService.createOrUpdate({
        titulo,
        subtitulo
      });

      return res.status(201).json({
        message: "Vista de trámites guardada exitosamente",
        data: resultado
      });

    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          error: error.message
        });
      }

      console.error("Error en createTramite:", error);
      return res.status(500).json({
        error: "Error interno del servidor"
      });
    }
  }

  getTramite = async (req: Request, res: Response) => {
    try {
      const resultado = await this.tramitesVistaService.get();

      return res.status(200).json(resultado);

    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          error: error.message
        });
      }

      console.error("Error en getTramite:", error);
      return res.status(500).json({
        error: "Error interno del servidor"
      });
    }
  }

  updateTramite = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { titulo, subtitulo } = req.body;

      const resultado = await this.tramitesVistaService.update(id, {
        titulo,
        subtitulo
      });

      return res.status(200).json({
        message: "Vista de trámites actualizada exitosamente",
        data: resultado
      });

    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          error: error.message
        });
      }

      console.error("Error en updateTramite:", error);
      return res.status(500).json({
        error: "Error interno del servidor"
      });
    }
  }

  deleteTramite = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const resultado = await this.tramitesVistaService.delete(id);

      return res.status(200).json(resultado);

    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          error: error.message
        });
      }

      console.error("Error en deleteTramite:", error);
      return res.status(500).json({
        error: "Error interno del servidor"
      });
    }
  }

}