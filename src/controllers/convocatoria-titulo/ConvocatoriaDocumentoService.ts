import { CustomError } from "../../errors/CustomErrors";
import { ConvocatoriaDocumento } from "../../models/ConvocatoriaDocumento";
import path from "path";
import fs from "fs";

interface DocumentoData {
  titulo: string;
  archivoPath: string;
}

interface DocumentoResponse {
  id: string;
  titulo: string;
  archivoPath: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ConvocatoriaDocumentoService {

  private uploadDir = path.join(__dirname, '../../../uploads/convocatoria-titulo');

  /**
   * POST - Crear documento
   */
  async create(data: DocumentoData): Promise<DocumentoResponse> {
    try {
      const { titulo, archivoPath } = data;

      if (!titulo || titulo.trim() === '') {
        throw CustomError.badRequest("El título del documento es requerido.");
      }

      if (!archivoPath || archivoPath.trim() === '') {
        throw CustomError.badRequest("El archivo es requerido.");
      }

      const documento = await ConvocatoriaDocumento.create({
        titulo,
        archivoPath
      });

      return this.formatResponse(documento);

    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }

      console.error("Error en ConvocatoriaDocumentoService.create:", error);
      throw CustomError.internalServer(
        `Error al crear el documento: ${error instanceof Error ? error.message : "Error desconocido"}`
      );
    }
  }

  /**
   * GET - Obtener todos los documentos
   */
  async getAll(): Promise<Omit<DocumentoResponse, 'archivoPath'>[]> {
    try {
      const documentos = await ConvocatoriaDocumento.findAll({
        order: [['createdAt', 'DESC']]
      });

      return documentos.map(doc => this.formatResponseWithoutPath(doc));

    } catch (error) {
      console.error("Error en ConvocatoriaDocumentoService.getAll:", error);
      throw CustomError.internalServer(
        `Error al obtener los documentos: ${error instanceof Error ? error.message : "Error desconocido"}`
      );
    }
  }

  /**
   * Obtener documento por ID (uso interno)
   */
  async findDocumentById(id: string): Promise<ConvocatoriaDocumento> {
    if (!id || id.trim() === '') {
      throw CustomError.badRequest("El ID es requerido.");
    }

    const documento = await ConvocatoriaDocumento.findByPk(id);

    if (!documento) {
      throw CustomError.notFound(`No se encontró documento con ID: ${id}`);
    }

    return documento;
  }

  /**
   * DELETE - Eliminar documento por ID
   */
  async delete(id: string): Promise<{ message: string }> {
    try {
      if (!id || id.trim() === '') {
        throw CustomError.badRequest("El ID es requerido.");
      }

      const documento = await ConvocatoriaDocumento.findByPk(id);

      if (!documento) {
        throw CustomError.notFound(`No se encontró documento con ID: ${id}`);
      }

      // Eliminar archivo físico
      const filePath = path.join(this.uploadDir, path.basename(documento.archivoPath));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      await documento.destroy();

      return { message: "Documento eliminado exitosamente." };

    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }

      console.error("Error en ConvocatoriaDocumentoService.delete:", error);
      throw CustomError.internalServer(
        `Error al eliminar el documento: ${error instanceof Error ? error.message : "Error desconocido"}`
      );
    }
  }

  /**
   * PUT - Actualizar título de documento
   */
  async update(id: string, titulo: string): Promise<DocumentoResponse> {
    try {
      if (!id || id.trim() === '') {
        throw CustomError.badRequest("El ID es requerido.");
      }

      if (!titulo || titulo.trim() === '') {
        throw CustomError.badRequest("El título es requerido.");
      }

      const documento = await ConvocatoriaDocumento.findByPk(id);

      if (!documento) {
        throw CustomError.notFound(`No se encontró documento con ID: ${id}`);
      }

      await documento.update({ titulo });

      return this.formatResponse(documento);

    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      console.error("Error en ConvocatoriaDocumentoService.update:", error);
      throw CustomError.internalServer(
        `Error al actualizar el documento: ${error instanceof Error ? error.message : "Error desconocido"}`
      );
    }
  }

  /**
   * DELETE - Eliminar todos los documentos
   */
  async deleteAll(): Promise<{ message: string; deletedCount: number }> {
    try {
      const documentos = await ConvocatoriaDocumento.findAll();
      let deletedCount = 0;

      // Eliminar archivos físicos y registros
      for (const documento of documentos) {
        const filePath = path.join(this.uploadDir, path.basename(documento.archivoPath));
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        await documento.destroy();
        deletedCount++;
      }

      return {
        message: "Todos los documentos han sido eliminados exitosamente.",
        deletedCount
      };

    } catch (error) {
      console.error("Error en ConvocatoriaDocumentoService.deleteAll:", error);
      throw CustomError.internalServer(
        `Error al eliminar los documentos: ${error instanceof Error ? error.message : "Error desconocido"}`
      );
    }
  }

  /**
   * Formatea la respuesta
   */
  private formatResponse(documento: ConvocatoriaDocumento): DocumentoResponse {
    return {
      id: documento.id,
      titulo: documento.titulo,
      archivoPath: documento.archivoPath,
      createdAt: documento.createdAt,
      updatedAt: documento.updatedAt
    };
  }

  /**
   * Formatea la respuesta sin archivoPath
   */
  private formatResponseWithoutPath(documento: ConvocatoriaDocumento): Omit<DocumentoResponse, 'archivoPath'> {
    return {
      id: documento.id,
      titulo: documento.titulo,
      createdAt: documento.createdAt,
      updatedAt: documento.updatedAt
    };
  }
}
