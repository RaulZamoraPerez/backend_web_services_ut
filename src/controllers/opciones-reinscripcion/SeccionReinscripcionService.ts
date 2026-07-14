import { CustomError } from "../../errors/CustomErrors";
import { SeccionReinscripcion } from "../../models/SeccionReinscripcion";
import path from "path";
import fs from "fs";

interface SeccionReinscripcionData {
  titulo: string;
  subtitulo?: string;
  periodo?: string;
  fechas?: string;
  sistema?: string;
  instructivoPath?: string;
}

interface SeccionReinscripcionResponse {
  id: string;
  titulo: string;
  subtitulo: string | null;
  periodo: string | null;
  fechas: string | null;
  sistema: string | null;
  instructivoPath: string | null;
  instructivoUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class SeccionReinscripcionService {

  /**
   * POST/PUT - Crear o actualizar sección (solo debe haber 1 registro)
   */
  async createOrUpdate(data: SeccionReinscripcionData): Promise<SeccionReinscripcionResponse> {
    try {
      const { titulo, subtitulo, periodo, fechas, sistema, instructivoPath } = data;

      // Validaciones
      if (!titulo || titulo.trim() === '') {
        throw CustomError.badRequest("El título es requerido.");
      }

      // Buscar si ya existe una sección
      const seccionExistente = await SeccionReinscripcion.findOne();

      if (seccionExistente) {
        // Actualizar la existente
        const updateData: any = {
          titulo: titulo.trim(),
          subtitulo: subtitulo ? subtitulo.trim() : null,
          periodo: periodo ? periodo.trim() : null,
          fechas: fechas ? fechas.trim() : null,
          sistema: sistema ? sistema.trim() : null
        };

        if (instructivoPath) {
          // Si hay un nuevo archivo, eliminar el anterior
          if (seccionExistente.instructivoPath) {
            this.deleteFile(seccionExistente.instructivoPath);
          }
          updateData.instructivoPath = instructivoPath;
        }

        await seccionExistente.update(updateData);

        return this.formatResponse(seccionExistente);
      }

      // Crear nueva sección
      const nuevaSeccion = await SeccionReinscripcion.create({
        titulo: titulo.trim(),
        subtitulo: subtitulo ? subtitulo.trim() : null,
        periodo: periodo ? periodo.trim() : null,
        fechas: fechas ? fechas.trim() : null,
        sistema: sistema ? sistema.trim() : null,
        instructivoPath: instructivoPath || null
      });

      return this.formatResponse(nuevaSeccion);

    } catch (error) {
      if (error instanceof CustomError) throw error;
      console.error("Error en SeccionReinscripcionService.createOrUpdate:", error);
      throw CustomError.internalServer("Error al guardar la sección de reinscripción.");
    }
  }

  /**
   * GET - Obtener la sección (solo hay 1)
   */
  async get(): Promise<SeccionReinscripcionResponse | null> {
    try {
      const seccion = await SeccionReinscripcion.findOne();

      if (!seccion) {
        return null;
      }

      return this.formatResponse(seccion);

    } catch (error) {
      console.error("Error en SeccionReinscripcionService.get:", error);
      throw CustomError.internalServer("Error al obtener la sección de reinscripción.");
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
        console.log(`Archivo de instructivo eliminado: ${filePath}`);
      }
    } catch (error) {
      console.error(`Error al eliminar archivo ${filePath}:`, error);
    }
  }

  /**
   * Formatear respuesta
   */
  private formatResponse(seccion: SeccionReinscripcion): SeccionReinscripcionResponse {
    const baseUrl = process.env.API_URL || 'http://localhost:3000';
    const instructivoUrl = seccion.instructivoPath
      ? `${baseUrl}/api/opciones-reinscripcion/seccion/instructivo`
      : null;

    return {
      id: seccion.id,
      titulo: seccion.titulo,
      subtitulo: seccion.subtitulo,
      periodo: seccion.periodo,
      fechas: seccion.fechas,
      sistema: seccion.sistema,
      instructivoPath: seccion.instructivoPath,
      instructivoUrl: instructivoUrl,
      createdAt: seccion.createdAt,
      updatedAt: seccion.updatedAt
    };
  }
}
