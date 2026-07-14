import { CustomError } from "../../errors/CustomErrors";
import { CarreraSimple } from "../../models/CarreraSimple";

interface CarreraSimpleData {
  nombre: string;
  tipo: 'TSU' | 'INGENIERIA' | 'LICENCIATURA' | 'MAESTRIA' | 'DOCTORADO' | 'OTRO';
  activo?: boolean;
}

interface CarreraSimpleResponse {
  id: string;
  nombre: string;
  tipo: string;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class CarreraSimpleService {

  /**
   * POST - Crear carrera
   */
  async create(data: CarreraSimpleData): Promise<CarreraSimpleResponse> {
    try {
      const { nombre, tipo, activo } = data;

      // Validaciones
      if (!nombre || nombre.trim() === '') {
        throw CustomError.badRequest("El nombre de la carrera es requerido.");
      }

      if (!tipo) {
        throw CustomError.badRequest("El tipo de carrera es requerido.");
      }

      // Verificar si ya existe una carrera con ese nombre
      const existente = await CarreraSimple.findOne({
        where: { nombre: nombre.trim() }
      });

      if (existente) {
        throw CustomError.badRequest(`Ya existe una carrera con el nombre '${nombre}'.`);
      }

      const carrera = await CarreraSimple.create({
        nombre: nombre.trim(),
        tipo,
        activo: activo !== undefined ? activo : true
      });

      return this.formatResponse(carrera);

    } catch (error) {
      if (error instanceof CustomError) throw error;
      console.error("Error en CarreraSimpleService.create:", error);
      throw CustomError.internalServer("Error al crear la carrera.");
    }
  }

  /**
   * GET - Obtener todas las carreras
   */
  async getAll(soloActivas: boolean = false): Promise<CarreraSimpleResponse[]> {
    try {
      const whereClause = soloActivas ? { activo: true } : {};

      const carreras = await CarreraSimple.findAll({
        where: whereClause,
        order: [['tipo', 'ASC'], ['nombre', 'ASC']]
      });

      return carreras.map(c => this.formatResponse(c));

    } catch (error) {
      console.error("Error en CarreraSimpleService.getAll:", error);
      throw CustomError.internalServer("Error al obtener las carreras.");
    }
  }

  /**
   * GET - Obtener carreras agrupadas por tipo
   */
  async getAllGrouped(soloActivas: boolean = false): Promise<any> {
    try {
      const whereClause = soloActivas ? { activo: true } : {};

      const carreras = await CarreraSimple.findAll({
        where: whereClause,
        order: [['tipo', 'ASC'], ['nombre', 'ASC']]
      });

      const grouped = carreras.reduce((acc, carrera) => {
        const tipo = carrera.tipo;
        if (!acc[tipo]) {
          acc[tipo] = [];
        }
        acc[tipo].push({
          id: carrera.id,
          nombre: carrera.nombre,
          activo: carrera.activo
        });
        return acc;
      }, {} as Record<string, any[]>);

      return grouped;

    } catch (error) {
      console.error("Error en CarreraSimpleService.getAllGrouped:", error);
      throw CustomError.internalServer("Error al obtener las carreras agrupadas.");
    }
  }

  /**
   * GET - Obtener solo los nombres (para select)
   */
  async getNombres(soloActivas: boolean = true): Promise<string[]> {
    try {
      const whereClause = soloActivas ? { activo: true } : {};

      const carreras = await CarreraSimple.findAll({
        where: whereClause,
        attributes: ['nombre'],
        order: [['tipo', 'ASC'], ['nombre', 'ASC']]
      });

      return carreras.map(c => c.nombre);

    } catch (error) {
      console.error("Error en CarreraSimpleService.getNombres:", error);
      throw CustomError.internalServer("Error al obtener los nombres de carreras.");
    }
  }

  /**
   * GET - Obtener carrera por ID
   */
  async getById(id: string): Promise<CarreraSimpleResponse> {
    try {
      const carrera = await this.findById(id);
      return this.formatResponse(carrera);

    } catch (error) {
      if (error instanceof CustomError) throw error;
      console.error("Error en CarreraSimpleService.getById:", error);
      throw CustomError.internalServer("Error al obtener la carrera.");
    }
  }

  /**
   * PUT - Actualizar carrera
   */
  async update(id: string, data: Partial<CarreraSimpleData>): Promise<CarreraSimpleResponse> {
    try {
      const carrera = await this.findById(id);

      if (data.nombre !== undefined) {
        const nombreTrim = data.nombre.trim();
        if (nombreTrim === '') {
          throw CustomError.badRequest("El nombre de la carrera no puede estar vacío.");
        }

        // Verificar que el nombre no esté en uso por otra carrera
        const existente = await CarreraSimple.findOne({
          where: { nombre: nombreTrim }
        });
        if (existente && existente.id !== id) {
          throw CustomError.badRequest(`El nombre '${nombreTrim}' ya está en uso por otra carrera.`);
        }

        carrera.nombre = nombreTrim;
      }

      if (data.tipo !== undefined) carrera.tipo = data.tipo;
      if (data.activo !== undefined) carrera.activo = data.activo;

      await carrera.save();
      return this.formatResponse(carrera);

    } catch (error) {
      if (error instanceof CustomError) throw error;
      console.error("Error en CarreraSimpleService.update:", error);
      throw CustomError.internalServer("Error al actualizar la carrera.");
    }
  }

  /**
   * DELETE - Eliminar carrera
   */
  async delete(id: string): Promise<{ message: string }> {
    try {
      const carrera = await this.findById(id);
      await carrera.destroy();
      return { message: "Carrera eliminada exitosamente." };

    } catch (error) {
      if (error instanceof CustomError) throw error;
      console.error("Error en CarreraSimpleService.delete:", error);
      throw CustomError.internalServer("Error al eliminar la carrera.");
    }
  }

  /**
   * Helper: Buscar por ID
   */
  private async findById(id: string): Promise<CarreraSimple> {
    if (!id || id.trim() === '') {
      throw CustomError.badRequest("El ID es requerido.");
    }

    const carrera = await CarreraSimple.findByPk(id);

    if (!carrera) {
      throw CustomError.notFound(`No se encontró la carrera con ID: ${id}`);
    }

    return carrera;
  }

  /**
   * Formatea la respuesta
   */
  private formatResponse(carrera: CarreraSimple): CarreraSimpleResponse {
    return {
      id: carrera.id,
      nombre: carrera.nombre,
      tipo: carrera.tipo,
      activo: carrera.activo,
      createdAt: carrera.createdAt,
      updatedAt: carrera.updatedAt
    };
  }
}
