import { Request, Response, NextFunction } from "express";
import { PersonalCarreraService } from "./PersonalCarreraService";

const personalCarreraService = new PersonalCarreraService();

export class PersonalCarreraController {

  /**
   * POST - Crear personal
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await personalCarreraService.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET - Obtener todo el personal
   */
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await personalCarreraService.getAll();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET - Obtener personal por ID
   */
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const result = await personalCarreraService.getById(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT - Actualizar personal
   */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const result = await personalCarreraService.update(id, req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE - Eliminar personal
   */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const result = await personalCarreraService.delete(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
