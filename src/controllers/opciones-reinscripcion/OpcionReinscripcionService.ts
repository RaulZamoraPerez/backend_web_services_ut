import { CustomError } from "../../errors/CustomErrors";
import { OpcionReinscripcion } from "../../models/OpcionReinscripcion";
import path from "path";
import fs from "fs";

interface OpcionReinscripcionData {
  titulo: string;
  subtitulo?: string;
  archivoPath: string;
  activo?: boolean;
}

interface OpcionReinscripcionResponse {
  id: string;
  titulo: string;
  subtitulo: string | null;
  archivoUrl: string;  // URL completa para descargar
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class OpcionReinscripcionService {

  /**
   * POST - Crear o actualizar opción de reinscripción
   */
  async createOrUpdate(
    id: string | undefined,
    data: OpcionReinscripcionData
  ): Promise<OpcionReinscripcionResponse> {
    try {
      const { titulo, subtitulo, archivoPath, activo } = data;

      // Validaciones
      if (!titulo || titulo.trim() === '') {
        throw CustomError.badRequest("El título es requerido.");
      }

      if (!archivoPath || archivoPath.trim() === '') {
        throw CustomError.badRequest("El archivo es requerido.");
      }

      // Si hay ID, intentar actualizar
      if (id) {
        const opcion = await OpcionReinscripcion.findByPk(id);

        if (!opcion) {
          throw CustomError.notFound(`Opción de reinscripción con ID ${id} no encontrada.`);
        }

        // Si hay un nuevo archivo, eliminar el anterior
        if (archivoPath !== opcion.archivoPath && opcion.archivoPath) {
          this.deleteFile(opcion.archivoPath);
        }

        // Actualizar
        await opcion.update({
          titulo: titulo.trim(),
          subtitulo: subtitulo ? subtitulo.trim() : null,
          archivoPath,
          activo: activo !== undefined ? activo : opcion.activo
        });

        return this.formatResponse(opcion);
      }

      // Crear nueva opción
      const nuevaOpcion = await OpcionReinscripcion.create({
        titulo: titulo.trim(),
        subtitulo: subtitulo ? subtitulo.trim() : null,
        archivoPath,
        activo: activo !== undefined ? activo : true
      });

      return this.formatResponse(nuevaOpcion);

    } catch (error) {
      if (error instanceof CustomError) throw error;
      console.error("Error en OpcionReinscripcionService.createOrUpdate:", error);
      throw CustomError.internalServer("Error al guardar la opción de reinscripción.");
    }
  }

  /**
   * GET - Obtener todas las opciones
   */
  async getAll(soloActivas: boolean = false): Promise<OpcionReinscripcionResponse[]> {
    try {
      const whereClause = soloActivas ? { activo: true } : {};

      const opciones = await OpcionReinscripcion.findAll({
        where: whereClause,
        order: [['createdAt', 'DESC']]
      });

      return opciones.map(o => this.formatResponse(o));

    } catch (error) {
      console.error("Error en OpcionReinscripcionService.getAll:", error);
      throw CustomError.internalServer("Error al obtener las opciones de reinscripción.");
    }
  }

  /**
   * GET - Obtener opción por ID
   */
  async getById(id: string): Promise<OpcionReinscripcionResponse> {
    try {
      const opcion = await OpcionReinscripcion.findByPk(id);

      if (!opcion) {
        throw CustomError.notFound(`Opción de reinscripción con ID ${id} no encontrada.`);
      }

      return this.formatResponse(opcion);

    } catch (error) {
      if (error instanceof CustomError) throw error;
      console.error("Error en OpcionReinscripcionService.getById:", error);
      throw CustomError.internalServer("Error al obtener la opción de reinscripción.");
    }
  }

  /**
   * GET - Obtener ruta del archivo (interno)
   */
  async getFilePath(id: string): Promise<string> {
    try {
      const opcion = await OpcionReinscripcion.findByPk(id);

      if (!opcion) {
        throw CustomError.notFound(`Opción de reinscripción con ID ${id} no encontrada.`);
      }

      return opcion.archivoPath;

    } catch (error) {
      if (error instanceof CustomError) throw error;
      console.error("Error en OpcionReinscripcionService.getFilePath:", error);
      throw CustomError.internalServer("Error al obtener la ruta del archivo.");
    }
  }

  /**
   * PATCH - Cambiar estado activo de una opción
   */
  async toggleActivo(id: string, activo: boolean): Promise<OpcionReinscripcionResponse> {
    try {
      const opcion = await OpcionReinscripcion.findByPk(id);

      if (!opcion) {
        throw CustomError.notFound(`Opción de reinscripción con ID ${id} no encontrada.`);
      }

      // Actualizar solo el campo activo
      await opcion.update({ activo });

      return this.formatResponse(opcion);

    } catch (error) {
      if (error instanceof CustomError) throw error;
      console.error("Error en OpcionReinscripcionService.toggleActivo:", error);
      throw CustomError.internalServer("Error al cambiar el estado de la opción de reinscripción.");
    }
  }

  /**
   * DELETE - Eliminar opción
   */
  async delete(id: string): Promise<{ message: string }> {
    try {
      const opcion = await OpcionReinscripcion.findByPk(id);

      if (!opcion) {
        throw CustomError.notFound(`Opción de reinscripción con ID ${id} no encontrada.`);
      }

      // Eliminar archivo asociado
      this.deleteFile(opcion.archivoPath);

      // Eliminar registro
      await opcion.destroy();

      return {
        message: `Opción de reinscripción '${opcion.titulo}' eliminada exitosamente.`
      };

    } catch (error) {
      if (error instanceof CustomError) throw error;
      console.error("Error en OpcionReinscripcionService.delete:", error);
      throw CustomError.internalServer("Error al eliminar la opción de reinscripción.");
    }
  }

  /**
   * Eliminar archivo del sistema
   */
  private deleteFile(filePath: string): void {
    try {
      const fullPath = path.join(process.cwd(), filePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log(`Archivo eliminado: ${filePath}`);
      }
    } catch (error) {
      console.error(`Error al eliminar archivo ${filePath}:`, error);
    }
  }

  /**
   * Formatear respuesta
   */
  private formatResponse(opcion: OpcionReinscripcion): OpcionReinscripcionResponse {
    // Construir URL completa para descarga
    const baseUrl = process.env.API_URL || 'http://localhost:3000';
    const archivoUrl = `${baseUrl}/api/opciones-reinscripcion/${opcion.id}/download`;

    return {
      id: opcion.id,
      titulo: opcion.titulo,
      subtitulo: opcion.subtitulo,
      archivoUrl: archivoUrl,
      activo: opcion.activo,
      createdAt: opcion.createdAt,
      updatedAt: opcion.updatedAt
    };
  }
}
