import { Request, Response } from "express";
import { ConvocatoriaTituloService } from "./ConvocatoriaTituloService";
import { CustomError } from "../../errors/CustomErrors";

export default class ConvocatoriaTituloController {

  private service = new ConvocatoriaTituloService();

  /**
   * POST - Crear o actualizar información de la convocatoria
   */
  createOrUpdate = async (req: Request, res: Response) => {
    try {
      const { titulo, subtitulo, nombreSeccionDocumentos } = req.body;

      const resultado = await this.service.createOrUpdate({
        titulo,
        subtitulo,
        nombreSeccionDocumentos
      });

      return res.status(201).json({
        message: "Información de convocatoria guardada exitosamente",
        data: resultado
      });

    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          error: error.message
        });
      }

      console.error("Error en createOrUpdate:", error);
      return res.status(500).json({
        error: "Error interno del servidor"
      });
    }
  }

  /**
   * GET - Obtener información de la convocatoria
   */
  get = async (req: Request, res: Response) => {
    try {
      const resultado = await this.service.get();

      return res.status(200).json(resultado);

    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          error: error.message
        });
      }

      console.error("Error en get:", error);
      return res.status(500).json({
        error: "Error interno del servidor"
      });
    }
  }

  /**
   * DELETE - Eliminar información por ID
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
}
