import { Request, Response, NextFunction } from "express";
import { CarreraSimpleService } from "./CarreraSimpleService";

const carreraSimpleService = new CarreraSimpleService();

export class CarreraSimpleController {

  /**
   * POST - Crear carrera
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await carreraSimpleService.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET - Obtener todas las carreras
   * Query params: activas=true (opcional)
   */
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const soloActivas = req.query.activas === 'true';
      const result = await carreraSimpleService.getAll(soloActivas);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET - Obtener carreras agrupadas por tipo
   * Query params: activas=true (opcional)
   */
  async getAllGrouped(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const soloActivas = req.query.activas === 'true';
      const result = await carreraSimpleService.getAllGrouped(soloActivas);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET - Obtener solo nombres de carreras
   * Query params: activas=true (opcional, default: true)
   */
  async getNombres(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const soloActivas = req.query.activas !== 'false'; // default true
      const result = await carreraSimpleService.getNombres(soloActivas);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET - Obtener carrera por ID
   */
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const result = await carreraSimpleService.getById(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT - Actualizar carrera
   */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const result = await carreraSimpleService.update(id, req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE - Eliminar carrera
   */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const result = await carreraSimpleService.delete(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
