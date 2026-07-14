import { Request, Response } from "express";
import { FormularioConfigService } from "./FormularioConfigService";
import { CustomError } from "../../errors/CustomErrors";

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

  // ==================== ERROR HANDLER ====================

  private handleError(res: Response, error: unknown, method: string) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.error(`Error en FormularioConfigController.${method}:`, error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
