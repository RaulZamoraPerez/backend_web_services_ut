import { CustomError } from "../../errors/CustomErrors";
import { ConvocatoriaTitulo } from "../../models/ConvocatoriaTitulo";

interface ConvocatoriaTituloData {
  titulo: string;
  subtitulo: string;
  nombreSeccionDocumentos: string;
}

interface ConvocatoriaTituloResponse {
  id: string;
  titulo: string;
  subtitulo: string;
  nombreSeccionDocumentos: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ConvocatoriaTituloService {

  /**
   * POST - Crear o actualizar información de la convocatoria
   * Solo permite un registro
   */
  async createOrUpdate(data: ConvocatoriaTituloData): Promise<ConvocatoriaTituloResponse> {
    try {
      const { titulo, subtitulo, nombreSeccionDocumentos } = data;

      // Validar campos obligatorios
      if (!titulo || titulo.trim() === '') {
        throw CustomError.badRequest("El título es requerido.");
      }

      if (!subtitulo || subtitulo.trim() === '') {
        throw CustomError.badRequest("El subtítulo/descripción es requerido.");
      }

      if (!nombreSeccionDocumentos || nombreSeccionDocumentos.trim() === '') {
        throw CustomError.badRequest("El nombre de la sección de documentos es requerido.");
      }

      // Verificar si ya existe un registro
      const registroExistente = await ConvocatoriaTitulo.findOne();

      if (registroExistente) {
        // Actualizar el registro existente
        registroExistente.titulo = titulo;
        registroExistente.subtitulo = subtitulo;
        registroExistente.nombreSeccionDocumentos = nombreSeccionDocumentos;

        await registroExistente.save();

        return this.formatResponse(registroExistente);
      }

      // Crear nuevo registro
      const registro = await ConvocatoriaTitulo.create({
        titulo,
        subtitulo,
        nombreSeccionDocumentos
      });

      return this.formatResponse(registro);

    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }

      console.error("Error en ConvocatoriaTituloService.createOrUpdate:", error);
      throw CustomError.internalServer(
        `Error al guardar la información: ${error instanceof Error ? error.message : "Error desconocido"}`
      );
    }
  }

  /**
   * GET - Obtener información de la convocatoria
   */
  async get(): Promise<ConvocatoriaTituloResponse> {
    try {
      const registro = await ConvocatoriaTitulo.findOne();

      if (!registro) {
        throw CustomError.notFound("No existe información de convocatoria configurada.");
      }

      return this.formatResponse(registro);

    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }

      console.error("Error en ConvocatoriaTituloService.get:", error);
      throw CustomError.internalServer(
        `Error al obtener la información: ${error instanceof Error ? error.message : "Error desconocido"}`
      );
    }
  }

  /**
   * DELETE - Eliminar información por ID
   */
  async delete(id: string): Promise<{ message: string }> {
    try {
      if (!id || id.trim() === '') {
        throw CustomError.badRequest("El ID es requerido.");
      }

      const registro = await ConvocatoriaTitulo.findByPk(id);

      if (!registro) {
        throw CustomError.notFound(`No se encontró registro con ID: ${id}`);
      }

      await registro.destroy();

      return { message: "Información de convocatoria eliminada exitosamente." };

    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }

      console.error("Error en ConvocatoriaTituloService.delete:", error);
      throw CustomError.internalServer(
        `Error al eliminar la información: ${error instanceof Error ? error.message : "Error desconocido"}`
      );
    }
  }

  /**
   * Formatea la respuesta
   */
  private formatResponse(registro: ConvocatoriaTitulo): ConvocatoriaTituloResponse {
    return {
      id: registro.id,
      titulo: registro.titulo,
      subtitulo: registro.subtitulo,
      nombreSeccionDocumentos: registro.nombreSeccionDocumentos,
      createdAt: registro.createdAt,
      updatedAt: registro.updatedAt
    };
  }
}
