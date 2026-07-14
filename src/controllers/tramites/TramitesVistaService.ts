import { CustomError } from "../../errors/CustomErrors";
import { TramitesVista } from "../../models/TramitesVista";

interface TramitesVistaData {
  titulo: string;
  subtitulo: string;
  correoPorDefecto?: string;
}

interface TramitesVistaResponse {
  id: string;
  titulo: string;
  subtitulo: string;
  correoPorDefecto: string | null;
  createdAt: Date;
}

export class TramitesVistaService {

  /**
   * Crea o actualiza la vista de trámites (solo permite un registro)
   */
  async createOrUpdate(data: TramitesVistaData): Promise<TramitesVistaResponse> {
    const { titulo, subtitulo, correoPorDefecto } = data;

    try {
      // Validar datos
      if (!titulo || titulo.trim() === '') {
        throw CustomError.badRequest("El título es requerido.");
      }

      if (!subtitulo || subtitulo.trim() === '') {
        throw CustomError.badRequest("El subtítulo es requerido.");
      }

      // Buscar si ya existe un registro
      const registroExistente = await TramitesVista.findOne();

      if (registroExistente) {
        // Actualizar el registro existente
        registroExistente.titulo = titulo;
        registroExistente.subtitulo = subtitulo;
        if (correoPorDefecto !== undefined) {
          registroExistente.correoPorDefecto = correoPorDefecto;
        }
        await registroExistente.save();

        return {
          id: registroExistente.id,
          titulo: registroExistente.titulo,
          subtitulo: registroExistente.subtitulo,
          correoPorDefecto: registroExistente.correoPorDefecto,
          createdAt: registroExistente.createdAt
        };
      }

      // Crear nuevo registro
      const registro = await TramitesVista.create({
        titulo,
        subtitulo,
        correoPorDefecto: correoPorDefecto || null
      });

      return {
        id: registro.id,
        titulo: registro.titulo,
        subtitulo: registro.subtitulo,
        correoPorDefecto: registro.correoPorDefecto,
        createdAt: registro.createdAt
      };

    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }

      console.error("Error en TramitesVistaService.createOrUpdate:", error);
      throw CustomError.internalServer(
        `Error al guardar la vista de trámites: ${error instanceof Error ? error.message : "Error desconocido"}`
      );
    }
  }

  /**
   * Obtiene la vista de trámites
   */
  async get(): Promise<TramitesVistaResponse> {
    try {
      const registro = await TramitesVista.findOne();

      if (!registro) {
        throw CustomError.notFound("No se encontró información de la vista de trámites.");
      }

      return {
        id: registro.id,
        titulo: registro.titulo,
        subtitulo: registro.subtitulo,
        correoPorDefecto: registro.correoPorDefecto,
        createdAt: registro.createdAt
      };

    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }

      console.error("Error en TramitesVistaService.get:", error);
      throw CustomError.internalServer(
        `Error al obtener la vista de trámites: ${error instanceof Error ? error.message : "Error desconocido"}`
      );
    }
  }

  /**
   * Actualiza la vista de trámites por ID
   */
  async update(id: string, data: Partial<TramitesVistaData>): Promise<TramitesVistaResponse> {
    const { titulo, subtitulo, correoPorDefecto } = data;

    try {
      const registro = await TramitesVista.findByPk(id);

      if (!registro) {
        throw CustomError.notFound(`No se encontró el registro con ID: ${id}`);
      }

      if (titulo) registro.titulo = titulo;
      if (subtitulo) registro.subtitulo = subtitulo;
      if (correoPorDefecto !== undefined) registro.correoPorDefecto = correoPorDefecto;

      await registro.save();

      return {
        id: registro.id,
        titulo: registro.titulo,
        subtitulo: registro.subtitulo,
        correoPorDefecto: registro.correoPorDefecto,
        createdAt: registro.createdAt
      };

    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }

      console.error("Error en TramitesVistaService.update:", error);
      throw CustomError.internalServer(
        `Error al actualizar la vista de trámites: ${error instanceof Error ? error.message : "Error desconocido"}`
      );
    }
  }

  /**
   * Elimina la vista de trámites por ID
   */
  async delete(id: string): Promise<{ message: string }> {
    try {
      const registro = await TramitesVista.findByPk(id);

      if (!registro) {
        throw CustomError.notFound(`No se encontró el registro con ID: ${id}`);
      }

      await registro.destroy();

      return { message: "Vista de trámites eliminada exitosamente" };

    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }

      console.error("Error en TramitesVistaService.delete:", error);
      throw CustomError.internalServer(
        `Error al eliminar la vista de trámites: ${error instanceof Error ? error.message : "Error desconocido"}`
      );
    }
  }
}
